'use strict';

/**
 * progres-harian service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::progres-harian.progres-harian', ({ strapi }) => ({
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
            (sum, report) => sum + (report.persentase_progres || report.progress_after || 0),
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
                        reports.reduce((sum, r) => sum + (r.persentase_progres || r.progress_after || 0), 0) / reports.length
                    )
                    : 0,
            onScheduleCount: reports.filter((r) => r.status_harian === "sesuai_jadwal")
                .length,
            delayedCount: reports.filter((r) => r.status_harian === "terlambat").length,
            aheadCount: reports.filter((r) => r.status_harian === "maju_jadwal").length,
            reports,
        };
    },

    // Helper function untuk update stock material
    async updateMaterialStock(materialUsageDetails, action) {
        if (!materialUsageDetails || !Array.isArray(materialUsageDetails)) {
            return;
        }

        try {
            for (const usage of materialUsageDetails) {
                const { material_id, jumlah } = usage;

                if (!material_id || !jumlah) {
                    continue;
                }

                const material = await strapi.entityService.findOne('api::material.material', material_id);

                if (!material) {
                    strapi.log.warn(`Material with ID ${material_id} not found`);
                    continue;
                }

                const currentStock = material.stok || 0;
                let newStock;

                if (action === 'subtract') {
                    newStock = Math.max(0, currentStock - jumlah);
                } else if (action === 'add') {
                    newStock = currentStock + jumlah;
                } else {
                    continue;
                }

                await strapi.entityService.update('api::material.material', material_id, {
                    data: { stok: newStock }
                });

                strapi.log.info(`Updated stock for material ${material.nama_material}: ${currentStock} → ${newStock} (${action})`);
            }
        } catch (error) {
            strapi.log.error('Error updating material stock:', error);
            throw new Error(`Failed to update material stock: ${error.message}`);
        }
    },
}));
