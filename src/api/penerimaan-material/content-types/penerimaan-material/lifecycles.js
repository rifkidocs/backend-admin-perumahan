module.exports = {
  async beforeCreate(event) {
    const { params } = event;
    const { data } = params;

    if (data.list_materials && Array.isArray(data.list_materials)) {
      for (const item of data.list_materials) {
        // If material is not selected but new material name is provided
        if (!item.material && item.nama_material_baru) {
          // Check if material already exists (globally)
          const existingMaterial = await strapi.db
            .query("api::material.material")
            .findOne({
              where: {
                nama_material: item.nama_material_baru,
              },
            });

          if (existingMaterial) {
            item.material = existingMaterial.id;
          } else {
            // Create new material (Master Data)
            const newMaterial = await strapi.entityService.create(
              "api::material.material",
              {
                data: {
                  nama_material: item.nama_material_baru,
                  satuan: item.unit,
                  status_material: "Tersedia",
                  // No stock or location fields here anymore
                },
              }
            );
            item.material = newMaterial.id;
          }
        }
      }
    }
  },

  // Store old status before update
  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;

    // Store the old status in the event for use in afterUpdate
    if (data.statusReceiving) {
      const oldRecord = await strapi.db
        .query("api::penerimaan-material.penerimaan-material")
        .findOne({
          where: where,
          select: ["statusReceiving"],
        });

      // Store in params so afterUpdate can access it
      params._oldStatus = oldRecord?.statusReceiving;
    }

    // Handle new material creation (same as beforeCreate)
    if (data.list_materials && Array.isArray(data.list_materials)) {
      for (const item of data.list_materials) {
        if (!item.material && item.nama_material_baru) {
          const existingMaterial = await strapi.db
            .query("api::material.material")
            .findOne({
              where: {
                nama_material: item.nama_material_baru,
              },
            });

          if (existingMaterial) {
            item.material = existingMaterial.id;
          } else {
            const newMaterial = await strapi.entityService.create(
              "api::material.material",
              {
                data: {
                  nama_material: item.nama_material_baru,
                  satuan: item.unit,
                  status_material: "Tersedia",
                },
              }
            );
            item.material = newMaterial.id;
          }
        }
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    if (
      result.statusReceiving === "completed" &&
      result.list_materials &&
      Array.isArray(result.list_materials)
    ) {
      await updateStock(result);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status is being changed TO 'completed' (and was NOT completed before)
    if (
      data.statusReceiving === "completed" &&
      params._oldStatus !== "completed" &&
      result.statusReceiving === "completed"
    ) {
      // Need to fetch the full record with populated materials and gudang
      const fullRecord = await strapi.entityService.findOne(
        "api::penerimaan-material.penerimaan-material",
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
  },
};

async function updateStock(record) {
  console.log("✅ Updating stock for record:", record.id);

  const gudangId = record.gudang?.id || record.gudang;
  if (!gudangId) {
    console.error("❌ No warehouse (gudang) specified in receiving record");
    return;
  }

  if (record.list_materials && Array.isArray(record.list_materials)) {
    for (const item of record.list_materials) {
      if (item.material && item.quantity) {
        const materialId = item.material.id || item.material;

        console.log(
          `📦 Processing material ${materialId} for gudang ${gudangId}, quantity: ${item.quantity}`
        );

        // Find existing material-gudang record
        const materialGudang = await strapi.db
          .query("api::material-gudang.material-gudang")
          .findOne({
            where: {
              material: materialId,
              gudang: gudangId,
            },
          });

        if (materialGudang) {
          // Update existing stock
          const newStock =
            Math.round(
              (Number(materialGudang.stok) + Number(item.quantity)) * 100
            ) / 100;

          await strapi.entityService.update(
            "api::material-gudang.material-gudang",
            materialGudang.id,
            {
              data: {
                stok: newStock,
                last_updated_by: "system (penerimaan)",
              },
            }
          );
          console.log(`✅ Updated stock to ${newStock}`);
        } else {
          // Create new material-gudang record
          await strapi.entityService.create(
            "api::material-gudang.material-gudang",
            {
              data: {
                material: materialId,
                gudang: gudangId,
                stok: Number(item.quantity),
                stok_minimal: 0,
                last_updated_by: "system (penerimaan)",
              },
            }
          );
          console.log(`✅ Created new stock record: ${item.quantity}`);
        }
      }
    }
  }
}
