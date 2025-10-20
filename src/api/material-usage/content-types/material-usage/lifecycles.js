module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi kuantitas
        if (data.kuantitas <= 0) {
            throw new Error("Kuantitas material harus lebih dari 0");
        }

        // Hitung total harga jika harga satuan ada
        if (data.harga_satuan && data.kuantitas) {
            data.total_harga = data.harga_satuan * data.kuantitas;
        }

        // Validasi harga
        if (data.harga_satuan && data.harga_satuan < 0) {
            throw new Error("Harga satuan tidak boleh negatif");
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Hitung ulang total harga jika ada perubahan
        if (data.harga_satuan !== undefined || data.kuantitas !== undefined) {
            const hargaSatuan = data.harga_satuan || event.params.where.harga_satuan;
            const kuantitas = data.kuantitas || event.params.where.kuantitas;

            if (hargaSatuan && kuantitas) {
                data.total_harga = hargaSatuan * kuantitas;
            }
        }

        // Validasi kuantitas
        if (data.kuantitas !== undefined && data.kuantitas <= 0) {
            throw new Error("Kuantitas material harus lebih dari 0");
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Update stok material jika ada relasi dengan inventory
        if (result.material) {
            try {
                await strapi
                    .service("api::material-usage.material-usage")
                    .updateMaterialStock(result);
            } catch (error) {
                console.log("Material stock update service not available:", error.message);
            }
        }

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "CREATE_MATERIAL_USAGE",
                entity_type: "material-usage",
                entity_id: result.id,
                description: `Penggunaan material: ${result.material} sebanyak ${result.kuantitas} ${result.satuan}`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },
};
