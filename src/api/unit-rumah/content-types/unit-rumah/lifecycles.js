module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate unit_id if not provided
        if (!data.unit_id) {
            const lastUnit = await strapi.entityService.findMany("api::unit-rumah.unit-rumah", {
                sort: { unit_id: "desc" },
                limit: 1,
            });

            let nextNumber = 1;
            if (lastUnit.length > 0) {
                const lastId = lastUnit[0].unit_id;
                const match = lastId.match(/UNIT-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            data.unit_id = `UNIT-${nextNumber.toString().padStart(3, "0")}`;
        }

        // Set default values
        if (!data.status) {
            data.status = "belum-dibangun";
        }
        if (data.progress === undefined) {
            data.progress = 0;
        }
    },

    async afterUpdate(event) {
        const { data, where } = event.params;
        const { result } = event;

        // Update project statistics when unit status changes
        if (data.status && result.proyek_perumahan) {
            const projectUnits = await strapi.entityService.findMany(
                "api::unit-rumah.unit-rumah",
                {
                    filters: { proyek_perumahan: result.proyek_perumahan.id },
                    populate: false,
                }
            );

            const totalUnits = projectUnits.length;
            const completedUnits = projectUnits.filter(
                (unit) => unit.status === "selesai" || unit.status === "serah-terima"
            ).length;

            const avgProgress =
                projectUnits.reduce((sum, unit) => sum + (unit.progress || 0), 0) /
                totalUnits;

            await strapi.entityService.update(
                "api::proyek-perumahan.proyek-perumahan",
                result.proyek_perumahan.id,
                {
                    data: {
                        total_units: totalUnits,
                        completed_units: completedUnits,
                        progress_percentage: Math.round(avgProgress),
                    },
                }
            );
        }
    },
};