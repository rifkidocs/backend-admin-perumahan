'use strict';

/**
 * rab service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rab.rab');
