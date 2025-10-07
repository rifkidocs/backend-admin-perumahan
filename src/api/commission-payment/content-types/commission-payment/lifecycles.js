'use strict';

/**
 * commission-payment lifecycle
 */

module.exports = {
  async afterCreate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update target payment status based on total payments vs total commission
    if (data.marketing_target) {
      const target = await strapi.entityService.findOne(
        'api::target-marketing.target-marketing',
        data.marketing_target,
        {
          populate: ['commission_payments'],
        }
      );

      if (target) {
        const totalPaid = target.commission_payments.reduce(
          (sum, payment) => {
            // Only count completed payments
            if (payment.payment_status === 'completed') {
              return sum + payment.amount_paid;
            }
            return sum;
          },
          0
        );
        const totalCommission = target.total_komisi || 0;

        let paymentStatus = 'belum-dibayar';
        if (totalPaid >= totalCommission && totalCommission > 0) {
          paymentStatus = 'lunas';
        } else if (totalPaid > 0) {
          paymentStatus = 'sebagian';
        }

        await strapi.entityService.update(
          'api::target-marketing.target-marketing',
          data.marketing_target,
          {
            data: { 
              status_pembayaran_komisi: paymentStatus,
              tanggal_pembayaran: paymentStatus === 'lunas' ? data.payment_date : null,
              metode_pembayaran: paymentStatus === 'lunas' ? data.payment_method : null
            },
          }
        );
      }
    }
  },

  async afterUpdate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update target payment status if payment status changed
    if (data.marketing_target || result.marketing_target) {
      const targetId = data.marketing_target || result.marketing_target;
      
      const target = await strapi.entityService.findOne(
        'api::target-marketing.target-marketing',
        targetId,
        {
          populate: ['commission_payments'],
        }
      );

      if (target) {
        const totalPaid = target.commission_payments.reduce(
          (sum, payment) => {
            // Only count completed payments
            if (payment.payment_status === 'completed') {
              return sum + payment.amount_paid;
            }
            return sum;
          },
          0
        );
        const totalCommission = target.total_komisi || 0;

        let paymentStatus = 'belum-dibayar';
        if (totalPaid >= totalCommission && totalCommission > 0) {
          paymentStatus = 'lunas';
        } else if (totalPaid > 0) {
          paymentStatus = 'sebagian';
        }

        await strapi.entityService.update(
          'api::target-marketing.target-marketing',
          targetId,
          {
            data: { 
              status_pembayaran_komisi: paymentStatus,
              tanggal_pembayaran: paymentStatus === 'lunas' ? target.commission_payments[0]?.payment_date : null,
              metode_pembayaran: paymentStatus === 'lunas' ? target.commission_payments[0]?.payment_method : null
            },
          }
        );
      }
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Update target payment status after payment deletion
    if (result.marketing_target) {
      const target = await strapi.entityService.findOne(
        'api::target-marketing.target-marketing',
        result.marketing_target,
        {
          populate: ['commission_payments'],
        }
      );

      if (target) {
        const totalPaid = target.commission_payments.reduce(
          (sum, payment) => {
            // Only count completed payments
            if (payment.payment_status === 'completed') {
              return sum + payment.amount_paid;
            }
            return sum;
          },
          0
        );
        const totalCommission = target.total_komisi || 0;

        let paymentStatus = 'belum-dibayar';
        if (totalPaid >= totalCommission && totalCommission > 0) {
          paymentStatus = 'lunas';
        } else if (totalPaid > 0) {
          paymentStatus = 'sebagian';
        }

        await strapi.entityService.update(
          'api::target-marketing.target-marketing',
          result.marketing_target,
          {
            data: { 
              status_pembayaran_komisi: paymentStatus,
              tanggal_pembayaran: paymentStatus === 'lunas' ? target.commission_payments[0]?.payment_date : null,
              metode_pembayaran: paymentStatus === 'lunas' ? target.commission_payments[0]?.payment_method : null
            },
          }
        );
      }
    }
  },
};
