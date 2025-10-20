'use strict';

/**
 * weather-condition controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::weather-condition.weather-condition');
