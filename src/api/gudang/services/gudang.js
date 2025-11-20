'use strict';

/**
 * gudang service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::gudang.gudang', ({ strapi }) => ({
  // Custom method untuk generate kode gudang
  async generateKodeGudang() {
    const lastGudang = await strapi.query('api::gudang.gudang')
      .findMany({
        orderBy: { id: 'desc' },
        limit: 1
      });

    const nextNumber = lastGudang.length > 0
      ? parseInt(lastGudang[0].kode_gudang?.replace('GD-', '') || 0) + 1
      : 1;

    return `GD-${String(nextNumber).padStart(4, '0')}`;
  },

  // Method untuk cek apakah gudang bisa dihapus
  async canDelete(gudangId) {
    // Cek relasi dengan penerimaan material
    const penerimaanCount = await strapi.query('api::penerimaan-material.penerimaan-material')
      .count({
        where: { gudang: gudangId }
      });

    // Cek relasi dengan pengeluaran material
    const pengeluaranCount = await strapi.query('api::pengeluaran-material.pengeluaran-material')
      .count({
        where: { gudang: gudangId }
      });

    // Cek relasi dengan stock opname
    const stockOpnameCount = await strapi.query('api::stock-opname.stock-opname')
      .count({
        where: { gudang: gudangId }
      });

    // Cek relasi dengan materials
    const materialsCount = await strapi.query('api::material.material')
      .count({
        where: { lokasi_gudang: gudangId }
      });

    return {
      canDelete: penerimaanCount === 0 && pengeluaranCount === 0 && stockOpnameCount === 0 && materialsCount === 0,
      dependencies: {
        penerimaan_material: penerimaanCount,
        pengeluaran_material: pengeluaranCount,
        stock_opname: stockOpnameCount,
        materials: materialsCount
      }
    };
  },

  // Method untuk mendapatkan gudang dengan material tersedia
  async getGudangWithMaterial(materialId) {
    // Implementasi logic untuk mendapatkan gudang yang memiliki material tertentu
    // Ini akan berguna untuk dropdown selection di transaksi material
    return await strapi.query('api::gudang.gudang').findMany({
      where: {
        status_gudang: 'Aktif',
        is_active: true
      },
      populate: {
        penerimaan_materials: {
          where: {
            material: materialId,
            sisa_quantity: {
              $gt: 0
            }
          }
        }
      }
    });
  },

  // Method untuk update status gudang
  async updateStatus(gudangId, status) {
    return await strapi.query('api::gudang.gudang').update({
      where: { id: gudangId },
      data: { status_gudang: status }
    });
  },

  // Method untuk mendapatkan ringkasan stock per gudang
  async getStockSummary(gudangId) {
    const penerimaanMaterials = await strapi.query('api::penerimaan-material.penerimaan-material')
      .findMany({
        where: { gudang: gudangId },
        populate: ['material']
      });

    const stockSummary = {};

    penerimaanMaterials.forEach(penerimaan => {
      const materialId = penerimaan.material?.id;
      const materialNama = penerimaan.material?.nama_material;
      const satuan = penerimaan.material?.satuan;

      if (!stockSummary[materialId]) {
        stockSummary[materialId] = {
          material_nama: materialNama,
          satuan: satuan,
          total_quantity: 0,
          sisa_quantity: 0,
          terpakai: 0
        };
      }

      stockSummary[materialId].total_quantity += penerimaan.quantity || 0;
      stockSummary[materialId].sisa_quantity += penerimaan.sisa_quantity || 0;
    });

    // Hitung terpakai
    Object.keys(stockSummary).forEach(materialId => {
      stockSummary[materialId].terpakai =
        stockSummary[materialId].total_quantity - stockSummary[materialId].sisa_quantity;
    });

    return Object.values(stockSummary);
  },

  // Method untuk mendapatkan materials yang tersimpan di gudang tertentu
  async getGudangMaterials(gudangId) {
    return await strapi.query('api::material.material').findMany({
      where: {
        lokasi_gudang: gudangId,
        is_active: true
      },
      populate: ['supplier', 'suppliers']
    });
  },

  // Method untuk memindahkan material antar gudang
  async transferMaterial(materialId, fromGudangId, toGudangId) {
    // Update lokasi_gudang material
    return await strapi.query('api::material.material').update({
      where: { id: materialId },
      data: { lokasi_gudang: toGudangId }
    });
  }
}));