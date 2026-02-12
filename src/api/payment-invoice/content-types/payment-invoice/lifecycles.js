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
    if (data.paid_amount === undefined) {
      data.paid_amount = 0;
    }
    if (data.remaining_amount === undefined) {
      data.remaining_amount = data.amount;
    }
    if (!data.payment_history) {
      data.payment_history = [];
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
    data.remaining_amount = data.amount - (data.paid_amount || 0);

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
        const supplier = await strapi.documents('api::supplier.supplier').findOne({
          documentId: result.supplier.documentId || result.supplier
        });
        if (supplier) {
          await strapi.documents('api::supplier.supplier').update({
            documentId: supplier.documentId,
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
    const documentId = where.documentId || where.id;

    if (!documentId) return;

    // Get current invoice for comparison using Document Service
    const currentInvoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
      documentId: documentId,
      populate: ['payment_history']
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
    if (data.paid_amount !== undefined && data.paid_amount !== currentInvoice.paid_amount) {
      const amount = data.amount !== undefined ? data.amount : currentInvoice.amount;
      data.remaining_amount = amount - data.paid_amount;

      // Auto-update status pembayaran based on payment
      if (data.paid_amount >= amount) {
        data.status_pembayaran = 'paid';
        data.fullyPaidDate = new Date().toISOString();
      } else if (data.paid_amount > 0 && data.paid_amount < amount) {
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
    const { result } = event;
    const { where } = event.params;
    const documentId = where.documentId || where.id;

    if (result && result.status_pembayaran === 'paid' && result.fullyPaidDate) {
      console.log(`Invoice ${result.invoiceNumber} has been fully paid on ${result.fullyPaidDate}`);
    }
  },

  // Before deleting an invoice
  async beforeDelete(event) {
    await cleanupMediaOnDelete(event);

    const { where } = event.params;
    const documentId = where.documentId || where.id;

    if (!documentId) return;

    // Get invoice details for cleanup
    const invoice = await strapi.documents('api::payment-invoice.payment-invoice').findOne({
      documentId: documentId
    });

    if (invoice) {
      // Log deletion
      console.log(`Deleting invoice ${invoice.invoiceNumber} with amount ${invoice.amount}`);

      // If invoice has payments, prevent deletion
      if (invoice.paid_amount > 0) {
        throw new Error('Cannot delete invoice with existing payments');
      }
    }
  },

  // After deleting an invoice
  async afterDelete(event) {
    const { result } = event;

    if (result && result.invoiceNumber) {
      console.log(`Invoice ${result.invoiceNumber} has been deleted`);
    }
  }
};
