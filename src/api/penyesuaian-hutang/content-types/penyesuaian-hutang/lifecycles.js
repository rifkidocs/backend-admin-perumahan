'use strict';

/**
 * penyesuaian-hutang lifecycle hooks
 */

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log(`[Lifecycle-Adjustment] afterCreate for ${result.documentId}`);
    
    const entry = await strapi.documents('api::penyesuaian-hutang.penyesuaian-hutang').findOne({
      documentId: result.documentId,
      populate: ['payment_invoice']
    });

    const invoiceId = entry?.payment_invoice?.documentId;
    if (invoiceId) {
      await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(invoiceId);
    }
  },

  async afterUpdate(event) {
    const { result } = event;
    console.log(`[Lifecycle-Adjustment] afterUpdate for ${result.documentId}`);

    const entry = await strapi.documents('api::penyesuaian-hutang.penyesuaian-hutang').findOne({
      documentId: result.documentId,
      populate: ['payment_invoice']
    });

    const invoiceId = entry?.payment_invoice?.documentId;
    if (invoiceId) {
      await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(invoiceId);
    }
  },

  async afterDelete(event) {
    const { result } = event;
    // Saat delete, result biasanya berisi data lama
    const invoiceId = result?.payment_invoice?.documentId || result?.payment_invoice;
    if (invoiceId && typeof invoiceId === 'string') {
      await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(invoiceId);
    }
  }
};
