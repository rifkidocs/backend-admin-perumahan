'use strict';

/**
 * weather-condition router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::weather-condition.weather-condition');
