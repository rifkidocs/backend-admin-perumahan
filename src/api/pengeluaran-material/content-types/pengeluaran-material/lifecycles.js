module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (!data.mrNumber) {
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      data.mrNumber = `MR-${dateStr}-${random}`;
    }
  },

  async afterCreate(event) {
    const { result, params } = event;
    const { data } = params;

    // Decrement stock when status is 'approved'
    // Check if materials exist in result OR input data (fallback)
    const hasMaterials = (result.list_materials && Array.isArray(result.list_materials) && result.list_materials.length > 0) ||
                         (data && data.list_materials && Array.isArray(data.list_materials) && data.list_materials.length > 0);

    if (
      result.approvalStatus === "approved" &&
      hasMaterials
    ) {
      await updateStock(result, data);
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

async function restoreStock(inputRecord) {
  console.log(`📈 Restoring stock for deleted/cancelled record ${inputRecord.id}`);

  // Fetch full record to ensure deep population
  const record = await strapi.entityService.findOne(
      "api::pengeluaran-material.pengeluaran-material",
      inputRecord.id,
      {
          populate: {
              list_materials: {
                  populate: ["material_gudang"],
              },
          },
      }
  );
  
  if (!record) {
      console.log(`   ⚠️ Could not fetch full record for restoration.`);
      // Fallback to using inputRecord if available and appears populated
      if (!inputRecord.list_materials) return;
  }
  
  const targetRecord = record || inputRecord;

  if (targetRecord.list_materials && Array.isArray(targetRecord.list_materials)) {
    for (const item of targetRecord.list_materials) {
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

async function updateStock(inputRecord, fallbackData = null) {
  console.log(`📉 Processing issuance for record ${inputRecord.id}`);

  // Fetch full record to ensure deep population of list_materials and their relations
  const record = await strapi.entityService.findOne(
    "api::pengeluaran-material.pengeluaran-material",
    inputRecord.id,
    {
      populate: {
        list_materials: {
          populate: ["material_gudang", "material"],
        },
      },
    }
  );

  // Determine materials source
  let materialsList = [];
  if (record && record.list_materials && Array.isArray(record.list_materials) && record.list_materials.length > 0) {
    materialsList = record.list_materials;
  } else if (fallbackData && fallbackData.list_materials && Array.isArray(fallbackData.list_materials) && fallbackData.list_materials.length > 0) {
    console.log("   ℹ️ Using fallback data for materials list (likely created via EntityService).");
    materialsList = fallbackData.list_materials;
  }

  if (!materialsList || materialsList.length === 0) {
    console.warn(`   ⚠️ No materials found for record ${inputRecord.id}, skipping stock deduction.`);
    return;
  }

  for (const item of materialsList) {
      // Handle Stock Source
      if (item.sumber === "stok" && item.material_gudang && item.quantity) {
        const materialGudangId =
          typeof item.material_gudang === 'object' ? item.material_gudang.id : item.material_gudang;
        
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
            (item.material && item.material.id) || item.material
          }, skipping stock deduction.`
        );
      }
    }
}
