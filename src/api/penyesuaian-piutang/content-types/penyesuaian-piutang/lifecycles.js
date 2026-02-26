'use strict';

/**
 * penyesuaian-piutang lifecycle hooks
 */

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    const entry = await strapi.documents('api::penyesuaian-piutang.penyesuaian-piutang').findOne({
      documentId: result.documentId,
      populate: ['piutang_konsumen']
    });

    const piutangId = entry?.piutang_konsumen?.documentId;
    if (piutangId) {
      await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(piutangId);
    }
  },

  async afterUpdate(event) {
    const { result } = event;
    const entry = await strapi.documents('api::penyesuaian-piutang.penyesuaian-piutang').findOne({
      documentId: result.documentId,
      populate: ['piutang_konsumen']
    });

    const piutangId = entry?.piutang_konsumen?.documentId;
    if (piutangId) {
      await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(piutangId);
    }
  },

  async afterDelete(event) {
    const { result } = event;
    const piutangId = result?.piutang_konsumen?.documentId || result?.piutang_konsumen;
    if (piutangId && typeof piutangId === 'string') {
      await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(piutangId);
    }
  }
};
