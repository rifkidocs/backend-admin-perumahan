# Implementation Plan: Redis-based Admin Cache Management

## Phase 1: Preparation & Environment Setup [checkpoint: 44aaf52]
- [x] Task: Install `ioredis` as a project dependency (b4dc6c0)
- [x] Task: Update `.env.example` with Redis configuration variables (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `REDIS_KEY_PREFIX`) (53f3d2a)
- [x] Task: Conductor - User Manual Verification 'Preparation & Environment Setup' (Protocol in workflow.md) (44aaf52)

## Phase 2: Redis Client Integration (admin-cache plugin) [checkpoint: 8b92952]
- [x] Task: Create a Redis client factory/service in `src/plugins/admin-cache/strapi-server.js` (59ca491)
- [x] Task: Implement Redis connection error handling to allow Strapi to start if Redis is down (bypass mode) (59ca491)
- [x] Task: Replace `lru-cache` with the Redis client for GET/SET operations (59ca491)
- [x] Task: Implement a SHA-256 hashing utility for consistent cache keys (59ca491)
- [x] Task: Conductor - User Manual Verification 'Redis Client Integration' (Protocol in workflow.md) (8b92952)

## Phase 3: Cache Invalidation & TTL Implementation [checkpoint: a4c519f]
- [x] Task: Update the `purge` function to support Redis-wide clearing for the specific prefix (59ca491)
- [x] Task: Implement `SCAN` and `DEL` logic for efficient global purge in Redis (59ca491)
- [x] Task: Configure the cache TTL (1 Week) to use Redis's native expiration feature (59ca491)
- [x] Task: Conductor - User Manual Verification 'Cache Invalidation & TTL' (Protocol in workflow.md) (a4c519f)

## Phase 4: Middleware Optimization & Error Handling [checkpoint: abf3fd0]
- [x] Task: Refactor the `strapi-server.js` middleware to handle asynchronous Redis operations (59ca491)
- [x] Task: Ensure `Content-Type` and `body` are correctly serialized/deserialized for Redis storage (59ca491)
- [x] Task: Implement a "Bypass" mode that automatically triggers when Redis connection is lost or timed out (59ca491)
- [x] Task: Conductor - User Manual Verification 'Middleware Optimization' (Protocol in workflow.md) (abf3fd0)

## Phase 5: Final Verification & Testing [checkpoint: 8a05199]
- [x] Task: Create unit tests for Redis storage engine (using `ioredis-mock` if available or manual mocks) (8a05199)
- [x] Task: Create integration tests for Content Manager caching behavior (GET hit, CUD purge) (8a05199)
- [x] Task: Verify that `X-Admin-Cache` headers are correctly returned on cache hits (8a05199)
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md) (8a05199)
