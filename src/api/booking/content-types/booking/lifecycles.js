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

        // Update unit status to 'dipesan' when booking is created
        if (data.unit_rumah) {
            await strapi.entityService.update("api::unit-rumah.unit-rumah", data.unit_rumah, {
                data: { status: "dipesan" },
            });
        }
    },

    async afterUpdate(event) {
        const { data, where } = event.params;
        const { result } = event;

        // Update unit status based on booking status
        if (data.booking_status && result.unit_rumah) {
            let unitStatus = "tersedia";

            switch (data.booking_status) {
                case "aktif":
                    unitStatus = "dipesan";
                    break;
                case "selesai":
                    unitStatus = "terjual";
                    break;
                case "dibatalkan":
                    unitStatus = "tersedia";
                    break;
                default:
                    unitStatus = "dipesan";
            }

            await strapi.entityService.update("api::unit-rumah.unit-rumah", result.unit_rumah.id, {
                data: { status: unitStatus },
            });
        }
    },

    async beforeDelete(event) {
        const { where } = event.params;

        // Get the booking to find associated unit
        const booking = await strapi.entityService.findOne(
            "api::booking.booking",
            where.id,
            {
                populate: ["unit_rumah"],
            }
        );

        // Update unit status back to available when booking is deleted
        if (booking && booking.unit_rumah) {
            await strapi.entityService.update("api::unit-rumah.unit-rumah", booking.unit_rumah.id, {
                data: { status: "tersedia" },
            });
        }
    },
};
