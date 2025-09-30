'use strict';

/**
 * communication router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::communication.communication');
