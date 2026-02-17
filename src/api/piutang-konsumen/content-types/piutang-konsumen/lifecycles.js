'use strict';

const { cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
  },

  async afterUpdate(event) {
    // Logic for updating totals or other related entities can go here
    // Payment history and kas-masuk creation is now handled by api::riwayat-pembayaran
  }
};
