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

    if (!data.approval_status) {
      data.approval_status = 'pending';
    }

    if (!data.invoiceNumber && data.category && data.date) {
      const date = new Date(data.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      data.invoiceNumber = `KK-${year}${month}-${random}`;
    }

    if (data.amount && data.amount < 1000) {
      throw new Error('Amount minimal 1.000');
    }
  },

  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);
    const { data, where } = event.params;

    if (data.amount !== undefined) {
      data.amount = cleanNumber(data.amount);
    }

    const previousData = await strapi.db.query('api::kas-keluar.kas-keluar').findOne({
      where: where,
      populate: ['pos_keuangan']
    });

    if (data.approval_status === 'approved' && previousData?.approval_status !== 'approved') {
      if (!data.approvedAt) {
        data.approvedAt = new Date();
      }
    }

    if (previousData?.approval_status === 'approved' && data.approval_status === 'pending') {
      throw new Error('Cannot change approved transaction back to pending');
    }

    event.state = { previousData };
  },

  async afterUpdate(event) {
    const { result, state } = event;
    const { previousData } = state;

    if (result.approval_status === 'approved' && previousData?.approval_status !== 'approved') {
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
              saldo: parseFloat(currentPos.saldo || 0) - amount
            }
          });
        }
      }
    }

    // Log status changes for audit trail
    if (result.approval_status && result.approval_status !== previousData?.approval_status) {
      let userId = result.approvedBy?.id || result.updatedBy?.id || null;

      await strapi.db.query('api::audit-log.audit-log').create({
        data: {
          action: 'status_change',
          entity: 'kas-keluar',
          entityId: result.id,
          changes: { status: result.approval_status },
          timestamp: new Date(),
          userId: userId
        }
      });
    }
  },

  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);
  }
};
