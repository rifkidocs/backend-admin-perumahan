'use strict';

/**
 * kas-keluar controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::kas-keluar.kas-keluar', ({ strapi }) => ({
  // Override find method to add custom filtering
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    // Add custom filters for date range and amounts
    const { query } = ctx;
    const filters = query.filters || {};

    // Apply date range filtering
    if (filters.date) {
      const dateFilter = {};
      if (filters.date.$gte) {
        dateFilter.$gte = filters.date.$gte;
      }
      if (filters.date.$lte) {
        dateFilter.$lte = filters.date.$lte;
      }
      if (Object.keys(dateFilter).length > 0) {
        query.filters.date = dateFilter;
      }
    }

    // Apply amount range filtering
    if (filters.amount) {
      const amountFilter = {};
      if (filters.amount.$gte) {
        amountFilter.$gte = filters.amount.$gte;
      }
      if (filters.amount.$lte) {
        amountFilter.$lte = filters.amount.$lte;
      }
      if (Object.keys(amountFilter).length > 0) {
        query.filters.amount = amountFilter;
      }
    }

    // Apply urgent filtering
    if (filters.urgent) {
      query.filters.urgent = filters.urgent;
    }

    return { data, meta };
  },

  // Custom method for batch approval
  async batchApproval(ctx) {
    const { ids, approval_status, approvedBy, notes } = ctx.request.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return ctx.badRequest('Transaction IDs are required');
    }

    if (!['approved', 'rejected'].includes(approval_status)) {
      return ctx.badRequest('Invalid approval_status. Must be approved or rejected');
    }

    if (approval_status === 'approved' && !approvedBy) {
      return ctx.badRequest('Approved transactions require an approver');
    }

    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        const updateData = {
          approval_status,
          approvedAt: new Date(),
          ...(approval_status === 'approved' && { approvedBy }),
          ...(notes && { notes })
        };

        const updated = await strapi.db.query('api::kas-keluar.kas-keluar').update({
          where: { id },
          data: updateData
        });

        results.push(updated);
      } catch (error) {
        errors.push({
          id,
          error: error.message
        });
      }
    }

    return {
      data: results,
      errors,
      processed: results.length,
      failed: errors.length
    };
  },

  // Custom method for category reports
  async categoryReport(ctx) {
    const { startDate, endDate, approval_status = 'approved' } = ctx.query;

    if (!startDate || !endDate) {
      return ctx.badRequest('Start date and end date are required');
    }

    const records = await strapi.db.query('api::kas-keluar.kas-keluar').findMany({
      where: {
        date: {
          $gte: startDate,
          $lte: endDate
        },
        approval_status
      },
      populate: ['project', 'createdBy']
    });

    // Calculate totals by category
    const categoryTotals = records.reduce((acc, record) => {
      const category = record.category;
      acc[category] = (acc[category] || 0) + record.amount;
      return acc;
    }, {});

    return {
      data: {
        period: { startDate, endDate },
        totalTransactions: records.length,
        totalAmount: records.reduce((sum, record) => sum + record.amount, 0),
        categoryBreakdown: categoryTotals,
        transactions: records
      }
    };
  },

  // Custom method for urgent transactions
  async urgentTransactions(ctx) {
    const urgentRecords = await strapi.db.query('api::kas-keluar.kas-keluar').findMany({
      where: {
        urgent: true,
        approval_status: 'pending'
      },
      populate: ['createdBy', 'project', 'approvedBy'],
      orderBy: { date: 'desc' }
    });

    return {
      data: urgentRecords
    };
  },

  // Custom method for cash flow summary
  async cashFlowSummary(ctx) {
    const { startDate, endDate } = ctx.query;

    if (!startDate || !endDate) {
      return ctx.badRequest('Start date and end date are required');
    }

    const [cashIn, cashOut] = await Promise.all([
      // Get cash in records
      strapi.db.query('api::kas-masuk.kas-masuk').findMany({
        where: {
          date: {
            $gte: startDate,
            $lte: endDate
          },
          approval_status: 'approved'
        },
        populate: ['project']
      }),
      // Get cash out records
      strapi.db.query('api::kas-keluar.kas-keluar').findMany({
        where: {
          date: {
            $gte: startDate,
            $lte: endDate
          },
          approval_status: 'approved'
        },
        populate: ['project']
      })
    ]);

    const totalCashIn = cashIn.reduce((sum, item) => sum + item.amount, 0);
    const totalCashOut = cashOut.reduce((sum, item) => sum + item.amount, 0);
    const netCashFlow = totalCashIn - totalCashOut;

    return {
      data: {
        period: { startDate, endDate },
        totalCashIn,
        totalCashOut,
        netCashFlow,
        transactions: {
          in: cashIn,
          out: cashOut
        }
      }
    };
  },

  // Override create method with custom validation
  async create(ctx) {
    const data = ctx.request.body.data || ctx.request.body;

    // Additional validation
    if (!data.createdBy) {
      return ctx.badRequest('Created by field is required');
    }

    if (!data.description || data.description.length < 10) {
      return ctx.badRequest('Description must be at least 10 characters');
    }

    if (!data.supplier) {
      return ctx.badRequest('Supplier is required');
    }

    // Call parent create method
    return await super.create(ctx);
  },

  // Custom method for duplicate invoice check
  async checkDuplicateInvoice(ctx) {
    const { invoiceNumber } = ctx.query;

    if (!invoiceNumber) {
      return ctx.badRequest('Invoice number is required');
    }

    const existing = await strapi.db.query('api::kas-keluar.kas-keluar').findOne({
      where: { invoiceNumber }
    });

    return {
      data: {
        exists: !!existing,
        invoiceNumber,
        existingRecord: existing
      }
    };
  }
}));