const { factories } = require('@strapi/strapi');

jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: jest.fn((uid, factoryFn) => {
        return factoryFn; // Return the function passed to it
    }),
  }
}));

// Mock Strapi global
global.strapi = {
  db: {
    query: jest.fn(() => ({
      findOne: jest.fn(),
      update: jest.fn()
    }))
  },
  log: {
    error: jest.fn()
  }
};

const absensiController = require('../src/api/absensi/controllers/absensi');

describe('Absensi Controller - addPatrolReport', () => {
  let controller;
  
  beforeAll(() => {
    // absensiController is the function we passed to createCoreController
    controller = absensiController({ strapi });
  });

  test('should append a patrol report successfully', async () => {
    const mockEntry = {
      id: 1,
      documentId: 'abc',
      laporan_patroli: [{ foto: 1, lokasi: { lat: 0, lng: 0 } }]
    };

    const findOneMock = jest.fn().mockResolvedValue(mockEntry);
    const updateMock = jest.fn().mockResolvedValue({
      ...mockEntry,
      laporan_patroli: [...mockEntry.laporan_patroli, { foto: 2, lokasi: { lat: 1, lng: 1 } }]
    });

    strapi.db.query.mockReturnValue({
      findOne: findOneMock,
      update: updateMock
    });

    const ctx = {
      params: { id: 'abc' },
      request: {
        body: {
          data: { foto: 2, lokasi: { lat: 1, lng: 1 } }
        }
      },
      send: jest.fn(),
      badRequest: jest.fn(),
      notFound: jest.fn()
    };

    await controller.addPatrolReport(ctx);

    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        laporan_patroli: expect.arrayContaining([
          expect.objectContaining({ foto: 1 }),
          expect.objectContaining({ foto: 2 })
        ])
      })
    }));
    expect(ctx.send).toHaveBeenCalled();
  });

  test('should return badRequest if data is missing', async () => {
    const ctx = {
      params: { id: 'abc' },
      request: {
        body: { data: {} }
      },
      badRequest: jest.fn()
    };

    await controller.addPatrolReport(ctx);
    expect(ctx.badRequest).toHaveBeenCalled();
  });
});
