'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * Lifecycle callbacks for the `booking-document` model.
 */

module.exports = {
    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);
        
        const { data } = event.params;
        
        // Synchronize verified status with status_dokumen
        if (data.status_dokumen === "Valid") {
            data.verified = true;
            if (!data.verified_date) {
                data.verified_date = new Date().toISOString().split("T")[0];
            }
        } else if (data.status_dokumen === "Perlu Direvisi" || data.status_dokumen === "Ditolak") {
            data.verified = false;
        }
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    },

    async beforeCreate(event) {
        const { data } = event.params;

        // Set upload date if not provided
        if (!data.upload_date) {
            data.upload_date = new Date().toISOString().split("T")[0];
        }

        // Set default verified status and status_dokumen
        if (data.status_dokumen === "Valid") {
            data.verified = true;
            if (!data.verified_date) {
                data.verified_date = new Date().toISOString().split("T")[0];
            }
        } else {
            if (data.verified === undefined) {
                data.verified = false;
            }
            if (!data.status_dokumen) {
                data.status_dokumen = "Menunggu Verifikasi";
            }
        }
    },

    async afterUpdate(event) {
        // No additional logic needed here as beforeUpdate handles the sync
    },
};
