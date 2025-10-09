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
      try {
        const target = await strapi.entityService.findOne(
          'api::target-marketing.target-marketing',
          data.marketing_target,
          {
            populate: ['commission_payments'],
          }
        );

        if (target) {
          // Handle case where commission_payments might be null or undefined
          const payments = target.commission_payments || [];

          const totalPaid = payments.reduce(
            (sum, payment) => {
              // Only count completed payments
              if (payment.payment_status === 'completed') {
                return sum + (parseFloat(payment.amount_paid) || 0);
              }
              return sum;
            },
            0
          );
          const totalCommission = parseFloat(target.total_komisi) || 0;

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
      } catch (error) {
        console.error('Error in commission-payment afterCreate lifecycle:', error);
        // Don't throw error to prevent creation failure
      }
    }
  },

  async afterUpdate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update target payment status if payment status changed
    if (data.marketing_target || result.marketing_target) {
      const targetId = data.marketing_target || result.marketing_target;

      try {
        const target = await strapi.entityService.findOne(
          'api::target-marketing.target-marketing',
          targetId,
          {
            populate: ['commission_payments'],
          }
        );

        if (target) {
          // Handle case where commission_payments might be null or undefined
          const payments = target.commission_payments || [];

          const totalPaid = payments.reduce(
            (sum, payment) => {
              // Only count completed payments
              if (payment.payment_status === 'completed') {
                return sum + (parseFloat(payment.amount_paid) || 0);
              }
              return sum;
            },
            0
          );
          const totalCommission = parseFloat(target.total_komisi) || 0;

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
                tanggal_pembayaran: paymentStatus === 'lunas' ? payments[0]?.payment_date : null,
                metode_pembayaran: paymentStatus === 'lunas' ? payments[0]?.payment_method : null
              },
            }
          );
        }
      } catch (error) {
        console.error('Error in commission-payment afterUpdate lifecycle:', error);
        // Don't throw error to prevent update failure
      }
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Update target payment status after payment deletion
    if (result.marketing_target) {
      try {
        const target = await strapi.entityService.findOne(
          'api::target-marketing.target-marketing',
          result.marketing_target,
          {
            populate: ['commission_payments'],
          }
        );

        if (target) {
          // Handle case where commission_payments might be null or undefined
          const payments = target.commission_payments || [];

          const totalPaid = payments.reduce(
            (sum, payment) => {
              // Only count completed payments
              if (payment.payment_status === 'completed') {
                return sum + (parseFloat(payment.amount_paid) || 0);
              }
              return sum;
            },
            0
          );
          const totalCommission = parseFloat(target.total_komisi) || 0;

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
                tanggal_pembayaran: paymentStatus === 'lunas' ? payments[0]?.payment_date : null,
                metode_pembayaran: paymentStatus === 'lunas' ? payments[0]?.payment_method : null
              },
            }
          );
        }
      } catch (error) {
        console.error('Error in commission-payment afterDelete lifecycle:', error);
        // Don't throw error to prevent deletion failure
      }
    }
  },
};
