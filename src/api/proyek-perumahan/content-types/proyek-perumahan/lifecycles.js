const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate project_id if not provided
        if (!data.project_id) {
            const lastProject = await strapi.entityService.findMany("api::proyek-perumahan.proyek-perumahan", {
                sort: { project_id: "desc" },
                limit: 1,
            });

            let nextNumber = 1;
            if (lastProject.length > 0) {
                const lastId = lastProject[0].project_id;
                const match = lastId.match(/PROJ-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            data.project_id = `PROJ-${nextNumber.toString().padStart(6, "0")}`;
        }

        // Initialize auto-calculated fields
        if (data.current_expense === undefined) {
            data.current_expense = 0;
        }
        if (data.total_units === undefined) {
            data.total_units = 0;
        }
        if (data.completed_units === undefined) {
            data.completed_units = 0;
        }
        if (data.progress_percentage === undefined) {
            data.progress_percentage = 0;
        }
        if (data.investment_value === undefined) {
            data.investment_value = data.budget || 0;
        }

        // Calculate progress percentage based on completed vs total units
        if (data.completed_units && data.total_units) {
            data.progress_percentage = (data.completed_units / data.total_units) * 100;
        }

        // Set default status
        if (!data.status_proyek) {
            data.status_proyek = "perencanaan";
        }

        // Validate budget vs current expense (convert to number for comparison)
        if (data.current_expense && data.budget) {
            const currentExpenseNum = parseFloat(data.current_expense);
            const budgetNum = parseFloat(data.budget);
            if (!isNaN(currentExpenseNum) && !isNaN(budgetNum) && currentExpenseNum > budgetNum) {
                throw new Error("Current expense cannot exceed budget");
            }
        }

        // Validate dates
        if (data.actual_completion && data.start_date && new Date(data.actual_completion) < new Date(data.start_date)) {
            throw new Error("Actual completion date cannot be before start date");
        }

        if (data.estimated_completion && data.start_date && new Date(data.estimated_completion) < new Date(data.start_date)) {
            throw new Error("Estimated completion date cannot be before start date");
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);

        const { data, where } = event.params;

        // Recalculate progress percentage on update
        if (data.completed_units !== undefined && data.total_units !== undefined && data.total_units > 0) {
            data.progress_percentage = (data.completed_units / data.total_units) * 100;
        }

        // Update status based on progress
        if (data.progress_percentage >= 100 && data.status_proyek === "pembangunan") {
            data.status_proyek = "terjual habis";
            data.actual_completion = new Date().toISOString().split("T")[0];
        }

        // Validate budget consistency (convert to number for comparison)
        if (data.current_expense && data.budget) {
            const currentExpenseNum = parseFloat(data.current_expense);

            const budgetNum = parseFloat(data.budget);
            if (!isNaN(currentExpenseNum) && !isNaN(budgetNum) && currentExpenseNum > budgetNum) {
                throw new Error("Current expense cannot exceed budget");
            }
        }

        // Auto-calculate investment value from budget if not set
        if (!data.investment_value && data.budget) {
            data.investment_value = data.budget;
        }
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};
