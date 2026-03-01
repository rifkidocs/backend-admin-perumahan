'use strict';

/**
 * payment-invoice controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment-invoice.payment-invoice', {
  // Custom methods for Tagihan & Hutang functionality

  // Find overdue invoices
  async findOverdue(ctx) {
    const { query } = ctx;
    const today = new Date().toISOString().split('T')[0];

    const overdueInvoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        $and: [
          { status_pembayaran: { $ne: 'paid' } },
          { dueDate: { $lt: today } }
        ]
      },
      populate: ['supplier', 'project', 'approvedBy'],
      sort: 'dueDate:asc',
      ...query
    });

    ctx.send({
      data: overdueInvoices,
      meta: {
        total: overdueInvoices.length,
        date: today
      }
    });
  },

  // Update payment status
  async updatePayment(ctx) {
    const { id } = ctx.params;
    const { paymentData } = ctx.request.body;
    
    console.log(`[Controller] updatePayment for ${id}. Data:`, JSON.stringify(paymentData));

    try {
      // Get current invoice
      const currentInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
        documentId: id,
        populate: ['supplier', 'project']
      });

      if (!currentInvoice) {
        return ctx.notFound('Invoice found');
      }

      // Create Riwayat Pembayaran record if there is a payment
      if (paymentData.paid_amount > 0) {
        console.log(`[Controller] Creating Riwayat Pembayaran for ${id}...`);
        await strapi.documents('api::riwayat-pembayaran.riwayat-pembayaran').create({
          data: {
            tipe_transaksi: 'keluar',
            kategori_pembayaran: 'tagihan_supplier',
            jumlah_pembayaran: Number(paymentData.paid_amount),
            tanggal_pembayaran: paymentData.paymentEntry?.date || new Date().toISOString().split('T')[0],
            metode_pembayaran: paymentData.paymentMethod || 'Transfer Bank',
            nomor_referensi: paymentData.paymentEntry?.reference,
            deskripsi: paymentData.paymentEntry?.notes || 'Pembayaran via Update Payment',
            payment_invoice: id,
            pos_keuangan: paymentData.pos_keuangan || paymentData.paymentEntry?.pos_keuangan,
            status_pembayaran: 'Berhasil',
            alokasi_pembayaran: paymentData.alokasi_pembayaran || null
          }
        });
        // The lifecycle of riwayat-pembayaran will trigger syncInvoiceTotals
      } else {
        // If only updating metadata, sync manually
        await strapi.service('api::payment-invoice.payment-invoice').syncInvoiceTotals(id);
      }

      // Fetch updated invoice to return
      const updatedInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
        documentId: id,
        populate: ['supplier', 'project', 'approvedBy', 'createdBy', 'riwayat_pembayarans']
      });

      ctx.send({
        data: updatedInvoice,
        message: `Payment processed successfully.`
      });
    } catch (error) {
      console.error('[Controller] updatePayment Error:', error);
      ctx.badRequest('Payment update failed', { error: error.message });
    }
  },

  // Get invoices by supplier
  async findBySupplier(ctx) {
    const { supplierId } = ctx.params;
    const { query } = ctx;

    const invoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        supplier: {
          documentId: supplierId
        }
      },
      populate: ['supplier', 'project', 'approvedBy', 'createdBy'],
      sort: 'dueDate:asc',
      ...query
    });

    ctx.send({
      data: invoices,
      meta: {
        total: invoices.length,
        supplierId
      }
    });
  },

  // Get invoices by project
  async findByProject(ctx) {
    const { projectId } = ctx.params;
    const { query } = ctx;

    const invoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        project: {
          documentId: projectId
        }
      },
      populate: ['supplier', 'project', 'approvedBy', 'createdBy'],
      sort: 'dueDate:asc',
      ...query
    });

    ctx.send({
      data: invoices,
      meta: {
        total: invoices.length,
        projectId
      }
    });
  },

  // Get invoices by status
  async findByStatus(ctx) {
    const { status } = ctx.params;
    const { query } = ctx;

    const invoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        status_pembayaran: status
      },
      populate: ['supplier', 'project', 'approvedBy', 'createdBy'],
      sort: 'dueDate:asc',
      ...query
    });

    ctx.send({
      data: invoices,
      meta: {
        total: invoices.length,
        status
      }
    });
  },

  // Get payment summary
  async getPaymentSummary(ctx) {
    const { query } = ctx;
    const { startDate, endDate, supplierId, projectId } = query;

    // Build filters
    const filters = {};
    if (startDate && endDate) {
      filters.dueDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    if (supplierId) {
      filters.supplier = {
        documentId: supplierId
      };
    }
    if (projectId) {
      filters.project = {
        documentId: projectId
      };
    }

    const invoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters,
      populate: ['supplier', 'project']
    });

    // Calculate summary
    const summary = {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
      totalPaid: invoices.reduce((sum, inv) => sum + Number(inv.paid_amount), 0),
      totalRemaining: invoices.reduce((sum, inv) => sum + Number(inv.remaining_amount), 0),
      statusBreakdown: {
        pending: invoices.filter(inv => inv.status_pembayaran === 'pending').length,
        partial: invoices.filter(inv => inv.status_pembayaran === 'partial').length,
        paid: invoices.filter(inv => inv.status_pembayaran === 'paid').length,
        overdue: invoices.filter(inv => inv.status_pembayaran === 'overdue').length,
        cancelled: invoices.filter(inv => inv.status_pembayaran === 'cancelled').length
      },
      categoryBreakdown: {}
    };

    // Category breakdown
    invoices.forEach(inv => {
      if (inv.category) {
        summary.categoryBreakdown[inv.category] = (summary.categoryBreakdown[inv.category] || 0) + Number(inv.amount);
      }
    });

    ctx.send({
      data: summary,
      meta: {
        filters: { startDate, endDate, supplierId, projectId }
      }
    });
  },

  // Approve invoice
  async approveInvoice(ctx) {
    const { id } = ctx.params;
    const { approvedBy } = ctx.request.body;

    try {
      const updatedInvoice = await strapi.documents('api::payment-invoice.payment-invoice').update({
        documentId: id,
        data: {
          statusInvoice: 'verified',
          approvedBy,
          approvedDate: new Date().toISOString()
        },
        populate: ['supplier', 'project', 'approvedBy']
      });

      ctx.send({
        data: updatedInvoice,
        message: 'Invoice approved successfully'
      });
    } catch (error) {
      ctx.badRequest('Invoice approval failed', { error: error.message });
    }
  },

  // Cancel invoice
  async cancelInvoice(ctx) {
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    try {
      const updatedInvoice = await strapi.documents('api::payment-invoice.payment-invoice').update({
        documentId: id,
        data: {
          status_pembayaran: 'cancelled',
          statusInvoice: 'cancelled',
          notes: `Invoice cancelled: ${reason || 'No reason provided'}`
        },
        populate: ['supplier', 'project', 'approvedBy']
      });

      ctx.send({
        data: updatedInvoice,
        message: 'Invoice cancelled successfully'
      });
    } catch (error) {
      ctx.badRequest('Invoice cancellation failed', { error: error.message });
    }
  }
});
