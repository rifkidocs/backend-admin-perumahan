'use strict';

/**
 * Lifecycle callbacks for the `unit-rumah` model.
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate unit ID if not provided
        if (!data.unit_id) {
            const lastUnit = await strapi.entityService.findMany(
                "api::unit-rumah.unit-rumah",
                {
                    filters: {
                        unit_id: {
                            $startsWith: "UNIT-",
                        },
                    },
                    sort: { unit_id: "desc" },
                    limit: 1,
                }
            );

            let nextNumber = 1;
            if (lastUnit.length > 0) {
                const lastId = lastUnit[0].unit_id;
                const lastNumber = parseInt(lastId.split("-")[1]);
                nextNumber = lastNumber + 1;
            }

            data.unit_id = `UNIT-${nextNumber.toString().padStart(3, "0")}`;
        }

        // Set default status if not provided
        if (!data.status) {
            data.status = "tersedia";
        }
    },
};
