const { beforeCreate } = require('../src/api/absensi/content-types/absensi/lifecycles');
const dayjs = require('dayjs');

// Mock Strapi
global.strapi = {
  entityService: {
    findMany: jest.fn(),
    findOne: jest.fn()
  },
  log: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
};

describe('Absensi Night Shift Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a local date string for testing
  const localDate = (h, m = 0, dayOffset = 0) => {
    return dayjs().add(dayOffset, 'day').hour(h).minute(m).second(0).toISOString();
  };

  test('should handle night shift check-in correctly (on time)', async () => {
    const mockSchedule = {
      id: 1,
      jam_masuk: '19:00:00',
      radius_meters: 100,
      locations: [{ latitude: '0', longitude: '0', nama_lokasi: 'Test Office' }]
    };

    strapi.entityService.findMany.mockResolvedValue([mockSchedule]);

    const event = {
      params: {
        data: {
          karyawan: 1,
          // Use a time that is exactly 19:00 in LOCAL time
          jam_masuk: dayjs().hour(19).minute(0).second(0).toISOString(),
          lokasi_absensi: {
            check_in_location: { lat: 0, lng: 0 }
          }
        }
      }
    };

    await beforeCreate(event);

    expect(event.params.data.keterangan).toContain('Tepat Waktu');
  });

  test('should handle night shift check-in correctly (late)', async () => {
    const mockSchedule = {
      id: 1,
      jam_masuk: '19:00:00',
      radius_meters: 100,
      locations: [{ latitude: '0', longitude: '0', nama_lokasi: 'Test Office' }]
    };

    strapi.entityService.findMany.mockResolvedValue([mockSchedule]);

    const event = {
      params: {
        data: {
          karyawan: 1,
          jam_masuk: dayjs().hour(19).minute(10).second(0).toISOString(),
          lokasi_absensi: {
            check_in_location: { lat: 0, lng: 0 }
          }
        }
      }
    };

    await beforeCreate(event);

    expect(event.params.data.keterangan).toContain('Terlambat 10 menit');
  });

  test('should handle night shift check-in after midnight correctly (late)', async () => {
    const mockSchedule = {
      id: 1,
      jam_masuk: '19:00:00',
      radius_meters: 100,
      locations: [{ latitude: '0', longitude: '0', nama_lokasi: 'Test Office' }]
    };

    strapi.entityService.findMany.mockResolvedValue([mockSchedule]);

    // Checking in at 1 AM (next day) for a shift that started at 7 PM (previous day)
    const event = {
      params: {
        data: {
          karyawan: 1,
          jam_masuk: dayjs().hour(1).minute(0).second(0).add(1, 'day').toISOString(),
          lokasi_absensi: {
            check_in_location: { lat: 0, lng: 0 }
          }
        }
      }
    };

    await beforeCreate(event);

    // 19:00 to 01:00 is 6 hours = 360 minutes
    expect(event.params.data.keterangan).toContain('Terlambat 360 menit');
  });

  test('should prioritize shift relation over schedule', async () => {
    const mockSchedule = {
      id: 1,
      jam_masuk: '08:00:00', // Regular day schedule
      radius_meters: 100,
      locations: [{ latitude: '0', longitude: '0', nama_lokasi: 'Test Office' }]
    };

    const mockShift = {
      id: 2,
      nama_shift: 'Night Shift',
      jam_mulai: '19:00:00'
    };

    strapi.entityService.findMany.mockResolvedValue([mockSchedule]);
    strapi.entityService.findOne.mockResolvedValue(mockShift);

    const event = {
      params: {
        data: {
          karyawan: 1,
          shift: 2,
          jam_masuk: dayjs().hour(19).minute(0).second(0).toISOString(),
          lokasi_absensi: {
            check_in_location: { lat: 0, lng: 0 }
          }
        }
      }
    };

    await beforeCreate(event);

    // Should use 19:00 from shift, not 08:00 from schedule
    expect(event.params.data.keterangan).toContain('Tepat Waktu');
  });
});