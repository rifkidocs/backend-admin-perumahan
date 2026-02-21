'use strict';

/**
 * payment-invoice service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-invoice.payment-invoice', ({ strapi }) => ({
  // Custom service methods for Tagihan & Hutang functionality

  // Generate unique invoice number
  async generateInvoiceNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    // Find the latest invoice for this month
    const latestInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        invoiceNumber: {
          $startsWith: `INV-${year}-${month}`
        }
      },
      sort: 'invoiceNumber:desc',
      limit: 1
    });

    let sequence = 1;
    if (latestInvoice.length > 0) {
      const latestNumber = latestInvoice[0].invoiceNumber;
      const lastSequence = parseInt(latestNumber.split('-')[3]);
      sequence = lastSequence + 1;
    }

    return `INV-${year}-${month}-${String(sequence).padStart(3, '0')}`;
  },

  // Calculate overdue penalties
  async calculatePenalty(documentId) {
    const invoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
      documentId: documentId
    });

    if (!invoice || invoice.status_pembayaran === 'paid' || invoice.status_pembayaran === 'cancelled') {
      return 0;
    }

    const today = new Date();
    const dueDate = new Date(invoice.dueDate);

    if (dueDate >= today) {
      return 0;
    }

    // Calculate days overdue
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    // Penalty calculation: 1% per month overdue of the remaining amount
    const monthlyPenaltyRate = 0.01;
    const monthsOverdue = daysOverdue / 30;
    const penaltyAmount = invoice.remaining_amount * monthlyPenaltyRate * monthsOverdue;

    return Math.round(penaltyAmount);
  },

  // Update overdue status for all invoices
  async updateOverdueStatus() {
    const today = new Date().toISOString().split('T')[0];

    // Find all pending or partial invoices that are overdue
    const overdueInvoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        $and: [
          { status_pembayaran: { $in: ['pending', 'partial'] } },
          { dueDate: { $lt: today } },
          { overdueNotified: false }
        ]
      }
    });

    // Update each overdue invoice
    for (const invoice of overdueInvoices) {
      await strapi.documents('api::payment-invoice.payment-invoice').update({
        documentId: invoice.documentId,
        data: {
          status_pembayaran: 'overdue',
          overdueNotified: true
        }
      });
    }

    return {
      updated: overdueInvoices.length,
      date: today
    };
  },

  // Get cash flow projection
  async getCashFlowProjection(days = 30) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    const upcomingPayments = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: {
        $and: [
          { status_pembayaran: { $ne: 'paid' } },
          { dueDate: { $gte: today.toISOString().split('T')[0] } },
          { dueDate: { $lte: futureDate.toISOString().split('T')[0] } }
        ]
      },
      populate: ['supplier', 'project'],
      sort: 'dueDate:asc'
    });

    // Group by due date
    const cashFlowByDate = {};
    upcomingPayments.forEach(payment => {
      const dueDate = payment.dueDate;
      if (!cashFlowByDate[dueDate]) {
        cashFlowByDate[dueDate] = {
          date: dueDate,
          totalAmount: 0,
          invoices: []
        };
      }
      cashFlowByDate[dueDate].totalAmount += payment.remaining_amount;
      cashFlowByDate[dueDate].invoices.push({
        documentId: payment.documentId,
        invoiceNumber: payment.invoiceNumber,
        supplier: payment.supplier?.name,
        remaining_amount: payment.remaining_amount,
        category: payment.category
      });
    });

    return {
      period: `${days} days`,
      totalAmountDue: upcomingPayments.reduce((sum, p) => sum + p.remaining_amount, 0),
      cashFlowByDate: Object.values(cashFlowByDate),
      generatedAt: today.toISOString()
    };
  },

  // Validate invoice before creation
  async validateInvoice(invoiceData) {
    const errors = [];

    // Check if invoice number already exists
    if (invoiceData.invoiceNumber) {
      const existingInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
        filters: {
          invoiceNumber: invoiceData.invoiceNumber
        },
        limit: 1
      });

      if (existingInvoice.length > 0) {
        errors.push('Invoice number already exists');
      }
    }

    // Validate amount
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    // Validate due date
    if (!invoiceData.dueDate) {
      errors.push('Due date is required');
    } else {
      const dueDate = new Date(invoiceData.dueDate);
      const today = new Date();
      if (dueDate < today.setHours(0, 0, 0, 0)) {
        errors.push('Due date cannot be in the past');
      }
    }

    // Validate supplier
    if (!invoiceData.supplier) {
      errors.push('Supplier is required');
    }

    // Validate payment terms
    const validPaymentTerms = ['cash', 'dp', 'termin', 'net30', 'net60'];
    if (invoiceData.paymentTerms && !validPaymentTerms.includes(invoiceData.paymentTerms)) {
      errors.push('Invalid payment terms');
    }

    // Validate category
    const validCategories = ["opname tukang", "hutang tanah", "hutang supplier", "lainnya"];
    if (invoiceData.category && !validCategories.includes(invoiceData.category)) {
      errors.push('Invalid category');
    }

    // Validate department
    const validDepartments = ['gudang', 'proyek', 'hrm', 'marketing', 'operasional', 'umum'];
    if (invoiceData.department && !validDepartments.includes(invoiceData.department)) {
      errors.push('Invalid department');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get invoice statistics
  async getInvoiceStatistics(filters = {}) {
    const baseFilters = {
      ...filters
    };

    const allInvoices = await strapi.documents('api::payment-invoice.payment-invoice').findMany({
      filters: baseFilters,
      populate: ['supplier', 'project']
    });

    const statistics = {
      total: allInvoices.length,
      totalAmount: allInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      paid_amount: allInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0),
      outstandingAmount: allInvoices.reduce((sum, inv) => sum + inv.remaining_amount, 0),
      statusDistribution: {},
      categoryDistribution: {},
      departmentDistribution: {},
      topSuppliers: {},
      overdueCount: 0,
      overdueAmount: 0
    };

    // Calculate distributions
    allInvoices.forEach(invoice => {
      // Status distribution
      statistics.statusDistribution[invoice.status_pembayaran] = (statistics.statusDistribution[invoice.status_pembayaran] || 0) + 1;

      // Category distribution
      if (invoice.category) {
        statistics.categoryDistribution[invoice.category] = (statistics.categoryDistribution[invoice.category] || 0) + invoice.amount;
      }

      // Department distribution
      if (invoice.department) {
        statistics.departmentDistribution[invoice.department] = (statistics.departmentDistribution[invoice.department] || 0) + 1;
      }

      // Top suppliers
      if (invoice.supplier?.name) {
        if (!statistics.topSuppliers[invoice.supplier.name]) {
          statistics.topSuppliers[invoice.supplier.name] = 0;
        }
        statistics.topSuppliers[invoice.supplier.name] += invoice.amount;
      }

      // Overdue calculation
      if (invoice.status_pembayaran === 'overdue') {
        statistics.overdueCount += 1;
        statistics.overdueAmount += invoice.remaining_amount;
      }
    });

    // Sort top suppliers by amount
    statistics.topSuppliers = Object.fromEntries(
      Object.entries(statistics.topSuppliers)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    );

    return statistics;
  }
}));
