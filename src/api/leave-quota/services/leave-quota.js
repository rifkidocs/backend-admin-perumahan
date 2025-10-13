'use strict';

/**
 * leave-quota service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::leave-quota.leave-quota');
