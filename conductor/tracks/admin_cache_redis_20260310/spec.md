# Track Specification: Redis-based Admin Cache Management

## Overview
This track involves migrating the existing `admin-cache` plugin from an in-memory `lru-cache` to a Redis-backed storage using the `ioredis` library. The goal is to improve scalability and persistence across server restarts/clusters while maintaining the current "Shared Cache" logic for Admin Content Manager APIs.

## Functional Requirements
1.  **Redis Integration**:
    - Replace `lru-cache` with `ioredis` as the primary storage engine.
    - Implement a connection manager for Redis within the `admin-cache` plugin.
2.  **Configuration**:
    - Support Redis configuration via `.env` variables:
        - `REDIS_HOST` (default: `127.0.0.1`)
        - `REDIS_PORT` (default: `6379`)
        - `REDIS_PASSWORD` (optional)
        - `REDIS_DB` (default: `0`)
        - `REDIS_KEY_PREFIX` (default: `strapi:admin-cache:`)
3.  **Caching Logic (GET)**:
    - Maintain SHARED CACHE: Keys are derived from `path` and `querystring` (hashed with SHA-256).
    - Cache successful `GET` responses from `/content-manager/collection-types/` and `/content-manager/single-types/`.
    - Restore `Content-Type` and set `X-Admin-Cache: HIT-SHARED` header on cache hit.
    - Default TTL: 1 Week (consistent with current logic).
4.  **Invalidation Logic (CUD)**:
    - Maintain Global Purge: Clear all keys associated with the `admin-cache` plugin on any successful POST, PUT, PATCH, or DELETE operation in the Content Manager.
    - Efficiently clear keys using the `REDIS_KEY_PREFIX` (e.g., via `SCAN` and `DEL` or a versioning strategy).

## Non-Functional Requirements
1.  **Performance**: Redis access should be fast enough to not introduce significant latency.
2.  **Reliability**: If Redis is unavailable, the system should fail gracefully (bypass cache) and log the error.
3.  **Consistency**: Ensure cache invalidation is atomic across all Redis-connected instances.

## Acceptance Criteria
1.  `GET` requests to Content Manager are successfully cached in Redis.
2.  `X-Admin-Cache: HIT-SHARED` header is present on subsequent `GET` requests for the same path/query.
3.  Any POST/PUT/DELETE operation to a Content Manager endpoint clears the relevant Redis cache.
4.  The system starts up correctly when Redis configuration is provided in `.env`.
5.  The system gracefully handles Redis connection failures by bypassing the cache.

## Out of Scope
- Granular invalidation (only clearing the specific collection that changed).
- Per-user caching (maintaining shared logic as per current implementation).
- Caching for public/custom APIs (only Content Manager APIs are targeted).
