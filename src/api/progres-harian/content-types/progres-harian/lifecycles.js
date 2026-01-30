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

    // 2. Create Pengeluaran Material if materials are used
    if (result.list_materials && result.list_materials.length > 0) {
      try {
        // Determine requester name safely
        let requesterName = "System";
        
        // Try to get from mandor (params preferred as it has the ID)
        const mandorId = getRelationId(params?.data?.mandor) || getRelationId(result.mandor);
        
        if (mandorId) {
          const mandor = await strapi.entityService.findOne("api::pekerja.pekerja", mandorId, {
            fields: ["nama_lengkap"],
          });
          if (mandor) {
            requesterName = mandor.nama_lengkap || `Mandor #${mandorId}`;
          }
        } else {
          // Fallback to creator
           const userId = getRelationId(params?.data?.created_by) || getRelationId(result.createdBy);
           if (userId) {
             const user = await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
                fields: ["username", "email", "firstname", "lastname"]
             });
             if (user) {
                 requesterName = user.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : (user.username || user.email);
             }
           } else if (typeof result.createdBy === 'object' && result.createdBy.firstname) {
                requesterName = `${result.createdBy.firstname} ${result.createdBy.lastname || ''}`.trim();
           } else if (typeof result.createdBy === 'string') {
               requesterName = result.createdBy;
           }
        }

        // Fetch full progress data to ensure we have all material details (especially relation IDs)
        // result.list_materials might have partial data or counts, and params.data.list_materials might be incomplete/dirty
        const fullProgres = await strapi.entityService.findOne("api::progres-harian.progres-harian", result.id, {
          populate: {
            foto_dokumentasi: true,
            list_materials: {
              populate: {
                material_gudang: true,
                material: true,
                nota: true
              }
            }
          }
        });

        const mappedMaterials = (fullProgres.list_materials || []).map(item => ({
           ...item,
           id: undefined, // Clear ID to create new component instances
           material_gudang: getRelationId(item.material_gudang),
           material: getRelationId(item.material),
           nota: item.nota ? (Array.isArray(item.nota) ? item.nota.map(n => n.id) : [item.nota.id]) : []
        }));

        // Robustly get project and unit IDs
        const projectId = getRelationId(params?.data?.proyek_perumahan) || getRelationId(result.proyek_perumahan);
        const unitId = getRelationId(params?.data?.unit_rumah) || getRelationId(result.unit_rumah);

        const pengeluaranData = {
          date: result.update_date,
          time: new Date().toTimeString().split(" ")[0], // Current time
          project: projectId,
          unit_rumah: unitId,
          list_materials: mappedMaterials, 
          requester: requesterName,
          approvalStatus: "approved", // Auto-approve
          status_issuance: "Selesai", // Auto-complete
          notes: `Auto-generated from Progres Harian ID: ${result.id}`,
          progres_harian: result.id,
          documents: fullProgres.foto_dokumentasi ? fullProgres.foto_dokumentasi.map(f => f.id) : []
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

    // 2. Sync with Pengeluaran Material
    // Find linked pengeluaran
    const linkedPengeluaran = await strapi.db
      .query("api::pengeluaran-material.pengeluaran-material")
      .findOne({
        where: { progres_harian: result.id },
      });

    if (result.list_materials && result.list_materials.length > 0) {
        
      // Determine requester name safely for update (same logic)
      let requesterName = "System";
      const mandorId = getRelationId(params?.data?.mandor) || getRelationId(result.mandor);
      if (mandorId) {
          const mandor = await strapi.entityService.findOne("api::pekerja.pekerja", mandorId, { fields: ["nama_lengkap"] });
          if (mandor) requesterName = mandor.nama_lengkap || `Mandor #${mandorId}`;
      } else {
          const userId = getRelationId(params?.data?.created_by) || getRelationId(result.createdBy);
           if (userId) {
             const user = await strapi.entityService.findOne("plugin::users-permissions.user", userId, {
                fields: ["username", "email", "firstname", "lastname"]
             });
             if (user) {
                 requesterName = user.firstname ? `${user.firstname} ${user.lastname || ''}`.trim() : (user.username || user.email);
             }
           } else if (typeof result.createdBy === 'object' && result.createdBy.firstname) {
                requesterName = `${result.createdBy.firstname} ${result.createdBy.lastname || ''}`.trim();
           } else if (typeof result.createdBy === 'string') {
               requesterName = result.createdBy;
           }
      }

      // Robustly get project and unit IDs
      const projectId = getRelationId(params?.data?.proyek_perumahan) || getRelationId(result.proyek_perumahan);
      const unitId = getRelationId(params?.data?.unit_rumah) || getRelationId(result.unit_rumah);

      // Fetch full progress data to ensure we have all material details and media
      const fullProgres = await strapi.entityService.findOne("api::progres-harian.progres-harian", result.id, {
        populate: {
          foto_dokumentasi: true,
          list_materials: {
            populate: {
              material_gudang: true,
              material: true,
              nota: true
            }
          }
        }
      });

      const mappedMaterials = (fullProgres.list_materials || []).map(item => ({
        ...item,
        id: undefined,
        material_gudang: getRelationId(item.material_gudang),
        material: getRelationId(item.material),
        nota: item.nota ? (Array.isArray(item.nota) ? item.nota.map(n => n.id) : [item.nota.id]) : []
      }));

      const pengeluaranData = {
        date: result.update_date,
        project: projectId,
        unit_rumah: unitId,
        requester: requesterName,
        list_materials: mappedMaterials,
        documents: fullProgres.foto_dokumentasi ? fullProgres.foto_dokumentasi.map(f => f.id) : []
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

    // Delete linked Pengeluaran Material
    const linkedPengeluaran = await strapi.db
      .query("api::pengeluaran-material.pengeluaran-material")
      .findOne({
        where: { progres_harian: result.id },
      });

    if (linkedPengeluaran) {
      try {
        await strapi.entityService.delete(
          "api::pengeluaran-material.pengeluaran-material",
          linkedPengeluaran.id
        );
        console.log(`Linked Pengeluaran Material ID ${linkedPengeluaran.id} deleted.`);
      } catch (err) {
        console.error(`Failed to delete linked Pengeluaran Material ID ${linkedPengeluaran.id}:`, err);
      }
    } else {
       console.log(`No linked Pengeluaran Material found for Progres Harian ID ${result.id} to delete.`);
    }

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
