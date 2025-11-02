'use strict';

/**
 * stock-opname-item router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::stock-opname-item.stock-opname-item', {
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
    'create-batch': {
      method: 'POST',
      path: '/batch',
      handler: 'stock-opname-item.createBatch',
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