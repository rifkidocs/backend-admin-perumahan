module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal tidak boleh di masa depan
    if (new Date(data.update_date) > new Date()) {
      throw new Error("Tanggal laporan tidak boleh di masa depan");
    }

    // Validasi persentase harus antara 0-100
    if (
      data.persentase_progres &&
      (data.persentase_progres < 0 || data.persentase_progres > 100)
    ) {
      throw new Error("Persentase harus antara 0-100");
    }

    // Set created_by dari user yang sedang login (gunakan username/email jika ada)
    if (event.state.user && !data.created_by) {
      data.created_by =
        event.state.user.username || event.state.user.email || "System";
    }

    // Update unit progress automatically
    if (data.unit_rumah && data.progress_after !== undefined) {
      await strapi.entityService.update(
        "api::unit-rumah.unit-rumah",
        data.unit_rumah,
        {
          data: { progress: data.progress_after },
        }
      );
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
  },

  async afterCreate(event) {
    const { result, params } = event;

    // 1. Update progress proyek secara otomatis
    try {
      let projectRef = params?.data?.proyek_perumahan;
      if (!projectRef && result?.proyek_perumahan) {
        projectRef =
          result.proyek_perumahan.id ||
          result.proyek_perumahan.documentId ||
          null;
      }

      let projectEntryId = null;
      if (typeof projectRef === "number") {
        projectEntryId = projectRef;
      } else if (typeof projectRef === "string" && projectRef) {
        const found = await strapi.entityService.findMany(
          "api::proyek-perumahan.proyek-perumahan",
          { filters: { documentId: projectRef }, limit: 1, fields: ["id"] }
        );
        projectEntryId =
          Array.isArray(found) && found.length > 0 ? found[0].id : null;
      }

      if (projectEntryId) {
        await strapi
          .service("api::progres-harian.progres-harian")
          .updateProjectProgress(projectEntryId);
      }
    } catch (e) {
      strapi.log.warn(
        `Failed to resolve proyek_perumahan for progress update: ${e.message}`
      );
    }

    // 2. Create Pengeluaran Material if materials are used
    if (result.list_materials && result.list_materials.length > 0) {
      try {
        const pengeluaranData = {
          date: result.update_date,
          time: new Date().toTimeString().split(" ")[0], // Current time
          project: result.proyek_perumahan,
          unit_rumah: result.unit_rumah,
          list_materials: result.list_materials, // Structure should match now
          requester: result.mandor || result.created_by || "System",
          approvalStatus: "approved", // Auto-approve
          status_issuance: "Selesai", // Auto-complete
          notes: `Auto-generated from Progres Harian ID: ${result.id}`,
          progres_harian: result.id,
        };

        await strapi.entityService.create(
          "api::pengeluaran-material.pengeluaran-material",
          {
            data: pengeluaranData,
          }
        );
      } catch (error) {
        strapi.log.error(
          "Failed to create pengeluaran-material from progres-harian:",
          error
        );
      }
    }

    // Log aktivitas
    try {
      await strapi.service("api::activity-log.activity-log").create({
        action: "CREATE_PROGRESS_REPORT",
        entity_type: "progres-harian",
        entity_id: result.id,
        description: `Laporan progress harian dibuat untuk ${
          result.proyek_perumahan?.project_name || "proyek"
        }`,
      });
    } catch (error) {
      console.log("Activity log service not available:", error.message);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // 1. Update progress proyek
    try {
      let projectRef = params?.data?.proyek_perumahan;
      if (!projectRef && result?.proyek_perumahan) {
        projectRef =
          result.proyek_perumahan.id ||
          result.proyek_perumahan.documentId ||
          null;
      }

      let projectEntryId = null;
      if (typeof projectRef === "number") {
        projectEntryId = projectRef;
      } else if (typeof projectRef === "string" && projectRef) {
        const found = await strapi.entityService.findMany(
          "api::proyek-perumahan.proyek-perumahan",
          { filters: { documentId: projectRef }, limit: 1, fields: ["id"] }
        );
        projectEntryId =
          Array.isArray(found) && found.length > 0 ? found[0].id : null;
      }

      if (projectEntryId) {
        await strapi
          .service("api::progres-harian.progres-harian")
          .updateProjectProgress(projectEntryId);
      }
    } catch (e) {
      strapi.log.warn(
        `Failed to resolve proyek_perumahan for progress update: ${e.message}`
      );
    }

    // 2. Sync with Pengeluaran Material
    // Find linked pengeluaran
    const linkedPengeluaran = await strapi.db
      .query("api::pengeluaran-material.pengeluaran-material")
      .findOne({
        where: { progres_harian: result.id },
      });

    if (result.list_materials && result.list_materials.length > 0) {
      const pengeluaranData = {
        date: result.update_date,
        project: result.proyek_perumahan,
        unit_rumah: result.unit_rumah,
        list_materials: result.list_materials,
        requester: result.mandor || result.created_by || "System",
      };

      if (linkedPengeluaran) {
        // Update existing
        await strapi.entityService.update(
          "api::pengeluaran-material.pengeluaran-material",
          linkedPengeluaran.id,
          {
            data: pengeluaranData,
          }
        );
      } else {
        // Create new if not exists (e.g. added materials later)
        await strapi.entityService.create(
          "api::pengeluaran-material.pengeluaran-material",
          {
            data: {
              ...pengeluaranData,
              time: new Date().toTimeString().split(" ")[0],
              approvalStatus: "approved",
              status_issuance: "Selesai",
              notes: `Auto-generated from Progres Harian ID: ${result.id}`,
              progres_harian: result.id,
            },
          }
        );
      }
    } else if (linkedPengeluaran) {
      // If materials removed, delete the linked pengeluaran
      await strapi.entityService.delete(
        "api::pengeluaran-material.pengeluaran-material",
        linkedPengeluaran.id
      );
    }

    // Log aktivitas
    try {
      await strapi.service("api::activity-log.activity-log").create({
        action: "UPDATE_PROGRESS_REPORT",
        entity_type: "progres-harian",
        entity_id: result.id,
        description: `Laporan progress harian diperbarui untuk ${
          result.proyek_perumahan?.project_name || "proyek"
        }`,
      });
    } catch (error) {
      console.log("Activity log service not available:", error.message);
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Delete linked Pengeluaran Material
    const linkedPengeluaran = await strapi.db
      .query("api::pengeluaran-material.pengeluaran-material")
      .findOne({
        where: { progres_harian: result.id },
      });

    if (linkedPengeluaran) {
      await strapi.entityService.delete(
        "api::pengeluaran-material.pengeluaran-material",
        linkedPengeluaran.id
      );
    }

    // Log aktivitas
    try {
      await strapi.service("api::activity-log.activity-log").create({
        action: "DELETE_PROGRESS_REPORT",
        entity_type: "progres-harian",
        entity_id: result.id,
        description: `Laporan progress harian dihapus`,
      });
    } catch (error) {
      console.log("Activity log service not available:", error.message);
    }
  },
};
