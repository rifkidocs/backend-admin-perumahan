'use strict';

/**
 * gudang controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::gudang.gudang', ({ strapi }) => ({
  // Method untuk mendapatkan gudang berdasarkan jenis
  async findByJenis(ctx) {
    const { jenis } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::gudang.gudang').find({
      ...query,
      filters: {
        ...query.filters,
        jenis_gudang: jenis
      }
    });

    const sanitizedResults = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedResults);
  },

  // Method untuk mendapatkan gudang aktif
  async findActive(ctx) {
    const { query } = ctx;

    const entity = await strapi.service('api::gudang.gudang').find({
      ...query,
      filters: {
        ...query.filters,
        status_gudang: 'Aktif',
        is_active: true
      }
    });

    const sanitizedResults = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedResults);
  },

  // Method untuk mendapatkan gudang berdasarkan proyek
  async findByProyek(ctx) {
    const { proyekId } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::gudang.gudang').find({
      ...query,
      filters: {
        ...query.filters,
        proyek_perumahan: proyekId
      }
    });

    const sanitizedResults = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedResults);
  },

  // Override create method untuk auto-generate kode
  async create(ctx) {
    const { data } = ctx.request.body;

    // Auto-generate kode gudang jika tidak ada
    if (!data.kode_gudang) {
      const lastGudang = await strapi.query('api::gudang.gudang')
        .findMany({
          orderBy: { id: 'desc' },
          limit: 1
        });

      const nextNumber = lastGudang.length > 0
        ? parseInt(lastGudang[0].kode_gudang?.replace('GD-', '') || 0) + 1
        : 1;

      data.kode_gudang = `GD-${String(nextNumber).padStart(4, '0')}`;
    }

    // Set default values
    if (!data.status_gudang) {
      data.status_gudang = 'Aktif';
    }
    if (data.is_active === undefined) {
      data.is_active = true;
    }

    return super.create(ctx);
  },

  // Custom method untuk mendapatkan statistik gudang
  async getStats(ctx) {
    const totalGudang = await strapi.query('api::gudang.gudang').count({
      where: { is_active: true }
    });

    const gudangInduk = await strapi.query('api::gudang.gudang').count({
      where: {
        jenis_gudang: 'Gudang Induk',
        is_active: true
      }
    });

    const gudangProyek = await strapi.query('api::gudang.gudang').count({
      where: {
        jenis_gudang: 'Gudang Proyek',
        is_active: true
      }
    });

    const gudangAktif = await strapi.query('api::gudang.gudang').count({
      where: {
        status_gudang: 'Aktif',
        is_active: true
      }
    });

    ctx.send({
      data: {
        total_gudang: totalGudang,
        gudang_induk: gudangInduk,
        gudang_proyek: gudangProyek,
        gudang_aktif: gudangAktif
      }
    });
  }
}));