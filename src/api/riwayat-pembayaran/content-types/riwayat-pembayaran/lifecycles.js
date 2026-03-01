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
        
        // Mapping kategori invoice ke kategori kas keluar
        let kasKeluarCategory = 'lainnya';
        let deskripsiKasKeluar = `[Auto] Riwayat Pembayaran Tagihan: ${invoice.invoiceNumber}. ${data.deskripsi || ''}`;

        if (invoice.category === 'opname tukang') {
          kasKeluarCategory = 'operasional';
          deskripsiKasKeluar = `[Auto] Pembayaran Opname Tukang: ${invoice.invoiceNumber}. ${data.deskripsi || ''}`;
        }
        else if (invoice.category === 'hutang supplier') {
          kasKeluarCategory = 'material';
          deskripsiKasKeluar = `[Auto] Pembayaran Tagihan Supplier: ${invoice.invoiceNumber}. ${data.deskripsi || ''}`;
        }
        else if (invoice.category === 'hutang tanah') {
          kasKeluarCategory = 'legal';
          deskripsiKasKeluar = `[Auto] Pembayaran Hutang Tanah: ${invoice.invoiceNumber}. ${data.deskripsi || ''}`;
        }

        await strapi.documents('api::kas-keluar.kas-keluar').create({
          data: {
            date: data.tanggal_pembayaran,
            category: kasKeluarCategory,
            amount: Number(data.jumlah_pembayaran),
            description: deskripsiKasKeluar,
            paymentMethod: data.metode_pembayaran === 'Tunai' ? 'cash' : (data.metode_pembayaran === 'Cek' ? 'cek' : 'transfer'),
            pos_keuangan: posKeuanganId,
            approval_status: 'pending',
            referenceDocument: invoice.invoiceNumber,
            supplier: invoice.supplier?.documentId || invoice.supplier?.id,
            project: invoice.project?.documentId || invoice.project?.id,
            tipe_terkait: invoice.project ? 'proyek' : 'kantor'
          }
        });
        console.log(`[Lifecycle] Riwayat Pembayaran: Created Kas Keluar for Invoice ${invoice.invoiceNumber} with category ${kasKeluarCategory}`);
      }

      // 3. Sync Totals
      const invoiceId = data.payment_invoice?.documentId || data.payment_invoice;
      const piutangId = data.piutang_konsumen?.documentId || data.piutang_konsumen;

      if (invoiceId) {
        await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(invoiceId);
      }
      if (piutangId) {
        await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(piutangId);
      }

    } catch (error) {
      console.error('[Lifecycle] Riwayat Pembayaran afterCreate Error:', error);
    }
  },

  async afterUpdate(event) {
    const { result } = event;
    console.log(`[Lifecycle-Riwayat] afterUpdate for ${result.documentId}`);

    const data = await strapi.documents('api::riwayat-pembayaran.riwayat-pembayaran').findOne({
      documentId: result.documentId,
      populate: ['pos_keuangan', 'payment_invoice', 'piutang_konsumen', 'payment_invoice.supplier', 'payment_invoice.project', 'piutang_konsumen.customer', 'piutang_konsumen.project', 'piutang_konsumen.unit']
    });

    const posKeuanganId = data.pos_keuangan?.documentId;

    // 1. Sync Kas Masuk/Keluar (Update existing if reference matches)
    if (data.tipe_transaksi === 'masuk' && data.piutang_konsumen) {
      // Find and update Kas Masuk
      const reference = data.nomor_referensi || `RIWAYAT-${data.id}`;
      const existingKasMasuk = await strapi.documents('api::kas-masuk.kas-masuk').findMany({
        filters: { reference }
      });

      if (existingKasMasuk.length > 0) {
        await strapi.documents('api::kas-masuk.kas-masuk').update({
          documentId: existingKasMasuk[0].documentId,
          data: {
            amount: data.jumlah_pembayaran,
            date: data.tanggal_pembayaran,
            pos_keuangan: posKeuanganId,
            description: `[Auto-Update] Riwayat Pembayaran Piutang. ${data.deskripsi || ''}`
          }
        });
      }
    } else if (data.tipe_transaksi === 'keluar' && data.payment_invoice) {
      // Find and update Kas Keluar
      const reference = data.payment_invoice.invoiceNumber;
      const existingKasKeluar = await strapi.documents('api::kas-keluar.kas-keluar').findMany({
        filters: { referenceDocument: reference, amount: result.jumlah_pembayaran } // Use result as fallback for old amount if needed
      });
      
      // Note: Updating Kas Keluar automatically is trickier because we don't have a unique ref for specific partial payment in referenceDocument
      // For now, let's at least sync the invoice totals
    }

    if (data.payment_invoice?.documentId) {
      await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(data.payment_invoice.documentId);
    }
    if (data.piutang_konsumen?.documentId) {
      await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(data.piutang_konsumen.documentId);
    }
  },

  async afterDelete(event) {
    const { result } = event;
    const invoiceId = result?.payment_invoice?.documentId || result?.payment_invoice;
    const piutangId = result?.piutang_konsumen?.documentId || result?.piutang_konsumen;

    if (invoiceId && typeof invoiceId === 'string') {
      await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(invoiceId);
    }
    if (piutangId && typeof piutangId === 'string') {
      await strapi.service('api::piutang-konsumen.piutang-konsumen').syncPiutangTotals(piutangId);
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  },
};
