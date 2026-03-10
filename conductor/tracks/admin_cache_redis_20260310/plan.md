# Implementation Plan: Redis-based Admin Cache Management

## Phase 1: Preparation & Environment Setup
- [ ] Task: Install `ioredis` as a project dependency
- [ ] Task: Update `.env.example` with Redis configuration variables (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `REDIS_KEY_PREFIX`)
- [ ] Task: Conductor - User Manual Verification 'Preparation & Environment Setup' (Protocol in workflow.md)

## Phase 2: Redis Client Integration (admin-cache plugin)
- [ ] Task: Create a Redis client factory/service in `src/plugins/admin-cache/strapi-server.js`
- [ ] Task: Implement Redis connection error handling to allow Strapi to start if Redis is down (bypass mode)
- [ ] Task: Replace `lru-cache` with the Redis client for GET/SET operations
- [ ] Task: Implement a SHA-256 hashing utility for consistent cache keys
- [ ] Task: Conductor - User Manual Verification 'Redis Client Integration' (Protocol in workflow.md)

## Phase 3: Cache Invalidation & TTL Implementation
- [ ] Task: Update the `purge` function to support Redis-wide clearing for the specific prefix
- [ ] Task: Implement `SCAN` and `DEL` logic for efficient global purge in Redis
- [ ] Task: Configure the cache TTL (1 Week) to use Redis's native expiration feature
- [ ] Task: Conductor - User Manual Verification 'Cache Invalidation & TTL' (Protocol in workflow.md)

## Phase 4: Middleware Optimization & Error Handling
- [ ] Task: Refactor the `strapi-server.js` middleware to handle asynchronous Redis operations
- [ ] Task: Ensure `Content-Type` and `body` are correctly serialized/deserialized for Redis storage
- [ ] Task: Implement a "Bypass" mode that automatically triggers when Redis connection is lost or timed out
- [ ] Task: Conductor - User Manual Verification 'Middleware Optimization' (Protocol in workflow.md)

## Phase 5: Final Verification & Testing
- [ ] Task: Create unit tests for Redis storage engine (using `ioredis-mock` if available or manual mocks)
- [ ] Task: Create integration tests for Content Manager caching behavior (GET hit, CUD purge)
- [ ] Task: Verify that `X-Admin-Cache` headers are correctly returned on cache hits
- [ ] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
