module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi tanggal laporan tidak boleh lebih dari 7 hari dari tanggal kegiatan
        if (data.activity_date) {
            const activityDate = new Date(data.activity_date);
            const today = new Date();
            const diffDays = Math.ceil(
                (today - activityDate) / (1000 * 60 * 60 * 24)
            );

            if (diffDays > 7) {
                throw new Error(
                    "Laporan kegiatan harus dibuat maksimal 7 hari setelah tanggal kegiatan"
                );
            }
        }

        // Set submitted_by jika tidak ada
        if (!data.submitted_by && event.state.user) {
            // Cari karyawan berdasarkan user
            try {
                const karyawan = await strapi.entityService.findMany(
                    "api::karyawan.karyawan",
                    {
                        filters: { user: event.state.user.id },
                    }
                );

                if (karyawan && karyawan.length > 0) {
                    data.submitted_by = karyawan[0].id;
                }
            } catch (error) {
                strapi.log.error("Error finding karyawan:", error);
            }
        }

        // Validasi data numerik
        if (data.leads_generated && data.leads_generated < 0) {
            throw new Error("Jumlah lead yang dihasilkan tidak boleh negatif");
        }

        if (data.bookings_made && data.bookings_made < 0) {
            throw new Error("Jumlah booking tidak boleh negatif");
        }

        if (data.booking_fee_collected && data.booking_fee_collected < 0) {
            throw new Error("Booking fee yang dikumpulkan tidak boleh negatif");
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Jika status berubah menjadi approved, set approval data
        if (data.status === "approved" && !data.approved_by) {
            if (event.state.user) {
                try {
                    const karyawan = await strapi.entityService.findMany(
                        "api::karyawan.karyawan",
                        {
                            filters: { user: event.state.user.id },
                        }
                    );

                    if (karyawan && karyawan.length > 0) {
                        data.approved_by = karyawan[0].id;
                        data.approval_date = new Date();
                    }
                } catch (error) {
                    strapi.log.error("Error finding approver:", error);
                }
            }
        }

        // Validasi data numerik
        if (data.leads_generated && data.leads_generated < 0) {
            throw new Error("Jumlah lead yang dihasilkan tidak boleh negatif");
        }

        if (data.bookings_made && data.bookings_made < 0) {
            throw new Error("Jumlah booking tidak boleh negatif");
        }
    },

    async afterCreate(event) {
        const { result } = event;

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
                    subject: `Laporan Kegiatan Baru: ${result.title}`,
                    text: `
            Laporan kegiatan baru telah disubmit:
            
            Judul: ${result.title}
            Jenis: ${result.report_type}
            Tanggal Kegiatan: ${new Date(result.activity_date).toLocaleDateString(
                        "id-ID"
                    )}
            Lokasi: ${result.location}
            Lead Generated: ${result.leads_generated || 0}
            Booking Made: ${result.bookings_made || 0}
            
            Silakan review laporan ini.
          `,
                });
            }
        } catch (error) {
            strapi.log.error("Error sending supervisor notification:", error);
        }

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "report_created",
                    entity_type: "laporan-kegiatan",
                    entity_id: result.id,
                    description: `Laporan kegiatan "${result.title}" telah dibuat`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;

        // Jika status berubah menjadi approved, kirim notifikasi
        if (params.data.status === "approved") {
            if (result.submitted_by) {
                try {
                    const submitter = await strapi.entityService.findOne(
                        "api::karyawan.karyawan",
                        result.submitted_by
                    );

                    if (submitter && submitter.email) {
                        await strapi.plugins["email"].services.email.send({
                            to: submitter.email,
                            subject: `Laporan Kegiatan Disetujui: ${result.title}`,
                            text: `
                Laporan kegiatan Anda telah disetujui:
                
                Judul: ${result.title}
                Tanggal Approval: ${new Date(
                                result.approval_date
                            ).toLocaleDateString("id-ID")}
                
                Terima kasih atas laporan yang telah dibuat.
              `,
                        });
                    }
                } catch (error) {
                    strapi.log.error("Error sending approval notification:", error);
                }
            }
        }

        // Log aktivitas
        try {
            await strapi.entityService.create("api::activity-log.activity-log", {
                data: {
                    action: "report_updated",
                    entity_type: "laporan-kegiatan",
                    entity_id: result.id,
                    description: `Laporan kegiatan "${result.title}" telah diupdate`,
                    user: event.state.user?.id,
                },
            });
        } catch (error) {
            strapi.log.error("Error creating activity log:", error);
        }
    },
};
