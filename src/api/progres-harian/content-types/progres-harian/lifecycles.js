module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi tanggal tidak boleh di masa depan
        if (new Date(data.update_date) > new Date()) {
            throw new Error("Tanggal laporan tidak boleh di masa depan");
        }

        // Validasi progress increment
        // Removed validation: allow progress_after to be less than or equal to progress_before

        // Validasi persentase harus antara 0-100
        if (data.persentase_progres && (data.persentase_progres < 0 || data.persentase_progres > 100)) {
            throw new Error("Persentase harus antara 0-100");
        }

        // Set created_by dari user yang sedang login (gunakan username/email jika ada)
        if (event.state.user && !data.created_by) {
            data.created_by = event.state.user.username || event.state.user.email || 'System';
        }

        // Update unit progress automatically
        if (data.unit_rumah && data.progress_after !== undefined) {
            await strapi.entityService.update("api::unit-rumah.unit-rumah", data.unit_rumah, {
                data: { progress: data.progress_after },
            });
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Validasi persentase
        if (
            data.persentase_progres !== undefined &&
            (data.persentase_progres < 0 || data.persentase_progres > 100)
        ) {
            throw new Error("Persentase harus antara 0-100");
        }

        // Removed validation: allow updating with any progress_before and progress_after values
    },

    async afterCreate(event) {
        const { result } = event;

        // Update progress proyek secara otomatis
        // Note: Content Manager responses return relations as summary objects (e.g., { count }) or
        // document references. Resolve the actual project entry id from the payload instead.
        try {
            let projectRef = event?.params?.data?.proyek_perumahan;
            if (!projectRef && result?.proyek_perumahan) {
                // Try to use id if present from result
                projectRef = result.proyek_perumahan.id || result.proyek_perumahan.documentId || null;
            }

            let projectEntryId = null;
            if (typeof projectRef === "number") {
                projectEntryId = projectRef;
            } else if (typeof projectRef === "string" && projectRef) {
                // Treat as documentId; fetch to get internal numeric id
                const found = await strapi.entityService.findMany(
                    "api::proyek-perumahan.proyek-perumahan",
                    { filters: { documentId: projectRef }, limit: 1, fields: ["id"] }
                );
                projectEntryId = Array.isArray(found) && found.length > 0 ? found[0].id : null;
            }

            if (projectEntryId) {
                await strapi.service("api::progres-harian.progres-harian").updateProjectProgress(projectEntryId);
            }
        } catch (e) {
            // Non-fatal: skip project progress update if resolution fails
            strapi.log.warn(`Failed to resolve proyek_perumahan for progress update: ${e.message}`);
        }

        // Update stock material secara otomatis
        await strapi.service('api::progres-harian.progres-harian').updateMaterialStock(event.params.data.detail_penggunaan_material, 'subtract');

        // Log aktivitas jika ada service activity-log
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "CREATE_PROGRESS_REPORT",
                entity_type: "progres-harian",
                entity_id: result.id,
                description: `Laporan progress harian dibuat untuk ${result.proyek_perumahan?.project_name || "proyek"
                    }`,
            });
        } catch (error) {
            // Activity log service mungkin belum ada, skip logging
            console.log("Activity log service not available:", error.message);
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;

        // Update progress proyek (resolve id or documentId same as afterCreate)
        try {
            let projectRef = event?.params?.data?.proyek_perumahan;
            if (!projectRef && result?.proyek_perumahan) {
                projectRef = result.proyek_perumahan.id || result.proyek_perumahan.documentId || null;
            }

            let projectEntryId = null;
            if (typeof projectRef === "number") {
                projectEntryId = projectRef;
            } else if (typeof projectRef === "string" && projectRef) {
                const found = await strapi.entityService.findMany(
                    "api::proyek-perumahan.proyek-perumahan",
                    { filters: { documentId: projectRef }, limit: 1, fields: ["id"] }
                );
                projectEntryId = Array.isArray(found) && found.length > 0 ? found[0].id : null;
            }

            if (projectEntryId) {
                await strapi.service("api::progres-harian.progres-harian").updateProjectProgress(projectEntryId);
            }
        } catch (e) {
            strapi.log.warn(`Failed to resolve proyek_perumahan for progress update: ${e.message}`);
        }

        // Update stock material (handle changes in material usage)
        const oldMaterialDetails = result.detail_penggunaan_material || [];
        const newMaterialDetails = params.data.detail_penggunaan_material || [];

        // Restore old stock first
        await strapi.service('api::progres-harian.progres-harian').updateMaterialStock(oldMaterialDetails, 'add');
        // Then subtract new usage
        await strapi.service('api::progres-harian.progres-harian').updateMaterialStock(newMaterialDetails, 'subtract');

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "UPDATE_PROGRESS_REPORT",
                entity_type: "progres-harian",
                entity_id: result.id,
                description: `Laporan progress harian diperbarui untuk ${result.proyek_perumahan?.project_name || "proyek"
                    }`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Restore stock material when progress report is deleted
        await strapi.service('api::progres-harian.progres-harian').updateMaterialStock(result.detail_penggunaan_material, 'add');

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "DELETE_PROGRESS_REPORT",
                entity_type: "progres-harian",
                entity_id: result.id,
                description: `Laporan progress harian dihapus untuk ${result.proyek_perumahan?.project_name || "proyek"
                    }`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },
};
