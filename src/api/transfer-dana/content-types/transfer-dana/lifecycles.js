'use strict';

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
    if (data.nominal !== undefined) {
      data.nominal = cleanNumber(data.nominal);
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    if (data.nominal !== undefined) {
      data.nominal = cleanNumber(data.nominal);
    }
    
    const previousData = await strapi.db.query('api::transfer-dana.transfer-dana').findOne({
      where: where,
      populate: ['pos_asal', 'pos_tujuan']
    });

    event.state = { previousData };
  },

  async afterUpdate(event) {
    const { result, state } = event;
    const { previousData } = state;

    // Trigger update saldo jika status berubah menjadi completed
    if (result.status_transfer === 'completed' && previousData?.status_transfer !== 'completed') {
      
      // Ambil ID Pos dari previousData karena result biasanya hanya berisi { count: 1 }
      const asal = previousData.pos_asal;
      const tujuan = previousData.pos_tujuan;
      const nominal = parseFloat(result.nominal || previousData.nominal);

      if (asal && tujuan && nominal) {
        // Ambil data terbaru saldo asal
        const posAsal = await strapi.db.query('api::pos-keuangan.pos-keuangan').findOne({ 
          where: { id: asal.id }
        });
        
        if (posAsal) {
          await strapi.db.query('api::pos-keuangan.pos-keuangan').update({
            where: { id: posAsal.id },
            data: { saldo: parseFloat(posAsal.saldo || 0) - nominal }
          });
        }

        // Ambil data terbaru saldo tujuan
        const posTujuan = await strapi.db.query('api::pos-keuangan.pos-keuangan').findOne({ 
          where: { id: tujuan.id }
        });

        if (posTujuan) {
          await strapi.db.query('api::pos-keuangan.pos-keuangan').update({
            where: { id: posTujuan.id },
            data: { saldo: parseFloat(posTujuan.saldo || 0) + nominal }
          });
        }
      }
    }
  }
};