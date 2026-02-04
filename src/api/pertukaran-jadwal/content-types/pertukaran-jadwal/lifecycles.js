'use strict';

module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;

    // Check if the status was updated to 'approved_by_target'
    // We check params.data.status to ensure this specific update triggered the change
    if (params.data && params.data.status === 'approved_by_target') {
      try {
        // Fetch the full relation details needed for the swap
        const exchangeRequest = await strapi.entityService.findOne(
          'api::pertukaran-jadwal.pertukaran-jadwal',
          result.id,
          {
            populate: ['requesting_schedule', 'target_schedule', 'requester', 'target_user'],
          }
        );

        if (
          exchangeRequest &&
          exchangeRequest.requesting_schedule &&
          exchangeRequest.target_schedule &&
          exchangeRequest.requester &&
          exchangeRequest.target_user
        ) {
          // 1. Assign Target User to the Requester's Schedule
          await strapi.entityService.update(
            'api::jadwal-security.jadwal-security',
            exchangeRequest.requesting_schedule.id,
            {
              data: {
                karyawan: exchangeRequest.target_user.id,
              },
            }
          );

          // 2. Assign Requester to the Target's Schedule
          await strapi.entityService.update(
            'api::jadwal-security.jadwal-security',
            exchangeRequest.target_schedule.id,
            {
              data: {
                karyawan: exchangeRequest.requester.id,
              },
            }
          );

          strapi.log.info(
            `Schedule swap executed for Exchange ID ${result.id}: User ${exchangeRequest.requester.id} <-> User ${exchangeRequest.target_user.id}`
          );
        } else {
            strapi.log.warn(`Schedule swap failed for Exchange ID ${result.id}: Missing relations.`);
        }
      } catch (error) {
        strapi.log.error(`Error in pertukaran-jadwal lifecycle afterUpdate: ${error.message}`);
      }
    }
  },
};
