'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      // Ambil data lengkap termasuk relasi pos_keuangan, piutang, dan invoice
      const data = await strapi.documents('api::riwayat-pembayaran.riwayat-pembayaran').findOne({
        documentId: result.documentId,
        populate: ['pos_keuangan', 'piutang_konsumen', 'payment_invoice', 'piutang_konsumen.customer', 'piutang_konsumen.project', 'piutang_konsumen.unit', 'payment_invoice.supplier', 'payment_invoice.project']
      });

      const posKeuanganId = data.pos_keuangan?.documentId;
      
      // 1. Jika ini Dana Masuk (Piutang Konsumen)
      if (data.tipe_transaksi === 'masuk' && data.piutang_konsumen) {
        const piutang = data.piutang_konsumen;
        
        await strapi.documents('api::kas-masuk.kas-masuk').create({
          data: {
            date: data.tanggal_pembayaran,
            type: 'pelunasan', // Default pelunasan, bisa disesuaikan
            amount: data.jumlah_pembayaran,
            customer: piutang.customer?.nama || piutang.customer?.nama_lengkap || 'Consumer Payment',
            description: `[Auto] Riwayat Pembayaran Piutang. ${data.deskripsi || ''}`,
            paymentMethod: data.metode_pembayaran === 'Tunai' ? 'cash' : (data.metode_pembayaran === 'Cek' ? 'cek' : 'transfer'),
            pos_keuangan: posKeuanganId,
            status_transaksi: 'pending',
            statusPayment: 'pending',
            project: piutang.project?.documentId || piutang.project?.id,
            customerRelation: piutang.customer?.documentId || piutang.customer?.id,
            unitRelation: piutang.unit?.documentId || piutang.unit?.id,
            reference: data.nomor_referensi || `RIWAYAT-${data.id}`
          }
        });
        console.log(`[Lifecycle] Riwayat Pembayaran: Created Kas Masuk for Piutang ${piutang.documentId}`);
      }
      
      // 2. Jika ini Dana Keluar (Payment Invoice / Tagihan Supplier)
      else if (data.tipe_transaksi === 'keluar' && data.payment_invoice) {
        const invoice = data.payment_invoice;
        
        await strapi.documents('api::kas-keluar.kas-keluar').create({
          data: {
            date: data.tanggal_pembayaran,
            category: invoice.category || 'lainnya',
            amount: data.jumlah_pembayaran,
            description: `[Auto] Riwayat Pembayaran Tagihan: ${invoice.invoiceNumber}. ${data.deskripsi || ''}`,
            paymentMethod: data.metode_pembayaran === 'Tunai' ? 'cash' : (data.metode_pembayaran === 'Cek' ? 'cek' : 'transfer'),
            pos_keuangan: posKeuanganId,
            approval_status: 'pending',
            referenceDocument: invoice.invoiceNumber,
            supplier: invoice.supplier?.documentId || invoice.supplier?.id,
            project: invoice.project?.documentId || invoice.project?.id,
            tipe_terkait: invoice.project ? 'proyek' : 'kantor'
          }
        });
        console.log(`[Lifecycle] Riwayat Pembayaran: Created Kas Keluar for Invoice ${invoice.invoiceNumber}`);
      }
    } catch (error) {
      console.error('[Lifecycle] Riwayat Pembayaran afterCreate Error:', error);
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  },
};
