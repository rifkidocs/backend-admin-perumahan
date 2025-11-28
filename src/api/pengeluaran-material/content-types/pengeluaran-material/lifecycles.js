module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Decrement stock when status is 'approved'
    if (
      result.approvalStatus === "approved" &&
      result.list_materials &&
      Array.isArray(result.list_materials)
    ) {
      await updateStock(result);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // 1. Status changed to 'approved'
    if (
      data.approvalStatus === "approved" &&
      result.approvalStatus === "approved" &&
      params._oldStatus !== "approved"
    ) {
      await updateStock(result);
    }
    // 2. Already approved and content changed (e.g. list_materials updated)
    else if (
      result.approvalStatus === "approved" &&
      params._oldStatus === "approved"
    ) {
      // Restore old stock
      if (params._oldRecord) {
        await restoreStock(params._oldRecord);
      }
      // Deduct new stock
      await updateStock(result);
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    const { where } = params;

    const oldRecord = await strapi.entityService.findOne(
      "api::pengeluaran-material.pengeluaran-material",
      where.id,
      {
        populate: {
          list_materials: {
            populate: ["material_gudang"],
          },
        },
      }
    );

    if (oldRecord) {
      params._oldStatus = oldRecord.approvalStatus;
      params._oldRecord = oldRecord;
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    const record = await strapi.entityService.findOne(
      "api::pengeluaran-material.pengeluaran-material",
      where.id,
      {
        populate: {
          list_materials: {
            populate: ["material_gudang"],
          },
        },
      }
    );

    if (
      record &&
      record.approvalStatus === "approved" &&
      record.list_materials &&
      Array.isArray(record.list_materials)
    ) {
      await restoreStock(record);
    }
  },
};

async function restoreStock(record) {
  console.log(`📈 Restoring stock for deleted/cancelled record ${record.id}`);

  if (record.list_materials && Array.isArray(record.list_materials)) {
    for (const item of record.list_materials) {
      if (item.sumber === "stok" && item.material_gudang && item.quantity) {
        const materialGudangId =
          item.material_gudang.id || item.material_gudang;
        const quantity = item.quantity;

        const materialGudang = await strapi.entityService.findOne(
          "api::material-gudang.material-gudang",
          materialGudangId
        );

        if (materialGudang) {
          const newStock = Number(materialGudang.stok) + Number(quantity);

          await strapi.entityService.update(
            "api::material-gudang.material-gudang",
            materialGudang.id,
            {
              data: {
                stok: newStock,
                last_updated_by: "system (pengeluaran: restore)",
              },
            }
          );
          console.log(`   ✅ Stock restored. New stock: ${newStock}`);
        }
      }
    }
  }
}

async function updateStock(record) {
  console.log(`📉 Processing issuance for record ${record.id}`);

  if (record.list_materials && Array.isArray(record.list_materials)) {
    for (const item of record.list_materials) {
      // Handle Stock Source
      if (item.sumber === "stok" && item.material_gudang && item.quantity) {
        const materialGudangId =
          item.material_gudang.id || item.material_gudang;
        const quantity = item.quantity;

        console.log(
          `   - Processing Stock Deduction: MaterialGudang ID ${materialGudangId}, quantity: ${quantity}`
        );

        const materialGudang = await strapi.entityService.findOne(
          "api::material-gudang.material-gudang",
          materialGudangId
        );

        if (materialGudang) {
          const newStock = Number(materialGudang.stok) - Number(quantity);

          if (newStock < 0) {
            strapi.log.warn(
              `⚠️ Stock negative for MaterialGudang ${materialGudangId}. Current: ${materialGudang.stok}, Issuance: ${quantity}`
            );
          }

          await strapi.entityService.update(
            "api::material-gudang.material-gudang",
            materialGudang.id,
            {
              data: {
                stok: newStock,
                last_updated_by: "system (pengeluaran)",
              },
            }
          );
          console.log(`   ✅ Stock deducted. New stock: ${newStock}`);
        } else {
          console.error(
            `   ❌ Material-Gudang record not found for ID ${materialGudangId}`
          );
        }
      }
      // Handle Direct Purchase
      else if (item.sumber === "langsung_beli") {
        console.log(
          `   ℹ️ Direct purchase for material ${
            item.material?.id || item.material
          }, skipping stock deduction.`
        );
      }
    }
  }
}
