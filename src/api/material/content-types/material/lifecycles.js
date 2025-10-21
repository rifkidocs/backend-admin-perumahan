module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Set default status jika tidak ada
        if (!data.status_material) {
            data.status_material = "Tersedia";
        }

        // Validasi stok tidak boleh negatif
        if (data.stok < 0) {
            throw new Error("Stok tidak boleh negatif");
        }

        // Hitung persentase sisa proyek berdasarkan stok dan minimum stock
        if (data.minimum_stock && data.stok > 0) {
            data.sisa_proyek = Math.round(
                (data.stok / (data.stok + data.minimum_stock)) * 100
            );
        } else {
            data.sisa_proyek = 100;
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update status berdasarkan stok
        if (data.stok !== undefined) {
            if (data.stok <= 0) {
                data.status_material = "Habis";
                data.sisa_proyek = 0;
            } else if (data.minimum_stock && data.stok <= data.minimum_stock) {
                data.status_material = "Segera Habis";
                data.sisa_proyek = Math.round(
                    (data.stok / (data.stok + data.minimum_stock)) * 100
                );
            } else {
                data.status_material = "Tersedia";
                data.sisa_proyek = Math.round(
                    (data.stok / (data.stok + (data.minimum_stock || 0))) * 100
                );
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log aktivitas
        strapi.log.info(`Material baru ditambahkan: ${result.nama_material}`);

        // Kirim notifikasi jika stok rendah
        if (result.status_material === "Segera Habis") {
            try {
                await strapi.plugins["email"].services.email.send({
                    to: "admin@company.com",
                    subject: "Alert: Material Segera Habis",
                    text: `Material ${result.nama_material} memiliki stok ${result.stok} ${result.satuan}`,
                });
            } catch (error) {
                strapi.log.error("Error sending email notification:", error);
            }
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log perubahan stok
        strapi.log.info(
            `Stok material ${result.nama_material} diupdate menjadi ${result.stok}`
        );

        // Kirim notifikasi jika stok habis
        if (result.status_material === "Habis") {
            try {
                await strapi.plugins["email"].services.email.send({
                    to: "admin@company.com",
                    subject: "Alert: Material Habis",
                    text: `Material ${result.nama_material} telah habis`,
                });
            } catch (error) {
                strapi.log.error("Error sending email notification:", error);
            }
        }
    },
};
