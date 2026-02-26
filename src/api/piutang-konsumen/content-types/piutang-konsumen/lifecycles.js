'use strict';

const { cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    
    // Set default values
    if (!data.status_piutang) data.status_piutang = 'active';
    if (data.paid_amount === undefined) data.paid_amount = 0;
    
    // Calculate remaining amount (initial)
    if (data.total_price !== undefined) {
      data.remaining_amount = Number(data.total_price) - (Number(data.paid_amount) || 0);
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
  },

  async afterUpdate(event) {
    const { result } = event;
    // Sync totals
    await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(result.documentId);
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const documentId = where.documentId || where.id;

    if (!documentId) return;

    const piutang = await strapi.documents('api::piutang-konsumen.piutang-konsumen').findOne({
      documentId: documentId
    });

    if (piutang && Number(piutang.paid_amount) > 0) {
      throw new Error('Cannot delete piutang with existing payments');
    }
  }
};
