module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-set phase number if not provided
        if (!data.phase_number && data.project) {
            const existingPhases = await strapi.entityService.findMany("api::project-phase.project-phase", {
                filters: { project: data.project },
                sort: { phase_number: "desc" },
                limit: 1,
            });

            data.phase_number = existingPhases.length > 0 ? existingPhases[0].phase_number + 1 : 1;
        }

        // Calculate progress percentage based on dates if not provided
        if (data.start_target && data.end_target && !data.progress_percent) {
            const start = new Date(data.start_target);
            const end = new Date(data.end_target);
            const now = new Date();

            if (now >= start && now <= end) {
                const totalDays = (end - start) / (1000 * 60 * 60 * 24);
                const passedDays = (now - start) / (1000 * 60 * 60 * 24);
                data.progress_percent = Math.min((passedDays / totalDays) * 100, 100);
            }
        }

        // Set default status
        if (!data.status) {
            data.status = "planning";
        }

        // Validate dates
        if (data.start_target && data.end_target && new Date(data.start_target) >= new Date(data.end_target)) {
            throw new Error("Start target date must be before end target date");
        }

        if (data.start_actual && data.end_actual && new Date(data.start_actual) >= new Date(data.end_actual)) {
            throw new Error("Start actual date must be before end actual date");
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update status based on actual completion
        if (data.end_actual && !data.status?.includes("completed")) {
            data.status = "completed";
            data.progress_percent = 100;
        }

        // Validate budget consistency
        if (data.actual_expense !== undefined && data.budget_allocation !== undefined) {
            if (data.actual_expense > data.budget_allocation) {
                // Note: Allow warning instead of throwing error for flexibility
                strapi.log.warn(`Phase ${data.phase_name}: Actual amount spent exceeds budget allocation`);
            }
        }

        // Update progress based on date if milestone data is present
        if (data.milestones && Array.isArray(data.milestones)) {
            const completedMilestones = data.milestones.filter(m => m.status === "completed");
            if (completedMilestones.length > 0) {
                data.progress_percent = (completedMilestones.length / data.milestones.length) * 100;
            }
        }
    },
};
