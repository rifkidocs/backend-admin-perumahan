module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    // Generate automatic opname number if not provided
    if (!data.opname_number) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      data.opname_number = `OP-${year}-${month}-${random}`;
    }
  },

  afterCreate(event) {
    const { result } = event;

    // Log the creation of stock opname
    strapi.log.info(`Stock Opname created: ${result.opname_number}`);
  },

  beforeUpdate(event) {
    const { data, where } = event.params;

    // Calculate totals if stock_opname_items are being updated
    if (data.stock_opname_items) {
      // This would typically be handled in a service or controller
      // for better performance and transaction handling
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Recalculate totals when items are updated
    if (result.stock_opname_items && result.stock_opname_items.length > 0) {
      const totalItems = result.stock_opname_items.length;
      const totalVariance = result.stock_opname_items.reduce(
        (sum, item) => sum + (item.difference || 0), 0
      );

      await strapi.entityService.update(
        'api::stock-opname.stock-opname',
        result.id,
        {
          data: {
            total_items: totalItems,
            total_variance: totalVariance
          }
        }
      );
    }
  }
};