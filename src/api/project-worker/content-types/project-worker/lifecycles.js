module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Set default status
        if (!data.status) {
            data.status = "aktif";
        }

        // Initialize total hours if not provided
        if (data.total_hours_worked === undefined) {
            data.total_hours_worked = 0;
        }

        // Validate worker type and rates
        if (data.worker_type === "harian" && !data.daily_rate) {
            throw new Error("Daily rate is required for daily workers");
        }

        if (data.worker_type === "karyawan" && !data.monthly_rate) {
            throw new Error("Monthly rate is required for employees");
        }

        if (data.worker_type === "outsourced" && !data.hourly_rate) {
            throw new Error("Hourly rate is required for outsourced workers");
        }

        // Validate dates
        if (data.end_date && data.start_date && new Date(data.end_date) <= new Date(data.start_date)) {
            throw new Error("End date must be after start date");
        }

        // Link with karyawan if employee_id is provided
        if (data.employee_id && !data.karyawan) {
            const karyawan = await strapi.entityService.findMany("api::karyawan.karyawan", {
                filters: { id: data.employee_id }
            });
            if (karyawan.length > 0) {
                data.karyawan = karyawan[0].id;
                data.worker_name = karyawan[0].nama_lengkap;
            }
        }

        // Auto-generate team leader if not provided and position suggests leadership
        if (!data.team_leader) {
            const leadershipPositions = ["manager", "supervisor", "leader", "mandor", "foreman"];
            if (leadershipPositions.some(pos => data.position.toLowerCase().includes(pos))) {
                data.team_leader = data.worker_name;
            }
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update status based on end date
        if (data.end_date && new Date(data.end_date) <= new Date()) {
            data.status = "terminated";
        }

        // Validate rates based on worker type
        if (data.worker_type === "harian" && !data.daily_rate) {
            throw new Error("Daily rate is required for daily workers");
        }

        if (data.worker_type === "karyawan" && !data.monthly_rate) {
            throw new Error("Monthly rate is required for employees");
        }

        // Calculate total compensation based on hours worked and rate
        if (data.worker_type === "outsourced" && data.hourly_rate && data.total_hours_worked) {
            const dailyCompensation = data.hourly_rate * 8; // Assuming 8 hours per day
            data.daily_rate = dailyCompensation;
        }
    },
};
