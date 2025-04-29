const { mergeConfig } = require("vite");

module.exports = (config) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    server: {
      allowedHosts: ["perumahan.rifkidocs.eu.org"], // Menambahkan host yang diizinkan
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });
};
