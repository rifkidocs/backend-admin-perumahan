module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate revision if not provided
        if (!data.revision) {
            data.revision = "01";
        }

        // Set creation date
        data.creation_date = new Date();

        // Validate document type
        if (
            data.document_type &&
            !["RAB", "BOQ Material", "BOQ Infrastruktur"].includes(data.document_type)
        ) {
            throw new Error("Tipe dokumen BOQ tidak valid");
        }

        // Set default status_boq
        if (!data.status_boq) {
            data.status_boq = "draft";
        }

        // Format total amount
        if (data.total_amount && typeof data.total_amount === "string") {
            data.total_amount = parseFloat(data.total_amount.replace(/[^\d.-]/g, ""));
        }

        // Auto-generate version if not provided
        if (!data.version) {
            data.version = "1.0";
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log BOQ creation
        strapi.log.info(
            `BOQ document created: ${result.document_name} (${result.document_type})`
        );
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Track revision changes
        if (data.revision) {
            const existingBOQ = await strapi.entityService.findOne(
                "api::boq-document.boq-document",
                where.id
            );
            if (existingBOQ && existingBOQ.revision !== data.revision) {
                strapi.log.info(
                    `BOQ document revision updated from ${existingBOQ.revision} to ${data.revision}`
                );
            }
        }

        // Validate status transitions - Allow all transitions for flexibility
        if (data.status_boq) {
            const existingBOQ = await strapi.entityService.findOne(
                "api::boq-document.boq-document",
                where.id
            );
            if (existingBOQ) {
                // Allow all status transitions for now
                strapi.log.info(
                    `Status changed from ${existingBOQ.status_boq} to ${data.status_boq}`
                );
            }
        }

        // Set archived_at when status changes to archived
        if (data.status_boq === "archived") {
            data.archived_at = new Date();
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log BOQ update
        strapi.log.info(`BOQ document updated: ${result.document_name}`);
    },

    async beforeDelete(event) {
        const { where } = event.params;

        // Log deletion attempt
        const boq = await strapi.entityService.findOne(
            "api::boq-document.boq-document",
            where.id
        );

        if (boq) {
            strapi.log.info(`Attempting to delete BOQ document: ${boq.document_name} (status: ${boq.status_boq})`);

            // Only warn if trying to delete active document, but allow it
            if (boq.status_boq === "active") {
                strapi.log.warn("Deleting active BOQ document - this may affect project references");
            }
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Log BOQ deletion
        strapi.log.info(`BOQ document deleted: ${result.document_name}`);

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