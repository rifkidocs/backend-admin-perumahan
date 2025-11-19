# API Usage Documentation - Gudang System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Manajemen Gudang. Sistem ini mengelola master data gudang, termasuk Gudang Induk (pusat) dan Gudang Proyek. Endpoint standar menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel, sedangkan endpoint custom tersedia melalui `/api/gudangs`.

## Content Types API Endpoints

### 1. Gudang API (`api::gudang.gudang`)

#### Base URL

```
/content-manager/collection-types/api::gudang.gudang
```

#### Standard Endpoints

| Method | Endpoint                                                               | Description                 |
| ------ | ---------------------------------------------------------------------- | --------------------------- |
| GET    | `/content-manager/collection-types/api::gudang.gudang`                 | Get all gudang records      |
| GET    | `/content-manager/collection-types/api::gudang.gudang/:id`             | Get gudang record by ID     |
| POST   | `/content-manager/collection-types/api::gudang.gudang`                 | Create new gudang record    |
| PUT    | `/content-manager/collection-types/api::gudang.gudang/:id`             | Update gudang record        |
| DELETE | `/content-manager/collection-types/api::gudang.gudang/:id`             | Delete gudang record        |

#### Custom Endpoints

| Method | Endpoint                                | Description                     |
| ------ | --------------------------------------- | ------------------------------- |
| GET    | `/api/gudangs/jenis/:jenis`             | Get gudangs by type             |
| GET    | `/api/gudangs/active`                   | Get all active gudangs          |
| GET    | `/api/gudangs/proyek/:proyekId`         | Get gudangs by project ID       |
| GET    | `/api/gudangs/stats`                    | Get gudang statistics           |

## Request Examples

### Create Gudang Induk

```json
POST /content-manager/collection-types/api::gudang.gudang
Content-Type: application/json

{
  "nama_gudang": "Gudang Pusat Jakarta",
  "jenis_gudang": "Gudang Induk",
  "lokasi": "Jakarta Industrial Estate",
  "alamat_lengkap": "Jl. Rawa Gelam V No. 12, Jakarta Timur",
  "kontak_person": "Budi Santoso",
  "telepon": "081234567890",
  "status_gudang": "Aktif",
  "keterangan": "Gudang utama untuk penyimpanan material bulk",
  "is_active": true
}
```

### Create Gudang Proyek

```json
POST /content-manager/collection-types/api::gudang.gudang
Content-Type: application/json

{
  "nama_gudang": "Gudang Proyek Citra Indah",
  "jenis_gudang": "Gudang Proyek",
  "lokasi": "Site Project Citra Indah",
  "alamat_lengkap": "Jl. Raya Jonggol Km 23",
  "kontak_person": "Ahmad Junaedi",
  "telepon": "081987654321",
  "status_gudang": "Aktif",
  "proyek_perumahan": "project_document_id",
  "keterangan": "Gudang sementara untuk proyek Citra Indah",
  "is_active": true
}
```

### Update Gudang Status

```json
PUT /content-manager/collection-types/api::gudang.gudang/1
Content-Type: application/json

{
  "status_gudang": "Maintenance",
  "keterangan": "Sedang dalam perbaikan atap"
}
```

---

## Schema JSON

### Gudang Schema

```json
{
  "kind": "collectionType",
  "collectionName": "gudangs",
  "info": {
    "singularName": "gudang",
    "pluralName": "gudangs",
    "displayName": "Gudang",
    "description": "Manajemen master data gudang (Gudang Induk dan Gudang Proyek)"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "kode_gudang": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 50,
      "description": "Kode unik gudang (Auto-generated: GD-XXXX)"
    },
    "nama_gudang": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "jenis_gudang": {
      "type": "enumeration",
      "enum": [
        "Gudang Induk",
        "Gudang Proyek"
      ],
      "required": true,
      "default": "Gudang Induk"
    },
    "lokasi": {
      "type": "text",
      "required": true
    },
    "alamat_lengkap": {
      "type": "text"
    },
    "kontak_person": {
      "type": "string",
      "maxLength": 255
    },
    "telepon": {
      "type": "string",
      "maxLength": 50
    },
    "status_gudang": {
      "type": "enumeration",
      "enum": [
        "Aktif",
        "Non-Aktif",
        "Maintenance"
      ],
      "required": true,
      "default": "Aktif"
    },
    "keterangan": {
      "type": "text"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "proyek_perumahan": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "gudangs",
      "description": "Proyek terkait (wajib untuk Gudang Proyek)"
    },
    "penerimaan_materials": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::penerimaan-material.penerimaan-material",
      "mappedBy": "gudang"
    },
    "pengeluaran_materials": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::pengeluaran-material.pengeluaran-material",
      "mappedBy": "gudang"
    },
    "stock_opnames": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::stock-opname.stock-opname",
      "mappedBy": "gudang"
    },
    "foto_gudang": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": [
        "images",
        "files"
      ]
    }
  }
}
```

---

## Relations

### Gudang Relations

- `proyek_perumahan` (Many-to-One) → Project Management (Proyek Perumahan)
- `penerimaan_materials` (One-to-Many) ← Penerimaan Material
- `pengeluaran_materials` (One-to-Many) ← Pengeluaran Material
- `stock_opnames` (One-to-Many) ← Stock Opname
- `foto_gudang` (Media) → Strapi Upload Files

---

## Gudang Types Details

### Gudang Induk
- Gudang pusat penyimpanan material
- Tidak terikat pada satu proyek spesifik
- Sumber distribusi material ke gudang-gudang proyek
- Lokasi biasanya di kantor pusat atau warehouse terpisah

### Gudang Proyek
- Gudang yang berlokasi di site proyek
- Terikat dengan satu data `proyek_perumahan`
- Tempat penyimpanan material untuk kebutuhan proyek tersebut
- Masa aktif mengikuti durasi proyek

---

## Authentication & Permissions

### Required Headers

```json
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}
```

### Permission Levels

**Public (No Access):**
- Tidak ada akses publik untuk data gudang

**Authenticated:**
- `find` - Melihat daftar gudang
- `findOne` - Melihat detail gudang

**Role-Based Access:**

- **Admin**: Full access
- **Logistik/Gudang**: Create, update, manage stock
- **Project Manager**: Read access for project warehouses
- **Keuangan**: Read access for asset auditing

---

## Custom API Endpoints Details

### Get Gudang by Jenis

**Endpoint:** `GET /api/gudangs/jenis/:jenis`

**Parameters:**
- `jenis`: "Gudang Induk" or "Gudang Proyek"

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nama_gudang": "Gudang Pusat",
        "jenis_gudang": "Gudang Induk",
        "kode_gudang": "GD-0001",
        ...
      }
    }
  ]
}
```

### Get Active Gudangs

**Endpoint:** `GET /api/gudangs/active`

**Description:** Mengambil semua gudang dengan `status_gudang: "Aktif"` dan `is_active: true`.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nama_gudang": "Gudang Pusat",
        "status_gudang": "Aktif",
        ...
      }
    }
  ]
}
```

### Get Gudang by Proyek

**Endpoint:** `GET /api/gudangs/proyek/:proyekId`

**Parameters:**
- `proyekId`: ID dari proyek perumahan

**Response:**
```json
{
  "data": [
    {
      "id": 2,
      "attributes": {
        "nama_gudang": "Gudang Proyek A",
        "jenis_gudang": "Gudang Proyek",
        "proyek_perumahan": { ... },
        ...
      }
    }
  ]
}
```

### Get Gudang Statistics

**Endpoint:** `GET /api/gudangs/stats`

**Response:**
```json
{
  "data": {
    "total_gudang": 10,
    "gudang_induk": 3,
    "gudang_proyek": 7,
    "gudang_aktif": 8
  }
}
```

---

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Nama gudang is required",
    "details": {}
  }
}
```

**Unique Constraint Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ApplicationError",
    "message": "This attribute must be unique: kode_gudang"
  }
}
```

---

## Query Parameters

### Pagination

```
?page=1&pageSize=25
```

### Sorting

```
?sort=nama_gudang:asc
?sort=createdAt:desc
```

### Filtering

```
?filters[jenis_gudang][$eq]=Gudang Induk
?filters[status_gudang][$eq]=Aktif
?filters[lokasi][$containsi]=Jakarta
?filters[proyek_perumahan][id][$eq]=1
```

### Population (Relations)

```
?populate=*
?populate[0]=proyek_perumahan
?populate[0]=foto_gudang
```

---

## Usage Examples

### Get Active Gudang Induk

```javascript
const response = await api.get('/api/gudangs', {
  params: {
    filters: {
      jenis_gudang: 'Gudang Induk',
      status_gudang: 'Aktif'
    },
    populate: '*'
  }
});
```

### Create New Gudang with Auto-Generated Code

```javascript
// Note: kode_gudang is auto-generated by the controller
const newGudang = {
  nama_gudang: "Gudang Cabang Surabaya",
  jenis_gudang: "Gudang Induk",
  lokasi: "Surabaya Industrial Park",
  status_gudang: "Aktif"
};

const response = await api.post('/content-manager/collection-types/api::gudang.gudang', newGudang);
console.log(response.data.kode_gudang); // Output: GD-XXXX
```

### Get Statistics Dashboard

```javascript
const stats = await api.get('/api/gudangs/stats');
console.log(`Total Gudang: ${stats.data.total_gudang}`);
console.log(`Gudang Aktif: ${stats.data.gudang_aktif}`);
```

---

## Best Practices

1. **Kode Gudang**: Biarkan sistem melakukan auto-generate untuk `kode_gudang` untuk menjamin konsistensi format dan keunikan.
2. **Gudang Proyek**: Selalu relasikan Gudang Proyek dengan `proyek_perumahan` yang sesuai.
3. **Status Management**: Gunakan status `Maintenance` atau `Non-Aktif` jika gudang sedang tidak bisa digunakan, jangan langsung menghapus data jika sudah ada riwayat transaksi.
4. **Data Integrity**: Jangan menghapus gudang yang memiliki relasi dengan transaksi (penerimaan/pengeluaran material).
5. **Media**: Upload foto kondisi gudang secara berkala untuk dokumentasi aset.
