'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * karyawan lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate NIK if not provided
        if (!data.nik_karyawan) {
            const lastEmployee = await strapi.entityService.findMany(
                "api::karyawan.karyawan",
                {
                    sort: { nik_karyawan: "desc" },
                    limit: 1,
                }
            );

            const lastNik = lastEmployee[0]?.attributes?.nik_karyawan || "EMP000";
            const nextNumber = parseInt(lastNik.replace("EMP", "")) + 1;
            data.nik_karyawan = `EMP${nextNumber.toString().padStart(3, "0")}`;
        }

        // Set default status if not provided
        if (!data.status_kepegawaian) {
            data.status_kepegawaian = "Tetap";
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};
