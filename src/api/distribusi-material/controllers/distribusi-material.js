"use strict";

/**
 * distribusi-material controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::distribusi-material.distribusi-material",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx.request.body;

      // 1. Validate required fields
      if (
        !data.material ||
        !data.gudang_asal ||
        !data.gudang_tujuan ||
        !data.jumlah
      ) {
        return ctx.badRequest(
          "Material, Gudang Asal, Gudang Tujuan, and Jumlah are required"
        );
      }

      const jumlahDistribusi = parseInt(data.jumlah);
      if (jumlahDistribusi <= 0) {
        return ctx.badRequest("Jumlah must be greater than 0");
      }

      try {
        // 2. Fetch Source Material
        const sourceMaterial = await strapi.entityService.findOne(
          "api::material.material",
          data.material,
          {
            populate: ["lokasi_gudang"],
          }
        );

        if (!sourceMaterial) {
          return ctx.notFound("Source material not found");
        }

        // Verify source warehouse matches
        if (sourceMaterial.lokasi_gudang?.id != data.gudang_asal) {
          return ctx.badRequest(
            "Material does not belong to the specified source warehouse"
          );
        }

        // 3. Check Stock Availability
        if (sourceMaterial.stok < jumlahDistribusi) {
          return ctx.badRequest(
            `Insufficient stock. Available: ${sourceMaterial.stok}, Requested: ${jumlahDistribusi}`
          );
        }

        // 4. Find or Create Destination Material
        // We assume 'kode_material' is the unique identifier for the same material across warehouses
        const destinationMaterials = await strapi.entityService.findMany(
          "api::material.material",
          {
            filters: {
              kode_material: sourceMaterial.kode_material,
              lokasi_gudang: data.gudang_tujuan,
            },
          }
        );

        let destinationMaterial =
          destinationMaterials.length > 0 ? destinationMaterials[0] : null;

        if (destinationMaterial) {
          // Update existing material stock
          await strapi.entityService.update(
            "api::material.material",
            destinationMaterial.id,
            {
              data: {
                stok: destinationMaterial.stok + jumlahDistribusi,
              },
            }
          );
        } else {
          // Create new material for destination warehouse
          // Copy relevant fields from source material
          destinationMaterial = await strapi.entityService.create(
            "api::material.material",
            {
              data: {
                nama_material: sourceMaterial.nama_material,
                kode_material: sourceMaterial.kode_material,
                satuan: sourceMaterial.satuan,
                stok: jumlahDistribusi,
                sisa_proyek: 100, // Default or calculate?
                status_material: "Tersedia",
                minimum_stock: sourceMaterial.minimum_stock,
                harga_satuan: sourceMaterial.harga_satuan,
                lokasi_gudang: data.gudang_tujuan,
                deskripsi: sourceMaterial.deskripsi,
                // Note: We might not want to copy supplier relations automatically as it might differ per project
              },
            }
          );
        }

        // 5. Deduct Stock from Source Material
        await strapi.entityService.update(
          "api::material.material",
          sourceMaterial.id,
          {
            data: {
              stok: sourceMaterial.stok - jumlahDistribusi,
            },
          }
        );

        // 6. Create Distribution Record
        // Ensure status is set if not provided
        if (!data.status) {
          data.status = "Pending";
        }

        const response = await super.create(ctx);

        return response;
      } catch (error) {
        strapi.log.error("Error in distribusi-material create:", error);
        return ctx.internalServerError(
          "An error occurred during material distribution"
        );
      }
    },
  })
);
