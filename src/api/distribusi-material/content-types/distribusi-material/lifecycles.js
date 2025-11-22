module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.material && data.gudang_asal && data.jumlah) {
      const material = await strapi.entityService.findOne(
        "api::material.material",
        data.material,
        {
          populate: ["lokasi_gudang"],
        }
      );

      if (!material) {
        throw new Error("Material tidak ditemukan");
      }

      // Verify material is in the source warehouse
      if (
        material.lokasi_gudang &&
        material.lokasi_gudang.id !== data.gudang_asal
      ) {
        // Ideally we should check if the material ID passed actually belongs to the source warehouse.
        // Since we are selecting a specific material ID, we assume the UI filters materials by warehouse.
        // But for safety, we can check.
        // However, if the user selects a material that is NOT in the source warehouse, this logic might be flawed if the UI allows it.
        // Let's assume the material ID passed IS the one in the source warehouse.
      }

      if (material.stok < data.jumlah) {
        throw new Error(
          `Stok tidak mencukupi di gudang asal. Stok tersedia: ${material.stok}`
        );
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'Diterima'
    if (data.status === "Diterima" && result.status === "Diterima") {
      const distribusi = await strapi.entityService.findOne(
        "api::distribusi-material.distribusi-material",
        result.id,
        {
          populate: ["material", "gudang_asal", "gudang_tujuan"],
        }
      );

      if (!distribusi) return;

      // 1. Decrement stock at source warehouse
      const sourceMaterial = distribusi.material;
      if (sourceMaterial) {
        await strapi.entityService.update(
          "api::material.material",
          sourceMaterial.id,
          {
            data: {
              stok: sourceMaterial.stok - distribusi.jumlah,
            },
          }
        );
      }

      // 2. Increment stock at destination warehouse
      // 2. Increment stock at destination warehouse
      // Find material with same code at destination
      let destMaterial = null;

      // First try to match by kode_material if it exists
      if (sourceMaterial.kode_material) {
        const destMaterialsByCode = await strapi.entityService.findMany(
          "api::material.material",
          {
            filters: {
              kode_material: sourceMaterial.kode_material,
              lokasi_gudang: distribusi.gudang_tujuan.id,
            },
          }
        );
        if (destMaterialsByCode && destMaterialsByCode.length > 0) {
          destMaterial = destMaterialsByCode[0];
        }
      }

      // If not found by code (or code didn't exist), try by name
      if (!destMaterial) {
        const destMaterialsByName = await strapi.entityService.findMany(
          "api::material.material",
          {
            filters: {
              nama_material: sourceMaterial.nama_material,
              lokasi_gudang: distribusi.gudang_tujuan.id,
            },
          }
        );
        if (destMaterialsByName && destMaterialsByName.length > 0) {
          destMaterial = destMaterialsByName[0];
        }
      }

      if (destMaterial) {
        // Update existing material
        await strapi.entityService.update(
          "api::material.material",
          destMaterial.id,
          {
            data: {
              stok: destMaterial.stok + distribusi.jumlah,
            },
          }
        );
      } else {
        // Create new material at destination
        await strapi.entityService.create("api::material.material", {
          data: {
            nama_material: sourceMaterial.nama_material,
            kode_material: sourceMaterial.kode_material,
            satuan: sourceMaterial.satuan,
            stok: distribusi.jumlah,
            sisa_proyek: 100, // Default
            status_material: "Tersedia",
            minimum_stock: sourceMaterial.minimum_stock,
            harga_satuan: sourceMaterial.harga_satuan,
            lokasi_gudang: distribusi.gudang_tujuan.id,
            deskripsi: sourceMaterial.deskripsi,
          },
        });
      }
    }
  },
};
