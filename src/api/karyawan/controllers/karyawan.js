'use strict';

/**
 * karyawan controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::karyawan.karyawan', ({ strapi }) => ({
  async findSchedulable(ctx) {
    const { data, meta } = await super.find({
      ...ctx,
      query: {
        ...ctx.query,
        filters: {
          ...ctx.query.filters,
          can_be_scheduled: true
        },
        populate: ['jabatan', 'shift_preference']
      }
    });

    return { data, meta };
  }
}));
