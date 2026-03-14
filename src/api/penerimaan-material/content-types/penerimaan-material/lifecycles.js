const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

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

    // Calculate total prices
    calculateTotalPrices(data);
  },

  // Store old status before update
  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);

    const { params } = event;
    const { data, where } = params;

    // Fetch old record for comparison
    const oldRecord = await strapi.entityService.findOne(
      "api::penerimaan-material.penerimaan-material",
      where.id,
      {
        populate: {
          list_materials: {
            populate: ["material"],
          },
          gudang: true,
        },
      }
    );

    if (oldRecord) {
      params._oldStatus = oldRecord.statusReceiving;
      params._oldStatusDokumen = oldRecord.status_dokumen;
      params._oldRecord = oldRecord;
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

    // Calculate total prices
    calculateTotalPrices(data);
  },

  async afterCreate(event) {
    const { result } = event;

    if (
      result.status_dokumen === "published" &&
      result.statusReceiving === "completed"
    ) {
      // In Strapi 5, we need to fetch the full record with populate
      // to ensure we have actual IDs for relations (not just summaries)
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

      if (
        fullRecord &&
        fullRecord.list_materials &&
        Array.isArray(fullRecord.list_materials)
      ) {
        await updateStock(fullRecord);
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    const isNowPublishedAndCompleted = 
      result.status_dokumen === "published" && 
      result.statusReceiving === "completed";
    
    const wasPublishedAndCompleted = 
      params._oldStatusDokumen === "published" && 
      params._oldStatus === "completed";

    // 1. Transition to 'published' and 'completed' from something else
    if (isNowPublishedAndCompleted && !wasPublishedAndCompleted) {
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
    // 2. Transition FROM 'published' and 'completed' back to draft or other status
    else if (!isNowPublishedAndCompleted && wasPublishedAndCompleted) {
      if (params._oldRecord) {
        await restoreStock(params._oldRecord);
      }
    }
    // 3. Content change while staying 'published' and 'completed'
    else if (isNowPublishedAndCompleted && wasPublishedAndCompleted) {
      // Check if critical data changed (list_materials or gudang)
      // For simplicity, we can always restore and update, or do deep comparison
      // Here we follow pengeluaran-material's pattern of restoring and updating
      if (params._oldRecord) {
        await restoreStock(params._oldRecord);
      }
      
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

  async beforeDelete(event) {
      await cleanupMediaOnDelete(event);

      const { where } = event.params;
      const record = await strapi.entityService.findOne(
        "api::penerimaan-material.penerimaan-material",
        where.id,
        {
          populate: {
            list_materials: {
              populate: ["material"],
            },
            gudang: true,
          },
        }
      );

      if (
        record &&
        record.status_dokumen === "published" &&
        record.statusReceiving === "completed"
      ) {
        await restoreStock(record);
      }
  }
};

/**
 * Robustly extract numeric ID from a relation field
 * @param {any} relation - The relation field value
 * @returns {number|null} - The numeric ID or null
 */
function getNumericId(relation) {
  if (!relation) return null;
  if (typeof relation === 'object') {
    // If it has id, return it
    if (relation.id) return relation.id;
    // If it's a Strapi 5 summary object { count: 1 }, it has no ID here
    return null;
  }
  // If it's already an ID (number or string)
  return relation;
}

async function restoreStock(record) {
  console.log("📈 Restoring (removing) stock for record:", record.id);

  const gudangId = getNumericId(record.gudang);
  if (!gudangId) {
    console.error("❌ No valid warehouse ID (gudang) found for restore");
    return;
  }

  if (record.list_materials && Array.isArray(record.list_materials)) {
    for (const item of record.list_materials) {
      if (item.material && item.quantity) {
        const materialId = getNumericId(item.material);
        if (!materialId) continue;

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
          const newStock =
            Math.round(
              (Number(materialGudang.stok) - Number(item.quantity)) * 100
            ) / 100;

          await strapi.entityService.update(
            "api::material-gudang.material-gudang",
            materialGudang.id,
            {
              data: {
                stok: newStock,
                last_updated_by: "system (penerimaan: restore)",
              },
            }
          );
          console.log(`✅ Restored stock to ${newStock}`);
        }
      }
    }
  }
}

async function updateStock(record) {
  console.log("✅ Updating stock for record:", record.id);

  const gudangId = getNumericId(record.gudang);
  if (!gudangId) {
    console.error("❌ No valid warehouse ID (gudang) specified in receiving record");
    return;
  }

  if (record.list_materials && Array.isArray(record.list_materials)) {
    for (const item of record.list_materials) {
      if (item.material && item.quantity) {
        const materialId = getNumericId(item.material);
        if (!materialId) {
          console.warn("⚠️ Skipping material item with no valid ID");
          continue;
        }

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

/**
 * Calculate total prices for each material item and overall purchase total
 * @param {Object} data - The penerimaan-material data object
 */
function calculateTotalPrices(data) {
  if (!data.list_materials || !Array.isArray(data.list_materials)) {
    return;
  }

  let totalPembelian = 0;

  for (const item of data.list_materials) {
    // Calculate total_harga for each item if harga_satuan is provided
    if (item.harga_satuan && item.quantity) {
      const hargaSatuan = Number(item.harga_satuan);
      const quantity = Number(item.quantity);

      // Calculate and round to 2 decimal places
      item.total_harga = Math.round(hargaSatuan * quantity * 100) / 100;

      totalPembelian += item.total_harga;
    } else if (item.total_harga) {
      // If total_harga is provided but not harga_satuan, just add to total
      totalPembelian += Number(item.total_harga);
    }
  }

  // Set total_pembelian, rounded to 2 decimal places
  if (totalPembelian > 0) {
    data.total_pembelian = Math.round(totalPembelian * 100) / 100;
  }
}
