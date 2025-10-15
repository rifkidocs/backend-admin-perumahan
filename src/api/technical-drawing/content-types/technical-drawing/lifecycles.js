module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate version if not provided
        if (!data.version) {
            data.version = "1.0";
        }

        // Set upload date
        data.upload_date = new Date();

        // Validate category
        if (
            data.category &&
            !["Arsitektur", "Struktur", "MEP"].includes(data.category)
        ) {
            throw new Error("Kategori gambar tidak valid");
        }

        // Validate file format
        if (
            data.file_format &&
            !["DWG", "PDF", "JPG"].includes(data.file_format)
        ) {
            throw new Error("Format file tidak didukung");
        }

        // Set default status_drawing
        if (!data.status_drawing) {
            data.status_drawing = "draft";
        }

        // Auto-generate drawing number if not provided
        if (!data.drawing_number) {
            // Simple drawing number generation without project filter
            data.drawing_number = `TD-${Date.now().toString().slice(-6)}`;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log document creation
        strapi.log.info(
            `Technical drawing created: ${result.file_name}`
        );
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Track version changes
        if (data.version) {
            const existingDrawing = await strapi.entityService.findOne(
                "api::technical-drawing.technical-drawing",
                where.id
            );
            if (existingDrawing && existingDrawing.version !== data.version) {
                strapi.log.info(
                    `Technical drawing version updated from ${existingDrawing.version} to ${data.version}`
                );
            }
        }

        // Validate status transitions - Allow all transitions for flexibility
        if (data.status_drawing) {
            const existingDrawing = await strapi.entityService.findOne(
                "api::technical-drawing.technical-drawing",
                where.id
            );
            if (existingDrawing) {
                // Allow all status transitions for now
                strapi.log.info(
                    `Status changed from ${existingDrawing.status_drawing} to ${data.status_drawing}`
                );
            }
        }

        // Set archived_at when status changes to archived
        if (data.status_drawing === "archived") {
            data.archived_at = new Date();
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log drawing update
        strapi.log.info(`Technical drawing updated: ${result.file_name}`);
    },

    async beforeDelete(event) {
        const { where } = event.params;

        // Log deletion attempt
        const drawing = await strapi.entityService.findOne(
            "api::technical-drawing.technical-drawing",
            where.id
        );

        if (drawing) {
            strapi.log.info(`Attempting to delete technical drawing: ${drawing.file_name} (status: ${drawing.status_drawing})`);

            // Only warn if trying to delete active drawing, but allow it
            if (drawing.status_drawing === "active") {
                strapi.log.warn("Deleting active drawing - this may affect project references");
            }
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Log drawing deletion
        strapi.log.info(`Technical drawing deleted: ${result.file_name}`);

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