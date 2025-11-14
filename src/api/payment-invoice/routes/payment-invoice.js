'use strict';

/**
 * payment-invoice router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::payment-invoice.payment-invoice', {
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
    // Custom routes for Tagihan & Hutang functionality
    'overdue': {
      method: 'GET',
      path: '/overdue',
      handler: 'payment-invoice.findOverdue',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'update-payment': {
      method: 'PUT',
      path: '/:id/update-payment',
      handler: 'payment-invoice.updatePayment',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'by-supplier': {
      method: 'GET',
      path: '/supplier/:supplierId',
      handler: 'payment-invoice.findBySupplier',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'by-project': {
      method: 'GET',
      path: '/project/:projectId',
      handler: 'payment-invoice.findByProject',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'by-status': {
      method: 'GET',
      path: '/status/:status',
      handler: 'payment-invoice.findByStatus',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'payment-summary': {
      method: 'GET',
      path: '/summary',
      handler: 'payment-invoice.getPaymentSummary',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'approve': {
      method: 'PUT',
      path: '/:id/approve',
      handler: 'payment-invoice.approveInvoice',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: []
        }
      }
    },
    'cancel': {
      method: 'PUT',
      path: '/:id/cancel',
      handler: 'payment-invoice.cancelInvoice',
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