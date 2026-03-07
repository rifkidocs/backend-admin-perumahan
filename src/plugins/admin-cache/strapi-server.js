'use strict';

/**
 * Admin Cache Plugin
 * Caches slow Content Manager GET requests with per-user isolation.
 */

const crypto = require('crypto');

module.exports = () => {
  // Handle cross-version LRUCache exports
  const LRU = require('lru-cache');
  const LRUCache = LRU.LRUCache || LRU;

  // Initialize LRU Cache
  // Supports both v11+ (ttl) and older versions (maxAge)
  const cache = new LRUCache({
    max: 1000,
    ttl: 1000 * 60 * 60, // 1 hour (v7+)
    maxAge: 1000 * 60 * 60, // 1 hour (fallback for older versions)
  });

  return {
    register({ strapi }) {
      strapi.log.info('Admin Cache Plugin: Registering...');
    },

    async bootstrap({ strapi }) {
      strapi.log.info('Admin Cache Plugin: Bootstrapping...');

      // Global Purge Function
      strapi.plugin('admin-cache').purge = () => {
        if (typeof cache.clear === 'function') {
          cache.clear();
        } else if (typeof cache.reset === 'function') {
          cache.reset();
        }
        strapi.log.info('Admin Cache: Global Purge Executed');
      };

      // Add Middleware to the Strapi middleware stack
      strapi.server.use(async (ctx, next) => {
        const { method, path, querystring } = ctx;

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
          
          // Generate Cache Key (User + Path + Raw Query String)
          const rawKey = `${userId}:${path}:${querystring}`;
          const cacheKey = crypto.createHash('sha256').update(rawKey).digest('hex');

          // Check Cache
          const cachedResponse = cache.get(cacheKey);
          if (cachedResponse) {
            strapi.log.info(`Admin Cache: HIT [${path}]`);
            ctx.status = 200;
            ctx.body = cachedResponse.body;
            
            // Restore original Content-Type
            if (cachedResponse.contentType) {
              ctx.type = cachedResponse.contentType;
            }
            
            // Set cache headers for debugging
            ctx.set('X-Admin-Cache', 'HIT');
            return;
          }

          strapi.log.info(`Admin Cache: MISS [${path}]`);
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
