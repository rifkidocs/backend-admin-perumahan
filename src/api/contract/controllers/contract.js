// @ts-nocheck
'use strict';

/**
 * contract controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contract.contract', ({ strapi }) => ({
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
    }
}));
