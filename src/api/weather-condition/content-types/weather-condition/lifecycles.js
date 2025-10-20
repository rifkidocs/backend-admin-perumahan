module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi suhu
        if (data.suhu_min && data.suhu_max && data.suhu_min > data.suhu_max) {
            throw new Error(
                "Suhu minimum tidak boleh lebih besar dari suhu maksimum"
            );
        }

        // Validasi kelembaban
        if (data.kelembaban && (data.kelembaban < 0 || data.kelembaban > 100)) {
            throw new Error("Kelembaban harus antara 0-100");
        }

        // Set durasi tunda default jika dampak ada tapi durasi tidak diisi
        if (data.dampak_konstruksi !== "tidak_ada" && !data.durasi_tunda) {
            data.durasi_tunda = 0;
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Validasi suhu
        if (
            data.suhu_min !== undefined &&
            data.suhu_max !== undefined &&
            data.suhu_min > data.suhu_max
        ) {
            throw new Error(
                "Suhu minimum tidak boleh lebih besar dari suhu maksimum"
            );
        }

        // Validasi kelembaban
        if (
            data.kelembaban !== undefined &&
            (data.kelembaban < 0 || data.kelembaban > 100)
        ) {
            throw new Error("Kelembaban harus antara 0-100");
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Jika ada dampak signifikan, kirim notifikasi
        if (result.dampak_konstruksi === "signifikan") {
            try {
                await strapi.service("api::notification.notification").sendWeatherAlert({
                    project: result.proyek,
                    weather: result.kondisi_cuaca,
                    impact: result.dampak_konstruksi,
                    delay: result.durasi_tunda,
                });
            } catch (error) {
                console.log("Notification service not available:", error.message);
            }
        }

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "CREATE_WEATHER_CONDITION",
                entity_type: "weather-condition",
                entity_id: result.id,
                description: `Kondisi cuaca dicatat: ${result.kondisi_cuaca} dengan dampak ${result.dampak_konstruksi}`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },
};
