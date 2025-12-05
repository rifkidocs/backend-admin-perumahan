'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

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

        // Handle price calculation based on booking_fee_type
        if (data.unit) {
            try {
                const unit = await strapi.entityService.findOne(
                    "api::unit-rumah.unit-rumah",
                    typeof data.unit === 'object' ? data.unit.id : data.unit,
                    { fields: ['price', 'id'] }
                );

                if (unit && unit.price) {
                    // Convert biginteger price to decimal for calculation
                    const originalPrice = parseFloat(unit.price.toString());
                    data.original_price = originalPrice;

                    // Calculate adjusted price based on booking_fee_type
                    if (data.booking_fee_type === 'Komersial' && data.booking_fee) {
                        // Komersial: booking fee reduces the house price
                        const bookingFee = parseFloat(data.booking_fee);
                        const adjustedPrice = originalPrice - bookingFee;
                        data.adjusted_price = adjustedPrice > 0 ? adjustedPrice : 0;
                    } else {
                        // Subsidi: booking fee does NOT reduce the house price
                        data.adjusted_price = originalPrice;
                    }
                }
            } catch (error) {
                console.error('Error calculating booking price:', error);
                // Don't block booking creation if price calculation fails
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Update unit status if unit is provided
        if (result.unit) {
            try {
                await strapi.entityService.update(
                    "api::unit-rumah.unit-rumah",
                    result.unit.id,
                    {
                        data: {
                            status_unit: 'dipesan'
                        }
                    }
                );
            } catch (error) {
                console.error('Error updating unit status:', error);
            }
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);

        const { data } = event.params;
        const { where } = event.params;

        // Handle price recalculation if booking_fee or booking_fee_type changes
        if (data.booking_fee || data.booking_fee_type || data.unit) {
            try {
                const booking = await strapi.entityService.findOne(
                    "api::booking.booking",
                    where.id,
                    { fields: ['id', 'unit', 'original_price'] }
                );

                if (!booking) return;

                let unit;
                if (data.unit) {
                    unit = await strapi.entityService.findOne(
                        "api::unit-rumah.unit-rumah",
                        typeof data.unit === 'object' ? data.unit.id : data.unit,
                        { fields: ['price', 'id'] }
                    );
                } else if (booking.unit) {
                    unit = await strapi.entityService.findOne(
                        "api::unit-rumah.unit-rumah",
                        typeof booking.unit === 'object' ? booking.unit.id : booking.unit,
                        { fields: ['price', 'id'] }
                    );
                }

                if (unit && unit.price) {
                    // Convert biginteger price to decimal for calculation
                    const unitPrice = parseFloat(unit.price.toString());
                    const originalPrice = data.original_price || unitPrice;
                    const bookingFee = data.booking_fee ? parseFloat(data.booking_fee) : 0;
                    const feeType = data.booking_fee_type;

                    // Calculate adjusted price
                    if (feeType === 'Komersial' && bookingFee > 0) {
                        const adjustedPrice = originalPrice - bookingFee;
                        data.adjusted_price = adjustedPrice > 0 ? adjustedPrice : 0;
                    } else {
                        data.adjusted_price = originalPrice;
                    }

                    // Also update original_price if unit changed
                    if (data.unit) {
                        data.original_price = unitPrice;
                    }
                }
            } catch (error) {
                console.error('Error recalculating booking price:', error);
            }
        }
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);

        const { where } = event.params;

        try {
            const booking = await strapi.entityService.findOne(
                "api::booking.booking",
                where.id,
                { fields: ['id', 'unit', 'booking_status'] }
            );

            // Reset unit status if booking is being deleted
            if (booking && booking.unit) {
                await strapi.entityService.update(
                    "api::unit-rumah.unit-rumah",
                    typeof booking.unit === 'object' ? booking.unit.id : booking.unit,
                    {
                        data: {
                            status_unit: 'tersedia'
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error handling booking deletion:', error);
        }
    }
};
