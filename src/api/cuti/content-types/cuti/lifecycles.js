'use strict';

/**
 * cuti lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Calculate total days
        if (data.tanggal_mulai && data.tanggal_selesai) {
            const start = new Date(data.tanggal_mulai);
            const end = new Date(data.tanggal_selesai);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            data.total_days = diffDays;
        }

        // Set default status if not provided
        if (!data.status_persetujuan) {
            data.status_persetujuan = "pending";
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Recalculate total days if dates are updated
        if (data.tanggal_mulai || data.tanggal_selesai) {
            const start = new Date(data.tanggal_mulai);
            const end = new Date(data.tanggal_selesai);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            data.total_days = diffDays;
        }
    }
};
