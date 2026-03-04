const { cleanNumber, roundHalfUp } = require('../src/utils/numberHelper');

describe('Financial Number Helper', () => {
  describe('cleanNumber', () => {
    test('should handle Indonesian number formatting (dot as thousand separator, comma as decimal)', () => {
      expect(cleanNumber('1.112.762,50')).toBe(1112762.5);
      expect(cleanNumber('1.000')).toBe(1000);
      expect(cleanNumber('1.000,25')).toBe(1000.25);
    });

    test('should handle regular strings and numbers', () => {
      expect(cleanNumber('1000.50')).toBe(1000.5);
      expect(cleanNumber(1000.5)).toBe(1000.5);
    });

    test('should handle empty or null values', () => {
      expect(cleanNumber('')).toBe(0);
      expect(cleanNumber(null)).toBe(0);
      expect(cleanNumber(undefined)).toBe(0);
    });
  });

  describe('roundHalfUp', () => {
    test('should round half up correctly to 2 decimal places', () => {
      expect(roundHalfUp(1.112505, 2)).toBe(1.11); // wait, round half up for 1.112505 to 2 decimal places is 1.11
      // wait, let's check: 1.112505 * 100 = 111.2505 -> round(111.2505) = 111 -> / 100 = 1.11
      expect(roundHalfUp(1.115, 2)).toBe(1.12);
      expect(roundHalfUp(1.114, 2)).toBe(1.11);
      expect(roundHalfUp(1.1151, 2)).toBe(1.12);
    });

    test('should handle default decimal places', () => {
      expect(roundHalfUp(1.115)).toBe(1.12);
    });
  });
});
