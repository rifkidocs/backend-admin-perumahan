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
            "mandor",
            "tukang",
            "foto_dokumentasi",
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
  })
);
