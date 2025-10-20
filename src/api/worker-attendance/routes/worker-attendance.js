'use strict';

/**
 * worker-attendance router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::worker-attendance.worker-attendance');
