// @ts-nocheck
'use strict';

/**
 * salary controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::salary.salary', ({ strapi }) => ({
    // Custom controller methods can be added here
    async find(ctx) {
        const { data, meta } = await super.find(ctx);

        // Add custom logic here if needed
        return { data, meta };
    },

    async findOne(ctx) {
        const { data, meta } = await super.findOne(ctx);

        // Add custom logic here if needed
        return { data, meta };
    },

    async create(ctx) {
        const { data, meta } = await super.create(ctx);

        // Add custom logic here if needed
        return { data, meta };
    },

    async update(ctx) {
        const { data, meta } = await super.update(ctx);

        // Add custom logic here if needed
        return { data, meta };
    },

    async delete(ctx) {
        const { data, meta } = await super.delete(ctx);

        // Add custom logic here if needed
        return { data, meta };
    },

    // Custom endpoint for batch processing salaries
    async batchProcess(ctx) {
        const { employeeIds, effectiveDate } = ctx.request.body;

        if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
            return ctx.badRequest('Employee IDs are required');
        }

        if (!effectiveDate) {
            return ctx.badRequest('Effective date is required');
        }

        try {
            const result = await strapi.service('api::salary.salary').batchProcessSalaries(employeeIds, effectiveDate);

            return {
                data: {
                    success: true,
                    message: 'Batch salary processing completed',
                    ...result
                }
            };
        } catch (error) {
            console.error('Error in batch salary processing:', error);
            return ctx.badRequest('Failed to process batch salaries', error);
        }
    },

    // Custom endpoint for salary summary by department
    async departmentSummary(ctx) {
        const { startDate, endDate } = ctx.query;

        if (!startDate || !endDate) {
            return ctx.badRequest('Start date and end date are required');
        }

        try {
            const summary = await strapi.service('api::salary.salary').getSalarySummaryByDepartment(startDate, endDate);

            return {
                data: summary
            };
        } catch (error) {
            console.error('Error getting department summary:', error);
            return ctx.badRequest('Failed to get department summary', error);
        }
    },

    // Custom endpoint to generate cash out transaction for existing salary
    async generateCashOut(ctx) {
        const { id } = ctx.params;

        try {
            const salary = await strapi.entityService.findOne('api::salary.salary', id, {
                populate: {
                    karyawan: true
                }
            });

            if (!salary) {
                return ctx.notFound('Salary record not found');
            }

            const transaction = await strapi.service('api::salary.salary').createCashOutTransaction(salary, salary.karyawan);

            return {
                data: {
                    success: true,
                    message: 'Cash out transaction generated successfully',
                    transaction
                }
            };
        } catch (error) {
            console.error('Error generating cash out transaction:', error);
            return ctx.badRequest('Failed to generate cash out transaction', error);
        }
    },

    // Custom endpoint to approve salary-related cash out transactions
    async approveCashOutTransactions(ctx) {
        const { ids, approvedBy, notes } = ctx.request.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return ctx.badRequest('Transaction IDs are required');
        }

        if (!approvedBy) {
            return ctx.badRequest('Approver ID is required');
        }

        try {
            const results = [];
            const errors = [];

            for (const id of ids) {
                try {
                    // Verify transaction is salary-related
                    const transactions = await strapi.entityService.findMany('api::kas-keluar.kas-keluar', {
                        filters: {
                            id,
                            category: 'gaji',
                            salary_id: { $notNull: true }
                        }
                    });

                    if (transactions.length === 0) {
                        errors.push({ id, error: 'Transaction not found or not salary-related' });
                        continue;
                    }

                    const transaction = transactions[0];

                    const updated = await strapi.entityService.update('api::kas-keluar.kas-keluar', id, {
                        data: {
                            approval_status: 'approved',
                            approvedAt: new Date(),
                            approvedBy,
                            notes
                        }
                    });

                    results.push(updated);
                } catch (error) {
                    errors.push({ id, error: error.message });
                }
            }

            return {
                data: {
                    success: true,
                    message: 'Cash out transactions processed',
                    processed: results.length,
                    failed: errors.length,
                    results,
                    errors
                }
            };
        } catch (error) {
            console.error('Error approving cash out transactions:', error);
            return ctx.badRequest('Failed to approve transactions', error);
        }
    }
}));
