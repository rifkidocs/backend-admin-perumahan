
module.exports = async ({ strapi }) => {
  console.log('--- Baseline Audit ---');
  
  const pos = await strapi.documents('api::pos-keuangan.pos-keuangan').findMany();
  console.log(`Pos Keuangan count: ${pos.length}`);
  pos.forEach(p => console.log(`- ${p.nama_pos}: ${p.saldo}`));

  const km = await strapi.documents('api::kas-masuk.kas-masuk').findMany();
  console.log(`Kas Masuk count: ${km.length}`);

  const kk = await strapi.documents('api::kas-keluar.kas-keluar').findMany();
  console.log(`Kas Keluar count: ${kk.length}`);

  const piutang = await strapi.documents('api::piutang-konsumen.piutang-konsumen').findMany();
  console.log(`Piutang count: ${piutang.length}`);

  const invoice = await strapi.documents('api::payment-invoice.payment-invoice').findMany();
  console.log(`Payment Invoice count: ${invoice.length}`);

  console.log('--- End Baseline ---');
};
