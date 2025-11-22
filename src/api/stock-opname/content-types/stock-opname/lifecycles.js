module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'Completed' or 'Reviewed'
    if (
      data.status_opname &&
      (result.status_opname === "Completed" ||
        result.status_opname === "Reviewed")
    ) {
      // Fetch the stock opname with all items and gudang
      const stockOpname = await strapi.entityService.findOne(
        "api::stock-opname.stock-opname",
        result.id,
        {
          populate: [
            "stock_opname_items",
            "stock_opname_items.material",
            "gudang",
          ],
        }
      );

      if (stockOpname && stockOpname.stock_opname_items && stockOpname.gudang) {
        const gudangId = stockOpname.gudang.id;

        // Update stock for each item based on physical count
        for (const item of stockOpname.stock_opname_items) {
          if (item.material && item.physical_stock !== undefined) {
            const materialId = item.material.id || item.material;

            // Find material-gudang record
            const materialGudang = await strapi.db
              .query("api::material-gudang.material-gudang")
              .findOne({
                where: {
                  material: materialId,
                  gudang: gudangId,
                },
              });

            if (materialGudang) {
              await strapi.entityService.update(
                "api::material-gudang.material-gudang",
                materialGudang.id,
                {
                  data: {
                    stok: item.physical_stock,
                    last_updated_by: "system (stock-opname)",
                  },
                }
              );
              strapi.log.info(
                `Stock updated for material ${materialId} in gudang ${gudangId}: ${materialGudang.stok} -> ${item.physical_stock}`
              );
            } else {
              // Create if not exists
              await strapi.entityService.create(
                "api::material-gudang.material-gudang",
                {
                  data: {
                    material: materialId,
                    gudang: gudangId,
                    stok: item.physical_stock,
                    stok_minimal: 0,
                    last_updated_by: "system (stock-opname)",
                  },
                }
              );
              strapi.log.info(
                `Stock created for material ${materialId} in gudang ${gudangId}: ${item.physical_stock}`
              );
            }
          }
        }
      } else {
        strapi.log.warn(
          `Stock Opname ${result.id} completed but missing items or gudang`
        );
      }
    }
  },
};
