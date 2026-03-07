# Implementation Plan: Admin Cache Plugin

## Phase 1: Plugin Scaffolding
- [ ] **Task: Create Plugin Directory Structure**
    - Create `src/plugins/admin-cache`
    - Create `src/plugins/admin-cache/strapi-server.js`
    - Create `src/plugins/admin-cache/package.json`
- [ ] **Task: Register Plugin**
    - Update `config/plugins.js` to enable the new `admin-cache` plugin.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

## Phase 2: Implementation of Caching Logic
- [ ] **Task: Implement Core Caching Middleware**
    - Create the middleware function in `strapi-server.js`.
    - Implement LRU cache logic (Memory-based).
    - Implement per-user cache key generation (using `ctx.state.user.id` or JWT hash).
    - Handle `GET` requests for `/content-manager/` routes.
- [ ] **Task: Implement Global Purge Logic**
    - Intercept `POST`, `PUT`, `PATCH`, `DELETE` requests.
    - Clear the entire cache upon success.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)**

## Phase 3: Testing and Verification
- [ ] **Task: Write Unit Tests**
    - Mock Strapi and Koa context.
    - Verify `GET` returns cached data on second hit.
    - Verify `POST` clears the cache.
- [ ] **Task: Manual Verification & Performance Check**
    - Test in the Strapi Admin panel.
    - Observe logs for "Cache Hit" vs "Cache Miss".
    - Verify slowness is resolved.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)**
