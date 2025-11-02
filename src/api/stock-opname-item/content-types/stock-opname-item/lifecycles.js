module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Calculate difference automatically
    if (data.system_stock !== undefined && data.physical_stock !== undefined) {
      data.difference = data.physical_stock - data.system_stock;

      // Set variance status based on difference
      if (data.difference === 0) {
        data.variance_status = 'Match';
      } else if (data.difference > 0) {
        data.variance_status = 'Over';
      } else {
        data.variance_status = 'Short';
      }

      // Set adjustment needed if there's a variance
      data.adjustment_needed = data.difference !== 0;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Recalculate difference if stock values are updated
    if (data.system_stock !== undefined || data.physical_stock !== undefined) {
      try {
        // Get current values if not being updated
        const currentData = await strapi.entityService.findOne('api::stock-opname-item.stock-opname-item', where);

        const currentSystemStock = data.system_stock !== undefined ? data.system_stock : currentData?.system_stock || 0;
        const currentPhysicalStock = data.physical_stock !== undefined ? data.physical_stock : currentData?.physical_stock || 0;

        const difference = currentPhysicalStock - currentSystemStock;
        data.difference = difference;

        // Update variance status
        if (difference === 0) {
          data.variance_status = 'Match';
        } else if (difference > 0) {
          data.variance_status = 'Over';
        } else {
          data.variance_status = 'Short';
        }

        // Update adjustment needed flag
        data.adjustment_needed = difference !== 0;
      } catch (error) {
        strapi.log.error('Error in beforeUpdate lifecycle:', error);
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    try {
      // Update the related stock opname totals
      await updateStockOpnameTotals(result.stock_opname);

      // Log variance if there's a difference
      if (result.difference !== 0) {
        strapi.log.warn(`Stock variance detected for ${result.material_name}: ${result.difference} ${result.unit}`);
      }
    } catch (error) {
      strapi.log.error('Error in afterCreate lifecycle:', error);
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    try {
      // Update the related stock opname totals
      await updateStockOpnameTotals(result.stock_opname);
    } catch (error) {
      strapi.log.error('Error in afterUpdate lifecycle:', error);
    }
  },

  async afterDelete(event) {
    const { result } = event;

    try {
      // Update the related stock opname totals after deletion
      if (result.stock_opname) {
        await updateStockOpnameTotals(result.stock_opname);
      }
    } catch (error) {
      strapi.log.error('Error in afterDelete lifecycle:', error);
    }
  }
};

// Helper function to update stock opname totals
async function updateStockOpnameTotals(stockOpnameId) {
  try {
    if (!stockOpnameId) {
      strapi.log.warn('No stock opname ID provided for updating totals');
      return;
    }

    // Get all items for this stock opname
    const items = await strapi.entityService.findMany('api::stock-opname-item.stock-opname-item', {
      filters: {
        stock_opname: stockOpnameId
      }
    });

    const totalItems = items.length;
    const totalVariance = items.reduce((sum, item) => sum + (item.difference || 0), 0);

    // Update the stock opname with new totals
    await strapi.entityService.update('api::stock-opname.stock-opname', stockOpnameId, {
      data: {
        total_items: totalItems,
        total_variance: totalVariance
      }
    });

    strapi.log.info(`Updated stock opname ${stockOpnameId} totals: ${totalItems} items, ${totalVariance} total variance`);

  } catch (error) {
    strapi.log.error('Error updating stock opname totals:', error);
    // Don't rethrow to prevent blocking the main operation
  }
}