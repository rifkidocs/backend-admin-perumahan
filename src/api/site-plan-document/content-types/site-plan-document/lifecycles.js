module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate version if not provided
        if (!data.version) {
            data.version = "1.0";
        }

        // Set upload date
        data.upload_date = new Date();

        // Validate file format
        if (
            data.file_format &&
            !["PDF", "DWG", "JPG", "PNG"].includes(data.file_format)
        ) {
            throw new Error("Format file tidak didukung");
        }

        // Set default status
        if (!data.status_site_plan) {
            data.status_site_plan = "draft";
        }

        // Auto-generate drawing number if not provided
        if (!data.drawing_number) {
            // Simple drawing number generation without project filter
            data.drawing_number = `SP-${Date.now().toString().slice(-6)}`;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log document creation
        strapi.log.info(
            `Site plan document created: ${result.document_name}`
        );
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Track version changes
        if (data.version) {
            const existingDoc = await strapi.entityService.findOne(
                "api::site-plan-document.site-plan-document",
                where.id
            );
            if (existingDoc && existingDoc.version !== data.version) {
                strapi.log.info(
                    `Site plan document version updated from ${existingDoc.version} to ${data.version}`
                );
            }
        }

        // Validate status transitions - Allow all transitions for flexibility
        if (data.status_site_plan) {
            const existingDoc = await strapi.entityService.findOne(
                "api::site-plan-document.site-plan-document",
                where.id
            );
            if (existingDoc) {
                // Allow all status transitions for now
                strapi.log.info(
                    `Status changed from ${existingDoc.status_site_plan} to ${data.status_site_plan}`
                );
            }
        }

        // Set archived_at when status changes to archived
        if (data.status_site_plan === "archived") {
            data.archived_at = new Date();
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log document update
        strapi.log.info(`Site plan document updated: ${result.document_name}`);
    },

    async beforeDelete(event) {
        const { where } = event.params;

        // Log deletion attempt
        const doc = await strapi.entityService.findOne(
            "api::site-plan-document.site-plan-document",
            where.id
        );

        if (doc) {
            strapi.log.info(`Attempting to delete site plan document: ${doc.document_name} (status: ${doc.status_site_plan})`);

            // Only warn if trying to delete active document, but allow it
            if (doc.status_site_plan === "active") {
                strapi.log.warn("Deleting active document - this may affect project references");
            }
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Log document deletion
        strapi.log.info(`Site plan document deleted: ${result.document_name}`);

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
