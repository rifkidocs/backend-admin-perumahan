'use strict';

strapi.log.info('[PertukaranJadwal] Lifecycle file loaded');

/**
 * Helper to extract ID from relation
 */
const getRelationId = (relation) => {
    if (!relation) return null;
    if (typeof relation === 'number' || typeof relation === 'string') return relation;
    if (relation.id) return relation.id;
    if (relation.documentId) return relation.documentId;
    return null;
};

module.exports = {
  async beforeUpdate(event) {
    const { params } = event;
    strapi.log.info(`[PertukaranJadwal] beforeUpdate triggered for ID: ${params.where?.id || params.where?.documentId}`);
    
    // FIX: Handle nested 'data' object that sometimes comes from Content Manager
    if (params.data && params.data.data) {
        strapi.log.info(`[PertukaranJadwal] Detected nested 'data' object. Flattening...`);
        const nestedData = params.data.data;
        // Merge nested data into parent data object
        Object.assign(params.data, nestedData);
        // Remove the nested reference to avoid confusion
        delete params.data.data;
    }

    strapi.log.info(`[PertukaranJadwal] beforeUpdate final data: ${JSON.stringify(params.data)}`);
    
    if (params.data && params.data.status_pertukaran) {
        strapi.log.info(`[PertukaranJadwal] Target status in beforeUpdate: ${params.data.status_pertukaran}`);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    strapi.log.info(`[PertukaranJadwal] afterUpdate result status: ${result.status_pertukaran}`);
    
    // Check both params.data and result for the status
    const status = params.data?.status_pertukaran || result.status_pertukaran;

    if (status === 'approved_by_target') {
      strapi.log.info(`[PertukaranJadwal] Executing schedule swap for ID: ${result.id}`);
      
      try {
        // Fetch full details
        const exchangeRequest = await strapi.db.query('api::pertukaran-jadwal.pertukaran-jadwal').findOne({
          where: { id: result.id },
          populate: ['requesting_schedule', 'target_schedule', 'requester', 'target_user'],
        });

        if (!exchangeRequest) {
            strapi.log.error(`[PertukaranJadwal] Record not found for ID: ${result.id}`);
            return;
        }

        const reqSchId = getRelationId(exchangeRequest.requesting_schedule);
        const tarSchId = getRelationId(exchangeRequest.target_schedule);
        const reqUsrId = getRelationId(exchangeRequest.requester);
        const tarUsrId = getRelationId(exchangeRequest.target_user);

        if (reqSchId && tarSchId && reqUsrId && tarUsrId) {
          strapi.log.info(`[PertukaranJadwal] Swapping Karyawan: ReqSch ${reqSchId} <-> TarSch ${tarSchId}`);

          // 1. Assign Target User to the Requester's Schedule
          await strapi.db.query('api::jadwal-security.jadwal-security').update({
            where: { id: reqSchId },
            data: { karyawan: tarUsrId }
          });

          // 2. Assign Requester to the Target's Schedule
          await strapi.db.query('api::jadwal-security.jadwal-security').update({
            where: { id: tarSchId },
            data: { karyawan: reqUsrId }
          });

          strapi.log.info(`[PertukaranJadwal] SUCCESS: Swap completed for Exchange ID ${result.id}`);
        } else {
          strapi.log.warn(`[PertukaranJadwal] ABORT: Missing relations for ID ${result.id}`);
        }
      } catch (error) {
        strapi.log.error(`[PertukaranJadwal] SWAP ERROR: ${error.message}`);
      }
    }
  },
};