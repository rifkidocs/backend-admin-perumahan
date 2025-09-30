'use strict';

/**
 * performance-review service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::performance-review.performance-review');
