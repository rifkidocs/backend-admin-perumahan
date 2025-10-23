# API Usage Documentation - Data Penilaian Kinerja (Performance Evaluation)

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Data Penilaian Kinerja dengan 3 content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Performance Review API (`api::performance-review.performance-review`)

#### Base URL

```
/content-manager/collection-types/api::performance-review.performance-review
```

#### Endpoints

| Method | Endpoint                                                                           | Description                   |
| ------ | ---------------------------------------------------------------------------------- | ----------------------------- |
| GET    | `/content-manager/collection-types/api::performance-review.performance-review`     | Get all performance reviews   |
| GET    | `/content-manager/collection-types/api::performance-review.performance-review/:id` | Get performance review by ID  |
| POST   | `/content-manager/collection-types/api::performance-review.performance-review`     | Create new performance review |
| PUT    | `/content-manager/collection-types/api::performance-review.performance-review/:id` | Update performance review     |
| DELETE | `/content-manager/collection-types/api::performance-review.performance-review/:id` | Delete performance review     |

#### Request Examples

**Create Performance Review:**

```json
POST /content-manager/collection-types/api::performance-review.performance-review
Content-Type: application/json

{
  "nik_karyawan": "123456",
  "nama_karyawan": "Ahmad Rizki",
  "divisi": 1,
  "jabatan": 1,
  "periode_evaluasi": "1/2024",
  "tahun_evaluasi": 2024,
  "bulan_evaluasi": 1,
  "rating_kinerja": 5.0,
  "target_divisi": "15 unit",
  "pencapaian_target": "18 unit",
  "reviewer": "Manager Marketing",
  "catatan_review": "Mencapai target penjualan 120% dengan closing rate yang sangat baik.",
  "status_evaluasi": "approved",
  "tanggal_evaluasi": "2024-01-15",
  "karyawan": 1
}
```

**Update Performance Review:**

```json
PUT /content-manager/collection-types/api::performance-review.performance-review/1
Content-Type: application/json

{
  "rating_kinerja": 4.5,
  "status_evaluasi": "reviewed",
  "catatan_review": "Performa sangat baik dengan sedikit area untuk improvement"
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Auto-generate `tanggal_evaluasi` jika tidak ada (default: hari ini)
- Set default `status_evaluasi` = "draft" jika tidak ada
- Validasi `rating_kinerja` harus antara 1-5
- Auto-calculate `persentase_pencapaian` dari `target_divisi` dan `pencapaian_target`
- Set `periode_evaluasi` format dari `bulan_evaluasi` dan `tahun_evaluasi`

**beforeUpdate:**

- Update `tanggal_review` jika status berubah ke "reviewed" atau "approved"
- Re-calculate `persentase_pencapaian` jika ada perubahan target/pencapaian

**afterCreate:**

- Update distribusi rating kinerja secara otomatis
- Log evaluasi kinerja baru

**afterUpdate:**

- Update distribusi rating kinerja
- Log perubahan evaluasi

**afterDelete:**

- Update distribusi rating kinerja setelah penghapusan
- Log penghapusan evaluasi

---

### 2. KPI Divisi API (`api::kpi-divisi.kpi-divisi`)

#### Base URL

```
/content-manager/collection-types/api::kpi-divisi.kpi-divisi
```

#### Endpoints

| Method | Endpoint                                                           | Description    |
| ------ | ------------------------------------------------------------------ | -------------- |
| GET    | `/content-manager/collection-types/api::kpi-divisi.kpi-divisi`     | Get all KPIs   |
| GET    | `/content-manager/collection-types/api::kpi-divisi.kpi-divisi/:id` | Get KPI by ID  |
| POST   | `/content-manager/collection-types/api::kpi-divisi.kpi-divisi`     | Create new KPI |
| PUT    | `/content-manager/collection-types/api::kpi-divisi.kpi-divisi/:id` | Update KPI     |
| DELETE | `/content-manager/collection-types/api::kpi-divisi.kpi-divisi/:id` | Delete KPI     |

#### Request Examples

**Create KPI Divisi:**

```json
POST /content-manager/collection-types/api::kpi-divisi.kpi-divisi
Content-Type: application/json

{
  "nama_divisi": "Marketing",
  "kode_divisi": "MKT-001",
  "target_bulanan": "20 unit",
  "target_tahunan": "240 unit",
  "pencapaian_bulanan": "22 unit",
  "pencapaian_tahunan": "250 unit",
  "periode": "1/2024",
  "tahun": 2024,
  "bulan": 1,
  "status_target": "melebihi",
  "catatan": "Target bulanan terlampaui dengan baik",
  "divisi": 1
}
```

**Update KPI Status:**

```json
PUT /content-manager/collection-types/api::kpi-divisi.kpi-divisi/1
Content-Type: application/json

{
  "pencapaian_bulanan": "25 unit",
  "catatan": "Target terlampaui dengan margin yang lebih besar"
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Auto-calculate `persentase_pencapaian` dari `target_bulanan` dan `pencapaian_bulanan`
- Set `status_target` berdasarkan persentase:
  - `persentase >= 100` → "tercapai" atau "melebihi"
  - `persentase < 100` → "kurang"
- Set `periode` format dari `bulan` dan `tahun`

**beforeUpdate:**

- Re-calculate `persentase_pencapaian` jika ada perubahan target/pencapaian
- Update `status_target` berdasarkan persentase baru

**afterCreate:**

- Log KPI baru
- Update divisi statistics

**afterUpdate:**

- Log perubahan KPI
- Update divisi statistics

**afterDelete:**

- Log penghapusan KPI
- Update divisi statistics

---

### 3. Rating Kinerja API (`api::rating-kinerja.rating-kinerja`)

#### Base URL

```
/content-manager/collection-types/api::rating-kinerja.rating-kinerja
```

#### Endpoints

| Method | Endpoint                                                                   | Description              |
| ------ | -------------------------------------------------------------------------- | ------------------------ |
| GET    | `/content-manager/collection-types/api::rating-kinerja.rating-kinerja`     | Get all rating records   |
| GET    | `/content-manager/collection-types/api::rating-kinerja.rating-kinerja/:id` | Get rating by ID         |
| POST   | `/content-manager/collection-types/api::rating-kinerja.rating-kinerja`     | Create new rating record |
| PUT    | `/content-manager/collection-types/api::rating-kinerja.rating-kinerja/:id` | Update rating record     |
| DELETE | `/content-manager/collection-types/api::rating-kinerja.rating-kinerja/:id` | Delete rating record     |

#### Request Examples

**Create Rating Record:**

```json
POST /content-manager/collection-types/api::rating-kinerja.rating-kinerja
Content-Type: application/json

{
  "rating": 5,
  "label_rating": "Excellent",
  "jumlah_karyawan": 15,
  "persentase": 25.5,
  "periode": "1/2024",
  "tahun": 2024,
  "bulan": 1,
  "warna_badge": "text-yellow-500"
}
```

**Update Rating Count:**

```json
PUT /content-manager/collection-types/api::rating-kinerja.rating-kinerja/1
Content-Type: application/json

{
  "jumlah_karyawan": 18,
  "persentase": 30.0
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Validasi `rating` harus antara 1-5
- Auto-set `label_rating` berdasarkan rating:
  - 1 → "Poor"
  - 2 → "Needs Improvement"
  - 3 → "Satisfactory"
  - 4 → "Good"
  - 5 → "Excellent"
- Auto-set `warna_badge` berdasarkan rating:
  - 1 → "text-red-500"
  - 2 → "text-orange-500"
  - 3 → "text-green-500"
  - 4 → "text-blue-500"
  - 5 → "text-yellow-500"
- Set default `jumlah_karyawan` = 0 jika tidak ada
- Set default `persentase` = 0 jika tidak ada

**beforeUpdate:**

- Validasi `rating` range jika diupdate
- Update `label_rating` dan `warna_badge` jika rating berubah

**afterCreate:**

- Log rating record baru
- Recalculate semua persentase untuk periode yang sama

**afterUpdate:**

- Log perubahan rating record
- Recalculate semua persentase untuk periode yang sama

**afterDelete:**

- Log penghapusan rating record
- Recalculate semua persentase untuk periode yang sama

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

**Public (Read Only):**

- `find` - Get all records
- `findOne` - Get single record

**Authenticated (Full Access):**

- `create` - Create new record
- `update` - Update existing record
- `delete` - Delete record

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Rating kinerja harus antara 1-5"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Performance review not found"
  }
}
```

**Unauthorized Error (401):**

```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Unauthorized"
  }
}
```

## Query Parameters

### Pagination

```
?pagination[page]=1&pagination[pageSize]=10
```

### Sorting

```
?sort=createdAt:desc
?sort=rating_kinerja:desc
?sort=tanggal_evaluasi:desc
```

### Filtering

**Performance Review:**

```
?filters[divisi][id][$eq]=1
?filters[periode_evaluasi][$eq]=1/2024
?filters[rating_kinerja][$eq]=5
?filters[status_evaluasi][$eq]=approved
?filters[tahun_evaluasi][$eq]=2024
?filters[bulan_evaluasi][$eq]=1
```

**KPI Divisi:**

```
?filters[divisi][id][$eq]=1
?filters[periode][$eq]=1/2024
?filters[tahun][$eq]=2024
?filters[bulan][$eq]=1
?filters[status_target][$eq]=tercapai
```

**Rating Kinerja:**

```
?filters[periode][$eq]=1/2024
?filters[tahun][$eq]=2024
?filters[bulan][$eq]=1
?filters[rating][$eq]=5
```

### Population (Relations)

```
?populate=divisi
?populate=jabatan
?populate=karyawan
?populate=*
```

## Best Practices

1. **Always validate rating range** (1-5) before creating performance reviews
2. **Use lifecycle hooks** for automatic calculations and validations
3. **Handle errors gracefully** with proper error messages
4. **Use pagination** for large datasets
5. **Populate relations** when needed to avoid additional API calls
6. **Validate data** on frontend before sending to API
7. **Monitor logs** for lifecycle hook activities
8. **Check target achievement** before updating KPI records
9. **Use consistent period format** (bulan/tahun) across all content types
10. **Monitor rating distribution** changes after performance review updates

## Testing Examples

### Test Performance Review Creation with Lifecycle

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::performance-review.performance-review' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nik_karyawan": "123456",
    "nama_karyawan": "Test Employee",
    "divisi": 1,
    "jabatan": 1,
    "periode_evaluasi": "1/2024",
    "tahun_evaluasi": 2024,
    "bulan_evaluasi": 1,
    "rating_kinerja": 4.5,
    "target_divisi": "10 unit",
    "pencapaian_target": "12 unit",
    "reviewer": "Test Manager",
    "status_evaluasi": "draft",
    "karyawan": 1
  }'
```

### Test KPI Divisi Creation with Auto-calculation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::kpi-divisi.kpi-divisi' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nama_divisi": "Test Division",
    "kode_divisi": "TEST-001",
    "target_bulanan": "100 unit",
    "target_tahunan": "1200 unit",
    "pencapaian_bulanan": "110 unit",
    "periode": "1/2024",
    "tahun": 2024,
    "bulan": 1,
    "divisi": 1
  }'
```

### Test Rating Kinerja Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::rating-kinerja.rating-kinerja' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "rating": 4,
    "jumlah_karyawan": 10,
    "periode": "1/2024",
    "tahun": 2024,
    "bulan": 1
  }'
```

### Test Performance Review Update with Status Change

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::performance-review.performance-review/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "status_evaluasi": "reviewed",
    "catatan_review": "Performance review completed"
  }'
```

### Test KPI Divisi Update with Achievement Change

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::kpi-divisi.kpi-divisi/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "pencapaian_bulanan": "125 unit",
    "catatan": "Target exceeded by 25%"
  }'
```

## Advanced Queries

### Get Performance Reviews by Division and Period

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::performance-review.performance-review?filters[divisi][id][$eq]=1&filters[periode_evaluasi][$eq]=1/2024&populate=*' \
  -H 'Authorization: Bearer <token>'
```

### Get KPI Summary by Year

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::kpi-divisi.kpi-divisi?filters[tahun][$eq]=2024&populate=divisi' \
  -H 'Authorization: Bearer <token>'
```

### Get Rating Distribution for Period

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::rating-kinerja.rating-kinerja?filters[periode][$eq]=1/2024&sort=rating:asc' \
  -H 'Authorization: Bearer <token>'
```

### Get Approved Performance Reviews

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::performance-review.performance-review?filters[status_evaluasi][$eq]=approved&populate=*' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Semua lifecycle hooks berjalan otomatis saat operasi CRUD dilakukan. Pastikan untuk memahami behavior masing-masing hook untuk menghindari error dan memastikan data konsisten. Sistem akan secara otomatis menghitung persentase pencapaian, update distribusi rating, dan mengelola status evaluasi.
