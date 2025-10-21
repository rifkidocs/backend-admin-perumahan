module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Hitung total kebutuhan
        if (data.kebutuhan_per_unit && data.total_unit) {
            data.total_kebutuhan = data.kebutuhan_per_unit * data.total_unit;
        }

        // Set default status
        if (!data.status_ketersediaan) {
            data.status_ketersediaan = "Tersedia";
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update total kebutuhan jika ada perubahan
        if (data.kebutuhan_per_unit || data.total_unit) {
            data.total_kebutuhan = data.kebutuhan_per_unit * data.total_unit;
        }

        // Update status berdasarkan ketersediaan material
        if (data.material) {
            const material = await strapi.entityService.findOne(
                "api::material.material",
                data.material
            );
            if (material) {
                if (material.stok >= data.total_kebutuhan) {
                    data.status_ketersediaan = "Tersedia";
                } else if (material.stok > 0) {
                    data.status_ketersediaan = "Segera Habis";
                } else {
                    data.status_ketersediaan = "Tidak Tersedia";
                }
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log kebutuhan material per unit
        strapi.log.info(
            `Kebutuhan material ${result.material.nama_material} untuk ${result.tipe_unit}: ${result.total_kebutuhan} ${result.material.satuan}`
        );
    },
};
