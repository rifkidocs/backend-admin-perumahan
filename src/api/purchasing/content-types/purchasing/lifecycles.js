module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        console.log('=== PURCHASING BEFORE CREATE DEBUG ===');
        console.log('Raw data received:', JSON.stringify(data, null, 2));

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
            console.log('Processing materials:', JSON.stringify(data.materials, null, 2));

            let totalHarga = 0;

            // For now, skip total calculation during creation if materials are component IDs
            // The total will be calculated after the components are properly created
            const hasComponentData = data.materials.some(item =>
                item.quantity !== undefined || item.unit_price !== undefined
            );

            if (hasComponentData) {
                // Materials contain actual data (from API request)
                data.materials.forEach((item, index) => {
                    console.log(`Processing material ${index} (with data):`, {
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        quantityType: typeof item.quantity,
                        unitPriceType: typeof item.unit_price
                    });

                    // Ensure quantity and unit_price are valid numbers
                    const quantity = Number(item.quantity);
                    const unitPrice = Number(item.unit_price || 0);

                    console.log(`Converted values: quantity=${quantity}, unitPrice=${unitPrice}`);

                    if (isNaN(quantity) || isNaN(unitPrice)) {
                        console.error(`NaN detected in material ${index}: quantity=${quantity}, unitPrice=${unitPrice}`);
                        throw new Error(`Invalid number values in material ${index}: quantity=${item.quantity}, unit_price=${item.unit_price}`);
                    }

                    const itemTotal = quantity * unitPrice;
                    totalHarga += itemTotal;
                    console.log(`Material ${index} total: ${itemTotal}, running total: ${totalHarga}`);
                });

                data.total_harga = totalHarga;
                console.log('Final total_harga:', data.total_harga);
            } else {
                // Materials are component IDs - skip calculation for now
                console.log('Materials are component IDs, skipping total calculation during creation');
                data.total_harga = 0;
            }
        } else {
            data.total_harga = 0;
            console.log('No materials, setting total_harga to 0');
        }

        console.log('Final data before save:', JSON.stringify(data, null, 2));
        console.log('=== END DEBUG ===');
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
            try {
                // Get the current purchasing record to fetch actual component data
                const currentRecord = await strapi.entityService.findOne(
                    "api::purchasing.purchasing",
                    event.params.where.id,
                    {
                        populate: {
                            materials: {
                                populate: {
                                    material: true
                                }
                            }
                        }
                    }
                );

                let totalHarga = 0;

                // Use the actual component data from the database
                if (currentRecord && currentRecord.materials) {
                    for (let i = 0; i < currentRecord.materials.length; i++) {
                        const item = currentRecord.materials[i];

                        // Handle different possible data structures
                        let quantity = 0;
                        let unitPrice = 0;

                        if (item.quantity !== undefined && item.quantity !== null) {
                            quantity = Number(item.quantity);
                            if (isNaN(quantity)) {
                                quantity = 0;
                            }
                        }

                        if (item.unit_price !== undefined && item.unit_price !== null) {
                            unitPrice = Number(item.unit_price);
                            if (isNaN(unitPrice)) {
                                unitPrice = 0;
                            }
                        }

                        const itemTotal = quantity * unitPrice;
                        totalHarga += itemTotal;
                    }
                }

                data.total_harga = totalHarga;
            } catch (error) {
                console.error('Error calculating total_harga:', error);
                // Don't throw error, just set total_harga to 0
                data.total_harga = 0;
            }
        } else {
            // If no materials, set total_harga to 0
            data.total_harga = 0;
        }

        // Ensure all decimal fields are valid numbers
        if (data.total_harga !== undefined && data.total_harga !== null) {
            const totalHargaNum = Number(data.total_harga);
            if (isNaN(totalHargaNum)) {
                data.total_harga = 0;
            } else {
                data.total_harga = totalHargaNum;
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        console.log('=== PURCHASING AFTER CREATE DEBUG ===');
        console.log('Created result:', JSON.stringify(result, null, 2));

        // Calculate total_harga after creation
        try {
            const purchasingRecord = await strapi.entityService.findOne(
                "api::purchasing.purchasing",
                result.id,
                {
                    populate: {
                        materials: {
                            populate: {
                                material: true
                            }
                        }
                    }
                }
            );

            console.log('Fetched purchasing record with materials:', JSON.stringify(purchasingRecord, null, 2));

            if (purchasingRecord && purchasingRecord.materials && purchasingRecord.materials.length > 0) {
                let totalHarga = 0;

                purchasingRecord.materials.forEach((item, index) => {
                    console.log(`Calculating total for material ${index}:`, {
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        quantityType: typeof item.quantity,
                        unitPriceType: typeof item.unit_price
                    });

                    const quantity = Number(item.quantity || 0);
                    const unitPrice = Number(item.unit_price || 0);

                    if (!isNaN(quantity) && !isNaN(unitPrice)) {
                        const itemTotal = quantity * unitPrice;
                        totalHarga += itemTotal;
                        console.log(`Material ${index} total: ${itemTotal}, running total: ${totalHarga}`);
                    } else {
                        console.warn(`Invalid values for material ${index}: quantity=${item.quantity}, unit_price=${item.unit_price}`);
                    }
                });

                // Update the total_harga
                await strapi.entityService.update(
                    "api::purchasing.purchasing",
                    result.id,
                    {
                        data: {
                            total_harga: totalHarga
                        }
                    }
                );

                console.log(`Updated total_harga to: ${totalHarga}`);
            }
        } catch (error) {
            console.error('Error calculating total_harga after create:', error);
        }

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

        console.log('=== END AFTER CREATE DEBUG ===');
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
