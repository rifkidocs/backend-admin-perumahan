'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

const cleanNumber = (val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return (val === '' || val === null) ? 0 : val;
};

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.amount !== undefined) {
      data.amount = cleanNumber(data.amount);
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
    const { data, where } = event.params;
    
    if (data.amount !== undefined) {
      data.amount = cleanNumber(data.amount);
    }

    const previousData = await strapi.db.query('api::kas-masuk.kas-masuk').findOne({
      where: where,
      populate: ['pos_keuangan']
    });

    event.state = { previousData };
  },

  async afterUpdate(event) {
    const { result, state } = event;
    const { previousData } = state;

    if (result.status_transaksi === 'confirmed' && previousData?.status_transaksi !== 'confirmed') {
      const pos = previousData.pos_keuangan;
      const amount = parseFloat(result.amount || previousData.amount);

      if (pos && amount) {
        const currentPos = await strapi.db.query('api::pos-keuangan.pos-keuangan').findOne({ 
          where: { id: pos.id } 
        });
        
        if (currentPos) {
          await strapi.db.query('api::pos-keuangan.pos-keuangan').update({
            where: { id: currentPos.id },
            data: {
              saldo: parseFloat(currentPos.saldo || 0) + amount
            }
          });
        }
      }
    }
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  },
};