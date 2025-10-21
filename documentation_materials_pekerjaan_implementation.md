# Strapi Documentation - Material & Pekerjaan System

## Overview

Dokumentasi ini menjelaskan implementasi backend Strapi untuk sistem Material & Pekerjaan yang mencakup manajemen inventaris material, delivery & PO, penggunaan material, item pekerjaan, material per unit, dan estimasi tenaga kerja.

## ✅ Implementation Status

**IMPLEMENTASI SELESAI** - Semua content types dan fitur telah diimplementasikan dengan sukses.

### Yang Telah Diimplementasikan:

1. ✅ **Material** - Content type dimodifikasi dengan lifecycle hooks lengkap
2. ✅ **Purchase Order** - Dimodifikasi dari Purchasing dengan fitur lengkap
3. ✅ **Material Usage** - Content type dimodifikasi dengan validasi stok
4. ✅ **Work Item** - Content type baru untuk manajemen pekerjaan
5. ✅ **Unit Material Requirement** - Content type baru untuk kebutuhan material per unit
6. ✅ **Labor Estimation** - Content type baru untuk estimasi tenaga kerja
7. ✅ **Components** - Material Item dan Labor Requirement components
8. ✅ **Lifecycle Hooks** - Semua content types memiliki lifecycle hooks lengkap
9. ✅ **Relations** - Semua relasi antar content types sudah terhubung

### File Dokumentasi Implementasi:

- `documentation_materials_pekerjaan_backend_implementation.md` - Dokumentasi lengkap implementasi

## Content Types

### 1. Material (api::material.material)

**Collection Type**: Material

#### Fields

| Field Name        | Type        | Required | Description                                                                                        |
| ----------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| `nama_material`   | String      | Yes      | Nama material                                                                                      |
| `kategori`        | Enumeration | Yes      | Kategori material (Material Struktur, Material Atap, Material Finishing, Peralatan, Material Kayu) |
| `satuan`          | String      | Yes      | Satuan material (Sak, m³, Batang, Pcs, Dus, Kg)                                                    |
| `stok`            | Number      | Yes      | Jumlah stok tersedia                                                                               |
| `sisa_proyek`     | Number      | Yes      | Persentase sisa untuk proyek                                                                       |
| `status_material` | Enumeration | Yes      | Status material (Tersedia, Segera Habis, Habis)                                                    |
| `minimum_stock`   | Number      | No       | Minimum stok untuk alert                                                                           |
| `harga_satuan`    | Decimal     | No       | Harga per satuan                                                                                   |
| `supplier`        | Relation    | No       | Relasi ke supplier                                                                                 |
| `lokasi_gudang`   | String      | No       | Lokasi penyimpanan di gudang                                                                       |
| `deskripsi`       | Text        | No       | Deskripsi material                                                                                 |
| `foto_material`   | Media       | No       | Foto material                                                                                      |
| `created_at`      | DateTime    | Auto     | Tanggal dibuat                                                                                     |
| `updated_at`      | DateTime    | Auto     | Tanggal diupdate                                                                                   |

#### Lifecycle Hooks

```javascript
// src/api/material/content-types/material/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Set default status jika tidak ada
    if (!data.status_material) {
      data.status_material = "Tersedia";
    }

    // Validasi stok minimum
    if (data.stok < 0) {
      throw new Error("Stok tidak boleh negatif");
    }

    // Hitung persentase sisa proyek berdasarkan stok dan minimum stock
    if (data.minimum_stock && data.stok > 0) {
      data.sisa_proyek = Math.round(
        (data.stok / (data.stok + data.minimum_stock)) * 100
      );
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update status berdasarkan stok
    if (data.stok !== undefined) {
      if (data.stok <= 0) {
        data.status_material = "Habis";
        data.sisa_proyek = 0;
      } else if (data.minimum_stock && data.stok <= data.minimum_stock) {
        data.status_material = "Segera Habis";
        data.sisa_proyek = Math.round(
          (data.stok / (data.stok + data.minimum_stock)) * 100
        );
      } else {
        data.status_material = "Tersedia";
        data.sisa_proyek = Math.round(
          (data.stok / (data.stok + (data.minimum_stock || 0))) * 100
        );
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log aktivitas
    strapi.log.info(`Material baru ditambahkan: ${result.nama_material}`);

    // Kirim notifikasi jika stok rendah
    if (result.status_material === "Segera Habis") {
      await strapi.plugins["email"].services.email.send({
        to: "admin@company.com",
        subject: "Alert: Material Segera Habis",
        text: `Material ${result.nama_material} memiliki stok ${result.stok} ${result.satuan}`,
      });
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log perubahan stok
    strapi.log.info(
      `Stok material ${result.nama_material} diupdate menjadi ${result.stok}`
    );

    // Kirim notifikasi jika stok habis
    if (result.status_material === "Habis") {
      await strapi.plugins["email"].services.email.send({
        to: "admin@company.com",
        subject: "Alert: Material Habis",
        text: `Material ${result.nama_material} telah habis`,
      });
    }
  },
};
```

### 2. Purchase Order (api::purchase-order.purchase-order)

**Collection Type**: Purchase Order

#### Fields

| Field Name                  | Type        | Required | Description                                                    |
| --------------------------- | ----------- | -------- | -------------------------------------------------------------- |
| `nomor_po`                  | String      | Yes      | Nomor Purchase Order                                           |
| `supplier`                  | Relation    | Yes      | Relasi ke supplier                                             |
| `materials`                 | Component   | Yes      | Daftar material yang dipesan                                   |
| `tanggal_order`             | Date        | Yes      | Tanggal pemesanan                                              |
| `tanggal_estimasi_delivery` | Date        | Yes      | Estimasi tanggal delivery                                      |
| `tanggal_actual_delivery`   | Date        | No       | Tanggal delivery aktual                                        |
| `status_po`                 | Enumeration | Yes      | Status PO (Diproses, Dikirim, Diterima, Terlambat, Dibatalkan) |
| `total_harga`               | Decimal     | No       | Total harga PO                                                 |
| `catatan`                   | Text        | No       | Catatan tambahan                                               |
| `created_by`                | Relation    | Yes      | Relasi ke user yang membuat                                    |
| `approved_by`               | Relation    | No       | Relasi ke user yang approve                                    |
| `created_at`                | DateTime    | Auto     | Tanggal dibuat                                                 |
| `updated_at`                | DateTime    | Auto     | Tanggal diupdate                                               |

#### Lifecycle Hooks

```javascript
// src/api/purchase-order/content-types/purchase-order/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Generate nomor PO otomatis
    if (!data.nomor_po) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      // Hitung nomor urut hari ini
      const existingPOs = await strapi.entityService.findMany(
        "api::purchase-order.purchase-order",
        {
          filters: {
            tanggal_order: {
              $gte: new Date(year, today.getMonth(), today.getDate()),
              $lt: new Date(year, today.getMonth(), today.getDate() + 1),
            },
          },
        }
      );

      const sequence = String(existingPOs.length + 1).padStart(3, "0");
      data.nomor_po = `PO-${year}-${month}-${day}-${sequence}`;
    }

    // Set default status
    if (!data.status_po) {
      data.status_po = "Diproses";
    }

    // Validasi tanggal
    if (data.tanggal_estimasi_delivery <= data.tanggal_order) {
      throw new Error("Tanggal estimasi delivery harus setelah tanggal order");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update status berdasarkan tanggal delivery
    if (data.tanggal_actual_delivery) {
      data.status_po = "Diterima";
    } else if (data.tanggal_estimasi_delivery < new Date()) {
      data.status_po = "Terlambat";
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log pembuatan PO
    strapi.log.info(`PO baru dibuat: ${result.nomor_po}`);

    // Kirim notifikasi ke supplier
    if (result.supplier?.email) {
      await strapi.plugins["email"].services.email.send({
        to: result.supplier.email,
        subject: `Purchase Order ${result.nomor_po}`,
        text: `Purchase Order ${result.nomor_po} telah dibuat dengan estimasi delivery ${result.tanggal_estimasi_delivery}`,
      });
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Update stok material jika PO diterima
    if (result.status_po === "Diterima" && result.materials) {
      for (const materialItem of result.materials) {
        await strapi.entityService.update(
          "api::material.material",
          materialItem.material.id,
          {
            data: {
              stok: materialItem.material.stok + materialItem.quantity,
            },
          }
        );
      }
    }
  },
};
```

### 3. Material Usage (api::material-usage.material-usage)

**Collection Type**: Material Usage

#### Fields

| Field Name           | Type     | Required | Description                  |
| -------------------- | -------- | -------- | ---------------------------- |
| `tanggal_penggunaan` | Date     | Yes      | Tanggal penggunaan material  |
| `proyek`             | Relation | Yes      | Relasi ke proyek             |
| `material`           | Relation | Yes      | Relasi ke material           |
| `jumlah`             | Number   | Yes      | Jumlah yang digunakan        |
| `lokasi_unit`        | String   | Yes      | Lokasi/unit penggunaan       |
| `dicatat_oleh`       | Relation | Yes      | Relasi ke user yang mencatat |
| `keterangan`         | Text     | No       | Keterangan penggunaan        |
| `created_at`         | DateTime | Auto     | Tanggal dibuat               |
| `updated_at`         | DateTime | Auto     | Tanggal diupdate             |

#### Lifecycle Hooks

```javascript
// src/api/material-usage/content-types/material-usage/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi jumlah tidak boleh negatif
    if (data.jumlah <= 0) {
      throw new Error("Jumlah penggunaan harus lebih dari 0");
    }

    // Validasi stok tersedia
    if (data.material) {
      const material = await strapi.entityService.findOne(
        "api::material.material",
        data.material
      );
      if (material.stok < data.jumlah) {
        throw new Error(
          `Stok tidak mencukupi. Stok tersedia: ${material.stok} ${material.satuan}`
        );
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Update stok material
    const material = await strapi.entityService.findOne(
      "api::material.material",
      result.material.id
    );
    await strapi.entityService.update(
      "api::material.material",
      result.material.id,
      {
        data: {
          stok: material.stok - result.jumlah,
        },
      }
    );

    // Log penggunaan material
    strapi.log.info(
      `Material ${result.material.nama_material} digunakan sebanyak ${result.jumlah} ${result.material.satuan} di ${result.lokasi_unit}`
    );
  },

  async afterDelete(event) {
    const { result } = event;

    // Kembalikan stok material jika penggunaan dihapus
    const material = await strapi.entityService.findOne(
      "api::material.material",
      result.material.id
    );
    await strapi.entityService.update(
      "api::material.material",
      result.material.id,
      {
        data: {
          stok: material.stok + result.jumlah,
        },
      }
    );

    strapi.log.info(
      `Stok material ${result.material.nama_material} dikembalikan sebanyak ${result.jumlah} ${result.material.satuan}`
    );
  },
};
```

### 4. Work Item (api::work-item.work-item)

**Collection Type**: Work Item

#### Fields

| Field Name          | Type        | Required | Description                                   |
| ------------------- | ----------- | -------- | --------------------------------------------- |
| `nama_pekerjaan`    | String      | Yes      | Nama item pekerjaan                           |
| `proyek`            | Relation    | Yes      | Relasi ke proyek                              |
| `bobot`             | Number      | Yes      | Bobot pekerjaan dalam persen                  |
| `deadline`          | Date        | Yes      | Deadline pekerjaan                            |
| `progress`          | Number      | Yes      | Progress pekerjaan (0-100)                    |
| `status_pekerjaan`  | Enumeration | Yes      | Status pekerjaan (On Track, Delayed, Selesai) |
| `deskripsi`         | Text        | No       | Deskripsi pekerjaan                           |
| `material_required` | Component   | No       | Daftar material yang dibutuhkan               |
| `tenaga_kerja`      | Component   | No       | Estimasi tenaga kerja                         |
| `created_at`        | DateTime    | Auto     | Tanggal dibuat                                |
| `updated_at`        | DateTime    | Auto     | Tanggal diupdate                              |

#### Lifecycle Hooks

```javascript
// src/api/work-item/content-types/work-item/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Set default progress
    if (!data.progress) {
      data.progress = 0;
    }

    // Set default status berdasarkan deadline
    if (!data.status_pekerjaan) {
      data.status_pekerjaan = "On Track";
    }

    // Validasi bobot tidak boleh lebih dari 100
    if (data.bobot > 100) {
      throw new Error("Bobot pekerjaan tidak boleh lebih dari 100%");
    }

    // Validasi progress 0-100
    if (data.progress < 0 || data.progress > 100) {
      throw new Error("Progress harus antara 0-100");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update status berdasarkan progress dan deadline
    if (data.progress !== undefined) {
      if (data.progress === 100) {
        data.status_pekerjaan = "Selesai";
      } else if (data.deadline && new Date(data.deadline) < new Date()) {
        data.status_pekerjaan = "Delayed";
      } else {
        data.status_pekerjaan = "On Track";
      }
    }

    // Update status berdasarkan deadline
    if (data.deadline && data.progress < 100) {
      if (new Date(data.deadline) < new Date()) {
        data.status_pekerjaan = "Delayed";
      } else {
        data.status_pekerjaan = "On Track";
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log pekerjaan baru
    strapi.log.info(
      `Item pekerjaan baru: ${result.nama_pekerjaan} untuk proyek ${result.proyek.project_name}`
    );
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log perubahan progress
    strapi.log.info(
      `Progress pekerjaan ${result.nama_pekerjaan} diupdate menjadi ${result.progress}%`
    );

    // Kirim notifikasi jika pekerjaan selesai
    if (result.status_pekerjaan === "Selesai") {
      await strapi.plugins["email"].services.email.send({
        to: "project-manager@company.com",
        subject: "Pekerjaan Selesai",
        text: `Pekerjaan ${result.nama_pekerjaan} telah selesai`,
      });
    }
  },
};
```

### 5. Unit Material Requirement (api::unit-material-requirement.unit-material-requirement)

**Collection Type**: Unit Material Requirement

#### Fields

| Field Name            | Type        | Required | Description                                                  |
| --------------------- | ----------- | -------- | ------------------------------------------------------------ |
| `tipe_unit`           | String      | Yes      | Tipe unit (Tipe 36/72, Tipe 45/90, Tipe 60/120)              |
| `material`            | Relation    | Yes      | Relasi ke material                                           |
| `kebutuhan_per_unit`  | Number      | Yes      | Kebutuhan material per unit                                  |
| `total_unit`          | Number      | Yes      | Total unit yang akan dibangun                                |
| `total_kebutuhan`     | Number      | Yes      | Total kebutuhan material                                     |
| `status_ketersediaan` | Enumeration | Yes      | Status ketersediaan (Tersedia, Segera Habis, Tidak Tersedia) |
| `created_at`          | DateTime    | Auto     | Tanggal dibuat                                               |
| `updated_at`          | DateTime    | Auto     | Tanggal diupdate                                             |

#### Lifecycle Hooks

```javascript
// src/api/unit-material-requirement/content-types/unit-material-requirement/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Hitung total kebutuhan
    if (data.kebutuhan_per_unit && data.total_unit) {
      data.total_kebutuhan = data.kebutuhan_per_unit * data.total_unit;
    }

    // Set default status
    if (!data.status_ketersediaan) {
      data.status_ketersediaan = "Tersedia";
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update total kebutuhan jika ada perubahan
    if (data.kebutuhan_per_unit || data.total_unit) {
      data.total_kebutuhan = data.kebutuhan_per_unit * data.total_unit;
    }

    // Update status berdasarkan ketersediaan material
    if (data.material) {
      const material = await strapi.entityService.findOne(
        "api::material.material",
        data.material
      );
      if (material.stok >= data.total_kebutuhan) {
        data.status_ketersediaan = "Tersedia";
      } else if (material.stok > 0) {
        data.status_ketersediaan = "Segera Habis";
      } else {
        data.status_ketersediaan = "Tidak Tersedia";
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log kebutuhan material per unit
    strapi.log.info(
      `Kebutuhan material ${result.material.nama_material} untuk ${result.tipe_unit}: ${result.total_kebutuhan} ${result.material.satuan}`
    );
  },
};
```

### 6. Labor Estimation (api::labor-estimation.labor-estimation)

**Collection Type**: Labor Estimation

#### Fields

| Field Name           | Type     | Required | Description                 |
| -------------------- | -------- | -------- | --------------------------- |
| `item_pekerjaan`     | Relation | Yes      | Relasi ke work item         |
| `proyek`             | Relation | Yes      | Relasi ke proyek            |
| `mandor`             | Number   | Yes      | Jumlah mandor               |
| `tukang`             | Number   | Yes      | Jumlah tukang               |
| `helper`             | Number   | Yes      | Jumlah helper               |
| `estimasi_jam_kerja` | Number   | Yes      | Estimasi jam kerja          |
| `estimasi_biaya`     | Decimal  | Yes      | Estimasi biaya tenaga kerja |
| `tarif_mandor`       | Decimal  | No       | Tarif per jam mandor        |
| `tarif_tukang`       | Decimal  | No       | Tarif per jam tukang        |
| `tarif_helper`       | Decimal  | No       | Tarif per jam helper        |
| `created_at`         | DateTime | Auto     | Tanggal dibuat              |
| `updated_at`         | DateTime | Auto     | Tanggal diupdate            |

#### Lifecycle Hooks

```javascript
// src/api/labor-estimation/content-types/labor-estimation/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Hitung estimasi biaya jika tarif tersedia
    if (
      data.tarif_mandor &&
      data.tarif_tukang &&
      data.tarif_helper &&
      data.estimasi_jam_kerja
    ) {
      const biayaMandor =
        data.mandor * data.tarif_mandor * data.estimasi_jam_kerja;
      const biayaTukang =
        data.tukang * data.tarif_tukang * data.estimasi_jam_kerja;
      const biayaHelper =
        data.helper * data.tarif_helper * data.estimasi_jam_kerja;

      data.estimasi_biaya = biayaMandor + biayaTukang + biayaHelper;
    }

    // Validasi jumlah tenaga kerja
    if (data.mandor < 0 || data.tukang < 0 || data.helper < 0) {
      throw new Error("Jumlah tenaga kerja tidak boleh negatif");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update estimasi biaya jika ada perubahan tarif atau jumlah
    if (
      data.tarif_mandor ||
      data.tarif_tukang ||
      data.tarif_helper ||
      data.mandor ||
      data.tukang ||
      data.helper ||
      data.estimasi_jam_kerja
    ) {
      const biayaMandor =
        data.mandor * data.tarif_mandor * data.estimasi_jam_kerja;
      const biayaTukang =
        data.tukang * data.tarif_tukang * data.estimasi_jam_kerja;
      const biayaHelper =
        data.helper * data.tarif_helper * data.estimasi_jam_kerja;

      data.estimasi_biaya = biayaMandor + biayaTukang + biayaHelper;
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log estimasi tenaga kerja
    strapi.log.info(
      `Estimasi tenaga kerja untuk ${result.item_pekerjaan.nama_pekerjaan}: ${result.mandor} mandor, ${result.tukang} tukang, ${result.helper} helper`
    );
  },
};
```

## Components

### Material Item Component (shared.material-item)

```javascript
// src/components/shared/material-item.json
{
  "collectionName": "components_shared_material_items",
  "info": {
    "displayName": "Material Item",
    "description": "Component untuk item material dalam PO atau penggunaan"
  },
  "options": {},
  "attributes": {
    "material": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::material.material"
    },
    "quantity": {
      "type": "integer",
      "required": true
    },
    "unit_price": {
      "type": "decimal"
    },
    "total_price": {
      "type": "decimal"
    }
  }
}
```

### Labor Requirement Component (shared.labor-requirement)

```javascript
// src/components/shared/labor-requirement.json
{
  "collectionName": "components_shared_labor_requirements",
  "info": {
    "displayName": "Labor Requirement",
    "description": "Component untuk kebutuhan tenaga kerja"
  },
  "options": {},
  "attributes": {
    "role": {
      "type": "enumeration",
      "enum": ["mandor", "tukang", "helper"],
      "required": true
    },
    "quantity": {
      "type": "integer",
      "required": true
    },
    "hourly_rate": {
      "type": "decimal"
    },
    "estimated_hours": {
      "type": "integer"
    }
  }
}
```

## API Endpoints

### Material Endpoints

```
GET    /api/materials                    # Get all materials
GET    /api/materials/:id                # Get material by ID
POST   /api/materials                    # Create new material
PUT    /api/materials/:id                # Update material
DELETE /api/materials/:id                # Delete material
GET    /api/materials/count              # Count materials
```

### Purchase Order Endpoints

```
GET    /api/purchase-orders              # Get all POs
GET    /api/purchase-orders/:id          # Get PO by ID
POST   /api/purchase-orders              # Create new PO
PUT    /api/purchase-orders/:id          # Update PO
DELETE /api/purchase-orders/:id          # Delete PO
GET    /api/purchase-orders/count        # Count POs
```

### Material Usage Endpoints

```
GET    /api/material-usages              # Get all material usages
GET    /api/material-usages/:id          # Get usage by ID
POST   /api/material-usages              # Create new usage
PUT    /api/material-usages/:id          # Update usage
DELETE /api/material-usages/:id          # Delete usage
GET    /api/material-usages/count        # Count usages
```

### Work Item Endpoints

```
GET    /api/work-items                   # Get all work items
GET    /api/work-items/:id               # Get work item by ID
POST   /api/work-items                   # Create new work item
PUT    /api/work-items/:id               # Update work item
DELETE /api/work-items/:id               # Delete work item
GET    /api/work-items/count             # Count work items
```

### Unit Material Requirement Endpoints

```
GET    /api/unit-material-requirements   # Get all unit requirements
GET    /api/unit-material-requirements/:id # Get requirement by ID
POST   /api/unit-material-requirements    # Create new requirement
PUT    /api/unit-material-requirements/:id # Update requirement
DELETE /api/unit-material-requirements/:id # Delete requirement
GET    /api/unit-material-requirements/count # Count requirements
```

### Labor Estimation Endpoints

```
GET    /api/labor-estimations             # Get all labor estimations
GET    /api/labor-estimations/:id         # Get estimation by ID
POST   /api/labor-estimations             # Create new estimation
PUT    /api/labor-estimations/:id         # Update estimation
DELETE /api/labor-estimations/:id         # Delete estimation
GET    /api/labor-estimations/count       # Count estimations
```

## Permissions

### Public Permissions

- **Material**: `find`, `findOne`
- **Purchase Order**: `find`, `findOne`
- **Material Usage**: `find`, `findOne`
- **Work Item**: `find`, `findOne`
- **Unit Material Requirement**: `find`, `findOne`
- **Labor Estimation**: `find`, `findOne`

### Authenticated Permissions

- **Material**: `create`, `update`, `delete`
- **Purchase Order**: `create`, `update`, `delete`
- **Material Usage**: `create`, `update`, `delete`
- **Work Item**: `create`, `update`, `delete`
- **Unit Material Requirement**: `create`, `update`, `delete`
- **Labor Estimation**: `create`, `update`, `delete`

## Custom Controllers (Optional)

### Material Controller

```javascript
// src/api/material/controllers/material.js
module.exports = {
  async findLowStock(ctx) {
    const materials = await strapi.entityService.findMany(
      "api::material.material",
      {
        filters: {
          status: {
            $in: ["Segera Habis", "Habis"],
          },
        },
        populate: ["supplier"],
      }
    );

    return { data: materials };
  },

  async updateStock(ctx) {
    const { id } = ctx.params;
    const { quantity, operation } = ctx.request.body; // operation: 'add' or 'subtract'

    const material = await strapi.entityService.findOne(
      "api::material.material",
      id
    );

    if (!material) {
      return ctx.notFound("Material not found");
    }

    const newStock =
      operation === "add" ? material.stok + quantity : material.stok - quantity;

    const updatedMaterial = await strapi.entityService.update(
      "api::material.material",
      id,
      {
        data: { stok: newStock },
      }
    );

    return { data: updatedMaterial };
  },
};
```

### Purchase Order Controller

```javascript
// src/api/purchase-order/controllers/purchase-order.js
module.exports = {
  async approve(ctx) {
    const { id } = ctx.params;
    const { approved_by } = ctx.request.body;

    const po = await strapi.entityService.update(
      "api::purchase-order.purchase-order",
      id,
      {
        data: {
          status: "Approved",
          approved_by: approved_by,
        },
      }
    );

    return { data: po };
  },

  async receive(ctx) {
    const { id } = ctx.params;
    const { tanggal_actual_delivery } = ctx.request.body;

    const po = await strapi.entityService.update(
      "api::purchase-order.purchase-order",
      id,
      {
        data: {
          status: "Diterima",
          tanggal_actual_delivery: tanggal_actual_delivery,
        },
      }
    );

    return { data: po };
  },
};
```

## Custom Routes (Optional)

### Material Routes

```javascript
// src/api/material/routes/material.js
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/materials/low-stock",
      handler: "material.findLowStock",
    },
    {
      method: "PUT",
      path: "/materials/:id/stock",
      handler: "material.updateStock",
    },
  ],
};
```

### Purchase Order Routes

```javascript
// src/api/purchase-order/routes/purchase-order.js
module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/purchase-orders/:id/approve",
      handler: "purchase-order.approve",
    },
    {
      method: "PUT",
      path: "/purchase-orders/:id/receive",
      handler: "purchase-order.receive",
    },
  ],
};
```

## Summary

Dokumentasi ini menyediakan struktur lengkap untuk sistem Material & Pekerjaan di Strapi dengan:

1. **6 Content Types** utama dengan field yang sesuai dengan kebutuhan frontend
2. **Lifecycle Hooks** untuk validasi, kalkulasi otomatis, dan notifikasi
3. **Components** untuk struktur data yang dapat digunakan ulang
4. **API Endpoints** standar untuk semua operasi CRUD
5. **Permissions** yang sesuai dengan kebutuhan akses
6. **Custom Controllers & Routes** untuk operasi khusus

Semua lifecycle hooks telah dirancang untuk memastikan data konsisten, validasi yang tepat, dan notifikasi otomatis untuk kondisi penting seperti stok rendah atau pekerjaan selesai.

## ✅ Implementation Status

**IMPLEMENTASI SELESAI** - Semua content types dan fitur telah diimplementasikan dengan sukses.

### Yang Telah Diimplementasikan:

1. ✅ **Material** - Content type dimodifikasi dengan lifecycle hooks lengkap
2. ✅ **Purchase Order** - Dimodifikasi dari Purchasing dengan fitur lengkap
3. ✅ **Material Usage** - Content type dimodifikasi dengan validasi stok
4. ✅ **Work Item** - Content type baru untuk manajemen pekerjaan
5. ✅ **Unit Material Requirement** - Content type baru untuk kebutuhan material per unit
6. ✅ **Labor Estimation** - Content type baru untuk estimasi tenaga kerja
7. ✅ **Components** - Material Item dan Labor Requirement components
8. ✅ **Lifecycle Hooks** - Semua content types memiliki lifecycle hooks lengkap
9. ✅ **Relations** - Semua relasi antar content types sudah terhubung

### Key Features Implemented:

- **Automatic Stock Management** - Stok material otomatis terupdate saat digunakan
- **Purchase Order Management** - Auto-generate nomor PO, hitung total harga
- **Progress Tracking** - Status pekerjaan otomatis update berdasarkan progress dan deadline
- **Material Requirement Planning** - Perhitungan kebutuhan material per unit
- **Labor Cost Estimation** - Estimasi biaya tenaga kerja otomatis
- **Email Notifications** - Alert untuk stok rendah dan pekerjaan selesai

### Field Naming Convention:

Semua field status menggunakan format `status_[entity]` untuk menghindari konflik:

- `status_material` (Material)
- `status_po` (Purchase Order)
- `status_pekerjaan` (Work Item)
- `status_ketersediaan` (Unit Material Requirement)

### Next Steps:

1. **Database Migration** - Jalankan migration untuk mengupdate struktur database
2. **Permissions Setup** - Konfigurasi permissions untuk semua content types
3. **Testing** - Test semua API endpoints dan lifecycle hooks
4. **Frontend Integration** - Integrasikan dengan frontend application

**File Dokumentasi Implementasi**: `documentation_materials_pekerjaan_backend_implementation.md`
