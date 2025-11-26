module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.items && Array.isArray(data.items)) {
      // Validation Loop
      for (const item of data.items) {
        if (!item.material_gudang || !item.jumlah) continue;

        const sourceStock = await strapi.db
          .query("api::material-gudang.material-gudang")
          .findOne({
            where: { id: item.material_gudang },
            populate: ["gudang", "material"],
          });

        if (!sourceStock) {
          throw new Error(`Sumber stok (Material Gudang ID: ${item.material_gudang}) tidak ditemukan.`);
        }

        // Prevent sending to same warehouse
        if (
          data.gudang_tujuan &&
          Number(sourceStock.gudang?.id) === Number(data.gudang_tujuan)
        ) {
           throw new Error(`Gudang tujuan tidak boleh sama dengan gudang asal untuk material ${sourceStock.material?.nama_material || ''}`);
        }

        // Check Sufficiency
        if (Number(sourceStock.stok) < Number(item.jumlah)) {
          throw new Error(
            `Stok tidak mencukupi untuk ${sourceStock.material?.nama_material || 'item'}. Stok tersedia: ${sourceStock.stok}, Diminta: ${item.jumlah}`
          );
        }
      }
    }
  },

  async beforeUpdate(event) {
    const { params } = event;
    const { data, where } = params;

    // Capture old status
    if (data.status_distribusi) {
      const oldRecord = await strapi.db
        .query("api::distribusi-material.distribusi-material")
        .findOne({
          where: where,
          select: ["status_distribusi"],
        });
      params._oldStatus = oldRecord?.status_distribusi;
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const oldStatus = params._oldStatus;
    const newStatus = result.status_distribusi;

    if (!oldStatus || oldStatus === newStatus) return;

    // Populate deeply to get items and their nested material_gudang details
    const distribusi = await strapi.entityService.findOne(
      "api::distribusi-material.distribusi-material",
      result.id,
      {
        populate: {
          items: {
            populate: {
              material_gudang: {
                 populate: ["material", "gudang"]
              }
            }
          },
          gudang_tujuan: true,
        },
      }
    );

    if (!distribusi || !distribusi.items) return;

    const targetGudangId = distribusi.gudang_tujuan?.id;
    if (!targetGudangId) {
      console.error("Missing target gudang in distribusi record");
      return;
    }

    // Loop through all items to process stock changes
    for (const item of distribusi.items) {
        if(!item.material_gudang) continue;

        const sourceStockId = item.material_gudang.id;
        const materialId = item.material_gudang.material?.id;
        const qty = Number(item.jumlah);

        if (!materialId) continue;

        // Logic for Deducting Source
        if (
          newStatus === "Dikirim" ||
          (newStatus === "Diterima" && oldStatus === "Pending")
        ) {
          console.log(
            `🚚 Deducting stock from source stock ID ${sourceStockId} (Qty: ${qty})`
          );
          await updateStockById(sourceStockId, -qty, "distribusi-out");
        }

        // Logic for Adding Destination
        if (newStatus === "Diterima") {
          console.log(
            `📥 Adding stock to destination gudang ${targetGudangId} (Material ID: ${materialId}, Qty: ${qty})`
          );
          await updateStockByLocation(
            materialId,
            targetGudangId,
            qty,
            "distribusi-in"
          );
        }
    }
  },
};

// Update specific ID (Source)
async function updateStockById(id, qtyChange, reason) {
  const materialGudang = await strapi.entityService.findOne(
    "api::material-gudang.material-gudang",
    id
  );

  if (materialGudang) {
    const newStock =
      Math.round((Number(materialGudang.stok) + Number(qtyChange)) * 100) / 100;

    await strapi.entityService.update(
      "api::material-gudang.material-gudang",
      id,
      {
        data: {
          stok: newStock,
          last_updated_by: `system (${reason})`,
        },
      }
    );
  }
}

// Find/Create and Update (Destination)
async function updateStockByLocation(materialId, gudangId, qtyChange, reason) {
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
        `❌ Cannot deduct stock (Destination): Record not found for material ${materialId} in gudang ${gudangId}`
      );
    }
  }
}
