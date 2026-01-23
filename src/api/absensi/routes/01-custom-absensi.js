'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/absensis/:id/patrol',
      handler: 'absensi.addPatrolReport',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
