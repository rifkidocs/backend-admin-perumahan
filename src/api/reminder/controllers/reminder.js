'use strict';

/**
 * reminder controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reminder.reminder', ({ strapi }) => ({
    // Custom controller methods can be added here
    async find(ctx) {
        const { data, meta } = await super.find(ctx);

        // Add any custom logic here
        return { data, meta };
    },

    async findOne(ctx) {
        const { data, meta } = await super.findOne(ctx);

        // Add any custom logic here
        return { data, meta };
    },

    async create(ctx) {
        const { data, meta } = await super.create(ctx);

        // Add any custom logic here
        return { data, meta };
    },

    async update(ctx) {
        const { data, meta } = await super.update(ctx);

        // Add any custom logic here
        return { data, meta };
    },

    async delete(ctx) {
        const { data, meta } = await super.delete(ctx);

        // Add any custom logic here
        return { data, meta };
    }
}));
