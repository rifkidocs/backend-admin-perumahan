'use strict';

/**
 * transfer-dana service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transfer-dana.transfer-dana');
