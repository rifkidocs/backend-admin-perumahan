const generatePurchaseOrderCode = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PO-${year}${month}${day}${random}`;
};

const generatePRNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
  return `PR-${year}-${random}`;
};

module.exports = {
  beforeCreate(event) {
    // Auto-generate PO code if not provided
    if (!event.params.data.kode) {
      event.params.data.kode = generatePurchaseOrderCode();
    }

    // Set default tanggal if not provided
    if (!event.params.data.tanggal) {
      event.params.data.tanggal = new Date();
    }

    // Calculate total_amount if items are provided
    if (event.params.data.items && Array.isArray(event.params.data.items)) {
      let total = 0;
      event.params.data.items.forEach(item => {
        if (item.jumlah && item.harga) {
          total += item.jumlah * item.harga;
        }
      });
      event.params.data.total_amount = total;
    }

    // Alternative calculation for materials field
    if (event.params.data.materials && Array.isArray(event.params.data.materials)) {
      let total = 0;
      event.params.data.materials.forEach(item => {
        if (item.quantity && item.unit_price) {
          total += item.quantity * item.unit_price;
        }
      });
      if (!event.params.data.total_amount) {
        event.params.data.total_amount = total;
      }
    }
  },

  beforeUpdate(event) {
    // Recalculate total_amount if items are updated
    if (event.params.data.items && Array.isArray(event.params.data.items)) {
      let total = 0;
      event.params.data.items.forEach(item => {
        if (item.jumlah && item.harga) {
          total += item.jumlah * item.harga;
        }
      });
      event.params.data.total_amount = total;
    }

    // Alternative calculation for materials field
    if (event.params.data.materials && Array.isArray(event.params.data.materials)) {
      let total = 0;
      event.params.data.materials.forEach(item => {
        if (item.quantity && item.unit_price) {
          total += item.quantity * item.unit_price;
        }
      });
      if (event.params.data.total_amount === undefined) {
        event.params.data.total_amount = total;
      }
    }

    // Update related purchase request status if this PO is linked
    if (event.params.data.purchase_request && (event.params.data.status_po === 'dikirim' || event.params.data.status_po === 'diterima')) {
      // You might want to add logic here to update the related PR status to 'processed'
      // This would require additional service calls
    }
  }
};