'use strict';

/**
 * piutang-konsumen service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { roundHalfUp } = require('../../../utils/numberHelper');

module.exports = createCoreService('api::piutang-konsumen.piutang-konsumen', ({ strapi }) => ({
  async syncPiutangTotals(documentId) {
    if (!documentId || typeof documentId === 'object') {
      console.log(`[Sync-Piutang] Invalid documentId:`, documentId);
      return null;
    }
    console.log(`[Sync-Piutang] Starting sync for Piutang: ${documentId}`);
    
    const piutang = await strapi.documents('api::piutang-konsumen.piutang-konsumen').findOne({
      documentId: documentId,
      populate: ['riwayat_pembayarans', 'penyesuaian_piutangs']
    });

    if (!piutang) {
      console.log(`[Sync-Piutang] Piutang not found: ${documentId}`);
      return null;
    }

    const basePrice = parseFloat(piutang.total_price || 0);
    
    // Sum all adjustments
    const adjustmentsSum = (piutang.penyesuaian_piutangs || []).reduce((sum, adj) => {
      const amount = parseFloat(adj.amount || 0);
      if (adj.tipe_penyesuaian === 'pengurangan') {
        console.log(`[Sync-Piutang] Found Adjustment: -${amount} (pengurangan)`);
        return sum - amount;
      }
      console.log(`[Sync-Piutang] Found Adjustment: +${amount} (penambahan)`);
      return sum + amount;
    }, 0);

    const totalPrice = roundHalfUp(basePrice + adjustmentsSum);
    
    // Sum all successful payments
    const paidSum = (piutang.riwayat_pembayarans || []).reduce((sum, pay) => {
      if (pay.status_pembayaran === 'Berhasil') {
        return sum + parseFloat(pay.jumlah_pembayaran || 0);
      }
      return sum;
    }, 0);

    const remainingAmount = roundHalfUp(Math.max(0, totalPrice - paidSum));

    // Determine status
    let status_piutang = 'active';
    if (paidSum >= totalPrice && totalPrice > 0) {
      status_piutang = 'completed';
    }

    console.log(`[Sync-Piutang] Calculated: TotalPrice=${totalPrice}, Paid=${paidSum}, Remaining=${remainingAmount}, Status=${status_piutang}`);

    // CEK: Hindari loop
    if (
      parseFloat(piutang.paid_amount || 0) === paidSum &&
      parseFloat(piutang.remaining_amount || 0) === remainingAmount &&
      piutang.status_piutang === status_piutang
    ) {
      console.log(`[Sync-Piutang] No changes detected. Skipping update.`);
      return piutang;
    }

    console.log(`[Sync-Piutang] Applying update...`);
    return await strapi.documents('api::piutang-konsumen.piutang-konsumen').update({
      documentId: documentId,
      data: {
        paid_amount: paidSum,
        remaining_amount: remainingAmount,
        status_piutang,
        last_payment: paidSum > 0 ? new Date().toISOString().split('T')[0] : piutang.last_payment
      }
    });
  }
}));