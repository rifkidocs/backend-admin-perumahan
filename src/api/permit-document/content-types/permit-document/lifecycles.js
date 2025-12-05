const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Set default status_permit
        if (!data.status_permit) {
            data.status_permit = "pending";
        }

        // Validate dates
        if (data.issue_date && data.expiry_date) {
            if (new Date(data.expiry_date) <= new Date(data.issue_date)) {
                throw new Error("Tanggal berlaku harus setelah tanggal terbit");
            }
        }

        // Auto-generate document number if not provided
        if (!data.document_number) {
            const year = new Date().getFullYear();
            const lastDoc = await strapi.entityService.findMany(
                "api::permit-document.permit-document",
                {
                    filters: {
                        document_type: data.document_type,
                        project: data.project
                    },
                    sort: { document_number: "desc" },
                    limit: 1,
                }
            );

            let nextNumber = 1;
            if (lastDoc.length > 0) {
                const lastNumber = lastDoc[0].document_number;
                const match = lastNumber.match(/\d+$/);
                if (match) {
                    nextNumber = parseInt(match[0]) + 1;
                }
            }

            const formatMap = {
                IMB: `${nextNumber}/IMB/${year}-001`,
                PBG: `PBG/${year}/${nextNumber}-001`,
                "Izin Lingkungan": `IL/${year}/${nextNumber}`,
            };

            data.document_number = formatMap[data.document_type] || `DOC-${year}-${nextNumber}`;
        }

        // Set default priority based on document type
        if (!data.priority) {
            const criticalDocs = ["IMB", "PBG"];
            if (criticalDocs.includes(data.document_type)) {
                data.priority = "critical";
            } else {
                data.priority = "high";
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log permit creation
        strapi.log.info(
            `Permit document created: ${result.document_number} (${result.document_type})`
        );
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);

        const { data, where } = event.params;

        // Validate status transitions - Allow all transitions for flexibility
        if (data.status_permit) {
            const existingPermit = await strapi.entityService.findOne(
                "api::permit-document.permit-document",
                where.id
            );
            if (existingPermit) {
                // Allow all status transitions for now
                strapi.log.info(
                    `Status changed from ${existingPermit.status_permit} to ${data.status_permit}`
                );
            }
        }

        // Auto-set status to expired if past expiry date
        if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
            data.status_permit = "expired";
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log permit update
        strapi.log.info(`Permit document updated: ${result.document_number}`);
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);

        const { where } = event.params;

        // Log deletion attempt
        const permit = await strapi.entityService.findOne(
            "api::permit-document.permit-document",
            where.id
        );

        if (permit) {
            strapi.log.info(`Attempting to delete permit document: ${permit.document_number} (status: ${permit.status_permit})`);

            // Only warn if trying to delete active document, but allow it
            if (permit.status_permit === "active") {
                strapi.log.warn("Deleting active permit document - this may affect project compliance");
            }
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Log permit deletion
        strapi.log.info(`Permit document deleted: ${result.document_number}`);

        // Clean up related files
        if (result.file) {
            try {
                await strapi.plugins["upload"].services.upload.remove(result.file);
            } catch (error) {
                strapi.log.warn("Failed to remove file:", error.message);
            }
        }
    },
};