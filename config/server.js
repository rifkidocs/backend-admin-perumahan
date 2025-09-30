module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  // url: ("https://backend-perumahan.rifkidocs.eu.org"),
  port: env.int('PORT', 1340),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
