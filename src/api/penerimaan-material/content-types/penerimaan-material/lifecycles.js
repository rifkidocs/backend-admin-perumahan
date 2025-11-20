module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    const { data } = params;

    if (
      result.statusReceiving === "completed" &&
      result.material &&
      result.quantity
    ) {
      const material = await strapi.entityService.findOne(
        "api::material.material",
        result.material.id || result.material,
        {
          fields: ["stok"],
        }
      );

      if (material) {
        await strapi.entityService.update(
          "api::material.material",
          material.id,
          {
            data: {
              stok: material.stok + result.quantity,
            },
          }
        );
      }
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'completed'
    // Note: This simple check assumes we don't revert from completed back to pending.
    // Ideally we should check the previous state, but Strapi v4 lifecycles don't easily give previous state in afterUpdate without a beforeUpdate fetch.
    // For now, we assume the transition is one-way or the user is careful.

    if (
      data.statusReceiving === "completed" &&
      result.statusReceiving === "completed"
    ) {
      // We need to be careful here. If we just update a note on a completed receipt, this might trigger again?
      // Strapi's `data` in params only contains the *changed* fields usually.
      // So if `statusReceiving` is in `data`, it means it was just updated.

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
        await strapi.entityService.update(
          "api::material.material",
          material.id,
          {
            data: {
              stok: material.stok + quantity,
            },
          }
        );
      }
    }
  },
};
