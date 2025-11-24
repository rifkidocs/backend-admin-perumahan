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

  // If items or gudang are not populated, fetch them
  let opnameData = stockOpname;
  if (!items || !gudang) {
    opnameData = await strapi.entityService.findOne(
      "api::stock-opname.stock-opname",
      id,
      {
        populate: ["items", "items.material", "gudang"],
      }
    );
  }

  if (!opnameData.gudang) {
    strapi.log.warn(
      `Stock Opname ${id} has no warehouse assigned. Skipping stock update.`
    );
    return;
  }

  const gudangId = opnameData.gudang.id;

  for (const item of opnameData.items) {
    if (item.material && item.physical_stock !== undefined) {
      const materialId = item.material.id;

      // Find the material-gudang record
      const materialGudang = await strapi.db
        .query("api::material-gudang.material-gudang")
        .findOne({
          where: {
            material: materialId,
            gudang: gudangId,
          },
        });

      if (materialGudang) {
        // Update existing record
        await strapi.entityService.update(
          "api::material-gudang.material-gudang",
          materialGudang.id,
          {
            data: {
              stok: item.physical_stock,
              last_updated_by: "Stock Opname " + opnameData.opname_number,
            },
          }
        );
      } else {
        // Create new record if it doesn't exist (optional, but good for consistency)
        await strapi.entityService.create(
          "api::material-gudang.material-gudang",
          {
            data: {
              material: materialId,
              gudang: gudangId,
              stok: item.physical_stock,
              last_updated_by: "Stock Opname " + opnameData.opname_number,
            },
          }
        );
      }
    }
  }
}
