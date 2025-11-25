"use strict";

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
          populate: ["items", "items.material_gudang", "gudang"],
        }
      );
      // Log carefully to avoid circular structure issues if any, though JSON.stringify usually handles simple objects fine
      // strapi.log.info(`[StockOpname] Fetched data: ${JSON.stringify(opnameData, null, 2)}`);
      // Commented out full JSON log to avoid spamming, but logging keys helps
      strapi.log.info(
        `[StockOpname] Fetched data keys: ${Object.keys(opnameData).join(", ")}`
      );
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

    if (item.material_gudang && item.physical_stock !== undefined) {
      const materialGudangId =
        typeof item.material_gudang === "object"
          ? item.material_gudang.id
          : item.material_gudang;
      strapi.log.info(
        `[StockOpname] Updating material_gudang ID: ${materialGudangId} with stock: ${item.physical_stock}`
      );

      if (!materialGudangId) {
        strapi.log.error(
          `[StockOpname] Error: material_gudang ID is missing for item ${index}`
        );
        continue;
      }

      try {
        await strapi.entityService.update(
          "api::material-gudang.material-gudang",
          materialGudangId,
          {
            data: {
              stok: item.physical_stock,
              last_updated_by: "Stock Opname " + opnameData.opname_number,
            },
          }
        );
        strapi.log.info(
          `[StockOpname] Successfully updated material_gudang ID: ${materialGudangId}`
        );
      } catch (e) {
        strapi.log.error(
          `[StockOpname] Error updating material_gudang ID ${materialGudangId}:`,
          e
        );
      }
    } else if (!item.material_gudang) {
      strapi.log.warn(
        `[StockOpname] Warning: Item ${index} in ${opnameData.opname_number} has no material_gudang assigned. Skipping.`
      );
    }
  }
  strapi.log.info(`[StockOpname] updateStock END for ID: ${id}`);
}
