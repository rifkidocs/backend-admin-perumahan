module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validate document type
        if (
            data.document_type &&
            !["BAST", "Check List", "Dokumen Garansi"].includes(data.document_type)
        ) {
            throw new Error("Tipe dokumen serah terima tidak valid");
        }

        // Set default status_handover
        if (!data.status_handover) {
            data.status_handover = "draft";
        }

        // Set signature required based on document type
        if (
            data.document_type === "BAST" &&
            data.signature_required === undefined
        ) {
            data.signature_required = true;
        }

        // Validate handover date
        if (data.handover_date && new Date(data.handover_date) > new Date()) {
            throw new Error("Tanggal serah terima tidak boleh di masa depan");
        }

        // Set warranty dates if not provided
        if (data.document_type === "Dokumen Garansi" && data.handover_date) {
            const handoverDate = new Date(data.handover_date);
            data.warranty_start_date = handoverDate;

            if (!data.warranty_end_date) {
                const warrantyEndDate = new Date(handoverDate);
                warrantyEndDate.setMonth(warrantyEndDate.getMonth() + (data.warranty_period || 12));
                data.warranty_end_date = warrantyEndDate;
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log document creation
        strapi.log.info(
            `Handover document created: ${result.document_name}`
        );
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Validate status transitions - Allow all transitions for flexibility
        if (data.status_handover) {
            const existingDoc = await strapi.entityService.findOne(
                "api::handover-document.handover-document",
                where.id
            );
            if (existingDoc) {
                // Allow all status transitions for now
                strapi.log.info(
                    `Status changed from ${existingDoc.status_handover} to ${data.status_handover}`
                );
            }
        }

        // Validate signature requirement
        if (data.signature_required && !data.signature_file) {
            strapi.log.warn("Signature required but no signature file provided");
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log document update
        strapi.log.info(`Handover document updated: ${result.document_name}`);
    },

    async beforeDelete(event) {
        const { where } = event.params;

        // Log deletion attempt
        const doc = await strapi.entityService.findOne(
            "api::handover-document.handover-document",
            where.id
        );

        if (doc) {
            strapi.log.info(`Attempting to delete handover document: ${doc.document_name} (status: ${doc.status_handover})`);

            // Only warn if trying to delete active document, but allow it
            if (doc.status_handover === "active") {
                strapi.log.warn("Deleting active handover document - this may affect project references");
            }
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Log document deletion
        strapi.log.info(`Handover document deleted: ${result.document_name}`);

        // Clean up related files
        if (result.file) {
            try {
                await strapi.plugins["upload"].services.upload.remove(result.file);
            } catch (error) {
                strapi.log.warn("Failed to remove file:", error.message);
            }
        }

        // Clean up signature file if exists
        if (result.signature_file) {
            try {
                await strapi.plugins["upload"].services.upload.remove(result.signature_file);
            } catch (error) {
                strapi.log.warn("Failed to remove signature file:", error.message);
            }
        }
    },
};