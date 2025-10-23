"use strict";

/**
 * rating-kinerja lifecycle
 */

module.exports = {
    /**
     * Triggered before rating creation.
     */
    async beforeCreate(event) {
        const { data } = event.params;


        // Validate rating range
        if (data.rating < 1 || data.rating > 5) {
            throw new Error("Rating harus antara 1-5");
        }

        // Set label based on rating
        const labelMap = {
            1: "Poor",
            2: "Needs Improvement",
            3: "Satisfactory",
            4: "Good",
            5: "Excellent",
        };

        if (!data.label_rating) {
            data.label_rating = labelMap[data.rating];
        }

        // Set color based on rating
        const colorMap = {
            1: "text-red-500",
            2: "text-orange-500",
            3: "text-green-500",
            4: "text-blue-500",
            5: "text-yellow-500",
        };

        if (!data.warna_badge) {
            data.warna_badge = colorMap[data.rating];
        }

        // Set default values
        if (!data.jumlah_karyawan) {
            data.jumlah_karyawan = 0;
        }

        if (!data.persentase) {
            data.persentase = 0;
        }
    },

    /**
     * Triggered after rating creation.
     */
    async afterCreate(event) {
        const { result } = event.params;

        if (result) {
            strapi.log.info(
                `Rating record created: ${result.label_rating || 'N/A'} (${result.rating || 'N/A'}) for ${result.tahun || 'N/A'}/${result.bulan || 'N/A'}`
            );

            // Recalculate all percentages for this year/month if tahun and bulan exist
            if (result.tahun && result.bulan) {
                await recalculateAllRatingPercentages(result.tahun, result.bulan);
            } else {
                strapi.log.warn("Cannot recalculate percentages after creation - tahun or bulan is missing");
            }
        } else {
            strapi.log.error("Result is undefined in afterCreate lifecycle");
        }
    },

    /**
     * Triggered before rating update.
     */
    async beforeUpdate(event) {
        const { data } = event.params;

        // Validate rating range if being updated
        if (data.rating && (data.rating < 1 || data.rating > 5)) {
            throw new Error("Rating harus antara 1-5");
        }
    },

    /**
     * Triggered after rating update.
     */
    async afterUpdate(event) {
        const { result } = event.params;

        if (result) {
            strapi.log.info(
                `Rating record updated: ${result.label_rating || 'N/A'} (${result.rating || 'N/A'}) for ${result.tahun || 'N/A'}/${result.bulan || 'N/A'}`
            );

            // Recalculate all percentages for this year/month if tahun and bulan exist
            if (result.tahun && result.bulan) {
                await recalculateAllRatingPercentages(result.tahun, result.bulan);
            } else {
                strapi.log.warn("Cannot recalculate percentages after update - tahun or bulan is missing");
            }
        } else {
            strapi.log.error("Result is undefined in afterUpdate lifecycle");
        }
    },

    /**
     * Triggered before rating deletion.
     */
    async beforeDelete(event) {
        const { where } = event.params;

        // Get rating yang akan dihapus untuk logging
        const rating = await strapi.entityService.findOne(
            "api::rating-kinerja.rating-kinerja",
            where.id
        );

        if (rating) {
            strapi.log.info(
                `Rating record akan dihapus: ${rating.label_rating} (${rating.rating}) ${rating.tahun}/${rating.bulan}`
            );

            // Store rating data in event for afterDelete to use
            event.params.deletedRating = rating;
        }
    },

    /**
     * Triggered after rating deletion.
     */
    async afterDelete(event) {
        const { result, deletedRating } = event.params;

        strapi.log.info("Rating record berhasil dihapus");

        // Try to get tahun and bulan from result first, then from deletedRating
        let tahun = null;
        let bulan = null;
        if (result && result.tahun && result.bulan) {
            tahun = result.tahun;
            bulan = result.bulan;
        } else if (deletedRating && deletedRating.tahun && deletedRating.bulan) {
            tahun = deletedRating.tahun;
            bulan = deletedRating.bulan;
        }

        if (tahun && bulan) {
            // Recalculate all percentages for this year/month
            await recalculateAllRatingPercentages(tahun, bulan);
        } else {
            strapi.log.warn("Cannot recalculate percentages after deletion - tahun or bulan is missing");
        }
    },
};

/**
 * Helper function to recalculate all rating percentages for a year/month
 */
async function recalculateAllRatingPercentages(tahun, bulan) {
    try {
        // Get all rating records for this year/month
        const ratingRecords = await strapi.entityService.findMany(
            "api::rating-kinerja.rating-kinerja",
            {
                filters: {
                    tahun: tahun,
                    bulan: bulan,
                },
            }
        );

        // Calculate total employees
        const totalEmployees = ratingRecords.reduce(
            (sum, record) => sum + record.jumlah_karyawan,
            0
        );

        if (totalEmployees === 0) return;

        // Update percentages for all records
        for (const record of ratingRecords) {
            const percentage = (
                (record.jumlah_karyawan / totalEmployees) *
                100
            ).toFixed(2);

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

        strapi.log.info(
            `Recalculated percentages for ${tahun}/${bulan}. Total employees: ${totalEmployees}`
        );
    } catch (error) {
        strapi.log.error("Error recalculating rating percentages:", error);
    }
}
