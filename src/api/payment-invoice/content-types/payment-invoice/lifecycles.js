'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * payment-invoice lifecycle hooks
 */

module.exports = {
  // Before creating an invoice
  async beforeCreate(event) {
    const { data } = event.params;

    // Generate invoice number if not provided
    if (!data.invoiceNumber) {
      const paymentInvoiceService = strapi.service('api::payment-invoice.payment-invoice');
      data.invoiceNumber = await paymentInvoiceService.generateInvoiceNumber();
    }

    // Validate invoice data
    const paymentInvoiceService = strapi.service('api::payment-invoice.payment-invoice');
    const validation = await paymentInvoiceService.validateInvoice(data);

    if (!validation.isValid) {
      throw new Error(`Invoice validation failed: ${validation.errors.join(', ')}`);
    }

    // Set default values
    if (!data.status_pembayaran) {
      data.status_pembayaran = 'pending';
    }
    if (!data.statusInvoice) {
      data.statusInvoice = 'received';
    }
    if (data.paidAmount === undefined) {
      data.paidAmount = 0;
    }
    if (data.remainingAmount === undefined) {
      data.remainingAmount = data.amount;
    }
    if (!data.paymentHistory) {
      data.paymentHistory = [];
    }
    if (data.overdueNotified === undefined) {
      data.overdueNotified = false;
    }
    if (!data.priority) {
      data.priority = 'normal';
    }
    if (data.taxIncluded === undefined) {
      data.taxIncluded = false;
    }
    if (data.penaltyAmount === undefined) {
      data.penaltyAmount = 0;
    }

    // Calculate remaining amount
    data.remainingAmount = data.amount - (data.paidAmount || 0);

    // Add creation timestamp in notes if not provided
    if (!data.notes) {
      data.notes = `Invoice created on ${new Date().toISOString().split('T')[0]}`;
    }
  },

  // After creating an invoice
  async afterCreate(event) {
    const { result } = event;

    // Update supplier total purchases if applicable
    if (result.supplier) {
      try {
        const supplier = await strapi.entityService.findOne('api::supplier.supplier', result.supplier);
        if (supplier) {
          await strapi.entityService.update('api::supplier.supplier', result.supplier, {
            data: {
              totalPurchases: (supplier.totalPurchases || 0) + result.amount,
              lastOrderDate: new Date().toISOString().split('T')[0]
            }
          });
        }
      } catch (error) {
        console.error('Failed to update supplier total purchases:', error);
      }
    }

    // Log creation
    console.log(`Invoice ${result.invoiceNumber} created successfully`);
  },

  // Before updating an invoice
  async beforeUpdate(event) {
    await cleanupMediaOnUpdate(event);

    const { data, where } = event.params;

    // Get current invoice for comparison
    const currentInvoice = await strapi.entityService.findOne('api::payment-invoice.payment-invoice', where.id, {
      populate: ['paymentHistory']
    });

    if (!currentInvoice) {
      return;
    }

    // Validate status transitions
    if (data.status_pembayaran && currentInvoice.status_pembayaran !== data.status_pembayaran) {
      const validTransitions = {
        'pending': ['partial', 'paid', 'cancelled'],
        'partial': ['paid', 'cancelled'],
        'paid': ['cancelled'],
        'overdue': ['paid', 'cancelled'],
        'cancelled': [] // Can't transition from cancelled
      };

      if (!validTransitions[currentInvoice.status_pembayaran].includes(data.status_pembayaran)) {
        throw new Error(`Invalid status transition from ${currentInvoice.status_pembayaran} to ${data.status_pembayaran}`);
      }
    }

    // Auto-calculate remaining amount if paid amount is updated
    if (data.paidAmount !== undefined && data.paidAmount !== currentInvoice.paidAmount) {
      data.remainingAmount = currentInvoice.amount - data.paidAmount;

      // Auto-update status pembayaran based on payment
      if (data.paidAmount >= currentInvoice.amount) {
        data.status_pembayaran = 'paid';
        data.fullyPaidDate = new Date().toISOString();
      } else if (data.paidAmount > 0 && data.paidAmount < currentInvoice.amount) {
        data.status_pembayaran = 'partial';
      }

      data.lastPaymentDate = new Date().toISOString();
    }

    // Check for overdue status
    if (data.dueDate || currentInvoice.dueDate) {
      const dueDate = new Date(data.dueDate || currentInvoice.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today && data.status_pembayaran !== 'paid' && data.status_pembayaran !== 'cancelled') {
        data.status_pembayaran = 'overdue';
      }
    }
  },

  // After updating an invoice
  async afterUpdate(event) {
    const { result, where } = event.params;

    // Check if status pembayaran changed to paid
    const currentInvoice = await strapi.entityService.findOne('api::payment-invoice.payment-invoice', where.id);
    if (currentInvoice && currentInvoice.status_pembayaran === 'paid' && currentInvoice.fullyPaidDate) {
      console.log(`Invoice ${result.invoiceNumber} has been fully paid on ${currentInvoice.fullyPaidDate}`);
    }

    // Log significant updates
    if (currentInvoice && currentInvoice.status_pembayaran !== result.status_pembayaran) {
      console.log(`Invoice ${result.invoiceNumber} status pembayaran changed from ${result.status_pembayaran} to ${currentInvoice.status_pembayaran}`);
    }
  },

  // Before deleting an invoice
  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);

    const { where } = event.params;

    // Get invoice details for cleanup
    const invoice = await strapi.entityService.findOne('api::payment-invoice.payment-invoice', where.id);

    if (invoice) {
      // Log deletion
      console.log(`Deleting invoice ${invoice.invoiceNumber} with amount ${invoice.amount}`);

      // If invoice has payments, prevent deletion
      if (invoice.paidAmount > 0) {
        throw new Error('Cannot delete invoice with existing payments');
      }
    }
  },

  // After deleting an invoice
  async afterDelete(event) {
    const { result } = event.params;

    if (result && result.invoiceNumber) {
      console.log(`Invoice ${result.invoiceNumber} has been deleted`);
    }
  }
};