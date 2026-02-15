# API Documentation - Project Master Data System

## Overview

Dokumentasi API untuk sistem manajemen master data proyek perumahan menggunakan Strapi CMS. Sistem ini mendukung CRUD operations untuk data proyek, unit perumahan, kontraktor, dan informasi pembangunan lainnya.

## Content Types

### 1. Project (Content Type: `proyek-perumahan`)

#### Fields

| Field Name             | Type        | Required | Description                  | Validation                                  |
| ---------------------- | ----------- | -------- | ---------------------------- | ------------------------------------------- |
| `project_id`           | String      | Yes      | ID unik proyek               | Unique, Pattern: PROJ-XXXXXX                |
| `project_name`         | String      | Yes      | Nama proyek perumahan        | Min: 2, Max: 100                            |
| `project_type`         | Enumeration | Yes      | Jenis proyek                 | Options: perumahan, pembangunan, renovasi   |
| `developer`            | String      | Yes      | Nama developer               | Min: 2, Max: 100                            |
| `project_manager`      | String      | No       | Nama project manager         | Max: 100                                    |
| `project_description`  | Text        | No       | Deskripsi proyek             | Max: 1000                                   |
| `start_date`           | Date        | Yes      | Tanggal mulai proyek         | Required                                    |
| `estimated_completion` | Date        | Yes      | Estimasi tanggal selesai     | Required                                    |
| `actual_completion`    | Date        | No       | Tanggal selesai aktual       | Date format                                 |
| `budget`               | Decimal     | Yes      | Budget total proyek          | Min: 0                                      |
| `current_expense`      | Decimal     | No       | Pengeluaran saat ini         | Min: 0                                      |
| `status`               | Enumeration | Yes      | Status proyek                | Options: planning, ongoing, completed, hold |
| `total_units`          | Integer     | No       | Total unit yang direncanakan | Min: 0                                      |
| `completed_units`      | Integer     | No       | Unit yang sudah selesai      | Min: 0                                      |
| `progress_percentage`  | Decimal     | No       | Persentase progress          | Min: 0, Max: 100                            |
| `investment_value`     | Decimal     | No       | Nilai investasi total        | Min: 0                                      |
| `address`              | Text        | No       | Alamat lengkap proyek        | Max： 500                                   |
| `location`             | Text        | No       | Lokasi detail proyek         | Max: 500                                    |
| `coordinate_lat`       | Float       | No       | Latitude koordinat           | Range: -90 to 90                            |
| `coordinate_lng`       | Float       | No       | Longitude koordinat          | Range: -180 to 180                          |
| `land_area`            | Decimal     | No       | Luas lahan (hektar)          | Min: 0                                      |
| `zoning_type`          | Enumeration | No       | Jenis zonasi                 | Options: residensial, komersial, campuran   |
| `building_license`     | String      | No       | Nomor IMB                    | Max: 50                                     |
| `environment_permits`  | JSON        | No       | Perizinan lingkungan         | JSON object                                 |
| `notes`                | Text        | No       | Catatan tambahan             | Max: 1000                                   |
| `contact_info`         | JSON        | No       | Informasi kontak             | JSON object                                 |
| `created_at`           | DateTime    | Auto     | Tanggal dibuat               | Auto-generated                              |
| `updated_at`           | DateTime    | Auto     | Tanggal diupdate             | Auto-generated                              |

#### Relations

- `units` (One-to-Many): Relation ke `unit`
- `contractors` (Many-to-Many): Relation ke `contractor`
- `phases` (One-to-Many): Relation ke `project-phase`
- `documents` (One-to-Many): Relation ke `project-document`
- `workers` (One-to-Many): Relation ke `project-worker`
- `materials` (One-to-Many): Relation ke `project-material`

### 2. Unit (Content Type: `unit`)

#### Fields

| Field Name       | Type        | Required | Description          | Validation                                       |
| ---------------- | ----------- | -------- | -------------------- | ------------------------------------------------ |
| `unit_id`        | String      | Yes      | ID unik unit         | Unique, Pattern: UNIT-XXX                        |
| `unit_type`      | String      | Yes      | Tipe unit            | Max: 50 (e.g., "Tipe 36/72")                     |
| `block`          | String      | Yes      | Blok unit            | Max: 10                                          |
| `number`         | String      | Yes      | Nomor unit           | Max: 10                                          |
| `price`          | Decimal     | Yes      | Harga unit           | Min: 0                                           |
| `land_area`      | Integer     | Yes      | Luas tanah (m²)      | Min: 1                                           |
| `building_area`  | Integer     | Yes      | Luas bangunan (m²)   | Min: 1                                           |
| `bedrooms`       | Integer     | Yes      | Jumlah kamar tidur   | Min: 1                                           |
| `bathrooms`      | Integer     | Yes      | Jumlah kamar mandi   | Min: 1                                           |
| `garage`         | Integer     | No       | Jumlah garasi        | Min: 0                                           |
| `location`       | String      | No       | Lokasi detail unit   | Max: 100                                         |
| `status`         | Enumeration | Yes      | Status unit          | Options: tersedia, dipesan, terjual, maintenance |
| `specifications` | JSON        | No       | Spesifikasi tambahan | JSON object                                      |
| `images`         | Media       | No       | Foto unit            | Multiple images (max 10MB total)                 |
| `created_at`     | DateTime    | Auto     | Tanggal dibuat       | Auto-generated                                   |
| `updated_at`     | DateTime    | Auto     | Tanggal diupdate     | Auto-generated                                   |

#### Relations

- `project` (Many-to-One): Relation ke `proyek-perumahan`
- `bookings` (One-to-Many): Relation ke `booking`

### 3. Contractor (Content Type: `contractor`)

#### Fields

| Field Name       | Type     | Required | Description        | Validation                       |
| ---------------- | -------- | -------- | ------------------ | -------------------------------- |
| `contractor_id`  | String   | Yes      | ID unik kontraktor | Unique, Pattern: CT-XXXX         |
| `name`           | String   | Yes      | Nama perusahaan    | Min: 2, Max: 100                 |
| `company_type`   | String   | Yes      | Jenis perusahaan   | Max: 50                          |
| `address`        | Text     | Yes      | Alamat perusahaan  | Max: 500                         |
| `phone`          | String   | Yes      | Nomor telepon      | Pattern: Indonesian phone format |
| `email`          | Email    | Yes      | Email perusahaan   | Valid email format               |
| `license_no`     | String   | No       | Nomor SIUP/SBU     | Max: 50                          |
| `tax_id`         | String   | No       | NPWP perusahaan    | Pattern: [0-9]{15}               |
| `specialization` | Text     | No       | Bidang keahlian    | Max: 500                         |
| `rating`         | Decimal  | No       | Rating kinerja     | Min: 0, Max: 5                   |
| `is_active`      | Boolean  | Yes      | Status aktif       | Default: true                    |
| `notes`          | Text     | No       | Catatan tambahan   | Max: 1000                        |
| `created_at`     | DateTime | Auto     | Tanggal dibuat     | Auto-generated                   |
| `updated_at`     | DateTime | Auto     | Tanggal diupdate   | Auto-generated                   |

#### Relations

- `projects` (Many-to-Many): Relation ke `proyek-perumahan`

### 4. Project Phase (Content Type: `project-phase`)

#### Fields

| Field Name          | Type        | Required | Description       | Validation                                     |
| ------------------- | ----------- | -------- | ----------------- | ---------------------------------------------- |
| `phase_name`        | String      | Yes      | Nama fase         | Min: 2, Max: 50                                |
| `phase_number`      | Integer     | Yes      | Nomor urutan fase | Min: 1                                         |
| `start_target`      | Date        | Yes      | Target mulai      | Required                                       |
| `end_target`        | Date        | Yes      | Target selesai    | Required                                       |
| `start_actual`      | Date        | No       | Mulai aktual      | Date format                                    |
| `end_actual`        | Date        | No       | Selesai aktual    | Date format                                    |
| `budget_allocation` | Decimal     | Yes      | Alokasi budget    | Min: 0                                         |
| `description`       | Text        | No       | Deskripsi fase    | Max: 500                                       |
| `status`            | Enumeration | Yes      | Status fase       | Options: planning, ongoing, completed, delayed |
| `progress_percent`  | Decimal     | No       | Progress fase     | Min: 0, Max: 100                               |
| `created_at`        | DateTime    | Auto     | Tanggal dibuat    | Auto-generated                                 |
| `updated_at`        | DateTime    | Auto     | Tanggal diupdate  | Auto-generated                                 |

#### Relations

- `project` (Many-to-One): Relation ke `proyek-perumahan`

### 5. Project Document (Content Type: `project-document`)

#### Fields

| Field Name      | Type        | Required | Description         | Validation                                   |
| --------------- | ----------- | -------- | ------------------- | -------------------------------------------- |
| `document_type` | Enumeration | Yes      | Jenis dokumen       | Options: imb, sjp, kontrak, laporan, lainnya |
| `document_name` | String      | Yes      | Nama dokumen        | Max: 100                                     |
| `file`          | Media       | Yes      | File dokumen        | PDF/Image file (max 5MB)                     |
| `issue_date`    | Date        | No       | Tanggal diterbitkan | Date format                                  |
| `expiry_date`   | Date        | No       | Tanggal kadaluarsa  | Date format                                  |
| `status`        | Enumeration | Yes      | Status dokumen      | Options: active, expired, renewal-needed     |
| `notes`         | Text        | No       | Catatan dokumen     | Max: 500                                     |
| `created_at`    | DateTime    | Auto     | Tanggal dibuat      | Auto-generated                               |
| `updated_at`    | DateTime    | Auto     | Tanggal diupdate    | Auto-generated                               |

#### Relations

- `project` (Many-to-One): Relation ke `proyek-perumahan`

### 6. Project Worker (Content Type: `project-worker`)

#### Fields

| Field Name    | Type        | Required | Description         | Validation                            |
| ------------- | ----------- | -------- | ------------------- | ------------------------------------- |
| `worker_name` | String      | Yes      | Nama pekerja        | Min: 2, Max: 100                      |
| `position`    | String      | Yes      | Jabatan/posisi      | Min: 2, Max: 50                       |
| `worker_type` | Enumeration | Yes      | Jenis pekerja       | Options: karyawan, outsourced, harian |
| `start_date`  | Date        | Yes      | Tanggal mulai kerja | Required                              |
| `end_date`    | Date        | No       | Tanggal selesai     | Date format                           |
| `hourly_rate` | Decimal     | No       | Tarif per jam       | Min: 0                                |
| `daily_rate`  | Decimal     | No       | Tarif per hari      | Min: 0                                |
| `phone`       | String      | No       | Nomor telepon       | Pattern: Indonesian phone format      |
| `id_number`   | String      | No       | Nomor identitas     | Max: 20                               |
| `notes`       | Text        | No       | Catatan             | Max: 300                              |
| `created_at`  | DateTime    | Auto     | Tanggal dibuat      | Auto-generated                        |
| `updated_at`  | DateTime    | Auto     | Tanggal diupdate    | Auto-generated                        |

#### Relations

- `project` (Many-to-One): Relation ke `proyek-perumahan`

### 7. Project Material (Content Type: `project-material`)

#### Fields

| Field Name         | Type        | Required | Description          | Validation                          |
| ------------------ | ----------- | -------- | -------------------- | ----------------------------------- |
| `material_code`    | String      | Yes      | Kode material        | Unique, Max: 50                     |
| `material_name`    | String      | Yes      | Nama material        | Min: 2, Max: 100                    |
| `category`         | Enumeration | Yes      | Kategori material    | Options: structural, finishing, mep |
| `unit_type`        | String      | Yes      | Satuan               | Max: 20 (e.g., "kg", "m²", "pcs")   |
| `quantity_planned` | Decimal     | Yes      | Quantitas rencana    | Min: 0                              |
| `quantity_used`    | Decimal     | No       | Quantitas terpakai   | Min: 0                              |
| `unit_price`       | Decimal     | Yes      | Harga per satuan     | Min: 0                              |
| `supplier`         | String      | No       | Supplier/penyedia    | Max: 100                            |
| `specification`    | Text        | No       | Spesifikasi material | Max: 500                            |
| `quality_status`   | Enumeration | Yes      | Status kualitas      | Options: good, damaged, rejected    |
| `notes`            | Text        | No       | Catatan material     | Max: 300                            |
| `created_at`       | DateTime    | Auto     | Tanggal dibuat       | Auto-generated                      |
| `updated_at`       | DateTime    | Auto     | Tanggal diupdate     | Auto-generated                      |

#### Relations

- `project` (Many-to-One): Relation ke `proyek-perumahan`

## API Endpoints

### Project Endpoints

#### GET /api/proyek-perumahans

**Description**: Mendapatkan daftar semua proyek dengan filtering dan pagination
**Query Parameters**:

- `filters[status][$eq]`: Filter berdasarkan status (planning, ongoing, completed, hold)
- `filters[project_type][$eq]`: Filter berdasarkan jenis proyek
- `filters[developer][$containsi]`: Search berdasarkan developer
- `filters[project_name][$containsi]`: Search berdasarkan nama proyek
- `filters[start_date][$gte]`: Filter proyek mulai dari tanggal
- `filters[estimated_completion][$lte]`: Filter proyek selesai sampai tanggal
- `populate`: Populate relations (units, contractors, phases, documents, workers, materials)
- `sort`: Sorting (created_at:desc, start_date:asc, project_name:asc, etc.)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "project_id": "PROJ-001",
        "project_name": "Perumahan Griya Indah",
        "project_type": "perumahan",
        "developer": "PT Griya Properti Indah",
        "project_manager": "Ahmad Rizki",
        "project_description": "Proyek perumahan dengan fasilitas lengkap",
        "start_date": "2023-01-15",
        "estimated_completion": "2024-12-31",
        "actual_completion": null,
        "budget": 45000000000,
        "current_expense": 12000000000,
        "status": "ongoing",
        "total_units": 120,
        "completed_units": 45,
        "progress_percentage": 37.5,
        "investment_value": 45000000000,
        "address": "Jl. Raya Cikarang No. 123, Cikarang Utara, Bekasi",
        "location": "Cikarang Utara, Bekasi",
        "coordinate_lat": -6.2088,
        "coordinate_lng": 106.8456,
        "land_area": 5.2,
        "zoning_type": "residensial",
        "building_license": "IMB-2023-001",
        "environment_permits": {
          "amdal": "AMDAL-001",
          "ukl-upl": "UKL-UPL-001"
        },
        "notes": "Proyek prioritas",
        "contact_info": {
          "phone": "021-12345678",
          "email": "info@griyaindah.com"
        },
        "created_at": "2023-01-15T08:00:00.000Z",
        "updated_at": "2023-09-12T10:00:00.000Z",
        "units": {
          "data": [...]
        },
        "contractors": {
          "data": [...]
        },
        "phases": {
          "data": [...]
        },
        "documents": {
          "data": [...]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 95
    }
  }
}
```

#### GET /api/proyek-perumahans/:id

**Description**: Mendapatkan detail proyek berdasarkan ID
**Query Parameters**:

- `populate`: Populate relations

#### POST /api/proyek-perumahans

**Description**: Membuat proyek baru
**Request Body**:

```json
{
  "data": {
    "project_name": "Perumahan Griya Indah",
    "project_type": "perumahan",
    "developer": "PT Griya Properti Indah",
    "project_manager": "Ahmad Rizki",
    "project_description": "Proyek perumahan dengan fasilitas lengkap",
    "start_date": "2023-01-15",
    "estimated_completion": "2024-12-31",
    "budget": 45000000000,
    "status": "planning",
    "total_units": 120,
    "address": "Jl. Raya Cikarang No. 123, Cikarang Utara, Bekasi",
    "location": "Cikarang Utara, Bekasi",
    "coordinate_lat": -6.2088,
    "coordinate_lng": 106.8456,
    "land_area": 5.2,
    "zoning_type": "residensial",
    "building_license": "IMB-2023-001",
    "contact_info": {
      "phone": "021-12345678",
      "email": "info@griyaindah.com"
    }
  }
}
```

#### PUT /api/proyek-perumahans/:id

**Description**: Update proyek
**Request Body**: Same as POST with additional fields

```json
{
  "data": {
    "current_expense": 12500000000,
    "completed_units": 50,
    "progress_percentage": 41.7,
    "status": "ongoing"
  }
}
```

#### DELETE /api/proyek-perumahans/:id

**Description**: Hapus proyek (soft delete - ubah status menjadi hold)

### Unit Endpoints

#### GET /api/units

**Description**: Mendapatkan daftar unit
**Query Parameters**:

- `filters[project][id][$eq]`: Filter berdasarkan project ID
- `filters[status][$eq]`: Filter berdasarkan status unit
- `filters[unit_type][$containsi]`: Search berdasarkan tipe unit
- `filters[block][$eq]`: Filter berdasarkan blok
- `filters[price][$gte]`: Filter harga minimum
- `filters[price][$lte]`: Filter harga maksimum
- `populate`: Populate project relation
- `sort`: Sorting (price:asc, unit_id:asc, etc.)

#### POST /api/units

**Description**: Tambah unit baru
**Request Body**:

```json
{
  "data": {
    "unit_id": "UNIT-001",
    "unit_type": "Tipe 36/72",
    "block": "A",
    "number": "12",
    "price": 450000000,
    "land_area": 72,
    "building_area": 36,
    "bedrooms": 2,
    "bathrooms": 1,
    "garage": 1,
    "location": "Blok A - Row 3",
    "status": "tersedia",
    "specifications": {
      "carport": true,
      "garden": false,
      "furnished": false
    },
    "project": 1
  }
}
```

### Contractor Endpoints

#### GET /api/contractors

**Description**: Mendapatkan daftar kontraktor
**Query Parameters**:

- `filters[is_active][$eq]`: Filter kontraktor aktif
- `filters[name][$containsi]`: Search berdasarkan nama perusahaan
- `filters[company_type][$eq]`: Filter berdasarkan jenis perusahaan
- `populate`: Populate projects relation
- `sort`: Sorting (name:asc, rating:desc, etc.)

#### POST /api/contractors

**Description**: Tambah kontraktor baru
**Request Body**:

```json
{
  "data": {
    "contractor_id": "CT-001",
    "name": "PT Bangun Jaya Konstruksi",
    "company_type": "PT",
    "address": "Jl. Industri No. 123, Jakarta",
    "phone": "021-12345678",
    "email": "info@bangunjaya.com",
    "license_no": "SIUP-123456",
    "tax_id": "123456789012345",
    "specialization": "Konstruksi perumahan dan komersial",
    "rating": 4.5,
    "is_active": true
  }
}
```

### Project Phase Endpoints

#### GET /api/project-phases

**Description**: Mendapatkan daftar fase proyek
**Query Parameters**:

- `filters[project][id][$eq]`: Filter berdasarkan project ID
- `filters[status][$eq]`: Filter berdasarkan status fase
- `populate`: Populate project relation
- `sort`: Sorting (phase_number:asc, start_target:asc)

#### POST /api/project-phases

**Description**: Tambah fase proyek baru
**Request Body**:

```json
{
  "data": {
    "phase_name": "Fase 1 - Pembangunan Infrastruktur",
    "phase_number": 1,
    "start_target": "2023-01-15",
    "end_target": "2023-06-30",
    "budget_allocation": 18000000000,
    "description": "Pembangunan jalan utama dan infrastruktur dasar",
    "status": "completed",
    "progress_percent": 100,
    "project": 1
  }
}
```

### Project Document Endpoints

#### GET /api/project-documents

**Description**: Mendapatkan daftar dokumen proy\*\*

**Query Parameters**:

- `filters[project][id][$eq]`: Filter berdasarkan project ID
- `filters[document_type][$eq]`: Filter berdasarkan jenis dokumen
- `filters[status][$eq]`: Filter berdasarkan status dokumen
- `populate`: Populate project relation
- `sort`: Sorting (issue_date:desc)

#### POST /api/project-documents

**Description**: Upload dokumen proy\*\*
**Request Body** (multipart/form-data):

```json
{
  "data": {
    "document_type": "imb",
    "document_name": "IMB Perumahan Griya Indah",
    "issue_date": "2023-01-10",
    "expiry_date": "2025-01-10",
    "status": "active",
    "project": 1
  },
  "files": {
    "file": [uploaded_file]
  }
}
```

### Project Worker Endpoints

#### GET /api/project-workers

**Description**: Mendapatkan daftar pekerja proy\*\*
**Query Parameters**:

- `filters[project][id][$eq]`: Filter berdasarkan project ID
- `filters[worker_type][$eq]`: Filter berdasarkan jenis pekerja
- `filters[position][$containsi]`: Search berdasarkan jabatan
- `populate`: Populate project relation
- `sort`: Sorting (worker_name:asc)

#### POST /api/project-workers

**Description**: Tambah pekerja proy** baru
**Request Body\*\*:

```json
{
  "data": {
    "worker_name": "Budi Santoso",
    "position": "Mandor",
    "worker_type": "karyawan",
    "start_date": "2023-01-15",
    "hourly_rate": 25000,
    "phone": "081234567890",
    "id_number": "3171234567890001",
    "project": 1
  }
}
```

### Project Material Endpoints

#### GET /api/project-materials

**Description**: Mendapatkan daftar material proy\*\*
**Query Parameters**:

- `filters[project][id][$eq]`: Filter berdasarkan project ID
- `filters[category][$eq]`: Filter berdasarkan kategori material
- `filters[material_name][$containsi]`: Search berdasarkan nama material
- `populate`: Populate project relation
- `sort`: Sorting (material_code:asc)

#### POST /api/project-materials

**Description**: Tambah material proy** baru
**Request Body\*\*:

```json
{
  "data": {
    "material_code": "BTPL-001",
    "material_name": "Bata Tembok Press",
    "category": "structural",
    "unit_type": "pcs",
    "quantity_planned": 10000,
    "unit_price": 1500,
    "supplier": "PT Bata Indonesia",
    "specification": "Bata merah press 10x10x20 cm",
    "quality_status": "good",
    "project": 1
  }
}
```

## Strapi Configuration

### Content Type Builder Settings

#### Project Content Type

```json
{
  "kind": "collectionType",
  "collectionName": "proyek_perumahans",
  "info": {
    "singularName": "proyek-perumahan",
    "pluralName": "proyek-perumahans",
    "displayName": "Proyek Perumahan"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "project_id": {
      "type": "string",
      "required": true,
      "unique": true,
      "regex": "^PROJ-[0-9]{6}$"
    },
    "project_name": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "project_type": {
      "type": "enumeration",
      "enum": ["perumahan", "pembangunan", "renovasi"],
      "required": true
    },
    "developer": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "project_manager": {
      "type": "string",
      "maxLength": 100
    },
    "project_description": {
      "type": "text",
      "maxLength": 1000
    },
    "start_date": {
      "type": "date",
      "required": true
    },
    "estimated_completion": {
      "type": "date",
      "required": true
    },
    "actual_completion": {
      "type": "date"
    },
    "budget": {
      "type": "decimal",
      "required": true,
      "min": 0
    },
    "current_expense": {
      "type": "decimal",
      "min": 0
    },
    "status": {
      "type": "enumeration",
      "enum": ["planning", "ongoing", "completed", "hold"],
      "required": true,
      "default": "planning"
    },
    "total_units": {
      "type": "integer",
      "min": 0
    },
    "completed_units": {
      "type": "integer",
      "min": 0
    },
    "progress_percentage": {
      "type": "decimal",
      "min": 0,
      "max": 100
    },
    "investment_value": {
      "type": "decimal",
      "min": 0
    },
    "address": {
      "type": "text",
      "maxLength": 500
    },
    "location": {
      "type": "text",
      "maxLength": 500
    },
    "coordinate_lat": {
      "type": "decimal",
      "min": -90,
      "max": 90
    },
    "coordinate_lng": {
      "type": "decimal",
      "min": -180,
      "max": 180
    },
    "land_area": {
      "type": "decimal",
      "min": 0
    },
    "zoning_type": {
      "type": "enumeration",
      "enum": ["residensial", "komersial", "campuran"]
    },
    "building_license": {
      "type": "string",
      "maxLength": 50
    },
    "environment_permits": {
      "type": "json"
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "contact_info": {
      "type": "json"
    },
    "units": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::unit.unit",
      "mappedBy": "project"
    },
    "contractors": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::contractor.contractor",
      "inversedBy": "projects"
    },
    "phases": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::project-phase.project-phase",
      "mappedBy": "project"
    },
    "documents": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::project-document.project-document",
      "mappedBy": "project"
    },
    "workers": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::project-worker.project-worker",
      "mappedBy": "project"
    },
    "materials": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::project-material.project-material",
      "mappedBy": "project"
    }
  }
}
```

### Permissions

Set permissions untuk:

- `proyek-perumahan`: find, findOne, create, update, delete
- `unit`: find, findOne, create, update, delete
- `contractor`: find, findOne, create, update, delete
- `project-phase`: find, findOne, create, update, delete
- `project-document`: find, findOne, create, update, delete
- `project-worker`: find, findOne, create, update, delete
- `project-material`: find, findOne, create, update, delete

### Lifecycle Hooks

```javascript
// api/proyek-perumahan/content-types/proyek-perumahan/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate project ID if not provided
    if (!data.project_id) {
      const lastProject = await strapi.entityService.findMany(
        "api::proyek-perumahan.proyek-perumahan",
        {
          sort: { project_id: "desc" },
          limit: 1,
        }
      );

      const lastId = lastProject[0]?.attributes?.project_id || "PROJ-000000";
      const nextNumber = parseInt(lastId.split("-")[1]) + 1;
      data.project_id = `PROJ-${nextNumber.toString().padStart(6, "0")}`;
    }

    // Calculate progress percentage
    if (data.completed_units && data.total_units) {
      data.progress_percentage =
        (data.completed_units / data.total_units) * 100;
    }

    // Set default status
    if (!data.status) {
      data.status = "planning";
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Recalculate progress percentage on update
    if (data.completed_units !== undefined && data.total_units !== undefined) {
      data.progress_percentage =
        (data.completed_units / data.total_units) * 100;
    }

    // Update status based on progress
    if (data.progress_percentage >= 100 && data.status === "ongoing") {
      data.status = "completed";
      data.actual_completion = new Date().toISOString().split("T")[0];
    }
  },
};

// api/project-phase/content-types/project-phase/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Calculate progress percentage if not provided
    if (data.start_target && data.end_target) {
      const start = new Date(data.start_target);
      const end = new Date(data.end_target);
      const now = new Date();

      if (now >= start && now <= end) {
        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const passedDays = (now - start) / (1000 * 60 * 60 * 24);
        data.progress_percent = Math.min((passedDays / totalDays) * 100, 100);
      }
    }

    // Set default status
    if (!data.status) {
      data.status = "planning";
    }
  },
};
```

## Frontend Integration Notes

### State Management

- Gunakan React Query/SWR untuk caching dan synchronization
- Implement optimistic updates untuk UX yang lebih baik
- Cache project data dengan TTL yang sesuai
- Real-time updates untuk progress dan status proyek

### Form validation

- Validasi project ID format (PROJ-XXXXXX)
- Validasi koordinat latitude/longitude range
- Validasi tanggal mulai tidak boleh lebih dari estimasi selesai
- Validasi budget dan pengeluaran harus konsisten
- Required field validation
- File type dan size validation untuk upload dokumen

### Multi-Step Project Management

1. **Project Setup**: Basic project information
2. **Planning Phase**: Budget allocation dan phase breakdown
3. **Resource Management**: Contractors, workers, materials
4. **Progress Tracking**: Real-time progress updates
5. **Documentation**: Upload dan manage project documents

### Geographic Features

- Integration dengan maps API untuk koordinat
- Geofencing untuk project locations
- Radius search untuk nearby projects
- Distance calculation antara projects

### File Upload

- Support multiple file upload untuk dokumen
- File type validation (PDF, DOC, images)
- File size limit (max 5MB per file)
- Document versioning untuk updates
- Progress indicator untuk upload

### Real-time Updates

- WebSocket untuk update progress real-time
- Notification untuk milestone achievements
- Auto-refresh project status changes
- Live budget tracking dan alerts

### Data Export

- Export project data ke Excel/CSV
- Export laporan progress per periode
- Export budget vs actual expenses
- Export resource allocation reports

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (Admin, Project Manager, Engineer, Worker)
3. **Data Validation**: Server-side validation untuk semua input
4. **Rate Limiting**: Implement rate limiting untuk API endpoints
5. **CORS**: Configure CORS untuk frontend domain
6. **Data Privacy**: Secure handling untuk financial data dan personal information
7. **Audit Trail**: Log semua perubahan proyek dan resource
8. **File Security**: Secure file upload dengan virus scanning
9. **Budget Security**: Role-based access untuk budget information
10. **Geolocation Privacy**: Secure coordinate data handling

## Performance Optimization

1. **Database Indexing**: Index pada field yang sering di-query (project_id, status, start_date, developer)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk project metadata dan stats
4. **Image Optimization**: Compress dan optimize uploaded images
5. **API Response**: Minimize response size dengan selective field population
6. **Lazy Loading**: Load relations only when needed
7. **Search Optimization**: Implement full-text search untuk project names dan descriptions
8. **GeoSpatial Indexing**: Optimize geographic queries untuk location-based features

## Business Rules

1. **Project ID Generation**: Auto-generate project ID dengan format PROJ-XXXXXX
2. **Progress Calculation**: Auto-calculate progress percentage dari completed vs total units
3. **Budget Tracking**: Validate current_expense tidak melebihi budget
4. **Phase Management**: Sequential phase numbering dan validation
5. **Material Tracking**: Quantity tracking untuk inventory management
6. **Worker Assignment**: Prevent duplicate worker assignments
7. **Document Management**: Track document expiry dates dan renewal alerts
8. **Status Workflow**: Enforce proper status transition workflow (planning -> ongoing -> completed)
9. **Resource Allocation**: Validate resource assignments tidak conflict
10. **Payment Integration**: Integration dengan system pembayaran kontraktor

## Reporting & Analytics

### Dashboard Metrics

- Total projects aktif dan completed
- Budget utilization vs allocation
- Progress tracking per project
- Resource utilization statistics
- Timeline adherence reports

### Reports

- Laporan progress harian/mingguan/bulanan
- Laporan budget vs actual expenses
- Laporan resource utilization
- Laporan document status dan expiry
- Laporan quality control dan inspection

### Export Features

- Export project data dengan filter tanggal
- Export resource allocation reports
- Export budget variance reports
- Export progress tracking charts
- Bulk export untuk stakeholder presentations

## Integration with Other Modules

### Project-Unit Integration

- Automatic unit creation dari project specifications
- Unit status update saat project progress
- Project completion triggers unit availability updates

### Project-Marketing Integration

- Unit availability feeding to marketing dashboard
- Project completion milestones untuk marketing campaigns
- Customer booking integration dengan project phases

### Project-Finance Integration

- Budget tracking integration dengan akunting system
- Contractor payment integration
- Investment tracking dan ROI calculations

### Project-HRM Integration

- Worker assignment dari HR database
- Attendance tracking untuk project workers
- Performance evaluation untuk project assignments
