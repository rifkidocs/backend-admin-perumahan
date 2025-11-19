'use strict';

/**
 * gudang router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::gudang.gudang', {
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
    'get-by-jenis/:jenis': {
      method: 'GET',
      path: '/jenis/:jenis',
      handler: 'gudang.findByJenis',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'get-active': {
      method: 'GET',
      path: '/active',
      handler: 'gudang.findActive',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'get-by-proyek/:proyekId': {
      method: 'GET',
      path: '/proyek/:proyekId',
      handler: 'gudang.findByProyek',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'get-stats': {
      method: 'GET',
      path: '/stats',
      handler: 'gudang.getStats',
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