# Dokumentasi Implementasi Progress Harian/Mingguan - Strapi Backend

## Overview

Dokumentasi ini menjelaskan implementasi backend Strapi untuk sistem Progress Harian/Mingguan yang telah dimodifikasi dari struktur yang sudah ada. Implementasi ini menggunakan pendekatan modifikasi content type `progres-harian` yang sudah ada dan menambahkan content types pendukung baru.

## Content Types yang Dimodifikasi dan Ditambahkan

### 1. Progres Harian (Dimodifikasi)

**File:** `src/api/progres-harian/content-types/progres-harian/schema.json`

Content type ini telah dimodifikasi untuk menambahkan field-field baru sesuai dengan dokumentasi:

#### Field yang Ditambahkan:

- `blok_unit` (string, required) - Blok unit yang sedang dikerjakan
- `aktivitas` (string, required) - Deskripsi aktivitas yang dilakukan
- `status_harian` (enumeration) - Status progress: "sesuai_jadwal", "terlambat", "maju_jadwal"
- `deskripsi` (text) - Deskripsi detail pekerjaan
- `catatan` (text) - Catatan tambahan
- `data_pekerja` (relation) - Relasi ke worker-attendance
- `data_cuaca` (relation) - Relasi ke weather-condition
- `penggunaan_material` (relation) - Relasi ke material-usage
- `dokumentasi_foto` (relation) - Relasi ke progress-photo

#### Field yang Dimodifikasi:

- `weather_condition` - Enum values diperbarui menjadi lowercase dengan opsi lebih lengkap
- `created_by` - Diubah dari string ke relation ke user
- `verified_by` - Diubah dari string ke relation ke user

### 2. Worker Attendance (Baru)

**File:** `src/api/worker-attendance/content-types/worker-attendance/schema.json`

Content type untuk tracking kehadiran dan alokasi pekerja harian:

```javascript
{
  "kind": "collectionType",
  "collectionName": "worker_attendances",
  "info": {
    "singularName": "worker-attendance",
    "pluralName": "worker-attendances",
    "displayName": "Kehadiran Pekerja",
    "description": "Data kehadiran dan alokasi pekerja harian"
  },
  "attributes": {
    "tanggal": { "type": "date", "required": true },
    "proyek": { "type": "relation", "relation": "manyToOne", "target": "api::proyek-perumahan.proyek-perumahan" },
    "mandor": { "type": "string", "required": true, "maxLength": 100 },
    "tukang_batu": { "type": "integer", "min": 0, "default": 0 },
    "tukang_kayu": { "type": "integer", "min": 0, "default": 0 },
    "tukang_cat": { "type": "integer", "min": 0, "default": 0 },
    "kernet": { "type": "integer", "min": 0, "default": 0 },
    "total_pekerja": { "type": "integer", "min": 0, "required": true },
    "persentase_kehadiran": { "type": "integer", "min": 0, "max": 100, "required": true },
    "catatan": { "type": "text" },
    "laporan_progress": { "type": "relation", "relation": "oneToOne", "target": "api::progres-harian.progres-harian", "inversedBy": "data_pekerja" }
  }
}
```

### 3. Weather Condition (Baru)

**File:** `src/api/weather-condition/content-types/weather-condition/schema.json`

Content type untuk tracking kondisi cuaca dan dampaknya terhadap konstruksi:

```javascript
{
  "kind": "collectionType",
  "collectionName": "weather_conditions",
  "info": {
    "singularName": "weather-condition",
    "pluralName": "weather-conditions",
    "displayName": "Kondisi Cuaca",
    "description": "Data kondisi cuaca dan dampaknya terhadap konstruksi"
  },
  "attributes": {
    "tanggal": { "type": "date", "required": true },
    "proyek": { "type": "relation", "relation": "manyToOne", "target": "api::proyek-perumahan.proyek-perumahan" },
    "kondisi_cuaca": { "type": "enumeration", "enum": ["cerah", "cerah_berawan", "berawan", "hujan_ringan", "hujan_sedang", "hujan_lebat", "angin_kencang"], "required": true },
    "suhu_min": { "type": "decimal", "min": -50, "max": 50 },
    "suhu_max": { "type": "decimal", "min": -50, "max": 50 },
    "kelembaban": { "type": "integer", "min": 0, "max": 100 },
    "dampak_konstruksi": { "type": "enumeration", "enum": ["tidak_ada", "minor", "sedang", "signifikan"], "default": "tidak_ada" },
    "durasi_tunda": { "type": "integer", "min": 0, "description": "Durasi penundaan dalam menit" },
    "keterangan": { "type": "text" },
    "laporan_progress": { "type": "relation", "relation": "oneToOne", "target": "api::progres-harian.progres-harian", "inversedBy": "data_cuaca" }
  }
}
```

### 4. Material Usage (Baru)

**File:** `src/api/material-usage/content-types/material-usage/schema.json`

Content type untuk tracking penggunaan material dalam konstruksi:

```javascript
{
  "kind": "collectionType",
  "collectionName": "material_usages",
  "info": {
    "singularName": "material-usage",
    "pluralName": "material-usages",
    "displayName": "Penggunaan Material",
    "description": "Data penggunaan material dalam konstruksi"
  },
  "attributes": {
    "tanggal": { "type": "date", "required": true },
    "proyek": { "type": "relation", "relation": "manyToOne", "target": "api::proyek-perumahan.proyek-perumahan" },
    "material": { "type": "string", "required": true, "maxLength": 255 },
    "kuantitas": { "type": "decimal", "min": 0, "required": true },
    "satuan": { "type": "string", "required": true, "maxLength": 50 },
    "penggunaan": { "type": "string", "required": true, "maxLength": 255 },
    "status_penggunaan": { "type": "enumeration", "enum": ["digunakan", "sebagian", "tidak_digunakan"], "default": "digunakan" },
    "harga_satuan": { "type": "decimal", "min": 0 },
    "total_harga": { "type": "decimal", "min": 0 },
    "catatan": { "type": "text" },
    "laporan_progress": { "type": "relation", "relation": "manyToOne", "target": "api::progres-harian.progres-harian", "inversedBy": "penggunaan_material" }
  }
}
```

### 5. Progress Photo (Baru)

**File:** `src/api/progress-photo/content-types/progress-photo/schema.json`

Content type untuk dokumentasi foto kemajuan konstruksi:

```javascript
{
  "kind": "collectionType",
  "collectionName": "progress_photos",
  "info": {
    "singularName": "progress-photo",
    "pluralName": "progress-photos",
    "displayName": "Foto Progress",
    "description": "Dokumentasi foto kemajuan konstruksi"
  },
  "attributes": {
    "tanggal": { "type": "date", "required": true },
    "proyek": { "type": "relation", "relation": "manyToOne", "target": "api::proyek-perumahan.proyek-perumahan" },
    "lokasi": { "type": "string", "required": true, "maxLength": 100 },
    "judul": { "type": "string", "required": true, "maxLength": 255 },
    "deskripsi": { "type": "text" },
    "foto": { "type": "media", "multiple": true, "required": true, "allowedTypes": ["images"] },
    "jumlah_foto": { "type": "integer", "min": 1, "required": true },
    "kategori": { "type": "enumeration", "enum": ["pondasi", "struktur", "atap", "finishing", "instalasi", "lainnya"], "default": "lainnya" },
    "laporan_progress": { "type": "relation", "relation": "manyToOne", "target": "api::progres-harian.progres-harian", "inversedBy": "dokumentasi_foto" }
  }
}
```

## Lifecycle Hooks

### 1. Progres Harian Lifecycle

**File:** `src/api/progres-harian/content-types/progres-harian/lifecycles.js`

Lifecycle hooks yang telah diperbarui dengan validasi dan otomasi:

- **beforeCreate**: Validasi tanggal, progress increment, persentase, dan set created_by
- **beforeUpdate**: Validasi persentase dan progress increment
- **afterCreate**: Update progress proyek dan logging aktivitas
- **afterUpdate**: Update progress proyek dan logging aktivitas
- **afterDelete**: Logging aktivitas

### 2. Worker Attendance Lifecycle

**File:** `src/api/worker-attendance/content-types/worker-attendance/lifecycles.js`

- **beforeCreate**: Hitung total pekerja otomatis dan validasi
- **beforeUpdate**: Hitung ulang total pekerja jika ada perubahan
- **afterCreate**: Logging aktivitas

### 3. Weather Condition Lifecycle

**File:** `src/api/weather-condition/content-types/weather-condition/lifecycles.js`

- **beforeCreate**: Validasi suhu dan kelembaban
- **beforeUpdate**: Validasi suhu dan kelembaban
- **afterCreate**: Kirim notifikasi jika dampak signifikan dan logging

### 4. Material Usage Lifecycle

**File:** `src/api/material-usage/content-types/material-usage/lifecycles.js`

- **beforeCreate**: Validasi kuantitas dan hitung total harga
- **beforeUpdate**: Hitung ulang total harga dan validasi
- **afterCreate**: Update stok material dan logging

### 5. Progress Photo Lifecycle

**File:** `src/api/progress-photo/content-types/progress-photo/lifecycles.js`

- **beforeCreate**: Validasi foto dan set jumlah foto
- **beforeUpdate**: Update jumlah foto dan validasi ukuran
- **afterCreate**: Generate thumbnail dan logging
- **afterDelete**: Hapus file foto dan logging

## Service Functions

### Progres Harian Service

**File:** `src/api/progres-harian/services/progres-harian.js`

Service yang telah diperbarui dengan fungsi tambahan:

```javascript
module.exports = createCoreService(
  "api::progres-harian.progres-harian",
  ({ strapi }) => ({
    async updateProjectProgress(projectId) {
      // Update progress proyek berdasarkan rata-rata laporan progress
    },

    async getProgressSummary(projectId, startDate, endDate) {
      // Ambil summary progress untuk periode tertentu
    },
  })
);
```

## Relasi Antar Content Types

```
progres-harian (1) ←→ (1) worker-attendance
progres-harian (1) ←→ (1) weather-condition
progres-harian (1) ←→ (N) material-usage
progres-harian (1) ←→ (N) progress-photo
progres-harian (N) ←→ (1) proyek-perumahan
progres-harian (N) ←→ (1) unit-rumah
progres-harian (N) ←→ (1) karyawan (pelapor)
progres-harian (N) ←→ (1) user (created_by)
progres-harian (N) ←→ (1) user (verified_by)
```

## Validasi dan Business Rules

### 1. Progres Harian

- Tanggal tidak boleh di masa depan
- Progress after harus lebih besar dari progress before
- Persentase harus antara 0-100
- Created_by otomatis diisi dari user yang login

### 2. Worker Attendance

- Total pekerja minimal 1
- Persentase kehadiran antara 0-100
- Total pekerja dihitung otomatis dari jumlah tukang

### 3. Weather Condition

- Suhu minimum tidak boleh lebih besar dari maksimum
- Kelembaban antara 0-100
- Durasi tunda default 0 jika ada dampak

### 4. Material Usage

- Kuantitas harus lebih dari 0
- Total harga dihitung otomatis dari harga satuan × kuantitas
- Harga satuan tidak boleh negatif

### 5. Progress Photo

- Minimal 1 foto
- Ukuran foto maksimal 10MB per foto
- Jumlah foto dihitung otomatis

## API Endpoints

Semua content types menggunakan standard Strapi REST API endpoints:

- `GET /api/progres-harians` - List semua laporan progress
- `GET /api/progres-harians/:id` - Detail laporan progress
- `POST /api/progres-harians` - Buat laporan progress baru
- `PUT /api/progres-harians/:id` - Update laporan progress
- `DELETE /api/progres-harians/:id` - Hapus laporan progress

Endpoints serupa tersedia untuk:

- `/api/worker-attendances`
- `/api/weather-conditions`
- `/api/material-usages`
- `/api/progress-photos`

## Populate Relations

Untuk mendapatkan data lengkap dengan relasi:

```javascript
// GET /api/progres-harians?populate=*
// atau
// GET /api/progres-harians?populate[data_pekerja]=true&populate[data_cuaca]=true&populate[penggunaan_material]=true&populate[dokumentasi_foto]=true
```

## Error Handling

Semua lifecycle hooks memiliki error handling yang proper:

- Validasi input dengan pesan error yang jelas
- Try-catch untuk service calls yang mungkin tidak tersedia
- Logging error untuk debugging

## Dependencies

Implementasi ini membutuhkan:

- Strapi v4+
- Plugin users-permissions (untuk user relations)
- Plugin upload (untuk file handling)

## Testing

Untuk testing implementasi:

1. Restart Strapi server setelah perubahan
2. Test create, update, delete operations
3. Verifikasi lifecycle hooks berjalan dengan benar
4. Test relasi antar content types
5. Verifikasi validasi business rules

## Migration Notes

Jika ada data existing di `progres-harian`:

- Field `created_by` dan `verified_by` yang berupa string akan perlu di-migrate ke relation
- Field `weather_condition` dengan nilai lama perlu di-update ke format baru
- Data existing akan tetap kompatibel dengan field lama

## Future Enhancements

Potensi pengembangan selanjutnya:

1. Custom API endpoints untuk reporting
2. Integration dengan notification service
3. PDF export functionality
4. Dashboard analytics
5. Mobile app integration
6. Real-time updates dengan WebSocket
