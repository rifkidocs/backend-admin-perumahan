'use strict';

/**
 * kas-keluar router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::kas-keluar.kas-keluar', {
  config: {
    find: {
      policies: [],
      middlewares: [],
      auth: {
        scope: []
      }
    },
    findOne: {
      policies: [],
      middlewares: [],
      auth: {
        scope: []
      }
    },
    create: {
      policies: [],
      middlewares: [],
      auth: {
        scope: []
      }
    },
    update: {
      policies: [],
      middlewares: [],
      auth: {
        scope: []
      }
    },
    delete: {
      policies: [],
      middlewares: [],
      auth: {
        scope: []
      }
    },
    // Custom routes
    'batch-approval': {
      method: 'POST',
      path: '/batch-approval',
      handler: 'kas-keluar.batchApproval',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'category-report': {
      method: 'GET',
      path: '/category-report',
      handler: 'kas-keluar.categoryReport',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'urgent-transactions': {
      method: 'GET',
      path: '/urgent-transactions',
      handler: 'kas-keluar.urgentTransactions',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'cash-flow-summary': {
      method: 'GET',
      path: '/cash-flow-summary',
      handler: 'kas-keluar.cashFlowSummary',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'check-duplicate-invoice': {
      method: 'GET',
      path: '/check-duplicate-invoice',
      handler: 'kas-keluar.checkDuplicateInvoice',
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
