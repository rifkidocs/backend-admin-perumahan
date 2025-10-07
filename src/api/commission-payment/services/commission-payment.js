'use strict';

/**
 * commission-payment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::commission-payment.commission-payment');
