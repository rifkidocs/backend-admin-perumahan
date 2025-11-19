'use strict';

/**
 * stock-opname-item controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::stock-opname-item.stock-opname-item', ({ strapi }) => ({
  async find(ctx) {
    try {
      // Add population for related data
      ctx.query.populate = {
        ...ctx.query.populate,
        stock_opname: true,
        material: true
      };

      const response = await super.find(ctx);
      return response;
    } catch (error) {
      strapi.log.error('Error finding stock opname items:', error);
      ctx.badRequest('Error finding stock opname items', { error: error.message });
    }
  },

  async findOne(ctx) {
    try {
      // Add population for related data
      ctx.query.populate = {
        ...ctx.query.populate,
        stock_opname: true,
        material: true
      };

      const response = await super.findOne(ctx);
      return response;
    } catch (error) {
      strapi.log.error('Error finding stock opname item:', error);
      ctx.badRequest('Error finding stock opname item', { error: error.message });
    }
  }
}));