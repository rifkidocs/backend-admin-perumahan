module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi tanggal
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);

            if (endDate <= startDate) {
                throw new Error("Tanggal selesai harus setelah tanggal mulai");
            }

            // Auto-calculate duration
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            data.duration_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Validasi dependencies
        if (data.dependencies && data.dependencies.length > 0) {
            const dependencyTasks = await strapi.entityService.findMany(
                "api::jadwal-proyek.jadwal-proyek",
                {
                    filters: {
                        id: { $in: data.dependencies },
                    },
                }
            );

            const incompleteDependencies = dependencyTasks.filter(
                (task) => task.task_status !== "completed"
            );
            if (incompleteDependencies.length > 0) {
                throw new Error("Task dependencies belum selesai");
            }
        }

        // Set default values
        if (!data.task_status) {
            data.task_status = "planned";
        }
        if (!data.progress_percentage) {
            data.progress_percentage = 0;
        }
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;
        const existingTask = await strapi.entityService.findOne(
            "api::jadwal-proyek.jadwal-proyek",
            where.id
        );

        // Validasi task status transition
        const validTransitions = {
            planned: ["in-progress"],
            "in-progress": ["completed", "delayed"],
            completed: [],
            delayed: ["in-progress", "completed"],
        };

        if (data.task_status && existingTask.task_status !== data.task_status) {
            if (
                !validTransitions[existingTask.task_status]?.includes(data.task_status)
            ) {
                throw new Error(
                    `Status tidak dapat berubah dari ${existingTask.task_status} ke ${data.task_status}`
                );
            }
        }

        // Auto-calculate progress berdasarkan task_status
        if (data.task_status === "completed") {
            data.progress_percentage = 100;
            data.actual_end_date = new Date().toISOString();
        } else if (
            data.task_status === "in-progress" &&
            existingTask.task_status === "planned"
        ) {
            data.actual_start_date = new Date().toISOString();
        }

        // Calculate deviation jika ada actual_end_date
        if (data.actual_end_date && existingTask.end_date) {
            const actualDate = new Date(data.actual_end_date);
            const plannedDate = new Date(existingTask.end_date);
            const diffTime = actualDate.getTime() - plannedDate.getTime();
            data.deviation_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Update project progress
        await updateProjectProgress(result.proyek_perumahan);

        // Send notification
        await sendTaskNotification(result, "created");
    },

    async afterUpdate(event) {
        const { result } = event;

        // Update project progress
        await updateProjectProgress(result.proyek_perumahan);

        // Send notification jika task_status berubah
        await sendTaskNotification(result, "updated");

        // Generate reminder jika task delayed
        if (result.task_status === "delayed") {
            await generateDelayReminder(result);
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Update project progress
        await updateProjectProgress(result.proyek_perumahan);
    },
};

// Helper functions
async function updateProjectProgress(projectId) {
    try {
        const tasks = await strapi.entityService.findMany(
            "api::jadwal-proyek.jadwal-proyek",
            {
                filters: { proyek_perumahan: projectId },
            }
        );

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
            (task) => task.task_status === "completed"
        ).length;
        const progressPercentage =
            totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        await strapi.entityService.update(
            "api::proyek-perumahan.proyek-perumahan",
            projectId,
            {
                data: {
                    progress_percentage: Math.round(progressPercentage),
                },
            }
        );
    } catch (error) {
        console.error("Failed to update project progress:", error);
    }
}

async function sendTaskNotification(task, action) {
    try {
        // Implementation untuk mengirim email notification
        console.log(`Task ${task.task_name} ${action} - Notification sent`);
    } catch (error) {
        console.error("Failed to send notification:", error);
    }
}

async function generateDelayReminder(task) {
    try {
        await strapi.entityService.create(
            "api::reminder-keterlambatan.reminder-keterlambatan",
            {
                data: {
                    project_name: task.proyek_perumahan?.project_name || "Unknown Project",
                    unit_id: task.unit?.unit_id,
                    issue_description: `Task "${task.task_name}" mengalami keterlambatan`,
                    deadline_date: task.end_date,
                    impact_description: `Dampak terhadap timeline proyek`,
                    priority: "high",
                    reminder_status: "active",
                    assigned_to: task.assigned_to,
                },
            }
        );
    } catch (error) {
        console.error("Failed to generate delay reminder:", error);
    }
}
