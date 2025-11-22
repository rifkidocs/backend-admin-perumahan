module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.material && data.gudang_asal && data.jumlah) {
      // Check stock in material-gudang
      const materialGudang = await strapi.db
        .query("api::material-gudang.material-gudang")
        .findOne({
          where: {
            material: data.material,
            gudang: data.gudang_asal,
          },
        });

      if (
        !materialGudang ||
        Number(materialGudang.stok) < Number(data.jumlah)
      ) {
        throw new Error(
          `Stok tidak mencukupi di gudang asal. Stok tersedia: ${
            materialGudang ? materialGudang.stok : 0
          }`
        );
      }
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;

    if (data.status) {
      const oldRecord = await strapi.db
        .query("api::distribusi-material.distribusi-material")
        .findOne({
          where: where,
          select: ["status"],
        });
      params._oldStatus = oldRecord?.status;
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const { data } = params;
    const oldStatus = params._oldStatus;
    const newStatus = result.status;

    if (!oldStatus || oldStatus === newStatus) return;

    const distribusi = await strapi.entityService.findOne(
      "api::distribusi-material.distribusi-material",
      result.id,
      {
        populate: ["material", "gudang_asal", "gudang_tujuan"],
      }
    );

    if (!distribusi) return;

    const materialId = distribusi.material.id;
    const qty = Number(distribusi.jumlah);

    // Logic for Deducting Source
    // Trigger: Transition to 'Dikirim' OR Transition to 'Diterima' directly from 'Pending'
    if (
      newStatus === "Dikirim" ||
      (newStatus === "Diterima" && oldStatus === "Pending")
    ) {
      console.log(
        `🚚 Deducting stock from source gudang ${distribusi.gudang_asal.id}`
      );
      await updateStock(
        materialId,
        distribusi.gudang_asal.id,
        -qty,
        "distribusi-out"
      );
    }

    // Logic for Adding Destination
    // Trigger: Transition to 'Diterima'
    if (newStatus === "Diterima") {
      console.log(
        `📥 Adding stock to destination gudang ${distribusi.gudang_tujuan.id}`
      );
      await updateStock(
        materialId,
        distribusi.gudang_tujuan.id,
        qty,
        "distribusi-in"
      );
    }
  },
};

async function updateStock(materialId, gudangId, qtyChange, reason) {
  const materialGudang = await strapi.db
    .query("api::material-gudang.material-gudang")
    .findOne({
      where: {
        material: materialId,
        gudang: gudangId,
      },
    });

  if (materialGudang) {
    const newStock =
      Math.round((Number(materialGudang.stok) + Number(qtyChange)) * 100) / 100;

    await strapi.entityService.update(
      "api::material-gudang.material-gudang",
      materialGudang.id,
      {
        data: {
          stok: newStock,
          last_updated_by: `system (${reason})`,
        },
      }
    );
  } else {
    if (qtyChange > 0) {
      // Create if adding stock
      await strapi.entityService.create(
        "api::material-gudang.material-gudang",
        {
          data: {
            material: materialId,
            gudang: gudangId,
            stok: qtyChange,
            stok_minimal: 0,
            last_updated_by: `system (${reason})`,
          },
        }
      );
    } else {
      console.error(
        `❌ Cannot deduct stock: Record not found for material ${materialId} in gudang ${gudangId}`
      );
    }
  }
}
