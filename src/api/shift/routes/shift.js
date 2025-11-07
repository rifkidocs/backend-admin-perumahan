module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/shifts',
      handler: 'shift.find',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    },
    {
      method: 'GET',
      path: '/shifts/:id',
      handler: 'shift.findOne',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    },
    {
      method: 'POST',
      path: '/shifts',
      handler: 'shift.create',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    },
    {
      method: 'PUT',
      path: '/shifts/:id',
      handler: 'shift.update',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    },
    {
      method: 'DELETE',
      path: '/shifts/:id',
      handler: 'shift.delete',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    },
    {
      method: 'GET',
      path: '/shifts/active',
      handler: 'shift.findActive',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['admin']
        }
      }
    }
  ]
};