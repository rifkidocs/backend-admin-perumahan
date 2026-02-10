'use strict';

/**
 * pos-keuangan lifecycles
 */

const cleanNumber = (val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    // Hapus titik (separator ribuan) dan ganti koma dengan titik (decimal)
    const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return (val === '' || val === null) ? 0 : val;
};

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    if (data.saldo !== undefined) {
      data.saldo = cleanNumber(data.saldo);
    }
    if (data.saldo_minimum !== undefined) {
      data.saldo_minimum = cleanNumber(data.saldo_minimum);
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;
    if (data.saldo !== undefined) {
      data.saldo = cleanNumber(data.saldo);
    }
    if (data.saldo_minimum !== undefined) {
      data.saldo_minimum = cleanNumber(data.saldo_minimum);
    }
  },
};
