'use strict';

/**
 * weather-condition service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::weather-condition.weather-condition');
