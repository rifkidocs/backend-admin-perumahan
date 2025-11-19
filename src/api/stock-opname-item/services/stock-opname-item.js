'use strict';

/**
 * stock-opname-item service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::stock-opname-item.stock-opname-item', ({ strapi }) => ({
  // Method untuk menghitung system stock berdasarkan transaksi material per gudang
  async calculateSystemStock(materialId, gudangId) {
    try {
      // Hitung total penerimaan material untuk gudang dan material tertentu
      const totalPenerimaan = await strapi.db.connection.raw(`
        SELECT COALESCE(SUM(sisa_quantity), 0) as total
        FROM penerimaan_materials
        WHERE material = ? AND gudang = ?
      `, [materialId, gudangId]);

      // Hitung total pengeluaran material untuk gudang dan material tertentu
      const totalPengeluaran = await strapi.db.connection.raw(`
        SELECT COALESCE(SUM(quantity), 0) as total
        FROM pengeluaran_materials
        WHERE material = ? AND gudang = ? AND approvalStatus = 'approved'
      `, [materialId, gudangId]);

      const penerimaan = parseFloat(totalPenerimaan[0][0]?.total || 0);
      const pengeluaran = parseFloat(totalPengeluaran[0][0]?.total || 0);

      // System stock = total penerimaan - total pengeluaran
      return penerimaan - pengeluaran;

    } catch (error) {
      console.error('Error calculating system stock:', error);
      return 0;
    }
  },

  // Method untuk auto-generate system stock saat create stock opname item
  async generateSystemStock(stockOpnameId, materialId) {
    try {
      // Get stock opname data untuk mendapatkan gudang
      const stockOpname = await strapi.entityService.findOne('api::stock-opname.stock-opname', stockOpnameId, {
        populate: ['gudang']
      });

      if (!stockOpname?.gudang?.id) {
        throw new Error('Stock opname tidak memiliki gudang terkait');
      }

      // Hitung system stock
      const systemStock = await this.calculateSystemStock(materialId, stockOpname.gudang.id);

      return systemStock;

    } catch (error) {
      console.error('Error generating system stock:', error);
      return 0;
    }
  },

  // Method untuk auto-update variance status
  async updateVarianceStatus(systemStock, physicalStock) {
    const difference = physicalStock - systemStock;

    if (difference === 0) {
      return 'Match';
    } else if (difference > 0) {
      return 'Over';
    } else {
      return 'Short';
    }
  },

  // Override create method untuk auto-generate system stock
  async create(params) {
    const { data } = params;

    // Auto-generate system stock jika material dan stock_opname ada
    if (data.material && data.stock_opname) {
      const systemStock = await this.generateSystemStock(data.stock_opname, data.material);
      data.system_stock = systemStock;

      // Auto-calculate difference dan variance status
      if (data.physical_stock) {
        const difference = data.physical_stock - systemStock;
        data.difference = difference;
        data.variance_status = await this.updateVarianceStatus(systemStock, data.physical_stock);
      }
    }

    return super.create(params);
  },

  // Override update method untuk auto-recalculate
  async update(entityId, params) {
    const { data } = params;

    // Get current data untuk mendapatkan material dan stock_opname
    const currentItem = await strapi.entityService.findOne('api::stock-opname-item.stock-opname-item', entityId, {
      populate: ['material', 'stock_opname']
    });

    // Re-calculate system stock jika material atau stock_opname berubah
    if ((data.material || currentItem?.material) && (data.stock_opname || currentItem?.stock_opname)) {
      const materialId = data.material || currentItem.material.id;
      const stockOpnameId = data.stock_opname || currentItem.stock_opname.id;

      const systemStock = await this.generateSystemStock(stockOpnameId, materialId);
      data.system_stock = systemStock;

      // Re-calculate difference dan variance status
      const physicalStock = data.physical_stock !== undefined ? data.physical_stock : currentItem.physical_stock;
      if (physicalStock !== undefined) {
        const difference = physicalStock - systemStock;
        data.difference = difference;
        data.variance_status = await this.updateVarianceStatus(systemStock, physicalStock);
      }
    }

    return super.update(entityId, params);
  },

  // Method untuk mendapatkan ringkasan variance per stock opname
  async getVarianceSummary(stockOpnameId) {
    const items = await strapi.entityService.findMany('api::stock-opname-item.stock-opname-item', {
      where: { stock_opname: stockOpnameId },
      populate: ['material']
    });

    const summary = {
      total_items: items.length,
      matched_items: 0,
      over_items: 0,
      short_items: 0,
      total_variance: 0,
      variance_details: []
    };

    items.forEach(item => {
      // Update counters
      if (item.variance_status === 'Match') {
        summary.matched_items++;
      } else if (item.variance_status === 'Over') {
        summary.over_items++;
      } else if (item.variance_status === 'Short') {
        summary.short_items++;
      }

      // Add to total variance
      summary.total_variance += item.difference || 0;

      // Add detail for significant variances
      if (Math.abs(item.difference || 0) > 0) {
        summary.variance_details.push({
          material_name: item.material?.nama_material || item.material_name,
          system_stock: item.system_stock,
          physical_stock: item.physical_stock,
          difference: item.difference,
          variance_status: item.variance_status,
          unit: item.unit
        });
      }
    });

    return summary;
  }
}));