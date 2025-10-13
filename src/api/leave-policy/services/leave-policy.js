'use strict';

/**
 * leave-policy service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::leave-policy.leave-policy');
