'use strict';

/**
 * stock-opname-item controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::stock-opname-item.stock-opname-item', ({ strapi }) => ({
  async create(ctx) {
    try {
      const response = await super.create(ctx);

      // Log item creation with variance information
      const difference = response.data.data.attributes.difference;
      if (difference !== 0) {
        strapi.log.warn(`Stock variance created: ${response.data.data.attributes.material_name} - ${difference} units`);
      }

      return response;
    } catch (error) {
      strapi.log.error('Error creating stock opname item:', error);
      ctx.badRequest('Error creating stock opname item', { error: error.message });
    }
  },

  async update(ctx) {
    try {
      const response = await super.update(ctx);

      // Log item update with variance information
      const difference = response.data.data.attributes.difference;
      if (difference !== 0) {
        strapi.log.info(`Stock opname item updated: ${response.data.data.attributes.material_name} - Variance: ${difference} units`);
      }

      return response;
    } catch (error) {
      strapi.log.error('Error updating stock opname item:', error);
      ctx.badRequest('Error updating stock opname item', { error: error.message });
    }
  },

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

  async createBatch(ctx) {
    try {
      const { items } = ctx.request.body;

      if (!Array.isArray(items) || items.length === 0) {
        return ctx.badRequest('Items array is required and cannot be empty');
      }

      const createdItems = [];

      // Create each item
      for (const itemData of items) {
        const createdItem = await strapi.entityService.create('api::stock-opname-item.stock-opname-item', {
          data: itemData
        });
        createdItems.push(createdItem);
      }

      // Update the related stock opname totals
      if (createdItems.length > 0 && createdItems[0].stock_opname) {
        const stockOpnameId = createdItems[0].stock_opname;
        await updateStockOpnameTotals(stockOpnameId);
      }

      return ctx.send({ data: createdItems });
    } catch (error) {
      strapi.log.error('Error creating stock opname items batch:', error);
      ctx.badRequest('Error creating items batch', { error: error.message });
    }
  }
}));