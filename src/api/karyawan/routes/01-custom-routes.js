module.exports = {
  routes: [
    {
      method: "POST",
      path: "/karyawans/:id/reset-admin-password",
      handler: "karyawan.resetAdminPassword",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
