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
    
    // Calculate remaining amount (initial)
    data.remaining_amount = Number(data.amount) - (Number(data.paid_amount) || 0);
  },

  // After creating an invoice
  async afterCreate(event) {
    const { result } = event;
    console.log(`[Lifecycle] afterCreate for Invoice: ${result.invoiceNumber}`);

    // Trigger sync to ensure totals are correct
    await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(result.documentId);

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
              totalPurchases: (Number(supplier.totalPurchases) || 0) + Number(result.amount),
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
    console.log(`[Lifecycle] beforeUpdate for ${where.documentId || where.id}. Data:`, JSON.stringify(data));
  },

  // After updating an invoice
  async afterUpdate(event) {
    const { result } = event;
    console.log(`[Lifecycle] afterUpdate for Invoice: ${result.invoiceNumber}`);
    
    // Sync totals if amount changed
    await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(result.documentId);

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

    if (invoice && Number(invoice.paid_amount) > 0) {
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
