"use strict";

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

// Helper to extract ID from various relation formats (Strapi v4/v5 compatibility)
function getRelationId(relationData) {
  if (!relationData) return null;
  if (typeof relationData === "number" || typeof relationData === "string") {
    return relationData;
  }

  if (typeof relationData === "object") {
    // Direct ID in object
    if (relationData.id) return relationData.id;
    
    // Strapi connect/set syntax
    if (Array.isArray(relationData.set) && relationData.set.length > 0) {
      return relationData.set[0].id;
    }
    if (Array.isArray(relationData.connect) && relationData.connect.length > 0) {
      return relationData.connect[0].id;
    }
  }
  return null;
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    console.log("DEBUG beforeCreate - data:", JSON.stringify(data, null, 2));

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
    const unitId = getRelationId(data.unit_rumah);
    if (unitId && data.progress_after !== undefined) {
      await strapi.entityService.update(
        "api::unit-rumah.unit-rumah",
        unitId,
        {
          data: { progress: data.progress_after },
        }
      );
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);

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

    console.log("DEBUG afterCreate - result:", JSON.stringify(result, null, 2));
    console.log("DEBUG afterCreate - params:", JSON.stringify(params, null, 2));

    // 1. Update progress proyek secara otomatis
    try {
      let projectRef = params?.data?.proyek_perumahan;
      let projectEntryId = getRelationId(projectRef);
      
      console.log("DEBUG afterCreate - Extracted projectEntryId from params:", projectEntryId);

      if (!projectEntryId && result?.proyek_perumahan) {
        projectEntryId = getRelationId(result.proyek_perumahan);
        console.log("DEBUG afterCreate - Extracted projectEntryId from result:", projectEntryId);
      }

      if (projectEntryId) {
        // Check if it's a string that might need lookup (though usually ID is sufficient)
        if (typeof projectEntryId === 'string' && isNaN(Number(projectEntryId))) {
             console.log("DEBUG afterCreate - Project ID is string, attempting lookup:", projectEntryId);
             const found = await strapi.entityService.findMany(
              "api::proyek-perumahan.proyek-perumahan",
              { filters: { id: projectEntryId }, limit: 1, fields: ["id"] }
             );
             if (Array.isArray(found) && found.length > 0) {
                 projectEntryId = found[0].id;
             }
        }

        await strapi
          .service("api::progres-harian.progres-harian")
          .updateProjectProgress(projectEntryId);
      }
    } catch (e) {
      strapi.log.warn(
        `Failed to resolve proyek_perumahan for progress update: ${e.message}`
      );
    }

    // Log aktivitas
    try {
      // Check if service exists before calling
      const activityLogService = strapi.service("api::activity-log.activity-log");
      if (activityLogService) {
        await activityLogService.create({
            action: "CREATE_PROGRESS_REPORT",
            entity_type: "progres-harian",
            entity_id: result.id,
            description: `Laporan progress harian dibuat untuk ${
            result.proyek_perumahan?.project_name || "proyek"
            }`,
        });
      }
    } catch (error) {
      console.log("Activity log error:", error.message);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // 1. Update progress proyek
    try {
      let projectRef = params?.data?.proyek_perumahan;
      let projectEntryId = getRelationId(projectRef);

      console.log("DEBUG afterUpdate - Extracted projectEntryId from params:", projectEntryId);

      if (!projectEntryId && result?.proyek_perumahan) {
        projectEntryId = getRelationId(result.proyek_perumahan);
        console.log("DEBUG afterUpdate - Extracted projectEntryId from result:", projectEntryId);
      }

      if (projectEntryId) {
         if (typeof projectEntryId === 'string' && isNaN(Number(projectEntryId))) {
             console.log("DEBUG afterUpdate - Project ID is string, attempting lookup:", projectEntryId);
             const found = await strapi.entityService.findMany(
              "api::proyek-perumahan.proyek-perumahan",
              { filters: { id: projectEntryId }, limit: 1, fields: ["id"] }
             );
             if (Array.isArray(found) && found.length > 0) {
                 projectEntryId = found[0].id;
             }
        }

        await strapi
          .service("api::progres-harian.progres-harian")
          .updateProjectProgress(projectEntryId);
      }
    } catch (e) {
      strapi.log.warn(
        `Failed to resolve proyek_perumahan for progress update: ${e.message}`
      );
    }

    // Log aktivitas
    try {
      const activityLogService = strapi.service("api::activity-log.activity-log");
      if (activityLogService) {
        await activityLogService.create({
            action: "UPDATE_PROGRESS_REPORT",
            entity_type: "progres-harian",
            entity_id: result.id,
            description: `Laporan progress harian diperbarui untuk ${
            result.proyek_perumahan?.project_name || "proyek"
            }`,
        });
      }
    } catch (error) {
      console.log("Activity log error:", error.message);
    }
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  },

  async afterDelete(event) {
    const { result } = event;

    // Log aktivitas
    try {
      const activityLogService = strapi.service("api::activity-log.activity-log");
      if (activityLogService) {
        await activityLogService.create({
            action: "DELETE_PROGRESS_REPORT",
            entity_type: "progres-harian",
            entity_id: result.id,
            description: `Laporan progress harian dihapus`,
        });
      }
    } catch (error) {
      console.log("Activity log error:", error.message);
    }
  },
};
