module.exports = {
  async beforeCreate(event) {
    const { params } = event;
    const { data } = params;

    if (data.list_materials && Array.isArray(data.list_materials)) {
      for (const item of data.list_materials) {
        // If material is not selected but new material name is provided
        if (!item.material && item.nama_material_baru) {
          // Check if material already exists
          const existingMaterial = await strapi.db
            .query("api::material.material")
            .findOne({
              where: { nama_material: item.nama_material_baru },
            });

          if (existingMaterial) {
            item.material = existingMaterial.id;
          } else {
            // Create new material
            const newMaterial = await strapi.entityService.create(
              "api::material.material",
              {
                data: {
                  nama_material: item.nama_material_baru,
                  stok: 0, // Initial stock 0, will be updated in afterCreate
                  satuan: item.unit,
                  status_material: "Tersedia",
                  sisa_proyek: 100, // Default value
                  // Add other required fields with defaults if necessary
                },
              }
            );
            item.material = newMaterial.id;
          }
        }
      }
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    const { data } = params;

    if (data.list_materials && Array.isArray(data.list_materials)) {
      for (const item of data.list_materials) {
        // If material is not selected but new material name is provided
        if (!item.material && item.nama_material_baru) {
          // Check if material already exists
          const existingMaterial = await strapi.db
            .query("api::material.material")
            .findOne({
              where: { nama_material: item.nama_material_baru },
            });

          if (existingMaterial) {
            item.material = existingMaterial.id;
          } else {
            // Create new material
            const newMaterial = await strapi.entityService.create(
              "api::material.material",
              {
                data: {
                  nama_material: item.nama_material_baru,
                  stok: 0,
                  satuan: item.unit,
                  status_material: "Tersedia",
                  sisa_proyek: 100,
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
      for (const item of result.list_materials) {
        if (item.material && item.quantity) {
          const materialId = item.material.id || item.material;

          const material = await strapi.entityService.findOne(
            "api::material.material",
            materialId,
            {
              fields: ["stok"],
            }
          );

          if (material) {
            await strapi.entityService.update(
              "api::material.material",
              material.id,
              {
                data: {
                  stok: Number(material.stok) + Number(item.quantity),
                },
              }
            );
          }
        }
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'completed'
    if (
      data.statusReceiving === "completed" &&
      result.statusReceiving === "completed" &&
      result.list_materials &&
      Array.isArray(result.list_materials)
    ) {
      for (const item of result.list_materials) {
        if (item.material && item.quantity) {
          const materialId = item.material.id || item.material;

          const material = await strapi.entityService.findOne(
            "api::material.material",
            materialId,
            {
              fields: ["stok"],
            }
          );

          if (material) {
            await strapi.entityService.update(
              "api::material.material",
              material.id,
              {
                data: {
                  stok: Number(material.stok) + Number(item.quantity),
                },
              }
            );
          }
        }
      }
    }
  },
};
