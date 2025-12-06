module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/karyawans/:id/create-admin-account',
      handler: 'karyawan.createAdminAccount',
      config: {
        auth: false, // WARNING: Disabling auth for development/testing. Secure this in production!
        policies: [],
        middlewares: [],
      },
    },
  ],
};
