'use strict';

/**
 * lead-marketing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lead-marketing.lead-marketing', ({ strapi }) => ({
    // Custom service methods can be added here
    async findWithRelations(params) {
        return await strapi.entityService.findMany('api::lead-marketing.lead-marketing', {
            ...params,
            populate: {
                marketing: true,
                communications: {
                    sort: { date: 'desc' }
                },
                reminders: {
                    sort: { date: 'asc' }
                }
            }
        });
    },

    async findByStatus(status_lead, params = {}) {
        return await strapi.entityService.findMany('api::lead-marketing.lead-marketing', {
            ...params,
            filters: {
                status_lead: status_lead
            },
            populate: {
                marketing: true,
                communications: true,
                reminders: true
            }
        });
    },

    async findByMarketingStaff(marketingId, params = {}) {
        return await strapi.entityService.findMany('api::lead-marketing.lead-marketing', {
            ...params,
            filters: {
                marketing: {
                    id: marketingId
                }
            },
            populate: {
                marketing: true,
                communications: true,
                reminders: true
            }
        });
    },

    async searchLeads(searchTerm, params = {}) {
        return await strapi.entityService.findMany('api::lead-marketing.lead-marketing', {
            ...params,
            filters: {
                $or: [
                    {
                        name: {
                            $containsi: searchTerm
                        }
                    },
                    {
                        phone: {
                            $containsi: searchTerm
                        }
                    },
                    {
                        email: {
                            $containsi: searchTerm
                        }
                    }
                ]
            },
            populate: {
                marketing: true,
                communications: true,
                reminders: true
            }
        });
    }
}));
