// @ts-nocheck
'use strict';

/**
 * purchasing controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::purchasing.purchasing', ({ strapi }) => ({
    // Custom create method with debug logging
    async create(ctx) {
        console.log('=== PURCHASING CONTROLLER CREATE DEBUG ===');
        console.log('Request body:', JSON.stringify(ctx.request.body, null, 2));
        console.log('Request params:', JSON.stringify(ctx.params, null, 2));

        try {
            const { data, meta } = await super.create(ctx);
            console.log('Create successful, returning data:', JSON.stringify(data, null, 2));
            return { data, meta };
        } catch (error) {
            console.error('Create error:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    },

    // Custom find method to populate material data properly
    async find(ctx) {
        const { query } = ctx;

        // Set default populate to include materials with their related material data
        const populate = query.populate || {};

        // If populate is '*' or not specified, add materials population
        if (populate === '*' || !populate.materials) {
            populate.materials = {
                populate: {
                    material: true
                }
            };
        }

        // Update query with proper populate
        ctx.query.populate = populate;

        // Call the default find method
        const { data, meta } = await super.find(ctx);

        return { data, meta };
    },

    // Custom findOne method to populate material data properly
    async findOne(ctx) {
        const { query } = ctx;

        // Set default populate to include materials with their related material data
        const populate = query.populate || {};

        // If populate is '*' or not specified, add materials population
        if (populate === '*' || !populate.materials) {
            populate.materials = {
                populate: {
                    material: true
                }
            };
        }

        // Update query with proper populate
        ctx.query.populate = populate;

        // Call the default findOne method
        const { data, meta } = await super.findOne(ctx);

        return { data, meta };
    }
}));
