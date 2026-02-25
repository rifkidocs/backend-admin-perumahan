'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * payment-invoice lifecycle hooks
 */

module.exports = {
  // Before creating an invoice
  async beforeCreate(event) {
    const { data } = event.params;

    // Generate invoice number if not provided
    if (!data.invoiceNumber) {
      const paymentInvoiceService = strapi.service('api::payment-invoice.payment-invoice');
      data.invoiceNumber = await paymentInvoiceService.generateInvoiceNumber();
    }

    // Set default values
    if (!data.status_pembayaran) data.status_pembayaran = 'pending';
    if (!data.statusInvoice) data.statusInvoice = 'received';
    if (data.paid_amount === undefined) data.paid_amount = 0;
    if (data.remaining_amount === undefined) data.remaining_amount = data.amount;

    // Calculate remaining amount - using Number() to handle strings from biginteger
    data.remaining_amount = Number(data.amount) - (Number(data.paid_amount) || 0);
  },

  // After creating an invoice
  async afterCreate(event) {
    const { result } = event;

    // Update supplier total purchases if applicable
    if (result.supplier) {
      try {
        const supplier = await strapi.documents('api::supplier.supplier').findOne({
          documentId: result.supplier.documentId || result.supplier
        });
        if (supplier) {
          // Both result.amount and supplier.totalPurchases are strings from biginteger
          const amount = Number(result.amount) || 0;
          const currentTotal = Number(supplier.totalPurchases) || 0;

          await strapi.documents('api::supplier.supplier').update({
            documentId: supplier.documentId,
            data: {
              totalPurchases: currentTotal + amount,
              lastOrderDate: new Date().toISOString().split('T')[0]
            }
          });
        }
      } catch (error) {
        console.error('Failed to update supplier total purchases:', error);
      }
    }
  },

  // Before updating an invoice
  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);

    const { data, where } = event.params;
    const documentId = where.documentId || where.id;

    if (!documentId) return;

    // Get current invoice for comparison using Document Service
    const currentInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
      documentId: documentId,
      populate: ['penyesuaian_hutangs']
    });

    if (!currentInvoice) return;

    // Calculate total amount including adjustments - using Number() for biginteger strings
    const baseAmount = data.amount !== undefined ? Number(data.amount) : (Number(currentInvoice.amount) || 0);
    const adjustmentsSum = (currentInvoice.penyesuaian_hutangs || []).reduce((sum, adj) => sum + (Number(adj.amount) || 0), 0);
    const totalDebt = baseAmount + adjustmentsSum;

    // Auto-calculate remaining amount if paid amount or base amount is updated
    if (data.paid_amount !== undefined || data.amount !== undefined) {
      const paidAmount = data.paid_amount !== undefined ? Number(data.paid_amount) : (Number(currentInvoice.paid_amount) || 0);
      data.remaining_amount = totalDebt - paidAmount;

      // Auto-update status pembayaran based on payment
      if (paidAmount >= totalDebt && totalDebt > 0) {
        data.status_pembayaran = 'paid';
        data.fullyPaidDate = new Date().toISOString();
      } else if (paidAmount > 0 && paidAmount < totalDebt) {
        data.status_pembayaran = 'partial';
      } else if (paidAmount === 0) {
        data.status_pembayaran = 'pending';
      }

      data.lastPaymentDate = new Date().toISOString();
    }
  },

  // After updating an invoice
  async afterUpdate(event) {
    const { result } = event;
    if (result && result.status_pembayaran === 'paid' && result.fullyPaidDate) {
      console.log(`Invoice ${result.invoiceNumber} has been fully paid`);
    }
  },

  // Before deleting an invoice
  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);

    const { where } = event.params;
    const documentId = where.documentId || where.id;

    if (!documentId) return;

    const invoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
      documentId: documentId
    });

    if (invoice && invoice.paid_amount > 0) {
      throw new Error('Cannot delete invoice with existing payments');
    }
  },

  // After deleting an invoice
  async afterDelete(event) {
    const { result } = event;
    if (result && result.invoiceNumber) {
      console.log(`Invoice ${result.invoiceNumber} has been deleted`);
    }
  }
};
