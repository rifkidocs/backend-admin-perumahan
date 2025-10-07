# API Documentation - Marketing Targets & Commission System

## Overview

Dokumentasi API untuk sistem manajemen target penjualan dan komisi marketing menggunakan Strapi CMS. Sistem ini mendukung CRUD operations untuk data target marketing, tracking pencapaian, kalkulasi komisi, dan status pembayaran komisi per marketing staff.

## Content Types

### 1. Marketing Target (Content Type: `marketing-target`)

#### Fields

| Field Name                 | Type        | Required | Description                 | Validation                               |
| -------------------------- | ----------- | -------- | --------------------------- | ---------------------------------------- |
| `target_id`                | String      | Yes      | ID unik target              | Unique, Pattern: TGT-YYYY-XXX            |
| `periode`                  | String      | Yes      | Periode target              | Format: "YYYY-MM" (e.g., "2023-09")      |
| `target_unit`              | Integer     | Yes      | Target jumlah unit          | Min: 1                                   |
| `target_nominal`           | Decimal     | Yes      | Target nilai penjualan      | Min: 0                                   |
| `pencapaian_unit`          | Integer     | Yes      | Pencapaian unit terjual     | Min: 0, Default: 0                       |
| `pencapaian_nominal`       | Decimal     | Yes      | Pencapaian nilai penjualan  | Min: 0, Default: 0                       |
| `komisi_per_unit`          | JSON        | Yes      | Komisi per tipe unit        | JSON object dengan tipe unit sebagai key |
| `total_komisi`             | Decimal     | Auto     | Total komisi yang diperoleh | Auto-calculated                          |
| `status_pembayaran_komisi` | Enumeration | Yes      | Status pembayaran komisi    | Options: belum-dibayar, sebagian, lunas  |
| `tanggal_pembayaran`       | Date        | No       | Tanggal pembayaran komisi   | Date format                              |
| `metode_pembayaran`        | Enumeration | No       | Metode pembayaran komisi    | Options: transfer, cash, check           |
| `bukti_pembayaran`         | Media       | No       | Bukti pembayaran komisi     | Image/PDF file (max 5MB)                 |
| `notes`                    | Text        | No       | Catatan target              | Max: 1000                                |
| `created_at`               | DateTime    | Auto     | Tanggal dibuat              | Auto-generated                           |
| `updated_at`               | DateTime    | Auto     | Tanggal diupdate            | Auto-generated                           |

#### Relations

- `marketing_staff` (Many-to-One): Relation ke `marketing-staff`
- `project` (Many-to-One): Relation ke `project`
- `achievement_updates` (One-to-Many): Relation ke `achievement-update`
- `commission_payments` (One-to-Many): Relation ke `commission-payment`

### 2. Marketing Staff (Content Type: `marketing-staff`)

#### Fields

| Field Name   | Type     | Required | Description          | Validation                        |
| ------------ | -------- | -------- | -------------------- | --------------------------------- |
| `staff_id`   | String   | Yes      | ID unik staff        | Unique, Max: 20                   |
| `name`       | String   | Yes      | Nama marketing staff | Min: 2, Max: 100                  |
| `code`       | String   | Yes      | Kode unik staff      | Unique, Max: 20 (e.g., "Sales A") |
| `phone`      | String   | No       | Nomor telepon staff  | Pattern: Indonesian phone format  |
| `email`      | Email    | No       | Email staff          | Valid email format                |
| `position`   | String   | No       | Jabatan              | Max: 50                           |
| `department` | String   | No       | Departemen           | Max: 50                           |
| `is_active`  | Boolean  | Yes      | Status aktif         | Default: true                     |
| `created_at` | DateTime | Auto     | Tanggal dibuat       | Auto-generated                    |
| `updated_at` | DateTime | Auto     | Tanggal diupdate     | Auto-generated                    |

#### Relations

- `targets` (One-to-Many): Relation ke `marketing-target`
- `achievements` (One-to-Many): Relation ke `achievement-update`

### 3. Project (Content Type: `project`)

#### Fields

| Field Name        | Type        | Required | Description         | Validation                                  |
| ----------------- | ----------- | -------- | ------------------- | ------------------------------------------- |
| `project_id`      | String      | Yes      | ID unik proyek      | Unique, Pattern: PROJ-XXX                   |
| `project_name`    | String      | Yes      | Nama proyek         | Min: 2, Max: 100                            |
| `project_type`    | Enumeration | Yes      | Jenis proyek        | Options: perumahan, pembangunan, renovasi   |
| `location`        | String      | Yes      | Lokasi proyek       | Min: 5, Max: 200                            |
| `developer`       | String      | Yes      | Developer/Developer | Min: 2, Max: 100                            |
| `status`          | Enumeration | Yes      | Status proyek       | Options: planning, ongoing, completed, hold |
| `total_units`     | Integer     | Auto     | Total unit          | Auto-calculated                             |
| `available_units` | Integer     | Auto     | Unit tersedia       | Auto-calculated                             |
| `sold_units`      | Integer     | Auto     | Unit terjual        | Auto-calculated                             |
| `created_at`      | DateTime    | Auto     | Tanggal dibuat      | Auto-generated                              |
| `updated_at`      | DateTime    | Auto     | Tanggal diupdate    | Auto-generated                              |

#### Relations

- `targets` (One-to-Many): Relation ke `marketing-target`

### 4. Achievement Update (Content Type: `achievement-update`)

#### Fields

| Field Name          | Type     | Required | Description           | Validation      |
| ------------------- | -------- | -------- | --------------------- | --------------- |
| `update_date`       | Date     | Yes      | Tanggal update        | Required        |
| `unit_achieved`     | Integer  | Yes      | Unit yang dicapai     | Min: 0          |
| `nominal_achieved`  | Decimal  | Yes      | Nominal yang dicapai  | Min: 0          |
| `unit_breakdown`    | JSON     | Yes      | Rincian unit per tipe | JSON object     |
| `commission_earned` | Decimal  | Auto     | Komisi yang diperoleh | Auto-calculated |
| `notes`             | Text     | No       | Catatan pencapaian    | Max: 500        |
| `verified_by`       | String   | No       | Diverifikasi oleh     | Max: 100        |
| `verified_date`     | Date     | No       | Tanggal verifikasi    | Date format     |
| `created_at`        | DateTime | Auto     | Tanggal dibuat        | Auto-generated  |
| `updated_at`        | DateTime | Auto     | Tanggal diupdate      | Auto-generated  |

#### Relations

- `marketing_target` (Many-to-One): Relation ke `marketing-target`
- `marketing_staff` (Many-to-One): Relation ke `marketing-staff`

### 5. Commission Payment (Content Type: `commission-payment`)

#### Fields

| Field Name         | Type        | Required | Description         | Validation                          |
| ------------------ | ----------- | -------- | ------------------- | ----------------------------------- |
| `payment_date`     | Date        | Yes      | Tanggal pembayaran  | Required                            |
| `amount_paid`      | Decimal     | Yes      | Jumlah yang dibayar | Min: 0                              |
| `payment_method`   | Enumeration | Yes      | Metode pembayaran   | Options: transfer, cash, check      |
| `payment_status`   | Enumeration | Yes      | Status pembayaran   | Options: pending, completed, failed |
| `reference_number` | String      | No       | Nomor referensi     | Max: 50                             |
| `bank_account`     | String      | No       | Rekening tujuan     | Max: 100                            |
| `notes`            | Text        | No       | Catatan pembayaran  | Max: 500                            |
| `processed_by`     | String      | Yes      | Diproses oleh       | Max: 100                            |
| `created_at`       | DateTime    | Auto     | Tanggal dibuat      | Auto-generated                      |
| `updated_at`       | DateTime    | Auto     | Tanggal diupdate    | Auto-generated                      |

#### Relations

- `marketing_target` (Many-to-One): Relation ke `marketing-target`

### 6. Commission Structure (Content Type: `commission-structure`)

#### Fields

| Field Name          | Type     | Required | Description      | Validation                       |
| ------------------- | -------- | -------- | ---------------- | -------------------------------- |
| `unit_type`         | String   | Yes      | Tipe unit        | Max: 50 (e.g., "36/72", "45/90") |
| `commission_rate`   | Decimal  | Yes      | Rate komisi (%)  | Min: 0, Max: 100                 |
| `commission_amount` | Decimal  | Yes      | Jumlah komisi    | Min: 0                           |
| `bonus_threshold`   | Integer  | No       | Threshold bonus  | Min: 1                           |
| `bonus_rate`        | Decimal  | No       | Rate bonus (%)   | Min: 0                           |
| `cash_incentive`    | Decimal  | No       | Insentif cash    | Min: 0                           |
| `is_active`         | Boolean  | Yes      | Status aktif     | Default: true                    |
| `effective_date`    | Date     | Yes      | Tanggal efektif  | Required                         |
| `expiry_date`       | Date     | No       | Tanggal berakhir | Date format                      |
| `notes`             | Text     | No       | Catatan struktur | Max: 500                         |
| `created_at`        | DateTime | Auto     | Tanggal dibuat   | Auto-generated                   |
| `updated_at`        | DateTime | Auto     | Tanggal diupdate | Auto-generated                   |

## API Endpoints

### Marketing Target Endpoints

#### GET /api/marketing-targets

**Description**: Mendapatkan daftar semua target marketing dengan filtering dan pagination
**Query Parameters**:

- `filters[periode][$eq]`: Filter berdasarkan periode
- `filters[marketing_staff][id][$eq]`: Filter berdasarkan marketing staff
- `filters[project][id][$eq]`: Filter berdasarkan proyek
- `filters[status_pembayaran_komisi][$eq]`: Filter berdasarkan status pembayaran
- `filters[target_id][$containsi]`: Search berdasarkan target ID
- `filters[periode][$gte]`: Filter dari periode
- `filters[periode][$lte]`: Filter sampai periode
- `populate`: Populate relations (marketing_staff, project, achievement_updates, commission_payments)
- `sort`: Sorting (created_at:desc, periode:desc, target_nominal:desc)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "target_id": "TGT-2023-001",
        "periode": "2023-09",
        "target_unit": 5,
        "target_nominal": 2500000000,
        "pencapaian_unit": 3,
        "pencapaian_nominal": 1650000000,
        "komisi_per_unit": {
          "Tipe 36/72": 7500000,
          "Tipe 45/90": 9000000
        },
        "total_komisi": 24750000,
        "status_pembayaran_komisi": "sebagian",
        "tanggal_pembayaran": "2023-10-15",
        "metode_pembayaran": "transfer",
        "notes": "Target untuk periode September 2023",
        "created_at": "2023-09-01T08:00:00.000Z",
        "updated_at": "2023-10-15T10:00:00.000Z",
        "marketing_staff": {
          "data": {
            "id": 1,
            "attributes": {
              "staff_id": "STF-001",
              "name": "Ahmad Fadillah",
              "code": "Sales A",
              "position": "Marketing Executive",
              "department": "Sales Team A"
            }
          }
        },
        "project": {
          "data": {
            "id": 1,
            "attributes": {
              "project_id": "PROJ-001",
              "project_name": "Green Valley Residence",
              "location": "Bekasi, Jawa Barat"
            }
          }
        },
        "achievement_updates": {
          "data": [...]
        },
        "commission_payments": {
          "data": [...]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 3,
      "total": 67
    }
  }
}
```

#### GET /api/marketing-targets/:id

**Description**: Mendapatkan detail target marketing berdasarkan ID
**Query Parameters**:

- `populate`: Populate relations

#### POST /api/marketing-targets

**Description**: Membuat target marketing baru
**Request Body**:

```json
{
  "data": {
    "periode": "2023-10",
    "target_unit": 4,
    "target_nominal": 2000000000,
    "komisi_per_unit": {
      "Tipe 36/72": 7500000,
      "Tipe 45/90": 9000000
    },
    "status_pembayaran_komisi": "belum-dibayar",
    "notes": "Target untuk periode Oktober 2023",
    "marketing_staff": 1,
    "project": 1
  }
}
```

#### PUT /api/marketing-targets/:id

**Description**: Update target marketing
**Request Body**: Same as POST with additional fields

```json
{
  "data": {
    "pencapaian_unit": 4,
    "pencapaian_nominal": 2250000000,
    "status_pembayaran_komisi": "lunas",
    "tanggal_pembayaran": "2023-11-15",
    "metode_pembayaran": "transfer"
  }
}
```

#### DELETE /api/marketing-targets/:id

**Description**: Hapus target marketing (soft delete)

### Marketing Staff Endpoints

#### GET /api/marketing-staffs

**Description**: Mendapatkan daftar marketing staff
**Query Parameters**:

- `filters[is_active][$eq]`: Filter staff aktif
- `filters[name][$containsi]`: Search berdasarkan nama
- `filters[department][$eq]`: Filter berdasarkan departemen
- `populate`: Populate targets relation
- `sort`: Sorting (name:asc, created_at:desc)

#### POST /api/marketing-staffs

**Description**: Tambah marketing staff baru
**Request Body**:

```json
{
  "data": {
    "staff_id": "STF-002",
    "name": "Dewi Susanti",
    "code": "Sales B",
    "phone": "081234567890",
    "email": "dewi@company.com",
    "position": "Senior Marketing",
    "department": "Sales Team B",
    "is_active": true
  }
}
```

### Achievement Update Endpoints

#### GET /api/achievement-updates

**Description**: Mendapatkan daftar update pencapaian
**Query Parameters**:

- `filters[marketing_target][id][$eq]`: Filter berdasarkan target ID
- `filters[marketing_staff][id][$eq]`: Filter berdasarkan marketing staff
- `filters[update_date][$gte]`: Filter dari tanggal
- `filters[update_date][$lte]`: Filter sampai tanggal
- `populate`: Populate relations
- `sort`: Sorting (update_date:desc)

#### POST /api/achievement-updates

**Description**: Tambah update pencapaian baru
**Request Body**:

```json
{
  "data": {
    "update_date": "2023-09-15",
    "unit_achieved": 2,
    "nominal_achieved": 900000000,
    "unit_breakdown": {
      "Tipe 36/72": 1,
      "Tipe 45/90": 1
    },
    "notes": "Pencapaian untuk minggu kedua September",
    "marketing_target": 1,
    "marketing_staff": 1
  }
}
```

### Commission Payment Endpoints

#### GET /api/commission-payments

**Description**: Mendapatkan daftar pembayaran komisi
**Query Parameters**:

- `filters[marketing_target][id][$eq]`: Filter berdasarkan target ID
- `filters[payment_status][$eq]`: Filter berdasarkan status pembayaran
- `filters[payment_date][$gte]`: Filter dari tanggal pembayaran
- `populate`: Populate marketing_target relation
- `sort`: Sorting (payment_date:desc)

#### POST /api/commission-payments

**Description**: Tambah pembayaran komisi baru
**Request Body**:

```json
{
  "data": {
    "payment_date": "2023-10-15",
    "amount_paid": 15000000,
    "payment_method": "transfer",
    "payment_status": "completed",
    "reference_number": "TRF-2023-001",
    "bank_account": "BCA 1234567890",
    "notes": "Pembayaran komisi sebagian",
    "processed_by": "Finance Manager",
    "marketing_target": 1
  }
}
```

### Commission Structure Endpoints

#### GET /api/commission-structures

**Description**: Mendapatkan daftar struktur komisi
**Query Parameters**:

- `filters[unit_type][$eq]`: Filter berdasarkan tipe unit
- `filters[is_active][$eq]`: Filter struktur aktif
- `filters[effective_date][$lte]`: Filter struktur yang berlaku
- `sort`: Sorting (unit_type:asc, effective_date:desc)

#### POST /api/commission-structures

**Description**: Tambah struktur komisi baru
**Request Body**:

```json
{
  "data": {
    "unit_type": "36/72",
    "commission_rate": 1.5,
    "commission_amount": 7500000,
    "bonus_threshold": 3,
    "bonus_rate": 0.5,
    "cash_incentive": 1000000,
    "is_active": true,
    "effective_date": "2023-01-01",
    "notes": "Struktur komisi untuk unit tipe 36/72"
  }
}
```

## Strapi Configuration

### Content Type Builder Settings

#### Marketing Target Content Type

```json
{
  "kind": "collectionType",
  "collectionName": "marketing_targets",
  "info": {
    "singularName": "marketing-target",
    "pluralName": "marketing-targets",
    "displayName": "Marketing Target"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "target_id": {
      "type": "string",
      "required": true,
      "unique": true,
      "regex": "^TGT-[0-9]{4}-[0-9]{3}$"
    },
    "periode": {
      "type": "string",
      "required": true,
      "regex": "^[0-9]{4}-[0-9]{2}$"
    },
    "target_unit": {
      "type": "integer",
      "required": true,
      "min": 1
    },
    "target_nominal": {
      "type": "decimal",
      "required": true,
      "min": 0
    },
    "pencapaian_unit": {
      "type": "integer",
      "required": true,
      "min": 0,
      "default": 0
    },
    "pencapaian_nominal": {
      "type": "decimal",
      "required": true,
      "min": 0,
      "default": 0
    },
    "komisi_per_unit": {
      "type": "json",
      "required": true
    },
    "total_komisi": {
      "type": "decimal",
      "min": 0
    },
    "status_pembayaran_komisi": {
      "type": "enumeration",
      "enum": ["belum-dibayar", "sebagian", "lunas"],
      "required": true,
      "default": "belum-dibayar"
    },
    "tanggal_pembayaran": {
      "type": "date",
      "required": false
    },
    "metode_pembayaran": {
      "type": "enumeration",
      "enum": ["transfer", "cash", "check"]
    },
    "bukti_pembayaran": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files"]
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "marketing_staff": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::marketing-staff.marketing-staff",
      "inversedBy": "targets"
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::project.project",
      "inversedBy": "targets"
    },
    "achievement_updates": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::achievement-update.achievement-update",
      "mappedBy": "marketing_target"
    },
    "commission_payments": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::commission-payment.commission-payment",
      "mappedBy": "marketing_target"
    }
  }
}
```

### Permissions

Set permissions untuk:

- `marketing-target`: find, findOne, create, update, delete
- `marketing-staff`: find, findOne, create, update, delete
- `project`: find, findOne, create, update, delete
- `achievement-update`: find, findOne, create, update, delete
- `commission-payment`: find, findOne, create, update, delete
- `commission-structure`: find, findOne, create, update, delete

### Lifecycle Hooks

```javascript
// api/marketing-target/content-types/marketing-target/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate target ID if not provided
    if (!data.target_id) {
      const currentYear = new Date().getFullYear();
      const lastTarget = await strapi.entityService.findMany(
        "api::marketing-target.marketing-target",
        {
          filters: {
            target_id: {
              $startsWith: `TGT-${currentYear}-`,
            },
          },
          sort: { target_id: "desc" },
          limit: 1,
        }
      );

      let nextNumber = 1;
      if (lastTarget.length > 0) {
        const lastId = lastTarget[0].target_id;
        const lastNumber = parseInt(lastId.split("-")[2]);
        nextNumber = lastNumber + 1;
      }

      data.target_id = `TGT-${currentYear}-${nextNumber
        .toString()
        .padStart(3, "0")}`;
    }

    // Set default values
    if (!data.pencapaian_unit) {
      data.pencapaian_unit = 0;
    }
    if (!data.pencapaian_nominal) {
      data.pencapaian_nominal = 0;
    }
    if (!data.status_pembayaran_komisi) {
      data.status_pembayaran_komisi = "belum-dibayar";
    }

    // Calculate total commission
    if (data.komisi_per_unit && data.pencapaian_unit) {
      let totalCommission = 0;
      const unitBreakdown = data.unit_breakdown || {};

      Object.entries(data.komisi_per_unit).forEach(([unitType, commission]) => {
        const unitCount = unitBreakdown[unitType] || 0;
        totalCommission += commission * unitCount;
      });

      data.total_komisi = totalCommission;
    }
  },

  async afterUpdate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Recalculate total commission when achievement changes
    if (data.pencapaian_unit !== undefined || data.komisi_per_unit) {
      const target = await strapi.entityService.findOne(
        "api::marketing-target.marketing-target",
        result.id,
        {
          populate: ["achievement_updates"],
        }
      );

      if (target) {
        let totalCommission = 0;
        const unitBreakdown = target.unit_breakdown || {};

        Object.entries(target.komisi_per_unit).forEach(
          ([unitType, commission]) => {
            const unitCount = unitBreakdown[unitType] || 0;
            totalCommission += commission * unitCount;
          }
        );

        await strapi.entityService.update(
          "api::marketing-target.marketing-target",
          result.id,
          {
            data: { total_komisi: totalCommission },
          }
        );
      }
    }
  },
};

// api/achievement-update/content-types/achievement-update/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Calculate commission earned
    if (data.marketing_target && data.unit_breakdown) {
      const target = await strapi.entityService.findOne(
        "api::marketing-target.marketing-target",
        data.marketing_target,
        {
          populate: false,
        }
      );

      if (target && target.komisi_per_unit) {
        let commissionEarned = 0;

        Object.entries(data.unit_breakdown).forEach(([unitType, unitCount]) => {
          const commission = target.komisi_per_unit[unitType] || 0;
          commissionEarned += commission * unitCount;
        });

        data.commission_earned = commissionEarned;
      }
    }
  },

  async afterCreate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update target achievement
    if (data.marketing_target) {
      const target = await strapi.entityService.findOne(
        "api::marketing-target.marketing-target",
        data.marketing_target,
        {
          populate: ["achievement_updates"],
        }
      );

      if (target) {
        let totalUnits = 0;
        let totalNominal = 0;
        let unitBreakdown = {};

        target.achievement_updates.forEach((update) => {
          totalUnits += update.unit_achieved;
          totalNominal += update.nominal_achieved;

          Object.entries(update.unit_breakdown).forEach(([unitType, count]) => {
            unitBreakdown[unitType] = (unitBreakdown[unitType] || 0) + count;
          });
        });

        await strapi.entityService.update(
          "api::marketing-target.marketing-target",
          data.marketing_target,
          {
            data: {
              pencapaian_unit: totalUnits,
              pencapaian_nominal: totalNominal,
              unit_breakdown: unitBreakdown,
            },
          }
        );
      }
    }
  },
};

// api/commission-payment/content-types/commission-payment/lifecycles.js
module.exports = {
  async afterCreate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update target payment status
    if (data.marketing_target) {
      const target = await strapi.entityService.findOne(
        "api::marketing-target.marketing-target",
        data.marketing_target,
        {
          populate: ["commission_payments"],
        }
      );

      if (target) {
        const totalPaid = target.commission_payments.reduce(
          (sum, payment) => sum + payment.amount_paid,
          0
        );
        const totalCommission = target.total_komisi || 0;

        let paymentStatus = "belum-dibayar";
        if (totalPaid >= totalCommission) {
          paymentStatus = "lunas";
        } else if (totalPaid > 0) {
          paymentStatus = "sebagian";
        }

        await strapi.entityService.update(
          "api::marketing-target.marketing-target",
          data.marketing_target,
          {
            data: { status_pembayaran_komisi: paymentStatus },
          }
        );
      }
    }
  },
};
```

## Frontend Integration Notes

### State Management

- Gunakan React Query/SWR untuk caching dan synchronization
- Implement optimistic updates untuk UX yang lebih baik
- Cache target data dengan TTL yang sesuai
- Real-time updates untuk pencapaian dan pembayaran komisi

### Form Validation

- Validasi target ID format (TGT-YYYY-XXX)
- Validasi periode format (YYYY-MM)
- Validasi komisi per unit harus berupa JSON object
- Required field validation
- File type dan size validation untuk bukti pembayaran

### Target Management Workflow

1. **Target Setting**: Set target per marketing staff per periode
2. **Achievement Tracking**: Update pencapaian secara berkala
3. **Commission Calculation**: Kalkulasi komisi otomatis berdasarkan pencapaian
4. **Payment Processing**: Proses pembayaran komisi
5. **Status Monitoring**: Monitor status pembayaran dan pencapaian

### Commission Calculation

- Auto-calculate berdasarkan struktur komisi yang berlaku
- Support multiple unit types dengan rate berbeda
- Bonus calculation untuk pencapaian di atas threshold
- Cash incentive untuk pencapaian tertentu
- Real-time update ketika ada perubahan pencapaian

### Dashboard Features

- Overview target vs pencapaian per marketing
- Commission summary per periode
- Payment status tracking
- Performance analytics dan trends
- Export reports untuk management

### Reporting & Analytics

- Laporan pencapaian target per marketing
- Laporan komisi dan pembayaran
- Performance comparison antar marketing
- Trend analysis pencapaian
- Export data untuk accounting

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (Admin, Marketing Manager, Finance, Marketing Staff)
3. **Data Validation**: Server-side validation untuk semua input
4. **Rate Limiting**: Implement rate limiting untuk API endpoints
5. **CORS**: Configure CORS untuk frontend domain
6. **File Security**: Secure file upload untuk bukti pembayaran
7. **Financial Data**: Encrypt sensitive financial data
8. **Audit Trail**: Log semua perubahan target dan pembayaran
9. **Commission Privacy**: Secure access ke data komisi per marketing

## Performance Optimization

1. **Database Indexing**: Index pada field yang sering di-query (target_id, periode, marketing_staff, status_pembayaran_komisi)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk commission structure dan target data
4. **API Response**: Minimize response size dengan selective field population
5. **Lazy Loading**: Load relations only when needed
6. **Search Optimization**: Implement full-text search untuk target dan marketing data

## Business Rules

1. **Target ID Generation**: Auto-generate target ID dengan format TGT-YYYY-XXX
2. **Commission Calculation**: Auto-calculate berdasarkan pencapaian dan struktur komisi
3. **Payment Status**: Auto-update status pembayaran berdasarkan total pembayaran
4. **Achievement Validation**: Validasi pencapaian tidak boleh melebihi target
5. **Commission Structure**: Struktur komisi berlaku per periode tertentu
6. **Payment Workflow**: Enforce proper payment workflow dan approval
7. **Target Period**: Target berlaku per periode bulanan
8. **Commission Privacy**: Marketing hanya bisa lihat komisi sendiri

## Reporting & Analytics

### Dashboard Metrics

- Total target vs pencapaian per periode
- Commission summary per marketing
- Payment status overview
- Performance ranking marketing staff
- Revenue dari komisi yang dibayar

### Reports

- Laporan pencapaian target harian/bulanan
- Laporan komisi dan pembayaran
- Laporan performance marketing
- Laporan outstanding commission
- Export data untuk payroll integration

### Export Features

- Export target data dengan filter periode
- Export commission reports untuk accounting
- Export performance data untuk HR
- Export payment reports untuk finance
- Bulk export untuk system integration

## Integration Points

### HR Integration

- Link marketing staff dengan employee data
- Performance tracking untuk appraisal
- Commission data untuk payroll

### Finance Integration

- Commission payment untuk accounting
- Budget tracking untuk marketing expenses
- Financial reporting untuk management

### CRM Integration

- Link target dengan sales pipeline
- Achievement tracking dengan lead conversion
- Customer data untuk commission calculation

### Project Management Integration

- Link target dengan project milestones
- Resource allocation berdasarkan target
- Timeline management untuk achievement
