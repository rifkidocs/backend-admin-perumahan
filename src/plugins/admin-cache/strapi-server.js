"use strict";

/**
 * Admin Cache Plugin - Optimized for Shared Cache with Redis
 */

const crypto = require("crypto");
const Redis = require("ioredis");

module.exports = () => {
  // Config from ENV
  const redisHost = process.env.REDIS_HOST || "127.0.0.1";
  const redisPort = parseInt(process.env.REDIS_PORT || "6379");
  const redisPassword = process.env.REDIS_PASSWORD || undefined;
  const redisDb = parseInt(process.env.REDIS_DB || "0");
  const redisKeyPrefix = process.env.REDIS_KEY_PREFIX || "strapi:admin-cache:";

  let redis;
  let isRedisAvailable = false;

  const ONE_WEEK = 60 * 60 * 24 * 7; // TTL in seconds for Redis

  return {
    register({ strapi }) {
      strapi.log.info("Admin Cache Plugin: Registering Redis Shared Cache...");

      try {
        redis = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          db: redisDb,
          keyPrefix: redisKeyPrefix,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 3,
        });

        redis.on("connect", () => {
          isRedisAvailable = true;
          strapi.log.info(`Admin Cache: Connected to Redis at ${redisHost}:${redisPort}`);
          if (strapi.plugin("admin-cache").onConnect) {
            strapi.plugin("admin-cache").onConnect();
          }
        });

        redis.on("error", (err) => {
          isRedisAvailable = false;
          strapi.log.error(`Admin Cache: Redis Error - ${err.message}`);
        });
      } catch (err) {
        strapi.log.error(`Admin Cache: Redis Initialization Failed - ${err.message}`);
      }
    },

    async bootstrap({ strapi }) {
      strapi.log.info("Admin Cache Plugin: Bootstrapping Redis Shared Cache...");

      // Global Purge Function
      strapi.plugin("admin-cache").purge = async () => {
        if (!isRedisAvailable) return;

        return new Promise((resolve, reject) => {
          try {
            // Efficient clear using SCAN if prefix is used
            const stream = redis.scanStream({
              match: `${redisKeyPrefix}*`,
            });

            stream.on("data", async (keys) => {
              if (keys.length) {
                const pipeline = redis.pipeline();
                keys.forEach((key) => {
                  const keyWithoutPrefix = key.startsWith(redisKeyPrefix) 
                    ? key.slice(redisKeyPrefix.length) 
                    : key;
                  pipeline.del(keyWithoutPrefix);
                });
                await pipeline.exec();
              }
            });

            stream.on("end", () => {
              strapi.log.info("Admin Cache: Global Purge Executed (Redis)");
              resolve();
            });

            stream.on("error", (err) => {
              strapi.log.error(`Admin Cache: Scan Error - ${err.message}`);
              reject(err);
            });
          } catch (err) {
            strapi.log.error(`Admin Cache: Purge Failed - ${err.message}`);
            reject(err);
          }
        });
      };

      // Add Middleware to the Strapi middleware stack
      strapi.server.use(async (ctx, next) => {
        const { method, path, querystring } = ctx;

        // 1. Identify Target Routes (Content Manager Collection/Single Types)
        const isContentManagerApi =
          path.startsWith("/content-manager/collection-types/") ||
          path.startsWith("/content-manager/single-types/");

        if (!isContentManagerApi) {
          return await next();
        }

        // 2. Handle Invalidation (POST, PUT, PATCH, DELETE)
        const isCudOperation = ["POST", "PUT", "PATCH", "DELETE"].includes(
          method,
        );
        if (isCudOperation) {
          await next();

          // Purge cache on any successful CUD operation
          if (ctx.status >= 200 && ctx.status < 300) {
            await strapi.plugin("admin-cache").purge();
          }
          return;
        }

        // 3. Handle Caching (GET)
        if (method === "GET") {
          // PER-USER CACHE: Use userId and Authorization header in cache key to ensure RBAC compatibility
          // In Strapi Admin, the user might be in ctx.state.user or ctx.state.admin
          const userId = ctx.state?.user?.id || ctx.state?.admin?.id || "public";
          const authHeader = ctx.get("Authorization") || "";
          
          // Using Authorization header ensures that even if ctx.state.user is not yet populated, 
          // different users with different tokens will have different cache keys.
          const rawKey = `user:${userId}:auth:${authHeader}:${path}:${querystring}`;
          const cacheKey = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex");

          // Check Cache
          if (isRedisAvailable) {
            try {
              const cachedData = await redis.get(cacheKey);
              if (cachedData) {
                const cachedResponse = JSON.parse(cachedData);
                const identity = `User:${userId}${authHeader ? " (Auth)" : ""}`;
                strapi.log.info(`Admin Cache: HIT [${identity}] [${path}]`);

                ctx.status = 200;
                ctx.body = cachedResponse.body;

                if (cachedResponse.contentType) {
                  ctx.type = cachedResponse.contentType;
                }

                ctx.set("X-Admin-Cache", "HIT-USER");
                ctx.set("X-Admin-Cache-Status", "HIT");
                return;
              } else {
                ctx.set("X-Admin-Cache-Status", "MISS-NOT-FOUND");
              }
            } catch (err) {
              strapi.log.error(`Admin Cache: Get Failed - ${err.message}`);
              ctx.set("X-Admin-Cache-Status", "ERROR-GET");
            }
          } else {
            ctx.set("X-Admin-Cache-Status", "BYPASS-REDIS-DOWN");
          }

          const identity = `User:${userId}${authHeader ? " (Auth)" : ""}`;
          strapi.log.info(`Admin Cache: MISS [${identity}] [${path}]`);
          await next();

          // Cache the response if it's successful
          if (isRedisAvailable && ctx.status === 200 && ctx.body) {
            try {
              const valueToCache = JSON.stringify({
                body: ctx.body,
                contentType: ctx.response.get("Content-Type"),
              });
              await redis.set(cacheKey, valueToCache, "EX", ONE_WEEK);
              ctx.set("X-Admin-Cache", "MISS");
            } catch (err) {
              strapi.log.error(`Admin Cache: Set Failed - ${err.message}`);
              ctx.set("X-Admin-Cache-Status", "ERROR-SET");
            }
          }

          return;
        }

        await next();
      });
    },
  };
};
