"use strict";

const {
  cleanupMediaOnDelete,
  cleanupMediaOnUpdate,
} = require("../../../../utils/mediaHelper");

/**
 * communication lifecycle callbacks
 */

module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    const leadData = params.data.lead;

    console.log("Communication Lifecycle Triggered for Lead Data:", JSON.stringify(leadData));

    if (leadData) {
      let leadId = null;

      // Handle various leadData formats in Strapi v5 (connect, set, array, or direct)
      if (typeof leadData === "string" || typeof leadData === "number") {
        leadId = leadData;
      } else if (Array.isArray(leadData) && leadData.length > 0) {
        leadId = leadData[0].documentId || leadData[0].id || leadData[0];
      } else if (typeof leadData === "object") {
        // Handle 'set' format: {"set":[{"id":8}]}
        if (leadData.set && Array.isArray(leadData.set) && leadData.set.length > 0) {
          leadId = leadData.set[0].documentId || leadData.set[0].id || leadData.set[0];
        } 
        // Handle 'connect' format
        else if (leadData.connect && Array.isArray(leadData.connect) && leadData.connect.length > 0) {
          leadId = leadData.connect[0].documentId || leadData.connect[0].id || leadData.connect[0];
        } else {
          leadId = leadData.documentId || leadData.id;
        }
      }

      if (leadId) {
        console.log("Resolved Lead Identifier:", leadId);

        let statusInteraksi = "chat";
        if (result.type === "telepon") statusInteraksi = "telepon";
        else if (result.type === "whatsapp") statusInteraksi = "chat";
        else if (result.type === "kunjungan") statusInteraksi = "visit";

        try {
          // Update the Lead Marketing record using direct db query
          // We use Number conversion for ID to be safe
          const updated = await strapi.db.query("api::lead-marketing.lead-marketing").update({
            where: {
              $or: [
                { documentId: leadId.toString() },
                { id: leadId }
              ]
            },
            data: {
              last_follow_up: result.date || new Date().toISOString().split("T")[0],
              status_interaksi: statusInteraksi,
            },
          });
          
          if (updated) {
            console.log("Successfully updated Lead record status and date.");
          } else {
            console.warn("No Lead record found to update with identifier:", leadId);
          }
        } catch (error) {
          console.error("Error in Lead update lifecycle:", error.message);
        }
      }
    } else {
      console.warn("No lead linked in the communication data.");
    }
  },

  async beforeUpdate(event) {
    // Cleanup old media files when updating
    await cleanupMediaOnUpdate(event);
  },

  async beforeDelete(event) {
    // Cleanup media files when deleting
    await cleanupMediaOnDelete(event);
  },
};
