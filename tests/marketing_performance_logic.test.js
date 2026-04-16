const lifecycles = require('../src/api/marketing-performance/content-types/marketing-performance/lifecycles');

// Mock strapi
global.strapi = {
  documents: jest.fn()
};

describe('Marketing Performance Scoring Logic', () => {
  let mockFindMany;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindMany = jest.fn();
    strapi.documents.mockReturnValue({
      findMany: mockFindMany,
      findOne: jest.fn()
    });
  });

  test('Scenario A: 100% achievement across all metrics', async () => {
    const data = {
      marketing_staff: { documentId: 'staff-1' },
      periode: '2024-03-01',
      target_kunjungan_harian: 10,
      target_booking: 5
    };

    // Mock visits (220)
    const mockVisits = new Array(220).fill({});
    // Mock bookings (5)
    const mockBookings = new Array(5).fill({});
    // Mock targets (2 sales)
    const mockTargets = [{ target_unit: 2, pencapaian_unit: 2 }];

    mockFindMany
      .mockResolvedValueOnce(mockVisits)    // First call: visits
      .mockResolvedValueOnce(mockBookings)  // Second call: bookings
      .mockResolvedValueOnce(mockTargets);   // Third call: targets

    const event = { params: { data } };
    await lifecycles.beforeCreate(event);

    expect(data.skor_kinerja).toBe(100.00);
    expect(data.rating).toBe('excellent');
    expect(data.pencapaian_kunjungan).toBe(220);
    expect(data.pencapaian_booking).toBe(5);
    expect(data.target_penjualan).toBe(2);
    expect(data.pencapaian_penjualan).toBe(2);
  });

  test('Scenario B: Partial achievement (50%)', async () => {
    const data = {
      marketing_staff: { documentId: 'staff-1' },
      periode: '2024-03-01',
      target_kunjungan_harian: 10,
      target_booking: 10
    };

    // Mock visits (110 / 220 = 50%)
    const mockVisits = new Array(110).fill({});
    // Mock bookings (5 / 10 = 50%)
    const mockBookings = new Array(5).fill({});
    // Mock targets (5 / 10 = 50%)
    const mockTargets = [{ target_unit: 10, pencapaian_unit: 5 }];

    mockFindMany
      .mockResolvedValueOnce(mockVisits)
      .mockResolvedValueOnce(mockBookings)
      .mockResolvedValueOnce(mockTargets);

    const event = { params: { data } };
    await lifecycles.beforeCreate(event);

    // (50 * 0.3) + (50 * 0.3) + (50 * 0.4) = 15 + 15 + 20 = 50
    expect(data.skor_kinerja).toBe(50.00);
    expect(data.rating).toBe('poor');
  });

  test('Scenario C: Zero targets', async () => {
    const data = {
      marketing_staff: { documentId: 'staff-1' },
      periode: '2024-03-01',
      target_kunjungan_harian: 0,
      target_booking: 0
    };

    mockFindMany
      .mockResolvedValueOnce([]) // visits
      .mockResolvedValueOnce([]) // bookings
      .mockResolvedValueOnce([{ target_unit: 0, pencapaian_unit: 0 }]); // targets

    const event = { params: { data } };
    await lifecycles.beforeCreate(event);

    expect(data.skor_kinerja).toBe(0.00);
    expect(data.rating).toBe('poor');
  });

  test('Scenario D: Mixed achievement with weightings (30/30/40)', async () => {
    const data = {
      marketing_staff: { documentId: 'staff-1' },
      periode: '2024-03-01',
      target_kunjungan_harian: 10,
      target_booking: 10
    };

    // Visits: 220/220 = 100% (Score 30)
    const mockVisits = new Array(220).fill({});
    // Bookings: 5/10 = 50% (Score 15)
    const mockBookings = new Array(5).fill({});
    // Sales: 0/10 = 0% (Score 0)
    const mockTargets = [{ target_unit: 10, pencapaian_unit: 0 }];

    mockFindMany
      .mockResolvedValueOnce(mockVisits)
      .mockResolvedValueOnce(mockBookings)
      .mockResolvedValueOnce(mockTargets);

    const event = { params: { data } };
    await lifecycles.beforeCreate(event);

    // (100 * 0.3) + (50 * 0.3) + (0 * 0.4) = 30 + 15 + 0 = 45
    expect(data.skor_kinerja).toBe(45.00);
    expect(data.rating).toBe('poor');
  });
});
