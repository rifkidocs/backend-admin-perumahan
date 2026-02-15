module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi tanggal
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);

            if (startDate >= endDate) {
                throw new Error("Tanggal mulai harus lebih awal dari tanggal selesai");
            }
        }

        // Validasi waktu
        if (data.start_time && data.end_time) {
            if (data.start_time >= data.end_time) {
                throw new Error("Waktu mulai harus lebih awal dari waktu selesai");
            }
        }

        // Set created_by jika tidak ada
        if (!data.created_by && event.state.user) {
            data.created_by = event.state.user.id;
        }

        // Generate unique title jika tidak ada
        if (!data.title) {
            const activityTypeMap = {
                exhibition: "Pameran",
                open_house: "Open House",
                site_visit: "Kunjungan Site",
                canvassing: "Canvassing",
                customer_visit: "Kunjungan Customer",
                phone_call: "Telepon",
                create_content: "Membuat Konten",
                broadcast: "Broadcast",
            };

            const date = new Date(data.start_date).toLocaleDateString("id-ID");
            data.title = `${activityTypeMap[data.activity_type] || "Kegiatan"
                } - ${date}`;
        }
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Validasi tanggal
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);

            if (startDate >= endDate) {
                throw new Error("Tanggal mulai harus lebih awal dari tanggal selesai");
            }
        }

        // Set updated_by
        if (event.state.user) {
            data.updated_by = event.state.user.id;
        }

        // Update status berdasarkan tanggal
        if (data.start_date) {
            const now = new Date();
            const startDate = new Date(data.start_date);
            const endDate = data.end_date ? new Date(data.end_date) : startDate;

            if (now < startDate) {
                data.status_jadwal = "upcoming";
            } else if (now >= startDate && now <= endDate) {
                data.status_jadwal = "ongoing";
            } else if (now > endDate) {
                data.status_jadwal = "completed";
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Kirim notifikasi ke staff yang ditugaskan
        if (result.assigned_staff && result.assigned_staff.length > 0) {
            try {
                await strapi.plugins["email"].services.email.send({
                    to: result.assigned_staff.map((staff) => staff.email).join(","),
                    subject: `Jadwal Marketing Baru: ${result.title}`,
                    text: `
            Anda telah ditugaskan untuk kegiatan marketing:
            
            Judul: ${result.title}
            Jenis: ${result.activity_type}
            Lokasi: ${result.location}
            Tanggal: ${new Date(result.start_date).toLocaleDateString("id-ID")}
            Waktu: ${result.start_time || "TBD"} - ${result.end_time || "TBD"}
            
            Silakan persiapkan diri untuk kegiatan ini.
          `,
                });
            } catch (error) {
                strapi.log.error("Error sending email notification:", error);
            }
        }

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "schedule_created",
                    entity_type: "jadwal-marketing",
                    entity_id: result.id,
                    description: `Jadwal marketing "${result.title}" telah dibuat`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;

        // Kirim notifikasi jika ada perubahan penting
        const changedFields = Object.keys(params.data);
        const importantFields = [
            "start_date",
            "end_date",
            "location",
            "assigned_staff",
        ];

        if (importantFields.some((field) => changedFields.includes(field))) {
            if (result.assigned_staff && result.assigned_staff.length > 0) {
                try {
                    await strapi.plugins["email"].services.email.send({
                        to: result.assigned_staff.map((staff) => staff.email).join(","),
                        subject: `Update Jadwal Marketing: ${result.title}`,
                        text: `
              Jadwal marketing telah diupdate:
              
              Judul: ${result.title}
              Perubahan: ${changedFields.join(", ")}
              
              Silakan cek detail terbaru di sistem.
            `,
                    });
                } catch (error) {
                    strapi.log.error("Error sending update notification:", error);
                }
            }
        }

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "schedule_updated",
                    entity_type: "jadwal-marketing",
                    entity_id: result.id,
                    description: `Jadwal marketing "${result.title}" telah diupdate`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },

    async beforeDelete(event) {
        const { where } = event.params;

        // Cek apakah ada laporan yang terkait
        try {
            const reports = await strapi.entityService.findMany(
                "api::laporan-kegiatan.laporan-kegiatan",
                {
                    filters: { schedule: where.id },
                }
            );

            if (reports && reports.length > 0) {
                throw new Error(
                    "Tidak dapat menghapus jadwal yang sudah memiliki laporan kegiatan"
                );
            }
        } catch (error) {
            strapi.log.error("Error checking related reports:", error);
            throw error;
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "schedule_deleted",
                    entity_type: "jadwal-marketing",
                    entity_id: result.id,
                    description: `Jadwal marketing "${result.title}" telah dihapus`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },
};
