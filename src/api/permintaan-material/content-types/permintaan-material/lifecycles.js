module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate request number if not provided
        if (!data.nomor_permintaan) {
            const lastRequest = await strapi.entityService.findMany(
                "api::permintaan-material.permintaan-material",
                {
                    sort: { nomor_permintaan: "desc" },
                    limit: 1,
                }
            );

            let nextNumber = 1;
            if (lastRequest.length > 0) {
                const lastNumber = lastRequest[0].nomor_permintaan;
                const match = lastNumber.match(/MR-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            data.nomor_permintaan = `MR-${nextNumber.toString().padStart(3, "0")}`;
        }
    },
};
