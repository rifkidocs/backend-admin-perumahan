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
        const { data, where } = event.params;

        // Get the ID from where parameter - handle different possible structures
        let recordId;
        if (where.id) {
            recordId = where.id;
        } else if (typeof where === 'string') {
            recordId = where;
        } else if (where && Object.keys(where).length === 1) {
            // If where has only one key, use that as the ID
            recordId = Object.values(where)[0];
        } else {
            throw new Error('Cannot determine record ID for update operation');
        }

        // Get existing record to access current values
        const existingRecord = await strapi.entityService.findOne(
            "api::unit-material-requirement.unit-material-requirement",
            recordId,
            { populate: ['material'] }
        );

        if (!existingRecord) {
            throw new Error('Record not found');
        }

        // Use existing values as fallback for missing data
        const kebutuhanPerUnit = data.kebutuhan_per_unit !== undefined ? data.kebutuhan_per_unit : existingRecord.kebutuhan_per_unit;
        const totalUnit = data.total_unit !== undefined ? data.total_unit : existingRecord.total_unit;

        // Handle material ID extraction - Strapi sends relation data in different formats
        let materialId;
        if (data.material !== undefined) {
            if (typeof data.material === 'object' && data.material.set && Array.isArray(data.material.set)) {
                // Format: { set: [{ id: 1 }] }
                materialId = data.material.set[0]?.id;
            } else if (typeof data.material === 'object' && data.material.id) {
                // Format: { id: 1 }
                materialId = data.material.id;
            } else if (typeof data.material === 'number' || typeof data.material === 'string') {
                // Format: 1 or "1"
                materialId = data.material;
            } else {
                materialId = null;
            }
        } else {
            materialId = existingRecord.material?.id;
        }

        // Update total kebutuhan jika ada perubahan
        if (data.kebutuhan_per_unit !== undefined || data.total_unit !== undefined) {
            data.total_kebutuhan = kebutuhanPerUnit * totalUnit;
        }

        // Update status berdasarkan ketersediaan material
        if (materialId && typeof materialId === 'number') {
            try {
                const material = await strapi.entityService.findOne(
                    "api::material.material",
                    materialId
                );
                if (material) {
                    const totalKebutuhan = data.total_kebutuhan !== undefined ? data.total_kebutuhan : existingRecord.total_kebutuhan;
                    if (material.stok >= totalKebutuhan) {
                        data.status_ketersediaan = "Tersedia";
                    } else if (material.stok > 0) {
                        data.status_ketersediaan = "Segera Habis";
                    } else {
                        data.status_ketersediaan = "Tidak Tersedia";
                    }
                }
            } catch (error) {
                // Don't throw error, just skip status update
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
