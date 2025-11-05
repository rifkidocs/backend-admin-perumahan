const generatePRNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
  return `PR-${year}-${random}`;
};

module.exports = {
  beforeCreate(event) {
    // Auto-generate PR number if not provided
    if (!event.params.data.pr_number) {
      event.params.data.pr_number = generatePRNumber();
    }

    // Set default request_date if not provided
    if (!event.params.data.request_date) {
      event.params.data.request_date = new Date();
    }

    // Calculate total_price if unit_price and quantity are provided
    if (event.params.data.quantity && event.params.data.unit_price) {
      event.params.data.total_price = event.params.data.quantity * event.params.data.unit_price;
    }

    // Set default status_purchase if not provided
    if (!event.params.data.status_purchase) {
      event.params.data.status_purchase = 'submitted';
    }

    // Set default priority if not provided
    if (!event.params.data.priority) {
      event.params.data.priority = 'normal';
    }

    // Set default request_type if not provided
    if (!event.params.data.request_type) {
      event.params.data.request_type = 'Proyek';
    }
  },

  beforeUpdate(event) {
    // Recalculate total_price if unit_price or quantity are updated
    if (event.params.data.quantity !== undefined || event.params.data.unit_price !== undefined) {
      const quantity = event.params.data.quantity || event.result.data.quantity;
      const unitPrice = event.params.data.unit_price || event.result.data.unit_price;

      if (quantity && unitPrice) {
        event.params.data.total_price = quantity * unitPrice;
      }
    }

    // Set approved_date when status changes to approved
    if (event.params.data.status_purchase === 'approved' && !event.params.data.approved_date) {
      event.params.data.approved_date = new Date();
    }

    // Clear approved_date when status is no longer approved
    if (event.params.data.status_purchase && event.params.data.status_purchase !== 'approved') {
      event.params.data.approved_date = null;
      event.params.data.approved_by = null;
    }
  }
};