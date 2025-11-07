'use strict';

/**
 * karyawan router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::karyawan.karyawan', {
  config: {
    find: {
      middlewares: [],
      policies: [],
      auth: {
        scope: ['admin']
      }
    },
    findOne: {
      middlewares: [],
      policies: [],
      auth: {
        scope: ['admin']
      }
    },
    create: {
      middlewares: [],
      policies: [],
      auth: {
        scope: ['admin']
      }
    },
    update: {
      middlewares: [],
      policies: [],
      auth: {
        scope: ['admin']
      }
    },
    delete: {
      middlewares: [],
      policies: [],
      auth: {
        scope: ['admin']
      }
    }
  },
  routes: [
    {
      method: 'GET',
      path: '/karyawans/schedulable',
      handler: 'karyawan.findSchedulable',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    }
  ]
});