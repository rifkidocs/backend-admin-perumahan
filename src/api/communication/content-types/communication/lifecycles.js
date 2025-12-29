"use strict";

const {
  cleanupMediaOnDelete,
  cleanupMediaOnUpdate,
} = require("../../../../utils/mediaHelper");

/**
 * communication lifecycle callbacks
 */

module.exports = {
  async beforeUpdate(event) {
    // Cleanup old media files when updating
    await cleanupMediaOnUpdate(event);
  },

  async beforeDelete(event) {
    // Cleanup media files when deleting
    await cleanupMediaOnDelete(event);
  },
};
