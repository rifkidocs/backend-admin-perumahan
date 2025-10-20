'use strict';

/**
 * worker-attendance controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::worker-attendance.worker-attendance');
