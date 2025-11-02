'use strict';

/**
 * stock-opname router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::stock-opname.stock-opname', {
  config: {
    find: {
      middlewares: [],
      policies: [],
      auth: {
        scope: []
      }
    },
    findOne: {
      middlewares: [],
      policies: [],
      auth: {
        scope: []
      }
    },
    create: {
      middlewares: [],
      policies: [],
      auth: {
        scope: []
      }
    },
    update: {
      middlewares: [],
      policies: [],
      auth: {
        scope: []
      }
    },
    delete: {
      middlewares: [],
      policies: [],
      auth: {
        scope: []
      }
    },
    // Custom routes
    'generate-report': {
      method: 'GET',
      path: '/:id/generate-report',
      handler: 'stock-opname.generateReport',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    }
  }
});