'use strict';

/**
 * pengeluaran-material service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pengeluaran-material.pengeluaran-material', ({ strapi }) => ({
  // Generate unique distribution number
  async generateDistributionNumber() {
    const currentYear = new Date().getFullYear();

    const count = await strapi.entityService.count('api::pengeluaran-material.pengeluaran-material', {
      filters: {
        distributionNumber: {
          $startsWith: `DIST-${currentYear}`,
        },
      },
    });

    const nextNumber = String(count + 1).padStart(3, '0');
    return `DIST-${currentYear}-${nextNumber}`;
  },

  // Check if material has sufficient stock
  async checkStockAvailability(materialId, requestedQuantity) {
    try {
      const material = await strapi.entityService.findOne('api::material.material', materialId);

      if (!material) {
        throw new Error(`Material with ID ${materialId} not found`);
      }

      // This would integrate with your inventory/stock system
      // For now, we'll assume sufficient stock
      // TODO: Implement actual stock checking logic

      return {
        available: true,
        materialName: material.nama_material || material.name,
        requestedQuantity,
        availableStock: 999999, // Placeholder
        sufficient: true,
      };
    } catch (error) {
      strapi.log.error('Error checking stock availability:', error);
      throw error;
    }
  },

  // Validate status transition
  validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      'pending': ['in-transit', 'delivered', 'approved', 'rejected'],
      'in-transit': ['delivered'],
      'delivered': [],
      'Pending': ['Sedang Diproses', 'Selesai'],
      'Sedang Diproses': ['Selesai'],
      'Selesai': [],
      'approved': ['in-transit', 'delivered'],
      'rejected': []
    };

    const isValid = validTransitions[currentStatus]?.includes(newStatus) || false;

    if (!isValid) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    return true;
  },

  // Get distributions by date range
  async getDistributionsByDateRange(startDate, endDate, filters = {}) {
    const dateFilters = {
      ...filters,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    return await strapi.entityService.findMany('api::pengeluaran-material.pengeluaran-material', {
      filters: dateFilters,
      populate: {
        project: true,
        material: true,
        driver: true,
        escort: true,
        supervisor: true,
        unit_rumah: true,
        fasilitas_proyek: true,
        approver: true,
        warehouseSupervisor: true,
      },
      sort: [{ date: 'desc' }, { time: 'desc' }],
    });
  },

  // Get distributions by project
  async getDistributionsByProject(projectId, status = null) {
    const filters = { project: projectId };

    if (status) {
      filters.status_issuance = status;
    }

    return await strapi.entityService.findMany('api::pengeluaran-material.pengeluaran-material', {
      filters,
      populate: {
        material: true,
        driver: true,
        escort: true,
        supervisor: true,
        unit_rumah: true,
        fasilitas_proyek: true,
      },
      sort: [{ date: 'desc' }, { time: 'desc' }],
    });
  },

  // Get dashboard statistics
  async getDashboardStats(filters = {}) {
    const distributions = await strapi.entityService.findMany('api::pengeluaran-material.pengeluaran-material', {
      filters,
      populate: ['project', 'material'],
    });

    const stats = {
      total: distributions.length,
      pending: distributions.filter(d => d.status_issuance === 'pending' || d.status_issuance === 'Pending').length,
      inTransit: distributions.filter(d => d.status_issuance === 'in-transit' || d.status_issuance === 'Sedang Diproses').length,
      delivered: distributions.filter(d => d.status_issuance === 'delivered' || d.status_issuance === 'Selesai').length,
      totalQuantity: distributions.reduce((sum, d) => sum + (d.quantity || 0), 0),
      totalCost: distributions.reduce((sum, d) => sum + (d.deliveryCost || 0), 0),
      uniqueProjects: [...new Set(distributions.map(d => d.project?.id).filter(Boolean))].length,
      uniqueMaterials: [...new Set(distributions.map(d => d.material?.id).filter(Boolean))].length,
    };

    return stats;
  },

  // Update distribution with status tracking
  async updateDistributionStatus(id, status, additionalData = {}) {
    const distribution = await strapi.entityService.findOne('api::pengeluaran-material.pengeluaran-material', id);

    if (!distribution) {
      throw new Error('Distribution not found');
    }

    // Validate status transition
    this.validateStatusTransition(distribution.status_issuance, status);

    const updateData = {
      status_issuance: status,
      ...additionalData,
    };

    // Auto-set timestamps based on status
    if (status === 'in-transit' && !distribution.departureTime) {
      updateData.departureTime = new Date();
    }

    if (status === 'delivered' && !distribution.actualArrival) {
      updateData.actualArrival = new Date();
    }

    return await strapi.entityService.update('api::pengeluaran-material.pengeluaran-material', id, {
      data: updateData,
    });
  },

  // Create distribution with validation
  async createDistribution(data) {
    // Auto-generate distribution number if not provided
    if (!data.mrNumber && !data.distributionNumber) {
      data.distributionNumber = await this.generateDistributionNumber();
    }

    // Validate stock availability
    if (data.material && data.quantity) {
      const stockCheck = await this.checkStockAvailability(data.material, data.quantity);
      if (!stockCheck.sufficient) {
        throw new Error(`Insufficient stock for ${stockCheck.materialName}. Available: ${stockCheck.availableStock}, Requested: ${stockCheck.requestedQuantity}`);
      }
    }

    // Create the distribution
    return await strapi.entityService.create('api::pengeluaran-material.pengeluaran-material', {
      data,
      populate: {
        project: true,
        material: true,
        driver: true,
        escort: true,
        supervisor: true,
        unit_rumah: true,
        fasilitas_proyek: true,
        approver: true,
        warehouseSupervisor: true,
      },
    });
  },

  // Get distributions by driver
  async getDistributionsByDriver(driverId, startDate = null, endDate = null) {
    const filters = { driver: driverId };

    if (startDate && endDate) {
      filters.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    return await strapi.entityService.findMany('api::pengeluaran-material.pengeluaran-material', {
      filters,
      populate: {
        project: true,
        material: true,
        escort: true,
        supervisor: true,
        unit_rumah: true,
        fasilitas_proyek: true,
      },
      sort: [{ date: 'desc' }, { time: 'desc' }],
    });
  },

  // Search distributions
  async searchDistributions(query, filters = {}) {
    const searchFilters = {
      ...filters,
      $or: [
        { mrNumber: { $containsi: query } },
        { distributionNumber: { $containsi: query } },
        { unit: { $containsi: query } },
        { notes: { $containsi: query } },
        { vehicle: { $containsi: query } },
        { vehicleNumber: { $containsi: query } },
      ],
    };

    return await strapi.entityService.findMany('api::pengeluaran-material.pengeluaran-material', {
      filters: searchFilters,
      populate: {
        project: true,
        material: true,
        driver: true,
        escort: true,
        supervisor: true,
        unit_rumah: true,
        fasilitas_proyek: true,
      },
      sort: [{ date: 'desc' }, { time: 'desc' }],
    });
  },
}));
