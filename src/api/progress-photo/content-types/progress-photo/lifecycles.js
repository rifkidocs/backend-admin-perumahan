module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi minimal 1 foto
        if (!data.foto || data.foto.length === 0) {
            throw new Error("Minimal harus ada 1 foto");
        }

        // Set jumlah foto secara otomatis
        data.jumlah_foto = data.foto.length;

        // Validasi ukuran foto (maksimal 10MB per foto)
        for (const foto of data.foto) {
            if (foto.size > 10 * 1024 * 1024) {
                throw new Error(
                    `Foto ${foto.name} terlalu besar. Maksimal 10MB per foto`
                );
            }
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update jumlah foto jika ada perubahan
        if (data.foto !== undefined) {
            data.jumlah_foto = data.foto.length;
        }

        // Validasi ukuran foto
        if (data.foto) {
            for (const foto of data.foto) {
                if (foto.size > 10 * 1024 * 1024) {
                    throw new Error(
                        `Foto ${foto.name} terlalu besar. Maksimal 10MB per foto`
                    );
                }
            }
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Generate thumbnail untuk foto
        try {
            await strapi
                .service("api::progress-photo.progress-photo")
                .generateThumbnails(result.foto);
        } catch (error) {
            console.log("Thumbnail generation service not available:", error.message);
        }

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "CREATE_PROGRESS_PHOTO",
                entity_type: "progress-photo",
                entity_id: result.id,
                description: `Foto progress diunggah: ${result.jumlah_foto} foto untuk ${result.judul}`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Hapus file foto dari storage
        if (result.foto && result.foto.length > 0) {
            for (const foto of result.foto) {
                try {
                    await strapi.plugins.upload.services.upload.remove(foto);
                } catch (error) {
                    console.log("Error removing photo:", error.message);
                }
            }
        }

        // Log aktivitas
        try {
            await strapi.service("api::activity-log.activity-log").create({
                action: "DELETE_PROGRESS_PHOTO",
                entity_type: "progress-photo",
                entity_id: result.id,
                description: `Foto progress dihapus: ${result.judul}`,
            });
        } catch (error) {
            console.log("Activity log service not available:", error.message);
        }
    },
};
