'use strict';

/**
 * contract lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate contract number if not provided
        if (!data.contract_number) {
            const lastContract = await strapi.entityService.findMany(
                "api::contract.contract",
                {
                    sort: { contract_number: "desc" },
                    limit: 1,
                }
            );

            const lastNumber = lastContract[0]?.attributes?.contract_number || "PKWT-2023-000";
            const parts = lastNumber.split('-');
            const year = parts[1];
            const number = parseInt(parts[2]) + 1;

            data.contract_number = `PKWT-${year}-${number.toString().padStart(3, "0")}`;
        }

        // Set default status if not provided
        if (!data.status) {
            data.status = "aktif";
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Add any update logic here if needed
    }
};
