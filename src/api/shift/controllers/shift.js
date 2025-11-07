'use strict';

/**
 * shift controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shift.shift', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    // Filter only active shifts by default
    if (!ctx.query.is_active) {
      ctx.query.is_active = true;
    }

    return { data, meta };
  },

  async findActive(ctx) {
    ctx.query = {
      ...ctx.query,
      is_active: true
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  }
}));