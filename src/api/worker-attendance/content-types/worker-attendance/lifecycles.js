module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Hitung total pekerja secara otomatis
        data.total_pekerja =
            (data.tukang_batu || 0) +
            (data.tukang_kayu || 0) +
            (data.tukang_cat || 0) +
            (data.kernet || 0);

        // Validasi total pekerja minimal 1
        if (data.total_pekerja < 1) {
            throw new Error("Minimal harus ada 1 pekerja");
        }

        // Validasi persentase kehadiran
        if (data.persentase_kehadiran < 0 || data.persentase_kehadiran > 100) {
            throw new Error("Persentase kehadiran harus antara 0-100");
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Hitung ulang total pekerja jika ada perubahan
        if (
            data.tukang_batu !== undefined ||
            data.tukang_kayu !== undefined ||
            data.tukang_cat !== undefined ||
            data.kernet !== undefined
        ) {
            data.total_pekerja =
                (data.tukang_batu || 0) +
                (data.tukang_kayu || 0) +
                (data.tukang_cat || 0) +
                (data.kernet || 0);
        }

        // Validasi persentase kehadiran
        if (
            data.persentase_kehadiran !== undefined &&
            (data.persentase_kehadiran < 0 || data.persentase_kehadiran > 100)
        ) {
            throw new Error("Persentase kehadiran harus antara 0-100");
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "CREATE_WORKER_ATTENDANCE",
                entity_type: "worker-attendance",
                entity_id: result.id,
                description: `Data kehadiran pekerja dicatat: ${result.total_pekerja} pekerja dengan kehadiran ${result.persentase_kehadiran}%`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },
};
