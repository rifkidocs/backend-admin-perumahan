module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate document number if not provided
        if (!data.document_number && data.document_type) {
            const typePrefix = {
                "imb": "IMB",
                "sjp": "SJP",
                "kontrak": "KTR",
                "laporan": "RPT",
                "gambar_arsitektur": "GA",
                "gambar_struktur": "GS",
                "rab": "RAB",
                "legal": "LEG",
                "lainnya": "DOC"
            };

            const prefix = typePrefix[data.document_type] || "DOC";

            const lastDoc = await strapi.entityService.findMany("api::project-document.project-document", {
                filters: { document_type: data.document_type },
                sort: { document_number: "desc" },
                limit: 1,
            });

            let nextNumber = 1;
            if (lastDoc.length > 0) {
                const lastNumber = lastDoc[0].document_number;
                const match = lastNumber.match(new RegExp(`${prefix}-(\\d+)`));
                if (match) {
                    nextNumber = parseInt(match[1])
                        + 1;
                }
            }

            data.document_number = `${prefix}-${nextNumber.toString().padStart(3, "0")}`;
        }

        // Set default status
        if (!data.status) {
            data.status = "draft";
        }

        // Set default priority based on document type
        const criticalDocs = ["imb", "kontrak", "legal"];
        if (criticalDocs.includes(data.document_type)) {
            data.priority = "critical";
            data.is_legal_requirement = true;
        }

        const highPriorityDocs = ["sjp", "rab"];
        if (highPriorityDocs.includes(data.document_type) && !data.priority) {
            data.priority = "high";
        }

        // Validate expiry date
        if (data.expiry_date && data.issue_date && new Date(data.expiry_date) <= new Date(data.issue_date)) {
            throw new Error("Expiry date must be after issue date");
        }

        // Auto-set issue date
        if (!data.issue_date) {
            data.issue_date = new Date().toISOString().split("T")[0];
        }

        // Check for renewal requirement for legal documents
        if (data.document_type === "imb" || data.document_type === "kontrak") {
            if (!data.expiry_date) {
                // Set default 2 years expiry for legal documents
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 2);
                data.expiry_date = expiryDate.toISOString().split("T")[0];
            }
        }

        // Auto-set approval status
        if (data.is_legal_requirement && !data.approval_status) {
            data.approval_status = "approved";
            data.status = "active";
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Check for expiry
        if (data.expiry_date && new Date(data.expiry_date) <= new Date()) {
            data.status = "expired";

            if (data.document_type === "imb" || data.document_type === "kontrak") {
                data.priority = "critical";
                strapi.log.warn(`Critical document ${data.document_name} has expired`);
            }
        }

        // Check for renewal needed (30 days before expiry)
        if (data.expiry_date) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            if (new Date(data.expiry_date) <= thirtyDaysFromNow && data.status === "active") {
                data.status = "renewal-needed";
                data.priority = "high";

                strapi.log.info(`Document ${data.document_name} needs renewal soon`);
            }
        }

        // Validate file presence
        if (data.file === null && data.status === "active") {
            throw new Error("Active document must have a file attached");
        }

        // Handle version updates
        if (data.approval_status === "needs_revision") {
            const currentVersion = parseFloat(data.version || "1.0");
            data.version = (currentVersion + 0.1).toFixed(1);
        }

        // Auto-update approval status based on document type
        if (data.approval_status === "pending" && !data.is_legal_requirement) {
            // Non-legal documents can be auto-approved
            data.approval_status = "approved";
            if (data.status === "draft") {
                data.status = "active";
            }
        }
    },

    async afterCreate(event) {
        const { data } = event.params;

        // Send notification for critical documents
        if (data.priority === "critical" && data.is_legal_requirement) {
            strapi.log.info(`Critical legal document ${data.document_name} created - ensuring proper visibility`);
        }

        // Auto-schedule renewal reminder for legal documents
        if ((data.document_type === "imb" || data.document_type === "kontrak") && data.expiry_date) {
            strapi.log.info(`Scheduling renewal reminder for ${data.document_name} before expiry date`);
        }
    },

    async afterUpdate(event) {
        const { data } = event.params;

        // Notify about status changes
        if (data.status === "expired" || data.status === "renewal-needed") {
            strapi.log.warn(`Document ${data.document_name} requires attention: ${data.status}`);
        }

        // Log version updates
        if (data.version && parseFloat(data.version) > 1.0) {
            strapi.log.info(`Document ${data.document_name} updated to version ${data.version}`);
        }
    },
};
