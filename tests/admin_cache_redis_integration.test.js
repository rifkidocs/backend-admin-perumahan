'use strict';

// Mock ioredis before requiring plugin
jest.mock('ioredis', () => require('ioredis-mock'));

const pluginFactory = require('../src/plugins/admin-cache/strapi-server');

describe('Admin Cache Redis Integration', () => {
  let strapi;
  let plugin;
  let middleware;

  beforeEach(async () => {
    // Reset environment variables for each test
    process.env.REDIS_HOST = '127.0.0.1';
    process.env.REDIS_PORT = '6379';
    process.env.REDIS_PASSWORD = '';
    process.env.REDIS_DB = '0';
    process.env.REDIS_KEY_PREFIX = 'strapi:admin-cache:';

    strapi = {
      log: {
        info: jest.fn(),
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
    
    // Create a promise to wait for connection
    const connected = new Promise((resolve) => {
      strapi.plugin().onConnect = resolve;
    });

    plugin.register({ strapi });
    await plugin.bootstrap({ strapi });
    
    // Wait for Redis mock to "connect"
    await connected;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should cache GET requests to Redis and return HIT on subsequent calls', async () => {
    const ctx = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      querystring: 'populate=*',
      status: 200,
      body: { data: 'original' },
      response: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      set: jest.fn(),
      type: '',
    };

    const next = jest.fn();

    // First Call: MISS
    await middleware(ctx, next);
    expect(next).toHaveBeenCalled();
    expect(ctx.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');

    // Second Call: HIT (User)
    next.mockClear();
    ctx.set.mockClear();
    ctx.body = null;
    
    await middleware(ctx, next);
    
    expect(next).not.toHaveBeenCalled();
    expect(ctx.body).toEqual({ data: 'original' });
    expect(ctx.set).toHaveBeenCalledWith('X-Admin-Cache', 'HIT-USER');
    expect(ctx.status).toBe(200);
  });

  test('should isolate cache per user', async () => {
    // User 1 GET
    const ctx1 = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      querystring: '',
      state: { user: { id: 1 } },
      status: 200,
      body: { data: 'user1' },
      response: { get: jest.fn().mockReturnValue('application/json') },
      set: jest.fn(),
    };
    await middleware(ctx1, jest.fn());
    expect(ctx1.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');

    // User 2 GET (same path)
    const ctx2 = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      querystring: '',
      state: { user: { id: 2 } },
      status: 200,
      body: { data: 'user2' },
      response: { get: jest.fn().mockReturnValue('application/json') },
      set: jest.fn(),
    };
    await middleware(ctx2, jest.fn());
    
    // Should be MISS because it's a different user
    expect(ctx2.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');
    
    // User 1 GET again (should be HIT)
    const ctx1Again = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      querystring: '',
      state: { user: { id: 1 } },
      status: 200,
      body: null,
      response: { get: jest.fn() },
      set: jest.fn(),
    };
    await middleware(ctx1Again, jest.fn());
    expect(ctx1Again.set).toHaveBeenCalledWith('X-Admin-Cache', 'HIT-USER');
    expect(ctx1Again.body).toEqual({ data: 'user1' });
  });

  test('should purge Redis cache on CUD operation', async () => {
    const getCtx = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      querystring: '',
      status: 200,
      body: { data: 'stale' },
      response: { get: jest.fn() },
      set: jest.fn(),
    };

    // 1. Fill Cache
    await middleware(getCtx, jest.fn());

    // 2. Perform POST
    const postCtx = {
      method: 'POST',
      path: '/content-manager/collection-types/api::test.test',
      status: 201,
      set: jest.fn(),
    };
    await middleware(postCtx, jest.fn());

    // Wait a bit for async purge (SCAN/DEL) if needed, 
    // but in ioredis-mock it might be fast.
    // However, our purge uses scanStream which is event-based.
    
    // 3. Verify MISS
    const nextGetCtx = {
      method: 'GET',
      path: '/content-manager/collection-types/api::test.test',
      querystring: '',
      status: 200,
      body: { data: 'fresh' },
      response: { get: jest.fn() },
      set: jest.fn(),
    };
    
    await middleware(nextGetCtx, jest.fn());
    expect(nextGetCtx.set).toHaveBeenCalledWith('X-Admin-Cache', 'MISS');
  });
});
