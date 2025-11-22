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
    const { data, where } = event.params;

    // Validasi persentase
    if (
      data.persentase_progres !== undefined &&
      (data.persentase_progres < 0 || data.persentase_progres > 100)
    ) {
      throw new Error("Persentase harus antara 0-100");
    }

    // Store old record for stock restoration in afterUpdate
    // We need list_materials and gudang to restore stock
    const oldRecord = await strapi.entityService.findOne(
      "api::progres-harian.progres-harian",
      where.id,
      {
        populate: {
          list_materials: {
            populate: ["material"],
          },
          gudang: true,
        },
      }
    );
    event.params._oldRecord = oldRecord;
  },

  async afterCreate(event) {
    const { result, params } = event;

    // Update progress proyek secara otomatis
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

    // Update stock material secara otomatis
    // Need to ensure we have the gudang ID.
    // If params.data.gudang is provided, use it. Otherwise check result.gudang.
    const gudangId = params.data.gudang || result.gudang?.id || result.gudang;

    await strapi
      .service("api::progres-harian.progres-harian")
      .updateMaterialStock(params.data.list_materials, gudangId, "subtract");

    // Log aktivitas jika ada service activity-log
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

    // Update progress proyek
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

    // Update stock material (handle changes in material usage)
    const oldRecord = params._oldRecord;
    const oldMaterialDetails = oldRecord?.list_materials || [];
    const oldGudangId = oldRecord?.gudang?.id || oldRecord?.gudang;

    const newMaterialDetails = params.data.list_materials || oldMaterialDetails; // If not updated, use old
    // If gudang is updated in params, use it. Else use old gudang.
    const newGudangId = params.data.gudang || oldGudangId;

    // Restore old stock first (using old gudang)
    if (oldMaterialDetails.length > 0 && oldGudangId) {
      await strapi
        .service("api::progres-harian.progres-harian")
        .updateMaterialStock(oldMaterialDetails, oldGudangId, "add");
    }

    // Then subtract new usage (using new gudang)
    if (newMaterialDetails.length > 0 && newGudangId) {
      await strapi
        .service("api::progres-harian.progres-harian")
        .updateMaterialStock(newMaterialDetails, newGudangId, "subtract");
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

  async beforeDelete(event) {
    const { where } = event.params;

    const record = await strapi.entityService.findOne(
      "api::progres-harian.progres-harian",
      where.id,
      {
        populate: {
          list_materials: {
            populate: ["material"],
          },
          gudang: true,
        },
      }
    );
    event.params._recordToDelete = record;
  },

  async afterDelete(event) {
    const { params } = event;
    const record = params._recordToDelete;

    if (record && record.list_materials && record.gudang) {
      const gudangId = record.gudang.id || record.gudang;
      await strapi
        .service("api::progres-harian.progres-harian")
        .updateMaterialStock(record.list_materials, gudangId, "add");
    }

    // Log aktivitas
    try {
      await strapi.service("api::activity-log.activity-log").create({
        action: "DELETE_PROGRESS_REPORT",
        entity_type: "progres-harian",
        entity_id: record?.id,
        description: `Laporan progress harian dihapus`,
      });
    } catch (error) {
      console.log("Activity log service not available:", error.message);
    }
  },
};
