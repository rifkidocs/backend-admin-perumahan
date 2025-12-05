'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

module.exports = {
  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  },
};
