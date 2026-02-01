'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * Lifecycle callbacks for the `booking` model.
 */

async function syncUnitTransactionStatus(unitId, bookingStatus) {
    if (!unitId) return;

    try {
        let statusToSet = 'tersedia';
        
        if (bookingStatus === 'aktif' || bookingStatus === 'menunggu-pembayaran') {
            statusToSet = 'booking';
        } else if (bookingStatus === 'selesai') {
            statusToSet = 'terjual';
        } else if (bookingStatus === 'dibatalkan') {
            statusToSet = 'tersedia';
        }

        await strapi.entityService.update(
            "api::unit-rumah.unit-rumah",
            unitId,
            {
                data: {
                    status_transaksi: statusToSet
                }
            }
        );
        console.log(`[Booking Lifecycle] Unit ${unitId} transaction status updated to: ${statusToSet}`);
    } catch (error) {
        console.error('[Booking Lifecycle] Error updating unit transaction status:', error);
    }
}

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

        // Update unit transaction status if unit is provided
        if (result.unit) {
            const unitId = typeof result.unit === 'object' ? result.unit.id : result.unit;
            await syncUnitTransactionStatus(unitId, result.booking_status);
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        try {
            // Fetch the booking with unit populated to ensure we have the relationship
            const booking = await strapi.entityService.findOne(
                "api::booking.booking",
                result.id,
                { populate: ['unit'] }
            );

            if (booking && booking.unit) {
                await syncUnitTransactionStatus(booking.unit.id, booking.booking_status);
            }
        } catch (error) {
            console.error('Error updating unit transaction status in afterUpdate:', error);
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
            console.log(`[Booking Lifecycle] beforeDelete triggered for booking id: ${where.id}`);

            const booking = await strapi.entityService.findOne(
                "api::booking.booking",
                where.id,
                { 
                    populate: ['unit'] 
                }
            );

            // Reset unit transaction status if booking is being deleted
            if (booking && booking.unit) {
                const unitId = booking.unit.id;
                console.log(`[Booking Lifecycle] Resetting unit transaction status for unit id: ${unitId}`);

                await strapi.entityService.update(
                    "api::unit-rumah.unit-rumah",
                    unitId,
                    {
                        data: {
                            status_transaksi: 'tersedia'
                        }
                    }
                );
                console.log(`[Booking Lifecycle] Unit ${unitId} transaction status reset to 'tersedia'`);
            } else {
                console.log('[Booking Lifecycle] No linked unit found for this booking.');
            }
        } catch (error) {
            console.error('[Booking Lifecycle] Error handling booking deletion:', error);
        }
    }
};
