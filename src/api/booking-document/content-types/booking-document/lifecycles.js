'use strict';

/**
 * Lifecycle callbacks for the `booking-document` model.
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Set upload date if not provided
        if (!data.upload_date) {
            data.upload_date = new Date().toISOString().split("T")[0];
        }

        // Set default verified status
        if (data.verified === undefined) {
            data.verified = false;
        }
    },

    async afterUpdate(event) {
        const { data } = event.params;

        // Set verified_date when document is verified
        if (data.verified === true && !data.verified_date) {
            await strapi.entityService.update(
                "api::booking-document.booking-document",
                event.result.id,
                {
                    data: {
                        verified_date: new Date().toISOString().split("T")[0],
                    },
                }
            );
        }
    },
};
