"use strict";

/**
 * placement lifecycle callbacks
 */

// Helper function to extract employee ID from various data structures
function extractEmployeeId(employeeData) {
    if (!employeeData) return null;

    if (typeof employeeData === 'string' || typeof employeeData === 'number') {
        return employeeData;
    } else if (employeeData.set && Array.isArray(employeeData.set) && employeeData.set.length > 0) {
        return employeeData.set[0].id;
    } else if (employeeData.id) {
        return employeeData.id;
    }

    return null;
}

module.exports = {
    /**
     * Triggered before placement creation
     * Validates business rules and auto-generates data
     */
    async beforeCreate(event) {
        try {
            const { data } = event.params;

            // Extract employee ID from the data structure
            const employeeId = extractEmployeeId(data.employee);

            // Validate date range
            if (data.start_date && data.end_date) {
                const startDate = new Date(data.start_date);
                const endDate = new Date(data.end_date);

                if (endDate <= startDate) {
                    throw new Error("Tanggal selesai harus setelah tanggal mulai");
                }
            }

            // Auto-set status_penempatan to 'aktif' if not provided
            if (!data.status_penempatan) {
                data.status_penempatan = "aktif";
            }

            // Validate employee exists and is active
            if (employeeId) {
                const employee = await strapi.entityService.findOne(
                    "api::karyawan.karyawan",
                    employeeId
                );

                if (!employee) {
                    throw new Error("Karyawan tidak ditemukan");
                }

                if (
                    employee.status_kepegawaian !== "Tetap" &&
                    employee.status_kepegawaian !== "Kontrak"
                ) {
                    throw new Error(
                        "Hanya karyawan tetap dan kontrak yang dapat ditempatkan"
                    );
                }
            }

            // Check for overlapping placements
            if (employeeId && data.start_date) {
                // Build the overlap filter correctly
                const overlapFilter = {
                    employee: employeeId,
                    status_penempatan: "aktif",
                };

                // Add date overlap conditions
                if (data.end_date) {
                    // If both start and end dates are provided, check for overlap
                    overlapFilter.$or = [
                        {
                            // Existing placement starts before new placement ends
                            start_date: { $lte: data.end_date },
                            // AND existing placement ends after new placement starts
                            end_date: { $gte: data.start_date }
                        },
                        {
                            // Existing placement has no end date but starts before new placement ends
                            start_date: { $lte: data.end_date },
                            end_date: null
                        }
                    ];
                } else {
                    // If only start date is provided, check if any active placement exists
                    overlapFilter.start_date = { $lte: data.start_date };
                    overlapFilter.$or = [
                        { end_date: { $gte: data.start_date } },
                        { end_date: null }
                    ];
                }

                const existingPlacements = await strapi.entityService.findMany(
                    "api::placement.placement",
                    {
                        filters: overlapFilter,
                    }
                );

                if (existingPlacements.length > 0) {
                    throw new Error(
                        "Karyawan sudah memiliki penempatan aktif pada periode tersebut"
                    );
                }
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Triggered after placement creation
     * Updates employee status and sends notifications
     */
    async afterCreate(event) {
        const { result } = event;

        // Extract employee ID from result
        const employeeId = extractEmployeeId(result.employee);

        // Update employee current project if this is active placement
        if (result.status_penempatan === "aktif" && employeeId) {
            await strapi.entityService.update(
                "api::karyawan.karyawan",
                employeeId,
                {
                    data: {
                        current_project: result.project_name,
                        current_location: result.location,
                    },
                }
            );
        }

        // Log placement activity
        try {
            await strapi.entityService.create("api::laporan-kegiatan.laporan-kegiatan", {
                data: {
                    jenis_kegiatan: "Penempatan Karyawan",
                    deskripsi: `Penempatan baru: Employee ID ${employeeId} ke ${result.project_name}`,
                    tanggal_kegiatan: new Date().toISOString().split("T")[0],
                    status_kegiatan: "selesai",
                    karyawan: employeeId,
                },
            });
        } catch (error) {
            // Log error but don't fail the creation
            console.error("Failed to create activity log:", error.message);
        }
    },

    /**
     * Triggered before placement update
     * Validates changes and business rules
     */
    async beforeUpdate(event) {
        const { data, where } = event.params;

        // Get current placement data
        const currentPlacement = await strapi.entityService.findOne(
            "api::placement.placement",
            where.id,
            {
                populate: ["employee"],
            }
        );

        if (!currentPlacement) {
            throw new Error("Penempatan tidak ditemukan");
        }

        // Validate date range if dates are being updated
        if (data.start_date || data.end_date) {
            const startDate = new Date(
                data.start_date || currentPlacement.start_date
            );
            const endDate = new Date(data.end_date || currentPlacement.end_date);

            if (endDate <= startDate) {
                throw new Error("Tanggal selesai harus setelah tanggal mulai");
            }
        }

        // Check for overlapping placements when changing dates or employee
        if (
            (data.start_date || data.end_date || data.employee) &&
            data.status_penempatan !== "selesai"
        ) {
            const employeeId = extractEmployeeId(data.employee) || extractEmployeeId(currentPlacement.employee);
            const startDate = data.start_date || currentPlacement.start_date;
            const endDate = data.end_date || currentPlacement.end_date;

            // Build the overlap filter correctly
            const overlapFilter = {
                id: { $ne: where.id },
                employee: employeeId,
                status_penempatan: "aktif",
            };

            // Add date overlap conditions
            if (endDate) {
                overlapFilter.$or = [
                    {
                        start_date: { $lte: endDate },
                        end_date: { $gte: startDate }
                    },
                    {
                        start_date: { $lte: endDate },
                        end_date: null
                    }
                ];
            } else {
                overlapFilter.start_date = { $lte: startDate };
                overlapFilter.$or = [
                    { end_date: { $gte: startDate } },
                    { end_date: null }
                ];
            }

            const overlappingPlacements = await strapi.entityService.findMany(
                "api::placement.placement",
                {
                    filters: overlapFilter,
                }
            );

            if (overlappingPlacements.length > 0) {
                throw new Error(
                    "Karyawan sudah memiliki penempatan aktif pada periode tersebut"
                );
            }
        }

        // Auto-set end_date when status_penempatan changes to 'selesai'
        if (
            data.status_penempatan === "selesai" &&
            !data.end_date &&
            !currentPlacement.end_date
        ) {
            data.end_date = new Date().toISOString().split("T")[0];
        }
    },

    /**
     * Triggered after placement update
     * Updates related data and sends notifications
     */
    async afterUpdate(event) {
        const { result, params } = event;

        // Update employee current project based on status_penempatan
        const employeeId = extractEmployeeId(result.employee);
        if (employeeId) {
            if (result.status_penempatan === "aktif") {
                await strapi.entityService.update(
                    "api::karyawan.karyawan",
                    employeeId,
                    {
                        data: {
                            current_project: result.project_name,
                            current_location: result.location,
                        },
                    }
                );
            } else if (
                result.status_penempatan === "selesai" ||
                result.status_penempatan === "dipindahkan"
            ) {
                // Clear current project if placement ended
                await strapi.entityService.update(
                    "api::karyawan.karyawan",
                    employeeId,
                    {
                        data: {
                            current_project: null,
                            current_location: null,
                        },
                    }
                );
            }
        }

        // Log placement update activity
        try {
            await strapi.entityService.create("api::laporan-kegiatan.laporan-kegiatan", {
                data: {
                    jenis_kegiatan: "Update Penempatan",
                    deskripsi: `Penempatan diupdate: Employee ID ${employeeId} - ${result.project_name}`,
                    tanggal_kegiatan: new Date().toISOString().split("T")[0],
                    status_kegiatan: "selesai",
                    karyawan: employeeId,
                },
            });
        } catch (error) {
            // Log error but don't fail the update
            console.error("Failed to create activity log:", error.message);
        }
    },

    /**
     * Triggered before placement deletion
     * Validates if placement can be deleted
     */
    async beforeDelete(event) {
        const { where } = event.params;

        // Get placement data
        const placement = await strapi.entityService.findOne(
            "api::placement.placement",
            where.id,
            {
                populate: ["employee"],
            }
        );

        if (!placement) {
            throw new Error("Penempatan tidak ditemukan");
        }

        // Prevent deletion of active placements
        if (placement.status_penempatan === "aktif") {
            throw new Error(
                "Tidak dapat menghapus penempatan yang masih aktif. Ubah status terlebih dahulu."
            );
        }

        // Check if placement has related records (attendance, etc.)
        const attendanceRecords = await strapi.entityService.findMany(
            "api::absensi.absensi",
            {
                filters: {
                    placement: where.id,
                },
            }
        );

        if (attendanceRecords.length > 0) {
            throw new Error(
                "Tidak dapat menghapus penempatan yang memiliki catatan absensi terkait"
            );
        }
    },

    /**
     * Triggered after placement deletion
     * Cleans up related data
     */
    async afterDelete(event) {
        const { result } = event;

        // Log placement deletion
        try {
            await strapi.entityService.create("api::laporan-kegiatan.laporan-kegiatan", {
                data: {
                    jenis_kegiatan: "Hapus Penempatan",
                    deskripsi: `Penempatan dihapus: ${result.project_name}`,
                    tanggal_kegiatan: new Date().toISOString().split("T")[0],
                    status_kegiatan: "selesai",
                },
            });
        } catch (error) {
            // Log error but don't fail the deletion
            console.error("Failed to create activity log:", error.message);
        }
    },
};
