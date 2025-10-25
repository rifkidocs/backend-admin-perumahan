'use strict';

/**
 * unit-pricing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::unit-pricing.unit-pricing');
