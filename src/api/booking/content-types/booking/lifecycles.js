'use strict';

/**
 * Lifecycle callbacks for the `booking` model.
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate booking ID if not provided
        if (!data.booking_id) {
            const currentYear = new Date().getFullYear();
            const lastBooking = await strapi.entityService.findMany(
                "api::booking.booking",
                {
                    filters: {
                        booking_id: {
                            $startsWith: `BK-${currentYear}-`,
                        },
                    },
                    sort: { booking_id: "desc" },
                    limit: 1,
                }
            );

            let nextNumber = 1;
            if (lastBooking.length > 0) {
                const lastId = lastBooking[0].booking_id;
                const lastNumber = parseInt(lastId.split("-")[2]);
                nextNumber = lastNumber + 1;
            }

            data.booking_id = `BK-${currentYear}-${nextNumber
                .toString()
                .padStart(3, "0")}`;
        }

        // Set booking date if not provided
        if (!data.booking_date) {
            data.booking_date = new Date().toISOString().split("T")[0];
        }

        // All unit updates temporarily disabled to isolate database issue
    },

    // All lifecycle methods temporarily disabled to isolate database issue
    // async afterUpdate(event) { ... },
    // async beforeDelete(event) { ... },
};
