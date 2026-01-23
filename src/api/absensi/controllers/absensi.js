'use strict';

/**
 * absensi controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::absensi.absensi', ({ strapi }) => ({
  async addPatrolReport(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data || !data.foto || !data.lokasi) {
      return ctx.badRequest('Foto and lokasi are required for patrol report');
    }

    try {
      // Find the entry with existing reports
      // Try finding by documentId (Strapi 5) first, then fallback to id
      let entry = await strapi.db.query('api::absensi.absensi').findOne({
        where: {
          $or: [
            { documentId: id },
            { id: id }
          ]
        },
        populate: ['laporan_patroli'],
      });

      if (!entry) {
        return ctx.notFound('Absensi record not found');
      }

      const currentReports = entry.laporan_patroli || [];
      const newReport = {
        ...data,
        waktu_laporan: data.waktu_laporan || new Date().toISOString()
      };

      // In Strapi, updating a repeatable component via db.query or entityService
      // usually requires passing the whole array if you want to keep existing items.
      const updatedEntry = await strapi.db.query('api::absensi.absensi').update({
        where: { id: entry.id },
        data: {
          laporan_patroli: [...currentReports, newReport],
        },
        populate: ['laporan_patroli'],
      });

      return ctx.send({ data: updatedEntry });
    } catch (err) {
      strapi.log.error('Error in addPatrolReport:', err);
      return ctx.internalServerError('Failed to add patrol report');
    }
  },
}));

