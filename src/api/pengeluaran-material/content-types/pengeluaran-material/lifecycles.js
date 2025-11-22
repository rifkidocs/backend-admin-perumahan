module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Decrement stock when status is 'approved'
    if (
      result.approvalStatus === "approved" &&
      result.list_materials &&
      Array.isArray(result.list_materials) &&
      result.gudang
    ) {
      await updateStock(result);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'approved'
    if (
      data.approvalStatus === "approved" &&
      result.approvalStatus === "approved" &&
      result.list_materials &&
      Array.isArray(result.list_materials) &&
      result.gudang
    ) {
      // Check if it wasn't approved before to avoid double deduction
      if (params._oldStatus !== "approved") {
        // Need to fetch full record to get populated materials if they aren't in result
        // result might not have deep population of components depending on the query
        // But usually components are returned. Let's be safe and fetch if needed,
        // but for now assuming result has it or we fetch it.
        // Actually, strapi update result might not have component data fully populated if not requested.
        // Let's fetch the full record to be safe, similar to penerimaan-material.

        const fullRecord = await strapi.entityService.findOne(
          "api::pengeluaran-material.pengeluaran-material",
          result.id,
          {
            populate: {
              list_materials: {
                populate: ["material"],
              },
              gudang: true,
            },
          }
        );
        await updateStock(fullRecord);
      }
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;

    if (data.approvalStatus) {
      const oldRecord = await strapi.db
        .query("api::pengeluaran-material.pengeluaran-material")
        .findOne({
          where: where,
          select: ["approvalStatus"],
        });
      params._oldStatus = oldRecord?.approvalStatus;
    }
  },
};

async function updateStock(record) {
  const gudangId = record.gudang.id || record.gudang;

  console.log(
    `📉 Processing issuance for record ${record.id} from gudang ${gudangId}`
  );

  if (record.list_materials && Array.isArray(record.list_materials)) {
    for (const item of record.list_materials) {
      if (item.material && item.quantity) {
        const materialId = item.material.id || item.material;
        const quantity = item.quantity;

        console.log(`   - Material ${materialId}, quantity: ${quantity}`);

        const materialGudang = await strapi.db
          .query("api::material-gudang.material-gudang")
          .findOne({
            where: {
              material: materialId,
              gudang: gudangId,
            },
          });

        if (materialGudang) {
          const newStock = Number(materialGudang.stok) - Number(quantity);

          if (newStock < 0) {
            strapi.log.warn(
              `⚠️ Stock negative for material ${materialId} in gudang ${gudangId}. Current: ${materialGudang.stok}, Issuance: ${quantity}`
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
            `   ❌ Material-Gudang record not found for material ${materialId} and gudang ${gudangId}`
          );
        }
      }
    }
  }
}
