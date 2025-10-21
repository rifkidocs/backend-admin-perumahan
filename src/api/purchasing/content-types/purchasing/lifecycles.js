module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Generate nomor PO otomatis
        if (!data.nomor_po) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");

            // Hitung nomor urut hari ini
            const existingPOs = await strapi.entityService.findMany(
                "api::purchasing.purchasing",
                {
                    filters: {
                        tanggal_order: {
                            $gte: new Date(year, today.getMonth(), today.getDate()),
                            $lt: new Date(year, today.getMonth(), today.getDate() + 1),
                        },
                    },
                }
            );

            const sequence = String(existingPOs.length + 1).padStart(3, "0");
            data.nomor_po = `PO-${year}-${month}-${day}-${sequence}`;
        }

        // Set default status
        if (!data.status_po) {
            data.status_po = "Diproses";
        }

        // Validasi tanggal
        if (data.tanggal_estimasi_delivery <= data.tanggal_order) {
            throw new Error("Tanggal estimasi delivery harus setelah tanggal order");
        }

        // Hitung total harga dari materials
        if (data.materials && data.materials.length > 0) {
            data.total_harga = data.materials.reduce((total, item) => {
                return total + (item.quantity * (item.unit_price || 0));
            }, 0);
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update status berdasarkan tanggal delivery
        if (data.tanggal_actual_delivery) {
            data.status_po = "Diterima";
        } else if (data.tanggal_estimasi_delivery && new Date(data.tanggal_estimasi_delivery) < new Date()) {
            data.status_po = "Terlambat";
        }

        // Update total harga jika materials berubah
        if (data.materials && data.materials.length > 0) {
            data.total_harga = data.materials.reduce((total, item) => {
                return total + (item.quantity * (item.unit_price || 0));
            }, 0);
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log pembuatan PO
        strapi.log.info(`PO baru dibuat: ${result.nomor_po}`);

        // Kirim notifikasi ke supplier
        if (result.supplier?.email) {
            try {
                await strapi.plugins["email"].services.email.send({
                    to: result.supplier.email,
                    subject: `Purchase Order ${result.nomor_po}`,
                    text: `Purchase Order ${result.nomor_po} telah dibuat dengan estimasi delivery ${result.tanggal_estimasi_delivery}`,
                });
            } catch (error) {
                strapi.log.error("Error sending email notification:", error);
            }
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Update stok material jika PO diterima
        if (result.status_po === "Diterima" && result.materials) {
            for (const materialItem of result.materials) {
                if (materialItem.material && materialItem.quantity) {
                    const material = await strapi.entityService.findOne(
                        "api::material.material",
                        materialItem.material.id || materialItem.material
                    );

                    if (material) {
                        await strapi.entityService.update(
                            "api::material.material",
                            material.id,
                            {
                                data: {
                                    stok: material.stok + materialItem.quantity,
                                },
                            }
                        );
                    }
                }
            }
        }
    },
};
