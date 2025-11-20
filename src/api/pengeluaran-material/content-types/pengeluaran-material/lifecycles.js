module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Decrement stock when status is 'approved' or 'delivered'
    if (
      (result.approvalStatus === "approved" ||
        result.status_issuance === "delivered") &&
      result.material &&
      result.quantity
    ) {
      const materialId = result.material.id || result.material;

      const material = await strapi.entityService.findOne(
        "api::material.material",
        materialId,
        {
          fields: ["stok"],
        }
      );

      if (material) {
        const newStock = material.stok - result.quantity;

        if (newStock < 0) {
          strapi.log.warn(
            `Stock akan menjadi negatif untuk material ${materialId}. Stok saat ini: ${material.stok}, Pengeluaran: ${result.quantity}`
          );
        }

        await strapi.entityService.update(
          "api::material.material",
          material.id,
          {
            data: {
              stok: Math.max(0, newStock), // Prevent negative stock
            },
          }
        );
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'approved' or 'delivered'
    const statusChanged =
      data.approvalStatus === "approved" ||
      data.status_issuance === "delivered";

    if (
      statusChanged &&
      (result.approvalStatus === "approved" ||
        result.status_issuance === "delivered")
    ) {
      const materialId = result.material.id || result.material;
      const quantity = result.quantity;

      const material = await strapi.entityService.findOne(
        "api::material.material",
        materialId,
        {
          fields: ["stok"],
        }
      );

      if (material) {
        const newStock = material.stok - quantity;

        if (newStock < 0) {
          strapi.log.warn(
            `Stock akan menjadi negatif untuk material ${materialId}. Stok saat ini: ${material.stok}, Pengeluaran: ${quantity}`
          );
        }

        await strapi.entityService.update(
          "api::material.material",
          material.id,
          {
            data: {
              stok: Math.max(0, newStock), // Prevent negative stock
            },
          }
        );
      }
    }
  },
};
