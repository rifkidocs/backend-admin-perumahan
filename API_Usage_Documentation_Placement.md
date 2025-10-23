# API Usage Documentation - HRM Placement System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Data Penempatan Proyek (HRM Placement) dengan content type `placement`. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Type API Endpoints

### Placement API (`api::placement.placement`)

#### Base URL

```
/content-manager/collection-types/api::placement.placement
```

#### Endpoints

| Method | Endpoint                                                         | Description          |
| ------ | ---------------------------------------------------------------- | -------------------- |
| GET    | `/content-manager/collection-types/api::placement.placement`     | Get all placements   |
| GET    | `/content-manager/collection-types/api::placement.placement/:id` | Get placement by ID  |
| POST   | `/content-manager/collection-types/api::placement.placement`     | Create new placement |
| PUT    | `/content-manager/collection-types/api::placement.placement/:id` | Update placement     |
| DELETE | `/content-manager/collection-types/api::placement.placement/:id` | Delete placement     |

#### Request Examples

**Create Placement:**

```json
POST /content-manager/collection-types/api::placement.placement
Content-Type: application/json

{
  "project_name": "Perumahan Taman Sari",
  "location": "Depok, Jawa Barat",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "role": "Marketing On Site",
  "status_penempatan": "aktif",
  "notes": "Penempatan untuk proyek baru",
  "employee": 1
}
```

**Update Placement:**

```json
PUT /content-manager/collection-types/api::placement.placement/1
Content-Type: application/json

{
  "status_penempatan": "selesai",
  "end_date": "2024-03-31",
  "notes": "Penempatan selesai sesuai rencana"
}
```

**Update Employee Project Assignment:**

```json
PUT /content-manager/collection-types/api::placement.placement/1
Content-Type: application/json

{
  "project_name": "Perumahan Griya Asri",
  "location": "Bogor, Jawa Barat",
  "role": "Site Supervisor"
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Validasi tanggal selesai > tanggal mulai
- Set default `status_penempatan` = "aktif" jika tidak ada
- Validasi employee exists dan status kepegawaian (Tetap/Kontrak)
- Cek overlap placement (karyawan tidak bisa double placement aktif)
- Validasi hanya karyawan tetap dan kontrak yang dapat ditempatkan

**afterCreate:**

- Update employee `current_project` dan `current_location` jika status "aktif"
- Log aktivitas penempatan baru ke `laporan-kegiatan`

**beforeUpdate:**

- Validasi tanggal range jika ada perubahan tanggal
- Cek overlap placement saat mengubah tanggal atau employee
- Auto-set `end_date` = hari ini jika status berubah ke "selesai"
- Validasi perubahan tidak menyebabkan konflik

**afterUpdate:**

- Update employee `current_project` dan `current_location` berdasarkan status:
  - Status "aktif" → Update project dan location
  - Status "selesai"/"dipindahkan" → Clear project dan location
- Log perubahan penempatan ke `laporan-kegiatan`

**beforeDelete:**

- Validasi penempatan aktif tidak dapat dihapus
- Cek relasi dengan data absensi terkait
- Pastikan tidak ada data terkait sebelum penghapusan

**afterDelete:**

- Log penghapusan penempatan ke `laporan-kegiatan`

---

## Field Descriptions

| Field Name          | Type        | Required | Description                | Validation                           |
| ------------------- | ----------- | -------- | -------------------------- | ------------------------------------ |
| `project_name`      | String      | Yes      | Nama proyek                | Min: 2, Max: 100                     |
| `location`          | String      | Yes      | Lokasi penempatan          | Min: 2, Max: 100                     |
| `start_date`        | Date        | Yes      | Tanggal mulai penempatan   | Required, Format: YYYY-MM-DD         |
| `end_date`          | Date        | No       | Tanggal selesai penempatan | Format: YYYY-MM-DD, > start_date     |
| `role`              | String      | Yes      | Peran dalam proyek         | Min: 2, Max: 50                      |
| `status_penempatan` | Enumeration | Yes      | Status penempatan          | Options: aktif, selesai, dipindahkan |
| `notes`             | Text        | No       | Catatan penempatan         | Max: 300                             |
| `employee`          | Relation    | Yes      | Karyawan yang ditempatkan  | Must exist, status: Tetap/Kontrak    |

## Business Rules

### 1. Date Validation

- `end_date` harus setelah `start_date`
- Jika `end_date` tidak diisi, penempatan dianggap ongoing

### 2. Employee Validation

- Hanya karyawan dengan status kepegawaian "Tetap" atau "Kontrak"
- Karyawan tidak dapat memiliki penempatan aktif yang overlapping

### 3. Status Management

- Default status: "aktif"
- Status "selesai" auto-set `end_date` = hari ini
- Status "dipindahkan" untuk transfer ke proyek lain

### 4. Project Tracking

- Employee `current_project` dan `current_location` otomatis diupdate
- Clear project info saat penempatan berakhir

---

## Query Parameters

### Pagination

```
?pagination[page]=1&pagination[pageSize]=10
```

### Sorting

```
?sort=createdAt:desc
?sort=start_date:asc
?sort=project_name:asc
```

### Filtering

**Filter by Status:**

```
?filters[status_penempatan][$eq]=aktif
```

**Filter by Employee:**

```
?filters[employee][id][$eq]=1
```

**Filter by Project Name:**

```
?filters[project_name][$containsi]=Taman Sari
```

**Filter by Date Range:**

```
?filters[start_date][$gte]=2024-01-01
?filters[end_date][$lte]=2024-12-31
```

**Filter Active Placements:**

```
?filters[status_penempatan][$eq]=aktif&filters[start_date][$lte]=2024-12-31&filters[$or][0][end_date][$gte]=2024-01-01&filters[$or][1][end_date][$null]=true
```

### Population (Relations)

```
?populate=employee
?populate=employee.jabatan
?populate=employee.departemen
```

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

- `find` - Get all placements
- `findOne` - Get single placement

**Authenticated (Full Access):**

- `create` - Create new placement
- `update` - Update existing placement
- `delete` - Delete placement (only non-active)

---

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Tanggal selesai harus setelah tanggal mulai"
  }
}
```

**Overlap Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Karyawan sudah memiliki penempatan aktif pada periode tersebut"
  }
}
```

**Employee Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Hanya karyawan tetap dan kontrak yang dapat ditempatkan"
  }
}
```

**Deletion Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Tidak dapat menghapus penempatan yang masih aktif. Ubah status terlebih dahulu."
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Placement not found"
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

---

## Testing Examples

### Test Placement Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::placement.placement' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "project_name": "Perumahan Taman Sari",
    "location": "Depok, Jawa Barat",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "role": "Marketing On Site",
    "employee": 1,
    "notes": "Penempatan untuk proyek baru"
  }'
```

### Test Placement Update (Change Status)

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::placement.placement/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "status_penempatan": "selesai",
    "notes": "Penempatan selesai sesuai rencana"
  }'
```

### Test Placement Transfer

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::placement.placement/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "status_penempatan": "dipindahkan",
    "project_name": "Perumahan Griya Asri",
    "location": "Bogor, Jawa Barat",
    "role": "Site Supervisor",
    "notes": "Dipindahkan ke proyek baru"
  }'
```

### Test Get Active Placements

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::placement.placement?filters[status_penempatan][$eq]=aktif&populate=employee' \
  -H 'Authorization: Bearer <token>'
```

### Test Get Placements by Employee

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::placement.placement?filters[employee][id][$eq]=1&populate=employee&sort=start_date:desc' \
  -H 'Authorization: Bearer <token>'
```

---

## Integration with Employee Management

### Employee Schema Updates

Setelah penempatan dibuat/diupdate, field berikut di employee akan otomatis terupdate:

```json
{
  "current_project": "Perumahan Taman Sari",
  "current_location": "Depok, Jawa Barat"
}
```

### Activity Logging

Semua aktivitas penempatan akan tercatat di `laporan-kegiatan`:

```json
{
  "jenis_kegiatan": "Penempatan Karyawan",
  "deskripsi": "Penempatan baru: Ahmad Rizki ke Perumahan Taman Sari",
  "tanggal_kegiatan": "2024-01-01",
  "status_kegiatan": "selesai",
  "karyawan": 1
}
```

---

## Best Practices

1. **Always validate employee status** sebelum membuat penempatan
2. **Check for overlapping placements** saat update tanggal atau employee
3. **Use lifecycle hooks** untuk automatic calculations dan validations
4. **Handle errors gracefully** dengan proper error messages
5. **Use pagination** untuk large datasets
6. **Populate employee relations** untuk mendapatkan data lengkap
7. **Monitor activity logs** untuk tracking perubahan
8. **Validate date ranges** pada frontend sebelum API call
9. **Use status_penempatan** untuk mengontrol workflow
10. **Clear project info** saat penempatan berakhir

---

## Common Use Cases

### 1. Assign Employee to New Project

```json
POST /content-manager/collection-types/api::placement.placement
{
  "project_name": "Perumahan Griya Asri",
  "location": "Bogor, Jawa Barat",
  "start_date": "2024-02-01",
  "role": "Marketing Executive",
  "employee": 5,
  "notes": "Penempatan untuk proyek baru"
}
```

### 2. Transfer Employee Between Projects

```json
PUT /content-manager/collection-types/api::placement.placement/1
{
  "status_penempatan": "dipindahkan",
  "project_name": "Perumahan Taman Indah",
  "location": "Tangerang, Banten",
  "role": "Site Manager"
}
```

### 3. End Placement

```json
PUT /content-manager/collection-types/api::placement.placement/1
{
  "status_penempatan": "selesai",
  "notes": "Proyek selesai sesuai rencana"
}
```

### 4. Get Employee Current Assignment

```bash
GET /content-manager/collection-types/api::karyawan.karyawan/1?populate=placements
```

---

**Note**: Semua lifecycle hooks berjalan otomatis saat operasi CRUD dilakukan. Pastikan untuk memahami business rules dan validasi yang diterapkan untuk menghindari error dan memastikan data konsisten.
