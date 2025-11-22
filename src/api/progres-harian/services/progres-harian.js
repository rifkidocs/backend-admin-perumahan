"use strict";

/**
 * progres-harian service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::progres-harian.progres-harian",
  ({ strapi }) => ({
    async updateProjectProgress(projectId) {
      if (!projectId) return;

      // Ambil semua laporan progress untuk proyek ini
      const reports = await strapi.entityService.findMany(
        "api::progres-harian.progres-harian",
        {
          filters: { proyek_perumahan: projectId },
          sort: { update_date: "desc" },
          populate: ["proyek_perumahan"],
        }
      );

      if (reports.length === 0) return;

      // Hitung rata-rata progress
      const totalProgress = reports.reduce(
        (sum, report) =>
          sum + (report.persentase_progres || report.progress_after || 0),
        0
      );
      const averageProgress = Math.round(totalProgress / reports.length);

      // Update progress proyek
      await strapi.entityService.update(
        "api::proyek-perumahan.proyek-perumahan",
        projectId,
        {
          data: {
            progress_percentage: averageProgress,
            updatedAt: new Date(),
          },
        }
      );
    },

    async getProgressSummary(projectId, startDate, endDate) {
      const reports = await strapi.entityService.findMany(
        "api::progres-harian.progres-harian",
        {
          filters: {
            proyek_perumahan: projectId,
            update_date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          sort: { update_date: "asc" },
          populate: [
            "proyek_perumahan",
            "unit_rumah",
            "pelapor",
            "data_pekerja",
            "data_cuaca",
            "penggunaan_material",
            "dokumentasi_foto",
          ],
        }
      );

      return {
        totalReports: reports.length,
        averageProgress:
          reports.length > 0
            ? Math.round(
                reports.reduce(
                  (sum, r) =>
                    sum + (r.persentase_progres || r.progress_after || 0),
                  0
                ) / reports.length
              )
            : 0,
        onScheduleCount: reports.filter(
          (r) => r.status_harian === "sesuai_jadwal"
        ).length,
        delayedCount: reports.filter((r) => r.status_harian === "terlambat")
          .length,
        aheadCount: reports.filter((r) => r.status_harian === "maju_jadwal")
          .length,
        reports,
      };
    },

    // Helper function untuk update stock material
    async updateMaterialStock(listMaterials, gudangId, action) {
      if (!listMaterials || !Array.isArray(listMaterials)) {
        return;
      }

      if (!gudangId) {
        strapi.log.warn(
          `Cannot update stock: No gudang specified in progress report.`
        );
        return;
      }

      try {
        for (const item of listMaterials) {
          // Handle both component structure (item.material.id) and direct ID if passed differently
          const materialId = item.material?.id || item.material;
          const quantity = item.quantity;

          if (!materialId || !quantity) {
            continue;
          }

          const materialGudang = await strapi.db
            .query("api::material-gudang.material-gudang")
            .findOne({
              where: {
                material: materialId,
                gudang: gudangId,
              },
            });

          if (!materialGudang) {
            strapi.log.warn(
              `Material-Gudang record not found for material ${materialId} in gudang ${gudangId}`
            );
            continue;
          }

          const currentStock = Number(materialGudang.stok) || 0;
          let newStock;

          if (action === "subtract") {
            newStock = Math.max(0, currentStock - Number(quantity));
          } else if (action === "add") {
            newStock = currentStock + Number(quantity);
          } else {
            continue;
          }

          // Round to 2 decimals
          newStock = Math.round(newStock * 100) / 100;

          await strapi.entityService.update(
            "api::material-gudang.material-gudang",
            materialGudang.id,
            {
              data: {
                stok: newStock,
                last_updated_by: `system (progres-harian: ${action})`,
              },
            }
          );

          strapi.log.info(
            `Updated stock for material ${materialId} in gudang ${gudangId}: ${currentStock} → ${newStock} (${action})`
          );
        }
      } catch (error) {
        strapi.log.error("Error updating material stock:", error);
        throw new Error(`Failed to update material stock: ${error.message}`);
      }
    },
  })
);
