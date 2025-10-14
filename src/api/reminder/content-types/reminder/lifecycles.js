module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi tanggal reminder tidak boleh di masa lalu
        if (data.reminder_date) {
            const reminderDate = new Date(data.reminder_date);
            const now = new Date();

            if (reminderDate <= now) {
                throw new Error("Tanggal reminder harus di masa depan");
            }
        }

        // Set assigned_to jika tidak ada
        if (!data.assigned_to && event.state.user) {
            try {
                const karyawan = await strapi.entityService.findMany(
                    "api::karyawan.karyawan",
                    {
                        filters: { user: event.state.user.id },
                    }
                );

                if (karyawan && karyawan.length > 0) {
                    data.assigned_to = karyawan[0].id;
                }
            } catch (error) {
                strapi.log.error("Error finding karyawan:", error);
            }
        }

        // Generate title jika tidak ada
        if (!data.title && data.activity) {
            data.title = data.activity;
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Jika status berubah menjadi completed, set completion data
        if (data.status_reminder === "completed" && !data.completed_at) {
            data.completed_at = new Date();
        }

        // Jika status berubah menjadi overdue
        if (data.reminder_date) {
            const reminderDate = new Date(data.reminder_date);
            const now = new Date();

            if (reminderDate < now && data.status_reminder === "pending") {
                data.status_reminder = "overdue";
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Kirim notifikasi ke staff yang ditugaskan
        if (result.assigned_to) {
            try {
                const staff = await strapi.entityService.findOne(
                    "api::karyawan.karyawan",
                    result.assigned_to
                );

                if (staff && staff.email) {
                    await strapi.plugins["email"].services.email.send({
                        to: staff.email,
                        subject: `Reminder Follow-up: ${result.title}`,
                        text: `
              Anda memiliki reminder follow-up:
              
              Judul: ${result.title}
              Jenis: ${result.reminder_type}
              Tanggal: ${new Date(result.reminder_date).toLocaleDateString(
                            "id-ID"
                        )}
              Prioritas: ${result.priority}
              
              Silakan lakukan follow-up sesuai jadwal.
            `,
                    });
                }
            } catch (error) {
                strapi.log.error("Error sending reminder notification:", error);
            }
        }

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "reminder_created",
                    entity_type: "reminder",
                    entity_id: result.id,
                    description: `Reminder follow-up "${result.title}" telah dibuat`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;

        // Jika status berubah menjadi completed, kirim notifikasi
        if (params.data.status_reminder === "completed") {
            // Kirim notifikasi ke supervisor
            try {
                const supervisors = await strapi.entityService.findMany(
                    "api::karyawan.karyawan",
                    {
                        filters: {
                            jabatan: {
                                nama_jabatan: {
                                    $in: ["Supervisor Marketing", "Manager Marketing"],
                                },
                            },
                        },
                    }
                );

                if (supervisors && supervisors.length > 0) {
                    await strapi.plugins["email"].services.email.send({
                        to: supervisors.map((supervisor) => supervisor.email).join(","),
                        subject: `Follow-up Selesai: ${result.title}`,
                        text: `
              Follow-up telah diselesaikan:
              
              Judul: ${result.title}
              Jenis: ${result.reminder_type}
              Tanggal Selesai: ${new Date(result.completed_at).toLocaleDateString(
                            "id-ID"
                        )}
              
              Silakan cek hasil follow-up di sistem.
            `,
                    });
                }
            } catch (error) {
                strapi.log.error("Error sending completion notification:", error);
            }
        }

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "reminder_updated",
                    entity_type: "reminder",
                    entity_id: result.id,
                    description: `Reminder follow-up "${result.title}" telah diupdate`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },
};
