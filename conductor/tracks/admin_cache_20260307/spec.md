# Specification: Strapi Admin Cache Plugin

## Overview
A custom Strapi 5 plugin designed to significantly improve the performance of the Content Manager API by implementing an intelligent, per-user caching layer. The plugin will cache slow `GET` requests in the admin panel and automatically invalidate them whenever any Create, Update, or Delete (CUD) operation occurs.

## Functional Requirements
- **Targeted Caching:** Specifically cache routes under `/content-manager/collection-types/` and `/content-manager/single-types/`.
- **Per-User Isolation:** Cache keys must include a unique user identifier (e.g., hash of the JWT) to ensure that users only see data they are authorized to access.
- **Global Invalidation:** Any successful `POST`, `PUT`, `PATCH`, or `DELETE` request to *any* content type must trigger a global purge of the entire admin cache.
- **In-Memory Storage:** Use a high-performance in-memory LRU (Least Recently Used) cache to minimize latency.
- **Configurable TTL:** Allow setting a Time-To-Live (TTL) for cached entries (default: 1 hour).

## Non-Functional Requirements
- **Performance:** Cache hits should resolve in <10ms.
- **Safety:** Ensure that sensitive admin data is never leaked between different users.
- **Stability:** The plugin must fail gracefully—if the cache system fails, requests should proceed to the database as normal.

## Acceptance Criteria
- [ ] Slow Content Manager `GET` requests (like the ones taking 2.7s) are resolved in under 50ms after the first hit.
- [ ] Updating any entry in the admin panel immediately clears all cached `GET` results.
- [ ] Different admin users have separate cache entries (verified by logging in as two different users).
- [ ] The system does not cache public `/api` routes by default (unless explicitly configured).

## Out of Scope
- Caching of the public REST API (`/api`) - addressed by existing plugins if needed.
- Persistent Redis storage (can be added as a future phase).
- Granular invalidation (clearing only specific content types).
