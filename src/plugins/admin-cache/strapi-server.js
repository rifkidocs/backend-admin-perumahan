'use strict';

/**
 * Admin Cache Plugin
 * Caches slow Content Manager GET requests with per-user isolation.
 */

const LRUCache = require('lru-cache');
const crypto = require('crypto');

module.exports = () => {
  // Initialize LRU Cache (Older version uses maxAge instead of ttl)
  const cache = new LRUCache({
    max: 1000,
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  return {
    register({ strapi }) {
      strapi.log.info('Admin Cache Plugin: Registering...');
    },

    async bootstrap({ strapi }) {
      strapi.log.info('Admin Cache Plugin: Bootstrapping...');

      // Global Purge Function
      strapi.plugin('admin-cache').purge = () => {
        cache.reset();
        strapi.log.info('Admin Cache: Global Purge Executed');
      };

      // Add Middleware to the Strapi middleware stack
      strapi.server.use(async (ctx, next) => {
        const { method, path, query } = ctx;

        // 1. Identify Target Routes (Content Manager Collection/Single Types)
        const isContentManagerApi = path.startsWith('/content-manager/collection-types/') || 
                                     path.startsWith('/content-manager/single-types/');
        
        if (!isContentManagerApi) {
          return await next();
        }

        // 2. Handle Invalidation (POST, PUT, PATCH, DELETE)
        const isCudOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        if (isCudOperation) {
          await next();
          
          // Only purge on successful CUD operations
          if (ctx.status >= 200 && ctx.status < 300) {
            strapi.plugin('admin-cache').purge();
          }
          return;
        }

        // 3. Handle Caching (GET)
        if (method === 'GET') {
          // Per-User Isolation: Use user ID from state (populated by admin auth)
          const userId = ctx.state?.user?.id || 'anonymous';
          
          // Generate Cache Key (User + Path + Query)
          const queryString = JSON.stringify(query);
          const rawKey = `${userId}:${path}:${queryString}`;
          const cacheKey = crypto.createHash('sha256').update(rawKey).digest('hex');

          // Check Cache
          const cachedResponse = cache.get(cacheKey);
          if (cachedResponse) {
            strapi.log.debug(`Admin Cache: Hit [${path}]`);
            ctx.status = 200;
            ctx.body = cachedResponse.body;
            
            // Set cache headers for debugging
            ctx.set('X-Admin-Cache', 'HIT');
            return;
          }

          strapi.log.debug(`Admin Cache: Miss [${path}]`);
          await next();

          // Cache the response if it's successful
          if (ctx.status === 200 && ctx.body) {
            cache.set(cacheKey, {
              body: ctx.body,
              contentType: ctx.response.get('Content-Type'),
            });
            ctx.set('X-Admin-Cache', 'MISS');
          }
          return;
        }

        await next();
      });
    },
  };
};
