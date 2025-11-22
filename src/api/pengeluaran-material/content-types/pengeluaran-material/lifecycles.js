module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Decrement stock when status is 'approved'
    if (
      result.approvalStatus === "approved" &&
      result.material &&
      result.quantity &&
      result.gudang
    ) {
      await updateStock(result);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;

    // Check if status changed to 'approved'
    // We need to check if it wasn't approved before.
    // Ideally we should store old status in beforeUpdate like in penerimaan-material
    // But for now, let's assume if data.approvalStatus is present and is 'approved', it's a change.

    if (
      data.approvalStatus === "approved" &&
      result.approvalStatus === "approved" &&
      result.material &&
      result.quantity &&
      result.gudang
    ) {
      // Ideally we should check if it was already approved to avoid double deduction.
      // Let's implement beforeUpdate to be safe.
      if (params._oldStatus !== "approved") {
        await updateStock(result);
      }
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;

    if (data.approvalStatus) {
      const oldRecord = await strapi.db
        .query("api::pengeluaran-material.pengeluaran-material")
        .findOne({
          where: where,
          select: ["approvalStatus"],
        });
      params._oldStatus = oldRecord?.approvalStatus;
    }
  },
};

async function updateStock(record) {
  const materialId = record.material.id || record.material;
  const gudangId = record.gudang.id || record.gudang;
  const quantity = record.quantity;

  console.log(
    `📉 Processing issuance for material ${materialId} from gudang ${gudangId}, quantity: ${quantity}`
  );

  const materialGudang = await strapi.db
    .query("api::material-gudang.material-gudang")
    .findOne({
      where: {
        material: materialId,
        gudang: gudangId,
      },
    });

  if (materialGudang) {
    const newStock = Number(materialGudang.stok) - Number(quantity);

    if (newStock < 0) {
      strapi.log.warn(
        `⚠️ Stock negative for material ${materialId} in gudang ${gudangId}. Current: ${materialGudang.stok}, Issuance: ${quantity}`
      );
    }

    await strapi.entityService.update(
      "api::material-gudang.material-gudang",
      materialGudang.id,
      {
        data: {
          stok: newStock,
          last_updated_by: "system (pengeluaran)",
        },
      }
    );
    console.log(`✅ Stock deducted. New stock: ${newStock}`);
  } else {
    console.error(
      `❌ Material-Gudang record not found for material ${materialId} and gudang ${gudangId}`
    );
    // Optionally create it with negative stock if allowed, or just log error.
    // For now, let's log error.
  }
}
