module.exports = {
  async beforeCreate(event) {
    const { params } = event;
    const { data } = params;

    if (data.list_materials && Array.isArray(data.list_materials)) {
      for (const item of data.list_materials) {
        // If material is not selected but new material name is provided
        if (!item.material && item.nama_material_baru) {
          // Check if material already exists AT THIS WAREHOUSE
          const existingMaterial = await strapi.db
            .query("api::material.material")
            .findOne({
              where: {
                nama_material: item.nama_material_baru,
                lokasi_gudang: data.gudang?.id || data.gudang,
              },
            });

          if (existingMaterial) {
            item.material = existingMaterial.id;
          } else {
            // Create new material LINKED TO THIS WAREHOUSE
            const newMaterial = await strapi.entityService.create(
              "api::material.material",
              {
                data: {
                  nama_material: item.nama_material_baru,
                  stok: 0, // Initial stock 0, will be updated in afterCreate
                  satuan: item.unit,
                  status_material: "Tersedia",
                  sisa_proyek: 100,
                  lokasi_gudang: data.gudang?.id || data.gudang,
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

      console.log("beforeUpdate - storing old status:", params._oldStatus);
    }

    // Handle new material creation
    if (data.list_materials && Array.isArray(data.list_materials)) {
      for (const item of data.list_materials) {
        // If material is not selected but new material name is provided
        if (!item.material && item.nama_material_baru) {
          // Check if material already exists AT THIS WAREHOUSE
          const existingMaterial = await strapi.db
            .query("api::material.material")
            .findOne({
              where: {
                nama_material: item.nama_material_baru,
                lokasi_gudang: data.gudang?.id || data.gudang,
              },
            });

          if (existingMaterial) {
            item.material = existingMaterial.id;
          } else {
            // Create new material LINKED TO THIS WAREHOUSE
            const newMaterial = await strapi.entityService.create(
              "api::material.material",
              {
                data: {
                  nama_material: item.nama_material_baru,
                  stok: 0,
                  satuan: item.unit,
                  status_material: "Tersedia",
                  sisa_proyek: 100,
                  lokasi_gudang: data.gudang?.id || data.gudang,
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

    console.log("afterCreate triggered:", {
      status: result.statusReceiving,
      listMaterialsCount: result.list_materials?.length,
    });

    if (
      result.statusReceiving === "completed" &&
      result.list_materials &&
      Array.isArray(result.list_materials)
    ) {
      console.log("✅ New receiving is completed, updating stock...");

      for (const item of result.list_materials) {
        if (item.material && item.quantity) {
          const materialId = item.material.id || item.material;

          console.log(
            `📦 Updating stock for material ${materialId}, quantity: ${item.quantity}`
          );

          const material = await strapi.entityService.findOne(
            "api::material.material",
            materialId,
            {
              fields: ["stok", "nama_material"],
            }
          );

          if (material) {
            // Fix floating point precision
            const newStock =
              Math.round(
                (Number(material.stok) + Number(item.quantity)) * 100
              ) / 100;
            console.log(
              `📊 Material "${material.nama_material}" (ID: ${materialId})`
            );
            console.log(`   Current stock: ${material.stok}`);
            console.log(`   Adding: ${item.quantity}`);
            console.log(`   New stock: ${newStock}`);

            await strapi.entityService.update(
              "api::material.material",
              material.id,
              {
                data: {
                  stok: newStock,
                },
              }
            );

            console.log(
              `✅ Stock updated successfully for material ${materialId}`
            );
          } else {
            console.log(`❌ Material ${materialId} not found`);
          }
        }
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Debug logging
    console.log("afterUpdate triggered:", {
      receivingId: result.id,
      oldStatus: params._oldStatus,
      newStatus: result.statusReceiving,
      dataHasStatus: !!data.statusReceiving,
      listMaterialsCount: result.list_materials?.length,
    });

    // Check if status is being changed TO 'completed' (and was NOT completed before)
    if (
      data.statusReceiving === "completed" &&
      params._oldStatus !== "completed" &&
      result.statusReceiving === "completed"
    ) {
      console.log("✅ Status changed to completed, updating stock...");

      try {
        // Need to fetch the full record with populated materials
        const fullRecord = await strapi.entityService.findOne(
          "api::penerimaan-material.penerimaan-material",
          result.id,
          {
            populate: {
              list_materials: {
                populate: ["material"],
              },
            },
          }
        );

        console.log("Full record fetched:", {
          id: fullRecord.id,
          listMaterialsCount: fullRecord.list_materials?.length,
        });

        if (
          fullRecord.list_materials &&
          Array.isArray(fullRecord.list_materials)
        ) {
          for (const item of fullRecord.list_materials) {
            if (item.material && item.quantity) {
              // Extract material ID - handle various formats
              let materialId;
              if (typeof item.material === "object" && item.material !== null) {
                materialId = item.material.id;
              } else {
                materialId = item.material;
              }

              console.log(`📦 Processing item:`, {
                materialRaw: typeof item.material,
                materialId: materialId,
                quantity: item.quantity,
              });

              if (!materialId) {
                console.log(
                  "❌ Could not extract material ID from:",
                  item.material
                );
                continue;
              }

              const material = await strapi.entityService.findOne(
                "api::material.material",
                materialId,
                {
                  fields: ["stok", "nama_material"],
                }
              );

              if (material) {
                // Fix floating point precision by rounding to 2 decimal places
                const newStock =
                  Math.round(
                    (Number(material.stok) + Number(item.quantity)) * 100
                  ) / 100;

                console.log(
                  `📊 Material "${material.nama_material}" (ID: ${materialId})`
                );
                console.log(`   Current stock: ${material.stok}`);
                console.log(`   Adding: ${item.quantity}`);
                console.log(`   New stock: ${newStock}`);

                await strapi.entityService.update(
                  "api::material.material",
                  material.id,
                  {
                    data: {
                      stok: newStock,
                    },
                  }
                );

                console.log(
                  `✅ Stock updated successfully for material ${materialId}`
                );
              } else {
                console.log(`❌ Material ${materialId} not found`);
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ Error updating stock:", error.message);
        console.error("Full error:", error);
        // Don't throw - let the update continue even if stock update fails
      }
    } else {
      console.log(
        "ℹ️ Status not changing to completed (oldStatus:",
        params._oldStatus,
        ", newStatus:",
        result.statusReceiving,
        ")"
      );
    }
  },
};
