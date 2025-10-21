module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Set default progress
        if (!data.progress) {
            data.progress = 0;
        }

        // Set default status berdasarkan deadline
        if (!data.status_pekerjaan) {
            data.status_pekerjaan = "On Track";
        }

        // Validasi bobot tidak boleh lebih dari 100
        if (data.bobot > 100) {
            throw new Error("Bobot pekerjaan tidak boleh lebih dari 100%");
        }

        // Validasi progress 0-100
        if (data.progress < 0 || data.progress > 100) {
            throw new Error("Progress harus antara 0-100");
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update status berdasarkan progress dan deadline
        if (data.progress !== undefined) {
            if (data.progress === 100) {
                data.status_pekerjaan = "Selesai";
            } else if (data.deadline && new Date(data.deadline) < new Date()) {
                data.status_pekerjaan = "Delayed";
            } else {
                data.status_pekerjaan = "On Track";
            }
        }

        // Update status berdasarkan deadline
        if (data.deadline && data.progress < 100) {
            if (new Date(data.deadline) < new Date()) {
                data.status_pekerjaan = "Delayed";
            } else {
                data.status_pekerjaan = "On Track";
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log pekerjaan baru
        strapi.log.info(
            `Item pekerjaan baru: ${result.nama_pekerjaan} untuk proyek ${result.proyek.project_name}`
        );
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log perubahan progress
        strapi.log.info(
            `Progress pekerjaan ${result.nama_pekerjaan} diupdate menjadi ${result.progress}%`
        );

        // Kirim notifikasi jika pekerjaan selesai
        if (result.status_pekerjaan === "Selesai") {
            try {
                await strapi.plugins["email"].services.email.send({
                    to: "project-manager@company.com",
                    subject: "Pekerjaan Selesai",
                    text: `Pekerjaan ${result.nama_pekerjaan} telah selesai`,
                });
            } catch (error) {
                strapi.log.error("Error sending email notification:", error);
            }
        }
    },
};
