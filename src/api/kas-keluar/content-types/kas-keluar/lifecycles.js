'use strict';

/**
 * kas-keluar lifecycles
 */

module.exports = {
  beforeCreate: async (data) => {
    // Set default values
    if (!data.approval_status) {
      data.approval_status = 'pending';
    }

    // Auto-generate invoice number if not provided
    if (!data.invoiceNumber && data.category && data.date) {
      const date = new Date(data.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      data.invoiceNumber = `KK-${year}${month}-${random}`;
    }

    // Validate amount minimum
    if (data.amount && data.amount < 1000) {
      throw new Error('Amount minimal 1.000');
    }

    // Validate category
    if (data.category && !['material', 'gaji', 'operasional', 'legal', 'lainnya'].includes(data.category)) {
      throw new Error('Invalid category');
    }

    // Validate payment method
    if (data.paymentMethod && !['transfer', 'cash', 'cek', 'giro'].includes(data.paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    // Validate department
    if (data.department && !['keuangan', 'gudang', 'hrm', 'project', 'marketing'].includes(data.department)) {
      throw new Error('Invalid department');
    }
  },

  beforeUpdate: async (params) => {
    // Extract data and where from the actual structure
    const data = params.params?.data || {};
    const where = params.params?.where || {};

    // Check if status is being changed to approved
    if (data.approval_status === 'approved') {
      // Set approval timestamp if not provided
      if (!data.approvedAt) {
        data.approvedAt = new Date();
      }

      // Require approvedBy for approval
      if (!data.approvedBy) {
        throw new Error('Approval requires approver');
      }
    }

    // Prevent status change from approved to pending
    const existing = await strapi.db.query('api::kas-keluar.kas-keluar').findOne({
      where: { id: where.id }
    });

    if (existing && existing.approval_status === 'approved' && data.approval_status === 'pending') {
      throw new Error('Cannot change approved transaction back to pending');
    }

    // Validate amount minimum
    if (data.amount && data.amount < 1000) {
      throw new Error('Amount minimal 1.000');
    }

    // Check for duplicate invoice number
    if (data.invoiceNumber) {
      const duplicate = await strapi.db.query('api::kas-keluar.kas-keluar').findOne({
        where: {
          invoiceNumber: data.invoiceNumber,
          id: { $ne: where.id }
        }
      });

      if (duplicate) {
        throw new Error('Nomor invoice sudah terdaftar dalam sistem');
      }
    }
  },

  afterCreate: async (result) => {
    // Get userId from the populated createdBy relationship
    let userId = null;
    if (result.createdBy && result.createdBy.id) {
      userId = result.createdBy.id;
    }

    // Log creation for audit trail
    await strapi.db.query('api::audit-log.audit-log').create({
      data: {
        action: 'create',
        entity: 'kas-keluar',
        entityId: result.id,
        changes: result.params.data, // Use the actual data that was submitted
        timestamp: new Date(),
        userId: userId
      }
    });
  },

  afterUpdate: async (result) => {
    // Log status changes for audit trail
    const data = result.params.data;
    if (data && data.approval_status) {
      // Get userId from the appropriate user relationship
      let userId = null;
      if (result.approvedBy && result.approvedBy.id) {
        userId = result.approvedBy.id;
      } else if (result.updatedBy && result.updatedBy.id) {
        userId = result.updatedBy.id;
      }

      await strapi.db.query('api::audit-log.audit-log').create({
        data: {
          action: 'status_change',
          entity: 'kas-keluar',
          entityId: result.id,
          changes: { status: data.approval_status },
          timestamp: new Date(),
          userId: userId
        }
      });
    }
  }
};