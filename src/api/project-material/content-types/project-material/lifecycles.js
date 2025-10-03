module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate material code if not provided
        if (!data.material_code) {
            const lastMaterial = await strapi.entityService.findMany("api::project-material.project-material", {
                sort: { material_code: "desc" },
                limit: 1,
            });

            let nextNumber = 1;
            if (lastMaterial.length > 0) {
                const lastCode = lastMaterial[0].material_code;
                const match = lastCode.match(/MTL-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            data.material_code = `MTL-${nextNumber.toString().padStart(6, "0")}`;
        }

        // Calculate total cost
        if (data.quantity_planned && data.unit_price) {
            data.total_cost = data.quantity_planned * data.unit_price;
        }

        // Initialize quantities
        if (data.quantity_received === undefined) {
            data.quantity_received = 0;
        }
        if (data.quantity_used === undefined) {
            data.quantity_used = 0;
        }
        if (data.quantity_remaining === undefined) {
            data.quantity_remaining = data.quantity_planned || 0;
        }

        // Set default quality status
        if (!data.quality_status) {
            data.quality_status = "pending";
        }

        // Validate quantities
        if (data.quantity_used > data.quantity_received) {
            throw new Error("Quantity used cannot exceed quantity received");
        }

        if (data.quantity_received > data.quantity_planned) {
            // Allow warning instead of error for cases where extra materials are received
            strapi.log.warn(`Material ${data.material_name}: Received quantity exceeds planned quantity`);
        }

        // Validate pricing
        if (data.unit_price <= 0) {
            throw new Error("Unit price must be greater than zero");
        }

        // Check for expiry date on perishable materials
        if (data.expiry_date && data.category === "other") {
            const expiryWarning = "Non-standard material with expiry date - ensure proper handling";
            if (data.notes) {
                data.notes += ` | ${expiryWarning}`;
            } else {
                data.notes = expiryWarning;
            }
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Recalculate quantities
        if (data.quantity_received !== undefined || data.quantity_used !== undefined) {
            const updatedData = await strapi.entityService.findOne("api::project-material.project-material", event.params.where.id.id, {
                populate: {},
            });

            const received = data.quantity_received !== undefined ? data.quantity_received : updatedData.quantity_received;
            const used = data.quantity_used !== undefined ? data.quantity_used : updatedData.quantity_used;

            data.quantity_remaining = received - used;

            if (data.quantity_remaining < 0) {
                throw new Error("Quantity remaining cannot be negative");
            }
        }

        // Update total cost if price changes
        if (data.quantity_planned !== undefined || data.unit_price !== undefined) {
            const updatedData = await strapi.entityService.findOne("api::project-material.project-material", event.params.where.id.id, {
                populate: {},
            });

            const planned = data.quantity_planned !== undefined ? data.quantity_planned : updatedData.quantity_planned;
            const price = data.unit_price !== undefined ? data.unit_price : updatedData.unit_price;

            data.total_cost = planned * price;
        }

        // Update quality status based on usage
        if (data.quantity_used > 0 && data.quality_status === "pending") {
            data.quality_status = "good";
        }

        // Alert for low stock
        if (data.quantity_remaining !== undefined && data.quantity_remaining <= 0) {
            strapi.log.warn(`Material ${data.material_name} is out of stock`);
        }

        // Validate delivery date vs planned date
        if (data.delivery_date && data.project) {
            const project = await strapi.entityService.findOne("api::proyek-perumahan.proyek-perumahan", event.params.where.id.id, {
                populate: {},
            });

            if (data.delivery_date > new Date(project.estimated_completion)) {
                strapi.log.warn(`Material ${data.material_name} delivery date is after project completion date`);
            }
        }
    },

    async afterUpdate(event) {
        const { data, where } = event.params;

        // Update project progress based on material availability
        if (data.category === "structural" && data.quantity_remaining <= 0) {
            // Structural materials finished might affect project progress
            strapi.log.info(`Structural material ${data.material_name} completely used - project phase may be progressing`);
        }
    },
};
