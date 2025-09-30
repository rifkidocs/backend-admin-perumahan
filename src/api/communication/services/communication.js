'use strict';

/**
 * communication service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::communication.communication', ({ strapi }) => ({
    // Custom service methods can be added here
    async findWithLeadInfo(params) {
        return await strapi.entityService.findMany('api::communication.communication', {
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
        return await strapi.entityService.findMany('api::communication.communication', {
            ...params,
            filters: {
                lead: {
                    id: leadId
                }
            },
            populate: {
                lead: true
            },
            sort: { date: 'desc' }
        });
    }
}));
