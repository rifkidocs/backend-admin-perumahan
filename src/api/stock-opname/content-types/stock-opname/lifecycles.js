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
      // Fetch the stock opname with all items
      const stockOpname = await strapi.entityService.findOne(
        "api::stock-opname.stock-opname",
        result.id,
        {
          populate: ["stock_opname_items", "stock_opname_items.material"],
        }
      );

      if (stockOpname && stockOpname.stock_opname_items) {
        // Update stock for each item based on physical count
        for (const item of stockOpname.stock_opname_items) {
          if (item.material && item.physical_stock !== undefined) {
            const materialId = item.material.id || item.material;

            await strapi.entityService.update(
              "api::material.material",
              materialId,
              {
                data: {
                  stok: item.physical_stock,
                },
              }
            );

            strapi.log.info(
              `Stock updated for material ${materialId}: ${item.system_stock} -> ${item.physical_stock} (difference: ${item.difference})`
            );
          }
        }
      }
    }
  },
};
