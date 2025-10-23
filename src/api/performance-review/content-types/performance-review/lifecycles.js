"use strict";

/**
 * performance-review lifecycle
 */

module.exports = {
    /**
     * Triggered before performance review creation.
     * @param {Object} params - The params object
     * @param {Object} params.data - The data object
     */
    async beforeCreate(event) {
        // Try both event structures for Strapi v5 compatibility
        const data = event.data || event.params?.data;

        // Auto-generate tanggal evaluasi jika tidak ada
        if (!data.tanggal_evaluasi) {
            data.tanggal_evaluasi = new Date();
        }

        // Set status default jika tidak ada
        if (!data.status_evaluasi) {
            data.status_evaluasi = "draft";
        }

        // Validasi rating kinerja
        if (data.rating_kinerja < 1 || data.rating_kinerja > 5) {
            throw new Error("Rating kinerja harus antara 1-5");
        }

        // Auto-calculate persentase pencapaian jika ada target dan pencapaian
        if (data.target_divisi && data.pencapaian_target) {
            const target = parseFloat(data.target_divisi.replace(/[^\d.]/g, ""));
            const pencapaian = parseFloat(
                data.pencapaian_target.replace(/[^\d.]/g, "")
            );

            if (target > 0) {
                data.persentase_pencapaian = ((pencapaian / target) * 100).toFixed(2);
            }
        }

        // Set periode evaluasi format
        if (data.tahun_evaluasi && data.bulan_evaluasi) {
            data.periode_evaluasi = `${data.bulan_evaluasi}/${data.tahun_evaluasi}`;
        }
    },

    /**
     * Triggered after performance review creation.
     * @param {Object} params - The params object
     * @param {Object} params.result - The result object
     */
    async afterCreate(event) {
        // Try both event structures for Strapi v5 compatibility
        const result = event.result || event.params?.result;

        try {
            // Update rating distribution
            await updateRatingDistribution(result);
        } catch (error) {
            strapi.log.error("Error updating rating distribution:", error);
        }

        try {
            // Log evaluasi baru
            if (result && result.nama_karyawan && result.nik_karyawan) {
                strapi.log.info(
                    `Evaluasi kinerja baru dibuat untuk ${result.nama_karyawan} (NIK: ${result.nik_karyawan})`
                );
            } else {
                strapi.log.info("Evaluasi kinerja baru dibuat (data tidak lengkap)");
            }
        } catch (error) {
            strapi.log.error("Error logging evaluasi baru:", error);
        }
    },

    /**
     * Triggered before performance review update.
     * @param {Object} params - The params object
     * @param {Object} params.data - The data object
     */
    async beforeUpdate(event) {
        // Try both event structures for Strapi v5 compatibility
        const data = event.data || event.params?.data;

        // Update tanggal review jika status berubah ke reviewed atau approved
        if (
            data.status_evaluasi === "reviewed" ||
            data.status_evaluasi === "approved"
        ) {
            data.tanggal_review = new Date();
        }

        // Re-calculate persentase pencapaian jika ada perubahan
        if (data.target_divisi && data.pencapaian_target) {
            const target = parseFloat(data.target_divisi.replace(/[^\d.]/g, ""));
            const pencapaian = parseFloat(
                data.pencapaian_target.replace(/[^\d.]/g, "")
            );

            if (target > 0) {
                data.persentase_pencapaian = ((pencapaian / target) * 100).toFixed(2);
            }
        }
    },

    /**
     * Triggered after performance review update.
     * @param {Object} params - The params object
     * @param {Object} params.result - The result object
     */
    async afterUpdate(event) {
        // Try both event structures for Strapi v5 compatibility
        const result = event.result || event.params?.result;

        try {
            // Update rating distribution
            await updateRatingDistribution(result);
        } catch (error) {
            strapi.log.error("Error updating rating distribution:", error);
        }

        try {
            // Log perubahan evaluasi
            if (result && result.nama_karyawan && result.nik_karyawan) {
                strapi.log.info(
                    `Evaluasi kinerja diperbarui untuk ${result.nama_karyawan} (NIK: ${result.nik_karyawan})`
                );
            } else {
                strapi.log.info("Evaluasi kinerja diperbarui (data tidak lengkap)");
            }
        } catch (error) {
            strapi.log.error("Error logging perubahan evaluasi:", error);
        }
    },

    /**
     * Triggered before performance review deletion.
     * @param {Object} params - The params object
     * @param {Object} params.where - The where object
     */
    async beforeDelete(event) {
        // Try both event structures for Strapi v5 compatibility
        const where = event.where || event.params?.where;

        // Get evaluasi yang akan dihapus untuk logging
        const evaluasi = await strapi.entityService.findOne(
            "api::performance-review.performance-review",
            where.id,
            { populate: "*" }
        );

        if (evaluasi) {
            strapi.log.info(
                `Evaluasi kinerja akan dihapus untuk ${evaluasi.nama_karyawan} (NIK: ${evaluasi.nik_karyawan})`
            );
        }
    },

    /**
     * Triggered after performance review deletion.
     * @param {Object} params - The params object
     * @param {Object} params.result - The result object
     */
    async afterDelete(event) {
        // Try both event structures for Strapi v5 compatibility
        const result = event.result || event.params?.result;

        // Update rating distribution setelah penghapusan
        await updateRatingDistributionAfterDelete(result);

        strapi.log.info("Evaluasi kinerja berhasil dihapus");
    },
};

/**
 * Helper function to update rating distribution
 */
async function updateRatingDistribution(evaluasi) {
    try {
        if (!evaluasi) {
            throw new Error("Evaluasi parameter is null or undefined");
        }

        if (!evaluasi.bulan_evaluasi) {
            throw new Error("bulan_evaluasi property is missing from evaluasi");
        }

        if (!evaluasi.tahun_evaluasi) {
            throw new Error("tahun_evaluasi property is missing from evaluasi");
        }

        if (!evaluasi.rating_kinerja) {
            throw new Error("rating_kinerja property is missing from evaluasi");
        }

        const periode = `${evaluasi.bulan_evaluasi}/${evaluasi.tahun_evaluasi}`;

        // Get or create rating record
        let ratingRecord = await strapi.entityService.findMany(
            "api::rating-kinerja.rating-kinerja",
            {
                filters: {
                    rating: evaluasi.rating_kinerja,
                    periode: periode,
                },
            }
        );

        if (ratingRecord.length === 0) {
            // Create new rating record
            const labelMap = {
                1: "Poor",
                2: "Needs Improvement",
                3: "Satisfactory",
                4: "Good",
                5: "Excellent",
            };

            const colorMap = {
                1: "text-red-500",
                2: "text-orange-500",
                3: "text-green-500",
                4: "text-blue-500",
                5: "text-yellow-500",
            };

            await strapi.entityService.create("api::rating-kinerja.rating-kinerja", {
                data: {
                    rating: evaluasi.rating_kinerja,
                    label_rating: labelMap[evaluasi.rating_kinerja],
                    jumlah_karyawan: 1,
                    persentase: 0, // Will be calculated below
                    periode: periode,
                    tahun: evaluasi.tahun_evaluasi,
                    bulan: evaluasi.bulan_evaluasi,
                    warna_badge: colorMap[evaluasi.rating_kinerja],
                },
            });
        } else {
            // Update existing rating record
            await strapi.entityService.update(
                "api::rating-kinerja.rating-kinerja",
                ratingRecord[0].id,
                {
                    data: {
                        jumlah_karyawan: ratingRecord[0].jumlah_karyawan + 1,
                    },
                }
            );
        }

        // Recalculate percentages for all ratings in this period
        await recalculateRatingPercentages(periode);
    } catch (error) {
        strapi.log.error("Error updating rating distribution:", error);
    }
}

/**
 * Helper function to recalculate rating percentages
 */
async function recalculateRatingPercentages(periode) {
    try {
        // Get total evaluations for this period
        const totalEvaluations = await strapi.entityService.findMany(
            "api::performance-review.performance-review",
            {
                filters: {
                    periode_evaluasi: periode,
                },
            }
        );

        const total = totalEvaluations.length;

        if (total === 0) return;

        // Get all rating records for this period
        const ratingRecords = await strapi.entityService.findMany(
            "api::rating-kinerja.rating-kinerja",
            {
                filters: {
                    periode: periode,
                },
            }
        );

        // Update percentages
        for (const record of ratingRecords) {
            const percentage = ((record.jumlah_karyawan / total) * 100).toFixed(2);

            await strapi.entityService.update(
                "api::rating-kinerja.rating-kinerja",
                record.id,
                {
                    data: {
                        persentase: parseFloat(percentage),
                    },
                }
            );
        }
    } catch (error) {
        strapi.log.error("Error recalculating rating percentages:", error);
    }
}

/**
 * Helper function to update rating distribution after deletion
 */
async function updateRatingDistributionAfterDelete(evaluasi) {
    try {
        const periode = `${evaluasi.bulan_evaluasi}/${evaluasi.tahun_evaluasi}`;

        // Find and update rating record
        const ratingRecord = await strapi.entityService.findMany(
            "api::rating-kinerja.rating-kinerja",
            {
                filters: {
                    rating: evaluasi.rating_kinerja,
                    periode: periode,
                },
            }
        );

        if (ratingRecord.length > 0) {
            const newCount = Math.max(0, ratingRecord[0].jumlah_karyawan - 1);

            if (newCount === 0) {
                // Delete rating record if count becomes 0
                await strapi.entityService.delete(
                    "api::rating-kinerja.rating-kinerja",
                    ratingRecord[0].id
                );
            } else {
                // Update count
                await strapi.entityService.update(
                    "api::rating-kinerja.rating-kinerja",
                    ratingRecord[0].id,
                    {
                        data: {
                            jumlah_karyawan: newCount,
                        },
                    }
                );
            }
        }

        // Recalculate percentages
        await recalculateRatingPercentages(periode);
    } catch (error) {
        strapi.log.error(
            "Error updating rating distribution after deletion:",
            error
        );
    }
}
