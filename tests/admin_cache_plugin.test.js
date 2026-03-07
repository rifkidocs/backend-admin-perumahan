'use strict';

const pluginFactory = require('../src/plugins/admin-cache/strapi-server');

describe('Admin Cache Plugin Middleware', () => {
  let strapi;
  let middleware;
  let plugin;

  beforeEach(() => {
    strapi = {
      log: {
        info: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
      },
      server: {
        use: jest.fn((fn) => {
          middleware = fn;
        }),
      },
      plugin: jest.fn().mockReturnValue({
        purge: null,
      }),
    };

    plugin = pluginFactory();
    plugin.register({ strapi });
    plugin.bootstrap({ strapi });
    
    // The bootstrap function adds the purge function to the plugin
    // and registers the middleware to strapi.server.use
  });

  test('should cache GET requests to content-manager', async () => {
    const ctx = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      query: {},
      state: { user: { id: 1 } },
      status: 200,
      body: { data: 'original' },
      response: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      set: jest.fn(),
    };

    const next = jest.fn();

    // First Call: Miss
    await middleware(ctx, next);
    expect(next).toHaveBeenCalled();
    expect(ctx.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');

    // Second Call: Hit
    next.mockClear();
    ctx.set.mockClear();
    ctx.body = null; // Clear body to ensure it's filled from cache
    
    await middleware(ctx, next);
    expect(next).not.toHaveBeenCalled();
    expect(ctx.body).toEqual({ data: 'original' });
    expect(ctx.set).toHaveBeenCalledWith('X-Admin-Cache', 'HIT');
  });

  test('should purge cache on successful POST request', async () => {
    // 1. Fill cache
    const getCtx = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      query: {},
      state: { user: { id: 1 } },
      status: 200,
      body: { data: 'original' },
      response: { get: jest.fn() },
      set: jest.fn(),
    };
    await middleware(getCtx, jest.fn());

    // 2. Perform POST (CUD)
    const postCtx = {
      method: 'POST',
      path: '/content-manager/collection-types/api::test.test',
      status: 201,
      set: jest.fn(),
    };
    await middleware(postCtx, jest.fn());

    // 3. Verify next GET is a Miss
    const nextGetCtx = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      query: {},
      state: { user: { id: 1 } },
      status: 200,
      body: { data: 'updated' },
      response: { get: jest.fn() },
      set: jest.fn(),
    };
    await middleware(nextGetCtx, jest.fn());
    expect(nextGetCtx.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');
  });

  test('should isolate cache per user', async () => {
    // User 1 GET
    const ctx1 = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      query: {},
      state: { user: { id: 1 } },
      status: 200,
      body: { data: 'user1' },
      response: { get: jest.fn() },
      set: jest.fn(),
    };
    await middleware(ctx1, jest.fn());

    // User 2 GET (same path)
    const ctx2 = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      query: {},
      state: { user: { id: 2 } },
      status: 200,
      body: { data: 'user2' },
      response: { get: jest.fn() },
      set: jest.fn(),
    };
    await middleware(ctx2, jest.fn());
    expect(ctx2.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');
  });
});
