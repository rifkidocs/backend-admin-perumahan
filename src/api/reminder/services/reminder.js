'use strict';

/**
 * reminder service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reminder.reminder', ({ strapi }) => ({
    // Custom service methods can be added here
    async findWithLeadInfo(params) {
        return await strapi.entityService.findMany('api::reminder.reminder', {
            ...params,
            populate: {
                lead: {
                    populate: {
                        marketing: true
                    }
                }
            }
        });
    },

    async findByLeadId(leadId, params = {}) {
        return await strapi.entityService.findMany('api::reminder.reminder', {
            ...params,
            filters: {
                lead: {
                    id: leadId
                }
            },
            populate: {
                lead: true
            },
            sort: { date: 'asc' }
        });
    },

    async findPendingReminders(params = {}) {
        return await strapi.entityService.findMany('api::reminder.reminder', {
            ...params,
            filters: {
                status: 'pending',
                date: {
                    $lte: new Date().toISOString().split('T')[0]
                }
            },
            populate: {
                lead: {
                    populate: {
                        marketing: true
                    }
                }
            },
            sort: { date: 'asc' }
        });
    },

    async updateStatus(id, status) {
        return await strapi.entityService.update('api::reminder.reminder', id, {
            data: { status }
        });
    }
}));
