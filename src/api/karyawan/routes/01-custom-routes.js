module.exports = {
  routes: [
    {
      method: "POST",
      path: "/karyawans/:id/reset-admin-password",
      handler: "karyawan.resetAdminPassword",
      config: {
        auth: false, // WARNING: Disabling auth for development/testing. Secure this in production!
        policies: [],
        middlewares: [],
      },
    },
  ],
};
