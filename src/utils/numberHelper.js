'use strict';

/**
 * numberHelper utility
 */

/**
 * Cleans and parses a number from various formats, including Indonesian IDR strings.
 * Handle dot as thousand separator and comma as decimal separator.
 * @param {string|number} val The value to clean and parse.
 * @returns {number} The parsed numeric value.
 */
const cleanNumber = (val) => {
  if (typeof val === 'number') return val;
  
  if (typeof val === 'string' && val.trim() !== '') {
    // If it's a simple number string like "1000" or "1000.5", just parse it
    // But only if it doesn't look like an Indonesian formatted string (e.g. "1.000")
    if (/^-?\d+(\.\d+)?$/.test(val)) {
      const parts = val.split('.');
      // If exactly 3 digits after dot, it's ambiguous. Assume IDR thousand separator if it's a large enough number?
      // Actually, let's just stick to the original logic but handle the '.' correctly.
      if (parts.length === 2 && parts[1].length === 3) {
         // Ambiguous: "1.000" could be 1 or 1000. 
         // In IDR context, "1.000" is usually 1000.
         // Let's check if there are multiple dots or a comma.
      } else if (parts.length === 2) {
         // "1000.5" -> 1000.5
         return parseFloat(val);
      }
    }

    // Default Indonesian parsing
    const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return (val === '' || val === null || val === undefined) ? 0 : val;
};

/**
 * Rounds a number using Round Half Up strategy.
 * @param {number} num The number to round.
 * @param {number} [decimals=2] The number of decimal places.
 * @returns {number} The rounded number.
 */
const roundHalfUp = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

module.exports = {
  cleanNumber,
  roundHalfUp
};
