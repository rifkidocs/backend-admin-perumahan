# API Documentation - Project Units System

## Overview

Dokumentasi API untuk sistem manajemen unit rumah pada proyek perumahan menggunakan Strapi CMS. Sistem ini mendukung CRUD operations untuk data unit, proyek, progres pembangunan, dan foto dokumentasi unit.

## Content Types

### 1. Unit (Content Type: `unit`)

#### Fields

| Field Name             | Type        | Required | Description                 | Validation                                              |
| ---------------------- | ----------- | -------- | --------------------------- | ------------------------------------------------------- |
| `unit_id`              | String      | Yes      | ID unik unit                | Unique, Pattern: UNIT-XXX                               |
| `project_name`         | String      | Yes      | Nama proyek                 | Min: 2, Max: 100                                        |
| `unit_type`            | String      | Yes      | Tipe unit                   | Max: 50 (e.g., "36/72", "45/90")                        |
| `block`                | String      | Yes      | Blok unit                   | Max: 10                                                 |
| `kavling_number`       | String      | Yes      | Nomor kavling               | Max: 10                                                 |
| `price`                | Decimal     | Yes      | Harga unit                  | Min: 0                                                  |
| `land_area`            | Integer     | Yes      | Luas tanah (m²)             | Min: 1                                                  |
| `building_area`        | Integer     | Yes      | Luas bangunan (m²)          | Min: 1                                                  |
| `bedrooms`             | Integer     | Yes      | Jumlah kamar tidur          | Min: 1                                                  |
| `bathrooms`            | Integer     | Yes      | Jumlah kamar mandi          | Min: 1                                                  |
| `garage`               | Integer     | No       | Jumlah garasi               | Min: 0                                                  |
| `location`             | String      | No       | Lokasi detail unit          | Max: 100                                                |
| `status`               | Enumeration | Yes      | Status unit                 | Options: belum-dibangun, progres, selesai, serah-terima |
| `progress`             | Integer     | Yes      | Progres pembangunan (%)     | Min: 0, Max: 100                                        |
| `estimated_completion` | Date        | Yes      | Estimasi selesai            | Required                                                |
| `construction_start`   | Date        | No       | Tanggal mulai pembangunan   | Date format                                             |
| `construction_end`     | Date        | No       | Tanggal selesai pembangunan | Date format                                             |
| `handover_date`        | Date        | No       | Tanggal serah terima        | Date format                                             |
| `handover_status`      | Enumeration | No       | Status serah terima         | Options: pending, completed, rejected                   |
| `construction_cost`    | Decimal     | No       | Biaya pembangunan           | Min: 0                                                  |
| `material_cost`        | Decimal     | No       | Biaya material              | Min: 0                                                  |
| `labor_cost`           | Decimal     | No       | Biaya tenaga kerja          | Min: 0                                                  |
| `specifications`       | JSON        | No       | Spesifikasi teknis          | JSON object                                             |
| `images`               | Media       | No       | Foto dokumentasi            | Multiple images (max 20MB total)                        |
| `floor_plans`          | Media       | No       | Denah bangunan              | PDF/Image files (max 10MB total)                        |
| `location_map`         | String      | No       | Koordinat GPS               | Format: "lat,lng"                                       |
| `notes`                | Text        | No       | Catatan unit                | Max: 1000                                               |
| `created_at`           | DateTime    | Auto     | Tanggal dibuat              | Auto-generated                                          |
| `updated_at`           | DateTime    | Auto     | Tanggal diupdate            | Auto-generated                                          |

#### Relations

- `project` (Many-to-One): Relation ke `project`
- `progress_updates` (One-to-Many): Relation ke `progress-update`
- `purchases` (One-to-Many): Relation ke `unit-purchase`
- `material_requests` (One-to-Many): Relation ke `material-request`

### 2. Project (Content Type: `project`)

#### Fields

| Field Name             | Type        | Required | Description            | Validation                                  |
| ---------------------- | ----------- | -------- | ---------------------- | ------------------------------------------- |
| `project_id`           | String      | Yes      | ID unik proyek         | Unique, Pattern: PROJ-XXX                   |
| `project_name`         | String      | Yes      | Nama proyek            | Min: 2, Max: 100                            |
| `project_type`         | Enumeration | Yes      | Jenis proyek           | Options: perumahan, pembangunan, renovasi   |
| `location`             | String      | Yes      | Lokasi proyek          | Min: 5, Max: 200                            |
| `developer`            | String      | Yes      | Developer/Developer    | Min: 2, Max: 100                            |
| `project_manager`      | String      | No       | Project Manager        | Max: 100                                    |
| `start_date`           | Date        | Yes      | Tanggal mulai proyek   | Required                                    |
| `estimated_completion` | Date        | Yes      | Estimasi selesai       | Required                                    |
| `actual_completion`    | Date        | No       | Tanggal selesai aktual | Date format                                 |
| `budget`               | Decimal     | Yes      | Budget proyek          | Min: 0                                      |
| `current_expense`      | Decimal     | Auto     | Pengeluaran saat ini   | Auto-calculated                             |
| `status`               | Enumeration | Yes      | Status proyek          | Options: planning, ongoing, completed, hold |
| `description`          | Text        | No       | Deskripsi proyek       | Max: 1000                                   |
| `total_units`          | Integer     | Auto     | Total unit             | Auto-calculated                             |
| `completed_units`      | Integer     | Auto     | Unit selesai           | Auto-calculated                             |
| `progress_percentage`  | Integer     | Auto     | Progres keseluruhan    | Auto-calculated                             |
| `contact_info`         | JSON        | No       | Informasi kontak       | JSON object                                 |
| `created_at`           | DateTime    | Auto     | Tanggal dibuat         | Auto-generated                              |
| `updated_at`           | DateTime    | Auto     | Tanggal diupdate       | Auto-generated                              |

#### Relations

- `units` (One-to-Many): Relation ke `unit`

### 3. Progress Update (Content Type: `progress-update`)

#### Fields

| Field Name          | Type     | Required | Description                 | Validation        |
| ------------------- | -------- | -------- | --------------------------- | ----------------- |
| `update_date`       | Date     | Yes      | Tanggal update              | Required          |
| `progress_before`   | Integer  | Yes      | Progres sebelum             | Min: 0, Max: 100  |
| `progress_after`    | Integer  | Yes      | Progres sesudah             | Min: 0, Max: 100  |
| `completed_work`    | Text     | Yes      | Pekerjaan yang diselesaikan | Min: 10, Max: 500 |
| `materials_used`    | Text     | No       | Material yang digunakan     | Max: 300          |
| `labor_hours`       | Decimal  | No       | Jam kerja dikerahkan        | Min: 0            |
| `photos_before`     | Media    | No       | Foto sebelum                | Multiple images   |
| `photos_after`      | Media    | No       | Foto sesudah                | Multiple images   |
| `weather_condition` | String   | No       | Kondisi cuaca               | Max: 50           |
| `notes`             | Text     | No       | Catatan update              | Max: 200          |
| `created_by`        | String   | Yes      | Dibuat oleh                 | Max: 100          |
| `verified_by`       | String   | No       | Diverifikasi oleh           | Max: 100          |
| `verified_date`     | Date     | No       | Tanggal verifikasi          | Date format       |
| `created_at`        | DateTime | Auto     | Tanggal dibuat              | Auto-generated    |
| `updated_at`        | DateTime | Auto     | Tanggal diupdate            | Auto-generated    |

#### Relations

- `unit` (Many-to-One): Relation ke `unit`

### 4. Unit Purchase (Content Type: `unit-purchase`)

#### Fields

| Field Name         | Type        | Required | Description         | Validation                         |
| ------------------ | ----------- | -------- | ------------------- | ---------------------------------- |
| `purchase_date`    | Date        | Yes      | Tanggal pembelian   | Required                           |
| `purchase_price`   | Decimal     | Yes      | Harga pembelian     | Min: 0                             |
| `payment_method`   | Enumeration | Yes      | Metode pembayaran   | Options: cash, kpr, cash-credit    |
| `payment_status`   | Enumeration | Yes      | Status pembayaran   | Options: pending, partial, paid    |
| `down_payments`    | Decimal     | No       | Uang muka           | Min: 0                             |
| `installments`     | Decimal     | No       | Cicilan bulanan     | Min: 0                             |
| `remaining_amount` | Decimal     | Auto     | Sisa pembayaran     | Auto-calculated                    |
| `customer_id`      | String      | Yes      | ID customer         | Max: 50                            |
| `customer_name`    | String      | Yes      | Nama customer       | Min: 2, Max: 100                   |
| `sales_agent`      | String      | Yes      | Sales agent         | Max: 100                           |
| `contract_number`  | String      | No       | Nomor kontrak       | Max: 50                            |
| `contract_date`    | Date        | No       | Tanggal kontrak     | Date format                        |
| `handover_status`  | Enumeration | Yes      | Status serah terima | Options: pending, ready, completed |
| `notes`            | Text        | No       | Catatan pembelian   | Max: 500                           |

#### Relations

- `unit` (Many-to-One): Relation ke `unit`

### 5. Material Request (Content Type: `material-request`)

#### Fields

| Field Name         | Type        | Required | Description          | Validation                                       |
| ------------------ | ----------- | -------- | -------------------- | ------------------------------------------------ |
| `request_number`   | String      | Yes      | Nomor permintaan     | Unique, Pattern: MR-XXX                          |
| `request_date`     | Date        | Yes      | Tanggal permintaan   | Required                                         |
| `material_type`    | Enumeration | Yes      | Jenis material       | Options: semen, batubata, besi, keramik, lainnya |
| `quantity`         | Decimal     | Yes      | Jumlah yang diminta  | Min: 0.01                                        |
| `unit_measurement` | String      | Yes      | Satuan               | Max: 20                                          |
| `specification`    | Text        | No       | Spesifikasi material | Max: 300                                         |
| `priority`         | Enumeration | Yes      | Prioritas            | Options: low, medium, high, urgent               |
| `required_date`    | Date        | Yes      | Tanggal dibutuhkan   | Required                                         |
| `status`           | Enumeration | Yes      | Status permintaan    | Options: pending, approved, ordered, delivered   |
| `supplier`         | String      | No       | Supplier             | Max: 100                                         |
| `estimated_cost`   | Decimal     | No       | Estimasi biaya       | Min: 0                                           |
| `actual_cost`      | Decimal     | No       | Biaya aktual         | Min: 0                                           |
| `delivery_date`    | Date        | No       | Tanggal pengiriman   | Date format                                      |
| `received_by`      | String      | No       | Diterima oleh        | Max: 100                                         |
| `notes`            | Text        | No       | Catatan              | Max: 200                                         |

#### Relations

- `unit` (Many-to-One): Relation ke `unit`

## API Endpoints

### Unit Endpoints

#### GET /api/units

**Description**: Mendapatkan daftar semua unit dengan filtering dan pagination
**Query Parameters**:

- `filters[project_name][$containsi]`: Filter berdasarkan nama proyek
- `filters[status][$eq]`: Filter berdasarkan status unit
- `filters[unit_type][$containsi]`: Search berdasarkan tipe unit
- `filters[block][$eq]`: Filter berdasarkan blok
- `filters[kavling_number][$eq]`: Filter berdasarkan nomor kavling
- `filters[price][$gte]`: Filter harga minimum
- `filters[price][$lte]`: Filter harga maksimum
- `filters[progress][$gte]`: Filter progres minimum
- `filters[progress][$lte]`: Filter progres maksimum
- `filters[estimated_completion][$gte]`: Filter dari estimasi selesai
- `filters[estimated_completion][$lte]`: Filter sampai estimasi selesai
- `populate`: Populate relations (project, progress_updates, purchases, material_requests)
- `sort`: Sorting (created_at:desc, progress:desc, price:asc, etc.)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "unit_id": "UNIT-001",
        "project_name": "Griya Indah",
        "unit_type": "36/72",
        "block": "A",
        "kavling_number": "12",
        "price": 450000000,
        "land_area": 72,
        "building_area": 36,
        "bedrooms": 2,
        "bathrooms": 1,
        "garage": 1,
        "location": "Blok A - Row 3",
        "status": "progres",
        "progress": 65,
        "estimated_completion": "2023-11-15",
        "construction_start": "2023-06-01",
        "construction_cost": 125000000,
        "material_cost": 75000000,
        "labor_cost": 50000000,
        "specifications": {
          "foundation": "beton",
          "walls": "batubatubata",
          "roof": "genteng beton",
          "floor": "keramik",
          "electrical": "220V"
        },
        "images": {
          "data": [...]
        },
        "floor_plans": {
          "data": [...]
        },
        "location_map": "-6.229728,106.811523",
        "notes": "Unit dengan pemandangan taman",
        "created_at": "2023-06-01T08:00:00.000Z",
        "updated_at": "2023-09-12T10:00:00.000Z",
        "project": {
          "data": {
            "id": 1,
            "attributes": {
              "project_id": "PROJ-001",
              "project_name": "Griya Indah",
              "location": "Bekasi, Jawa Barat",
              "developer": "PT Griya Sejahtera",
              "status": "ongoing",
              "progress_percentage": 65
            }
          }
        },
        "progress_updates": {
          "data": [...]
        },
        "purchases": {
          "data": [...]
        },
        "material_requests": {
          "data": [...]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 12,
      "total": 290
    }
  }
}
```

#### GET /api/units/:id

**Description**: Mendapatkan detail unit berdasarkan ID
**Query Parameters**:

- `populate`: Populate relations

#### POST /api/units

**Description**: Membuat unit baru
**Request Body**:

```json
{
  "data": {
    "unit_type": "36/72",
    "block": "A",
    "kavling_number": "13",
    "price": 450000000,
    "land_area": 72,
    "building_area": 36,
    "bedrooms": 2,
    "bathrooms": 1,
    "garage": 1,
    "location": "Blok A - Row 4",
    "status": "belum-dibangun",
    "progress": 0,
    "estimated_completion": "2024-03-15",
    "construction_cost": 125000000,
    "material_cost": 75000000,
    "labor_cost": 50000000,
    "specifications": {
      "foundation": "beton",
      "walls": "batubatubata",
      "roof": "genteng beton",
      "floor": "keramik"
    },
    "project": 1
  }
}
```

#### PUT /api/units/:id

**Description**: Update unit
**Request Body**: Same as POST with additional fields

```json
{
  "data": {
    "status": "progres",
    "progress": 25,
    "construction_start": "2023-10-01",
    "notes": "Pembangunan dimulai per Oktober 2023"
  }
}
```

#### DELETE /api/units/:id

**Description**: Hapus unit (soft delete atau hard delete berdasarkan status)

### Project Endpoints

#### GET /api/projects

**Description**: Mendapatkan daftar proyek
**Query Parameters**:

- `filters[status][$eq]`: Filter berdasarkan status proyek
- `filters[developer][$containsi]`: Search berdasarkan developer
- `filters[project_type][$eq]`: Filter berdasarkan jenis proyek
- `populate`: Populate units relation
- `sort`: Sorting (start_date:desc, project_name:asc)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

#### POST /api/projects

**Description**: Tambah proyek baru
**Request Body**:

```json
{
  "data": {
    "project_name": "Taman Sari Residence",
    "project_type": "perumahan",
    "location": "Depok, Jawa Barat",
    "developer": "PT Taman Sari Development",
    "project_manager": "Ahmad Rizki",
    "start_date": "2023-01-01",
    "estimated_completion": "2025-12-31",
    "budget": 10000000000,
    "status": "ongoing",
    "description": "Proyek perumahan dengan konsep green building"
  }
}
```

### Progress Update Endpoints

#### GET /api/progress-updates

**Description**: Mendapatkan daftar update progres
**Query Parameters**:

- `filters[unit][id][$eq]`: Filter berdasarkan unit ID
- `filters[update_date][$gte]`: Filter dari tanggal
- `filters[update_date][$lte]`: Filter sampai tanggal
- `filters[progress_after][$gte]`: Filter progres minimum
- `populate`: Populate unit relation
- `sort`: Sorting (update_date:desc)

#### POST /api/progress-updates

**Description**: Tambah update progres baru
**Request Body**:

```json
{
  "data": {
    "update_date": "2023-09-15",
    "progress_before": 60,
    "progress_after": 65,
    "completed_work": "Finishing dinding, pemasangan cat dasar",
    "materials_used": "Cat dasar 20 galon, catulit 15 sak",
    "labor_hours": 16.5,
    "weather_condition": "Cerah",
    "notes": "Progres mengikuti jadwal",
    "created_by": "Site Supervisor",
    "unit": 1
  }
}
```

#### PUT /api/progress-updates/:id

**Description**: Update status verifikasi progres

```json
{
  "data": {
    "verified_by": "Project Manager",
    "verified_date": "2023-09-16"
  }
}
```

### Unit Purchase Endpoints

#### GET /api/unit-purchases

**Description**: Mendapatkan daftar pembelian unit
**Query Parameters**:

- `filters[unit][id][$eq]`: Filter berdasarkan unit ID
- `filters[purchase_date][$gte]`: Filter dari tanggal pembelian
- `filters[payment_status][$eq]`: Filter berdasarkan(status pembayaran
- `populate`: Populate unit relation
- `sort`: Sorting (purchase_date:desc)

#### POST /api/unit-purchases

**Description**: Terdaftar pembelian unit baru
**Request Body**:

```json
{
  "data": {
    "purchase_date": "2023-09-10",
    "purchase_price": 450000000,
    "payment_method": "kpr",
    "payment_status": "partial",
    "down_payments": 45000000,
    "installments": 3500000,
    "customer_id": "CUST-001",
    "customer_name": "Budi Santoso",
    "sales_agent": "Ahmad Rizki",
    "contract_number": "KTR-2023-001",
    "contract_date": "2023-09-10",
    "handover_status": "pending",
    "unit": 1
  }
}
```

### Material Request Endpoints

#### GET /api/material-requests

**Description**: Mendapatkan daftar permintaan material
**Query Parameters**:

- `filters[unit][id][$eq]`: Filter berdasarkan unit ID
- `filters[status][$eq]`: Filter berdasarkan status permintaan
- `filters[material_type][$eq]`: Filter berdasarkan jenis material
- `filters[required_date][$gte]`: Filter dari tanggal dibutuhkan
- `populate`: Populate unit relation
- `sort`: Sorting (required_date:asc)

#### POST /api/material-requests

**Description**: Tambah permintaan material baru
**Request Body**:

```json
{
  "data": {
    "request_date": "2023-09-15",
    "material_type": "semen",
    "quantity": 100,
    "unit_measurement": "sak",
    "specification": "Semen Portland Tipe I",
    "priority": "high",
    "required_date": "2023-09-20",
    "status": "pending",
    "supplier": "CV Material Bangunan",
    "estimated_cost": 8000000,
    "unit": 1
  }
}
```

#### PUT /api/material-requests/:id

**Description**: Update status permintaan material

```json
{
  "data": {
    "status": "delivered",
    "actual_cost": 8200000,
    "delivery_date": "2023-09-19",
    "received_by": "Site Supervisor"
  }
}
```

## Strapi Configuration

### Content Type Builder Settings

#### Unit Content Type

```json
{
  "kind": "collectionType",
  "collectionName": "units",
  "info": {
    "singularName": "unit",
    "pluralName": "units",
    "displayName": "Unit"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "unit_id": {
      "type": "string",
      "required": true,
      "unique": true,
      "regex": "^UNIT-[0-9]{3}$"
    },
    "project_name": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "unit_type": {
      "type": "string",
      "required": true,
      "maxLength": 50
    },
    "place": {
      "type": "string",
      "required": true,
      "maxLength": 10
    },
    "kavling_number": {
      "type": "string",
      "required": true,
      "maxLength": 10
    },
    "price": {
      "type": "decimal",
      "required": true,
      "min": 0
    },
    "land_area": {
      "type": "integer",
      "required": true,
      "min": 1
    },
    "building_area": {
      "type": "integer",
      "required": true,
      "min": 1
    },
    "bedrooms": {
      "type": "integer",
      "required": true,
      "min": 1
    },
    "bathrooms": {
      "type": "integer",
      "required": true,
      "min": 1
    },
    "garage": {
      "type": "integer",
      "required": false,
      "min": 0
    },
    "location": {
      "type": "string",
      "maxLength": 100
    },
    "status": {
      "type": "enumeration",
      "enum": ["belum-dibangun", "progres", "selesai", "serah-terima"],
      "required": true,
      "default": "belum-dibangun"
    },
    "progress": {
      "type": "integer",
      "required": true,
      "min": 0,
      "max": 100,
      "default": 0
    },
    "estimated_completion": {
      "type": "date",
      "required": true
    },
    "construction_start": {
      "type": "date",
      "required": false
    },
    "construction_end": {
      "type": "date",
      "required": false
    },
    "handover_date": {
      "type": "date",
      "required": false
    },
    "handover_status": {
      "type": "enumeration",
      "enum": ["pending", "completed", "rejected"]
    },
    "construction_cost": {
      "type": "decimal",
      "min": 0
    },
    "material_cost": {
      "type": "decimal",
      "min": 0
    },
    "labor_cost": {
      "type": "decimal",
      "min": 0
    },
    "specifications": {
      "type": "json"
    },
    "images": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"],
      "required": false
    },
    "floor_plans": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images", "files"],
      "required": false
    },
    "location_map": {
      "type": "string",
      "regex": "^-?[0-9]{1,3}\\.[0-9]+,-?[0-9]{1,3}\\.[0-9]+$"
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::project.project",
      "inversedBy": "units"
    },
    "progress_updates": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::progress-update.progress-update",
      "mappedBy": "unit"
    },
    "purchases": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::unit-purchase.unit-purchase",
      "mappedBy": "unit"
    },
    "material_requests": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::material-request.material-request",
      "mappedBy": "unit"
    }
  }
}
```

### Permissions

Set permissions untuk:

- `unit`: find, findOne, create, update, delete
- `project`: find, findOne, create, update, delete
- `progress-update`: find, findOne, create, update, delete
- `unit-purchase`: find, findOne, create, update, delete
- `material-request`: find, findOne, create, update, delete

### Lifecycle Hooks

```javascript
// api/unit/content-types/unit/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate unit ID if not provided
    if (!data.unit_id) {
      const lastUnit = await strapi.entityService.findMany("api::unit.unit", {
        sort: { unit_id: "desc" },
        limit: 1,
      });

      let nextNumber = 1;
      if (lastUnit.length > 0) {
        const lastId = lastUnit[0].unit_id;
        const lastNumber = parseInt(lastId.split("-")[1]);
        nextNumber = lastNumber + 1;
      }

      data.unit_id = `UNIT-${nextNumber.toString().padStart(3, "0")}`;
    }

    // Set default status and progress
    if (!data.status) {
      data.status = "belum-dibangun";
    }
    if (!data.progress) {
      data.progress = 0;
    }

    // Auto-calculate total costs
    if (data.construction_cost && data.material_cost && data.labor_cost) {
      data.total_cost =
        data.construction_cost + data.material_cost + data.labor_cost;
    }
  },

  async afterUpdate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update project statistics when unit status changes
    if (data.status && result.project) {
      const projectUnits = await strapi.entityService.findMany(
        "api::unit.unit",
        {
          filters: { project: result.project.id },
          populate: false,
        }
      );

      const totalUnits = projectUnits.length;
      const completedUnits = projectUnits.filter(
        (unit) => unit.status === "selesai" || unit.status === "serah-terima"
      ).length;

      const avgProgress =
        projectUnits.reduce((sum, unit) => sum + (unit.progress || 0), 0) /
        totalUnits;

      await strapi.entityService.update(
        "api::project.project",
        result.project.id,
        {
          data: {
            total_units: totalUnits,
            completed_units: completedUnits,
            progress_percentage: Math.round(avgProgress),
          },
        }
      );
    }
  },
};

// api/progress-update/content-types/progress-update/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate progress increment
    if (data.progress_after <= data.progress_before) {
      throw new Error("Progress after must be greater than progress before");
    }

    // Update unit progress
    if (data.unit && data.progress_after) {
      await strapi.entityService.update("api::unit.unit", data.unit, {
        data: { progress: data.progress_after },
      });
    }
  },
};

// api/material-request/content-types/material-request/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate request number if not provided
    if (!data.request_number) {
      const lastRequest = await strapi.entityService.findMany(
        "api::material-request.material-request",
        {
          sort: { request_number: "desc" },
          limit: 1,
        }
      );

      let nextNumber = 1;
      if (lastRequest.length > 0) {
        const lastNumber = lastRequest[0].request_number;
        nextNumber = parseInt(lastNumber.split("-")[1]) + 1;
      }

      data.request_number = `MR-${nextNumber.toString().padStart(3, "0")}`;
    }
  },
};
```

## Frontend Integration Notes

### State Management

- Gunakan React Query/SWR untuk caching dan synchronization
- Implement optimistic updates untuk UX yang lebih baik
- Cache unit availability data dengan TTL yang sesuai
- Real-time updates untuk status progres pembangunan

### Form Validation

- Validasi unit ID format (UNIT-XXX)
- Validasi estimasi selesai harus lebih besar dari tanggal mulai
- Validasi progres harus antara 0-100
- Validasi koordinat GPS format
- Required field validation
- File type dan size validation untuk foto dan dokumen

### Unit Status Management

1. **Belum Dibangun**: Progress 0%, konfirmasi ke "Progres" dengan start date
2. **Progres**: Tracking progress updates dan foto dokumentasi
3. **Selesai**: Progress 100%, ready untuk serah terima
4. **Serah Terima**: Handover completed dan dokumen selesai

### Image Management

- Support multiple image upload untuk dokumentasi progres
- Auto-compress images untuk optimize storage
- Generate thumbnails untuk performance
- Image metadata (caption, date, type)
- Gallery view untuk sebelum/sesudah progres

### Progress Tracking

- Timeline view progres dengan milestone
- Photo comparison sebelum/sesudah
- Progress percentage calculation otomatis
- Alert untuk milestone penting
- Calendar integration untuk jadwal pembangunan

### Material Management Integration

- Live inventory tracking per unit
- Material cost calculation otomatis
- Supplier integration untuk ordering
- Delivery tracking dan confirmation

### Reporting Features

- Dashboard progress overview per proyek
- Unit statistics dan analytics
- Cost analysis dan budget tracking
- Milestone tracking dan alerts
- Export reports untuk stakeholders

### Mobile Considerations

- Geolocation untuk site visits
- Offline progress logging
- Photo capture dengan GPS metadata
- Sync ketika kembali online

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (Admin, Project Manager, Site Supervisor, Developer)
3. **Data Validation**: Server-side validation untuk semua input
4. **Rate Limiting**: Implement rate limiting untuk API endpoints
5. **CORS**: Configure CORS untuk frontend domain
6. **File Security**: Secure file upload dengan virus scanning
7. **Sensitive Data**: Encrypt financial data dan customer information
8. **Audit Trail**: Log semua perubahan progres dan penunjukan
9. **Location Privacy**: Secure GPS koordinat dengan proper permissions

## Performance Optimization

1. **Database Indexing**: Index pada field yang sering di-query (unit_id, project_name, status, progress, block, kavling_number)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk unit statistics dan availability
4. **Image Optimization**: Compress dan optimize uploaded images
5. **API Response**: Minimize response size dengan selective field population
6. **Lazy Loading**: Load relations only when needed
7. **Search Optimization**: Implement full-text search untuk unit dan proyek data

## Business Rules

1. **Unit ID Generation**: Auto-generate unit ID dengan format UNIT-XXX
2. **Progress Validation**: Progress harus incremental, tidak bisa turun
3. **Status Workflow**: Enforce proper status transition workflow
4. **Cost Calculation**: Auto-calculate total cost dari komponen cost
5. **Completion Date**: Estimasi completion bisa di-update berdasarkan progres aktual
6. **Handover Requirements**: Complete progress 100% sebelum serah terima
7. **Photo Documentation**: Require foto dokumentasi untuk setiap progress update
8. **Material Tracking**: Link material request ke specific unit dan progres
9. **Project Statistics**: Auto-update project statistics dari unit data

## Reporting & Analytics

### Dashboard Metrics

- Total unit per proyek
- Unit statistics per status
- Average progress per proyek
- Cost overview dan budget tracking
- Timeline tracking milestone

### Reports

- Laporan progres unit harian/bulanan
- Laporan cost breakdown per unit
- Laporan material usage per proyek
- Laporan handover status dan timeline
- Export data untuk project management tools

### Export Features

- Export unit data dengan filter proyek
- Export progres timeline dengan foto
- Export cost analysis dan budgeting
- Export material request dan delivery status
- Integration dengan project management tools (Gantt chart)

## Integration Points

### CRM Integration

- Link unit purchase dengan customer data
- Sales pipeline tracking untuk availability
- Automated follow-up untuk handover

### Financial Integration

- Cost tracking dan budget management
- Payment scheduling berdasarkan progres
- Financial reporting untuk stakeholders

### Project Management Integration

- Timeline management dengan Gantt charts
- Resource allocation berdasarkan material requests
- Team collaboration tools untuk progress updates

### IoT Integration

- Site cameras untuk remote monitoring
- Weather sensors untuk progress planning
- Material supply tracking dengan sensors
