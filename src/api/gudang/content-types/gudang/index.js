'use strict';

module.exports = {
  attributes: {
    // Auto-generate kode gudang before create
    beforeCreate: async (data) => {
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
    }
  }
};