module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate system stock jika material dan stock_opname ada
    if (data.material && data.stock_opname) {
      try {
        const systemStock = await strapi.service('api::stock-opname-item.stock-opname-item')
          .generateSystemStock(data.stock_opname, data.material);

        data.system_stock = systemStock;

        // Auto-calculate difference dan variance status
        if (data.physical_stock !== undefined) {
          const difference = data.physical_stock - systemStock;
          data.difference = difference;
          data.variance_status = await strapi.service('api::stock-opname-item.stock-opname-item')
            .updateVarianceStatus(systemStock, data.physical_stock);
          data.adjustment_needed = difference !== 0;
        }
      } catch (error) {
        strapi.log.error('Error generating system stock:', error);
        // Fallback ke manual calculation jika service gagal
        if (data.system_stock !== undefined && data.physical_stock !== undefined) {
          data.difference = data.physical_stock - data.system_stock;
          data.variance_status = data.difference === 0 ? 'Match' : (data.difference > 0 ? 'Over' : 'Short');
          data.adjustment_needed = data.difference !== 0;
        }
      }
    } else {
      // Fallback ke calculation manual
      if (data.system_stock !== undefined && data.physical_stock !== undefined) {
        data.difference = data.physical_stock - data.system_stock;
        data.variance_status = data.difference === 0 ? 'Match' : (data.difference > 0 ? 'Over' : 'Short');
        data.adjustment_needed = data.difference !== 0;
      }
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    try {
      // Get current data untuk mendapatkan material dan stock_opname
      const currentItem = await strapi.entityService.findOne('api::stock-opname-item.stock-opname-item', where.id, {
        populate: ['material', 'stock_opname']
      });

      if (!currentItem) return;

      // Re-calculate system stock jika material atau stock_opname berubah, atau physical stock diupdate
      const materialId = data.material || currentItem.material?.id;
      const stockOpnameId = data.stock_opname || currentItem.stock_opname?.id;
      const physicalStockUpdated = data.physical_stock !== undefined;

      if (materialId && stockOpnameId) {
        const systemStock = await strapi.service('api::stock-opname-item.stock-opname-item')
          .generateSystemStock(stockOpnameId, materialId);

        data.system_stock = systemStock;

        // Re-calculate difference dan variance status
        const physicalStock = physicalStockUpdated ? data.physical_stock : currentItem.physical_stock;
        if (physicalStock !== undefined) {
          const difference = physicalStock - systemStock;
          data.difference = difference;
          data.variance_status = await strapi.service('api::stock-opname-item.stock-opname-item')
            .updateVarianceStatus(systemStock, physicalStock);
          data.adjustment_needed = difference !== 0;
        }
      } else {
        // Fallback: recalculate difference jika stock values diupdate manual
        if (data.system_stock !== undefined || data.physical_stock !== undefined) {
          const currentSystemStock = data.system_stock !== undefined ? data.system_stock : currentItem?.system_stock || 0;
          const currentPhysicalStock = data.physical_stock !== undefined ? data.physical_stock : currentItem?.physical_stock || 0;

          const difference = currentPhysicalStock - currentSystemStock;
          data.difference = difference;
          data.variance_status = difference === 0 ? 'Match' : (difference > 0 ? 'Over' : 'Short');
          data.adjustment_needed = difference !== 0;
        }
      }
    } catch (error) {
      strapi.log.error('Error in beforeUpdate lifecycle:', error);
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