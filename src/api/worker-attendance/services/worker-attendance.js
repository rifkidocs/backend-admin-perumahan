'use strict';

/**
 * worker-attendance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::worker-attendance.worker-attendance');
