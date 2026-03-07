'use strict';

/**
 * Admin Cache Plugin - Optimized for Shared Cache & High Performance
 */

const crypto = require('crypto');

module.exports = () => {
  const LRU = require('lru-cache');
  const LRUCache = LRU.LRUCache || LRU;

  // Konfigurasi Agresif: Shared Cache antar user
  const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
  
  const cache = new LRUCache({
    max: 5000, // Kapasitas 5.000 entri (Aman untuk server dengan RAM 8GB)
    ttl: ONE_WEEK,
    maxAge: ONE_WEEK, // Fallback untuk versi lama
    updateAgeOnGet: true, // Data yang sering diakses tidak akan kedaluwarsa
  });

  return {
    register({ strapi }) {
      strapi.log.info('Admin Cache Plugin: Registering Optimized Shared Cache...');
    },

    async bootstrap({ strapi }) {
      strapi.log.info('Admin Cache Plugin: Bootstrapping Shared Cache...');

      // Global Purge Function
      strapi.plugin('admin-cache').purge = () => {
        if (typeof cache.clear === 'function') {
          cache.clear();
        } else if (typeof cache.reset === 'function') {
          cache.reset();
        }
        strapi.log.info('Admin Cache: Global Purge Executed (All Users Shared)');
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
          
          // Purge cache on any successful CUD operation
          if (ctx.status >= 200 && ctx.status < 300) {
            strapi.plugin('admin-cache').purge();
          }
          return;
        }

        // 3. Handle Caching (GET)
        if (method === 'GET') {
          // SHARED CACHE: Tidak pakai userId lagi agar antar user bisa berbagi cache
          // Kunci hanya berdasarkan Path dan Raw Query String (Filter)
          const rawKey = `${path}:${querystring}`;
          const cacheKey = crypto.createHash('sha256').update(rawKey).digest('hex');

          // Check Cache
          const cachedResponse = cache.get(cacheKey);
          if (cachedResponse) {
            strapi.log.info(`Admin Cache: SHARED HIT [${path}] - Items: ${cache.size}`);
            ctx.status = 200;
            ctx.body = cachedResponse.body;
            
            // Restore original Content-Type
            if (cachedResponse.contentType) {
              ctx.type = cachedResponse.contentType;
            }
            
            // Set cache headers for debugging
            ctx.set('X-Admin-Cache', 'HIT-SHARED');
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
