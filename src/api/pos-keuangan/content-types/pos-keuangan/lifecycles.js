'use strict';

/**
 * pos-keuangan lifecycles
 */

const { cleanNumber } = require('../../../../utils/numberHelper');

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
