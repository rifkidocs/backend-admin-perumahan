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

    try {
      // Get current invoice
      const currentInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
        documentId: id,
        populate: ['payment_history']
      });

      if (!currentInvoice) {
        return ctx.notFound('Invoice found');
      }

      // Validate payment amount
      if (Number(paymentData.paid_amount) > Number(currentInvoice.amount)) {
        return ctx.badRequest('Payment amount exceeds invoice total');
      }

      // Update payment history
      const updatedPaymentHistory = [...(currentInvoice.payment_history || [])];
      if (paymentData.paymentEntry) {
        updatedPaymentHistory.push({
          date: paymentData.paymentEntry.date || new Date().toISOString().split('T')[0],
          amount: Number(paymentData.paymentEntry.amount),
          method: paymentData.paymentEntry.method,
          reference: paymentData.paymentEntry.reference,
          bankAccount: paymentData.paymentEntry.bankAccount,
          paidBy: paymentData.paymentEntry.paidBy,
          notes: paymentData.paymentEntry.notes,
          receiptDocument: paymentData.paymentEntry.receiptDocument,
          processedAt: new Date().toISOString()
        });
      }

      // Calculate remaining amount
      const remaining_amount = Number(currentInvoice.amount) - Number(paymentData.paid_amount);

      // Determine status pembayaran
      let status_pembayaran = 'partial';
      if (Number(paymentData.paid_amount) === 0) {
        status_pembayaran = 'pending';
      } else if (remaining_amount <= 0) {
        status_pembayaran = 'paid';
      }

      const updatedInvoice = await strapi.documents('api::payment-invoice.payment-invoice').update({
        documentId: id,
        data: {
          status_pembayaran,
          paid_amount: Number(paymentData.paid_amount),
          remaining_amount: Math.max(0, remaining_amount),
          payment_history: updatedPaymentHistory,
          lastPaymentDate: paymentData.paid_amount > 0 ? new Date().toISOString() : currentInvoice.lastPaymentDate,
          fullyPaidDate: status_pembayaran === 'paid' ? new Date().toISOString() : currentInvoice.fullyPaidDate,
          paymentMethod: paymentData.paymentMethod,
          ...paymentData.additionalData
        },
        populate: ['supplier', 'project', 'approvedBy', 'createdBy']
      });

      ctx.send({
        data: updatedInvoice,
        message: `Payment updated successfully. Status: ${status_pembayaran}`
      });
    } catch (error) {
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
