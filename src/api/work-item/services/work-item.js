'use strict';

/**
 * work-item service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::work-item.work-item');
