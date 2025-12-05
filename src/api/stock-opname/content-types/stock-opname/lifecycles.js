"use strict";

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    if (result.status_opname === "Completed") {
      await updateStock(result);
    }
  },

  async afterUpdate(event) {
    const { result } = event;
    if (result.status_opname === "Completed") {
      await updateStock(result);
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  }
};

async function updateStock(stockOpname) {
  const { id, items, gudang } = stockOpname;
  strapi.log.info(`[StockOpname] updateStock START. ID: ${id}`);

  if (!id) {
    strapi.log.error("[StockOpname] Error: updateStock called without ID");
    return;
  }

  let opnameData = stockOpname;
  // Check if we need to fetch more data
  if (!items || !gudang) {
    strapi.log.info(`[StockOpname] Fetching full data for ID: ${id}`);
    try {
      opnameData = await strapi.entityService.findOne(
        "api::stock-opname.stock-opname",
        id,
        {
          populate: ["items.material_gudang", "gudang"]
        }
      );
      
      // Log the structure to debug population issues
      strapi.log.info(`[StockOpname] Fetched data keys: ${Object.keys(opnameData).join(", ")}`);
      if (opnameData.items && opnameData.items.length > 0) {
        strapi.log.info(`[StockOpname] First item keys: ${Object.keys(opnameData.items[0]).join(", ")}`);
        strapi.log.info(`[StockOpname] First item material_gudang type: ${typeof opnameData.items[0].material_gudang}`);
        if (opnameData.items[0].material_gudang) {
          strapi.log.info(`[StockOpname] First item material_gudang: ${JSON.stringify(opnameData.items[0].material_gudang)}`);
        }
      }
    } catch (e) {
      strapi.log.error(`[StockOpname] Error fetching data for ID ${id}:`, e);
      return;
    }
  }

  if (!opnameData) {
    strapi.log.error(
      `[StockOpname] Error: Stock Opname not found for ID ${id}`
    );
    return;
  }

  if (!opnameData.gudang) {
    strapi.log.warn(
      `[StockOpname] Warning: Stock Opname ${id} has no warehouse assigned. Skipping stock update.`
    );
    return;
  }

  if (!opnameData.items || opnameData.items.length === 0) {
    strapi.log.warn(
      `[StockOpname] Warning: No items found in Stock Opname ${id}`
    );
    return;
  }

  for (const [index, item] of opnameData.items.entries()) {
    strapi.log.info(`[StockOpname] Processing item ${index} (ID: ${item.id})`);

    // Enhanced validation and logging
    strapi.log.info(`[StockOpname] Item ${index} material_gudang: ${JSON.stringify(item.material_gudang)}`);
    strapi.log.info(`[StockOpname] Item ${index} physical_stock: ${item.physical_stock}`);

    if (!item.material_gudang) {
      strapi.log.warn(
        `[StockOpname] Warning: Item ${index} in ${opnameData.opname_number} has no material_gudang assigned. Skipping.`
      );
      continue;
    }

    if (item.physical_stock === undefined || item.physical_stock === null) {
      strapi.log.warn(
        `[StockOpname] Warning: Item ${index} has no physical_stock defined. Skipping.`
      );
      continue;
    }

    // Get material_gudang ID - handle the count object issue
    let materialGudangId = null;
    
    // Check if material_gudang is a count object (relation population issue)
    if (item.material_gudang && typeof item.material_gudang === 'object' && item.material_gudang.count !== undefined) {
      strapi.log.error(`[StockOpname] Error: material_gudang returned count object instead of relation. This suggests a relation population issue.`);
      strapi.log.error(`[StockOpname] material_gudang value: ${JSON.stringify(item.material_gudang)}`);
      
      // Try to find the material_gudang by fetching the item directly with proper population
      if (item.id) {
        try {
          strapi.log.info(`[StockOpname] Attempting to fetch item ${item.id} directly to get proper relation...`);
          const directQuery = await strapi.db.query('stock-opname.item-opname').findOne({
            where: { id: item.id },
            populate: {
              material_gudang: {
                select: ['id']
              }
            }
          });
          
          if (directQuery && directQuery.material_gudang && directQuery.material_gudang.id) {
            materialGudangId = directQuery.material_gudang.id;
            strapi.log.info(`[StockOpname] Successfully retrieved material_gudang ID: ${materialGudangId} from direct query`);
          } else {
            strapi.log.error(`[StockOpname] Direct query failed to return material_gudang relation`);
          }
        } catch (directQueryError) {
          strapi.log.error(`[StockOpname] Direct query failed:`, directQueryError);
        }
      }
    } else {
      // Normal case - try to get ID from object or use primitive value
      materialGudangId = item.material_gudang?.id || item.material_gudang;
    }
    
    if (!materialGudangId) {
      strapi.log.error(
        `[StockOpname] Error: Could not determine material_gudang ID for item ${index}. material_gudang: ${JSON.stringify(item.material_gudang)}`
      );
      continue;
    }
    
    strapi.log.info(
      `[StockOpname] Updating material_gudang ID: ${materialGudangId} with stock: ${item.physical_stock}`
    );

    try {
      // Verify the material_gudang exists before updating
      const existingMaterial = await strapi.entityService.findOne(
        "api::material-gudang.material-gudang",
        materialGudangId
      );
      
      if (!existingMaterial) {
        strapi.log.error(
          `[StockOpname] Error: material_gudang ID ${materialGudangId} does not exist`
        );
        continue;
      }

      await strapi.entityService.update(
        "api::material-gudang.material-gudang",
        materialGudangId,
        {
          data: {
            stok: item.physical_stock,
            last_updated_by: "Stock Opname " + (opnameData.opname_number || `ID:${id}`),
          },
        }
      );
      strapi.log.info(
        `[StockOpname] Successfully updated material_gudang ID: ${materialGudangId} from stock ${existingMaterial.stok} to ${item.physical_stock}`
      );
    } catch (e) {
      strapi.log.error(
        `[StockOpname] Error updating material_gudang ID ${materialGudangId}:`,
        e
      );
    }
  }
  strapi.log.info(`[StockOpname] updateStock END for ID: ${id}`);
}
