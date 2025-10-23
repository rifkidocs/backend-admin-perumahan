# Dokumentasi Implementasi Backend - Data Penilaian Kinerja (Performance Evaluation)

## Overview

Dokumentasi ini menjelaskan implementasi sistem Data Penilaian Kinerja untuk modul HRM menggunakan Strapi CMS. Sistem ini mencakup evaluasi kinerja karyawan, KPI per divisi, dan pencapaian target.

## Content Types yang Diimplementasikan

### 1. Performance Review (penilaian-kinerja) - MODIFIED

**File:** `src/api/performance-review/content-types/performance-review/schema.json`

Content type ini telah dimodifikasi dari struktur sebelumnya untuk menyesuaikan dengan kebutuhan dokumentasi.

#### Schema Structure

```javascript
{
  "kind": "collectionType",
  "collectionName": "performance_reviews",
  "info": {
    "singularName": "performance-review",
    "pluralName": "performance-reviews",
    "displayName": "Penilaian Kinerja",
    "description": "Data evaluasi kinerja karyawan"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "nik_karyawan": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "nama_karyawan": {
      "type": "string",
      "required": true
    },
    "divisi": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::departemen.departemen"
    },
    "jabatan": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::jabatan.jabatan"
    },
    "periode_evaluasi": {
      "type": "string",
      "required": true
    },
    "tahun_evaluasi": {
      "type": "integer",
      "required": true
    },
    "bulan_evaluasi": {
      "type": "integer",
      "required": true
    },
    "rating_kinerja": {
      "type": "decimal",
      "required": true,
      "min": 1,
      "max": 5
    },
    "target_divisi": {
      "type": "string"
    },
    "pencapaian_target": {
      "type": "string"
    },
    "persentase_pencapaian": {
      "type": "decimal"
    },
    "reviewer": {
      "type": "string",
      "required": true
    },
    "catatan_review": {
      "type": "text"
    },
    "status_evaluasi": {
      "type": "enumeration",
      "enum": ["draft", "submitted", "reviewed", "approved"],
      "default": "draft"
    },
    "tanggal_evaluasi": {
      "type": "date",
      "required": true
    },
    "tanggal_review": {
      "type": "datetime"
    },
    "karyawan": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan"
    }
  }
}
```

### 2. KPI Divisi (kpi-divisi) - NEW

**File:** `src/api/kpi-divisi/content-types/kpi-divisi/schema.json`

Content type baru untuk mengelola Key Performance Indicators per divisi.

#### Schema Structure

```javascript
{
  "kind": "collectionType",
  "collectionName": "kpi_divisis",
  "info": {
    "singularName": "kpi-divisi",
    "pluralName": "kpi-divisis",
    "displayName": "KPI Divisi",
    "description": "Key Performance Indicators per divisi"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "nama_divisi": {
      "type": "string",
      "required": true
    },
    "kode_divisi": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "target_bulanan": {
      "type": "string",
      "required": true
    },
    "target_tahunan": {
      "type": "string",
      "required": true
    },
    "pencapaian_bulanan": {
      "type": "string"
    },
    "pencapaian_tahunan": {
      "type": "string"
    },
    "persentase_pencapaian": {
      "type": "decimal"
    },
    "periode": {
      "type": "string",
      "required": true
    },
    "tahun": {
      "type": "integer",
      "required": true
    },
    "bulan": {
      "type": "integer",
      "required": true
    },
    "status_target": {
      "type": "enumeration",
      "enum": ["tercapai", "melebihi", "kurang"],
      "default": "kurang"
    },
    "catatan": {
      "type": "text"
    },
    "divisi": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::departemen.departemen"
    }
  }
}
```

### 3. Rating Kinerja (rating-kinerja) - NEW

**File:** `src/api/rating-kinerja/content-types/rating-kinerja/schema.json`

Content type baru untuk mengelola distribusi rating kinerja karyawan.

#### Schema Structure

```javascript
{
  "kind": "collectionType",
  "collectionName": "rating_kinerjas",
  "info": {
    "singularName": "rating-kinerja",
    "pluralName": "rating-kinerjas",
    "displayName": "Rating Kinerja",
    "description": "Distribusi rating kinerja karyawan"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "rating": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5
    },
    "label_rating": {
      "type": "enumeration",
      "enum": ["Poor", "Needs Improvement", "Satisfactory", "Good", "Excellent"],
      "required": true
    },
    "jumlah_karyawan": {
      "type": "integer",
      "required": true,
      "default": 0
    },
    "persentase": {
      "type": "decimal",
      "required": true,
      "default": 0
    },
    "periode": {
      "type": "string",
      "required": true
    },
    "tahun": {
      "type": "integer",
      "required": true
    },
    "bulan": {
      "type": "integer",
      "required": true
    },
    "warna_badge": {
      "type": "string"
    }
  }
}
```

## Lifecycle Hooks Implementation

### 1. Performance Review Lifecycle

**File:** `src/api/performance-review/content-types/performance-review/lifecycles.js`

#### Features:

- Auto-generate tanggal evaluasi jika tidak ada
- Set status default ke "draft"
- Validasi rating kinerja (1-5)
- Auto-calculate persentase pencapaian dari target dan pencapaian
- Update distribusi rating secara otomatis
- Logging semua aktivitas evaluasi

#### Key Functions:

- `updateRatingDistribution()` - Update distribusi rating setelah create/update
- `recalculateRatingPercentages()` - Recalculate persentase untuk semua rating dalam periode
- `updateRatingDistributionAfterDelete()` - Update distribusi setelah delete

### 2. KPI Divisi Lifecycle

**File:** `src/api/kpi-divisi/content-types/kpi-divisi/lifecycles.js`

#### Features:

- Auto-calculate persentase pencapaian dari target bulanan dan pencapaian
- Set status target berdasarkan persentase (tercapai/melebihi/kurang)
- Auto-generate periode format (bulan/tahun)
- Update divisi statistics
- Logging semua aktivitas KPI

#### Key Functions:

- `updateDivisiStatistics()` - Update statistik divisi berdasarkan KPI

### 3. Rating Kinerja Lifecycle

**File:** `src/api/rating-kinerja/content-types/rating-kinerja/lifecycles.js`

#### Features:

- Validasi rating range (1-5)
- Auto-set label rating berdasarkan nilai
- Auto-set warna badge berdasarkan rating
- Recalculate persentase untuk semua rating dalam periode
- Logging semua aktivitas rating

#### Key Functions:

- `recalculateAllRatingPercentages()` - Recalculate persentase untuk semua rating dalam periode

## API Endpoints

Semua content types menggunakan default Strapi CRUD endpoints:

### Performance Review Endpoints

```
GET    /api/performance-reviews
GET    /api/performance-reviews/:id
POST   /api/performance-reviews
PUT    /api/performance-reviews/:id
DELETE /api/performance-reviews/:id
```

### KPI Divisi Endpoints

```
GET    /api/kpi-divisis
GET    /api/kpi-divisis/:id
POST   /api/kpi-divisis
PUT    /api/kpi-divisis/:id
DELETE /api/kpi-divisis/:id
```

### Rating Kinerja Endpoints

```
GET    /api/rating-kinerjas
GET    /api/rating-kinerjas/:id
POST   /api/rating-kinerjas
PUT    /api/rating-kinerjas/:id
DELETE /api/rating-kinerjas/:id
```

## Query Parameters

### Performance Review

- `filters[divisi][id][$eq]` - Filter by divisi ID
- `filters[periode_evaluasi][$eq]` - Filter by periode evaluasi
- `filters[rating_kinerja][$eq]` - Filter by rating
- `filters[status_evaluasi][$eq]` - Filter by status evaluasi
- `populate` - Populate relations (divisi, jabatan, karyawan)

### KPI Divisi

- `filters[divisi][id][$eq]` - Filter by divisi ID
- `filters[periode][$eq]` - Filter by periode
- `filters[tahun][$eq]` - Filter by tahun
- `filters[bulan][$eq]` - Filter by bulan
- `populate` - Populate relations (divisi)

### Rating Kinerja

- `filters[periode][$eq]` - Filter by periode
- `filters[tahun][$eq]` - Filter by tahun
- `filters[bulan][$eq]` - Filter by bulan
- `filters[rating][$eq]` - Filter by rating

## Usage Examples

### Creating Performance Evaluation

```javascript
const evaluationData = {
  nik_karyawan: "123456",
  nama_karyawan: "Ahmad Rizki",
  divisi: 1, // Marketing divisi ID
  jabatan: 1, // Marketing Executive position ID
  periode_evaluasi: "1/2024",
  tahun_evaluasi: 2024,
  bulan_evaluasi: 1,
  rating_kinerja: 5.0,
  target_divisi: "15 unit",
  pencapaian_target: "18 unit",
  reviewer: "Manager Marketing",
  catatan_review:
    "Mencapai target penjualan 120% dengan closing rate yang sangat baik.",
  status_evaluasi: "approved",
  tanggal_evaluasi: "2024-01-15",
  karyawan: 1, // Employee ID
};

// Create evaluation
const response = await fetch("/api/performance-reviews", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ data: evaluationData }),
});
```

### Creating KPI Divisi

```javascript
const kpiData = {
  nama_divisi: "Marketing",
  kode_divisi: "MKT-001",
  target_bulanan: "20 unit",
  target_tahunan: "240 unit",
  pencapaian_bulanan: "22 unit",
  pencapaian_tahunan: "250 unit",
  periode: "1/2024",
  tahun: 2024,
  bulan: 1,
  status_target: "melebihi",
  catatan: "Target bulanan terlampaui dengan baik",
  divisi: 1, // Departemen ID
};

// Create KPI
const response = await fetch("/api/kpi-divisis", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ data: kpiData }),
});
```

### Getting Performance Statistics

```javascript
// Get all performance evaluations for a period
const evaluations = await fetch(
  "/api/performance-reviews?filters[periode_evaluasi][$eq]=1/2024&populate=*"
);

// Get KPI data for all divisions
const kpis = await fetch(
  "/api/kpi-divisis?filters[periode][$eq]=1/2024&populate=divisi"
);

// Get rating distribution
const ratings = await fetch(
  "/api/rating-kinerjas?filters[periode][$eq]=1/2024"
);
```

## Automatic Features

Sistem ini secara otomatis akan:

1. **Menghitung persentase pencapaian** dari target dan pencapaian yang diinput
2. **Update distribusi rating kinerja** setiap kali ada evaluasi baru/update/delete
3. **Set status target** berdasarkan persentase pencapaian (tercapai/melebihi/kurang)
4. **Auto-generate periode** dalam format bulan/tahun
5. **Set tanggal evaluasi** default jika tidak diisi
6. **Validasi rating** harus antara 1-5
7. **Logging** semua aktivitas untuk audit trail

## Integration dengan Content Types yang Sudah Ada

Sistem ini terintegrasi dengan content types yang sudah ada:

- **karyawan** - Relasi untuk data karyawan yang dievaluasi
- **departemen** - Relasi untuk divisi/departemen
- **jabatan** - Relasi untuk posisi/jabatan karyawan

## Database Migration

Setelah implementasi ini, jalankan:

```bash
npm run develop
# atau
yarn develop
```

Strapi akan otomatis membuat/migrasi tabel database sesuai dengan schema yang baru.

## Summary

Implementasi ini menyediakan:

1. **3 Content Types** lengkap dengan schema yang sesuai dokumentasi
2. **Lifecycle Hooks** yang mengikuti pola proyek yang sudah ada
3. **Auto-calculation** untuk persentase pencapaian dan distribusi rating
4. **Default Strapi CRUD API** tanpa custom endpoints
5. **Field naming** yang lebih spesifik (status_evaluasi, status_target)
6. **Integration** dengan content types HRM yang sudah ada

Semua lifecycle hooks telah dioptimalkan untuk memastikan data konsisten dan akurat di seluruh sistem, mengikuti pola implementasi yang sudah ada di proyek ini.
