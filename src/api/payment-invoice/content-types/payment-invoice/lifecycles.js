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

    // Calculate remaining amount
    data.remaining_amount = data.amount - (data.paid_amount || 0);
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
          await strapi.documents('api::supplier.supplier').update({
            documentId: supplier.documentId,
            data: {
              totalPurchases: (supplier.totalPurchases || 0) + result.amount,
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
      documentId: documentId
    });

    if (!currentInvoice) return;

    // Auto-calculate remaining amount if paid amount is updated
    if (data.paid_amount !== undefined && data.paid_amount !== currentInvoice.paid_amount) {
      const amount = data.amount !== undefined ? data.amount : currentInvoice.amount;
      data.remaining_amount = amount - data.paid_amount;

      // Auto-update status pembayaran based on payment
      if (data.paid_amount >= amount) {
        data.status_pembayaran = 'paid';
        data.fullyPaidDate = new Date().toISOString();
      } else if (data.paid_amount > 0 && data.paid_amount < amount) {
        data.status_pembayaran = 'partial';
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
