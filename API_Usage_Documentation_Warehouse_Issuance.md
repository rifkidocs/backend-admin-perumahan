# API Usage Documentation - Warehouse Issuance System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Pengeluaran Material (Issuance) dari gudang ke proyek. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel. Sistem ini digunakan untuk mengelola perpindahan material dari gudang ke lokasi proyek yang berbeda.

## Content Type API Endpoint

### Material Issuance API (`api::pengeluaran-material.pengeluaran-material`)

#### Base URL

```
/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
```

#### Endpoints

| Method | Endpoint                                                                 | Description                  |
|--------|--------------------------------------------------------------------------|------------------------------|
| GET    | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material` | Get all material issuance records |
| GET    | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/:id` | Get material issuance by ID |
| POST   | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material` | Create new material issuance |
| PUT    | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/:id` | Update material issuance    |
| DELETE | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/:id` | Delete material issuance    |

#### Request Examples

**Create Material Issuance:**

```json
POST /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
Content-Type: application/json

{
  "mrNumber": "MR-2024-001",
  "date": "2024-03-20",
  "time": "09:30",
  "project": 1,
  "unit": "Blok A1",
  "material": 1,
  "quantity": 50,
  "unitMeasure": "sak",
  "requester": "Budi (Mandor)",
  "approver": 1,
  "warehouseSupervisor": 1,
  "approvalStatus": "pending",
  "notes": "Untuk pekerjaan pondasi",
  "documents": [],
  "status_issuance": "Pending"
}
```

**Update Material Issuance Status:**

```json
PUT /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1
Content-Type: application/json

{
  "approvalStatus": "approved",
  "status_issuance": "Selesai"
}
```

**Update Material Issuance to In-Progress:**

```json
PUT /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1
Content-Type: application/json

{
  "status_issuance": "Sedang Diproses"
}
```

---

## Fields Structure

### Primary Fields
- `mrNumber` (string, required, unique): Nomor Material Request (contoh: MR-2024-001)
- `date` (date, required): Tanggal pengeluaran material
- `time` (time, required): Waktu pengeluaran material
- `project` (relation, required): Nama proyek tujuan (relation to proyek-perumahan)
- `unit` (string, required, max 255): Unit/lokasi di proyek (contoh: Blok A1)
- `material` (relation, required): Jenis material yang dikeluarkan (relation to material)
- `quantity` (integer, required, min 1): Jumlah material
- `unitMeasure` (string, required, max 50): Satuan material (sak, pcs, kg, kaleng)
- `requester` (string, required, max 255): Pemohon material (contoh: Budi (Mandor))
- `approver` (relation): Penyetujung dari supervisor (relation to karyawan with ID)
- `warehouseSupervisor` (relation): Penanggung jawab gudang (relation to karyawan with ID)

### Status Fields
- `approvalStatus` (enum): Status approval (pending, approved, rejected)
- `status_issuance` (enum): Main status of material issuance (Pending, Sedang Diproses, Selesai) - this is the primary field for tracking issuance workflow

### Additional Information
- `notes` (text): Catatan tambahan
- `documents` (media): Dokumen terkait (surat jalan, foto barang)

### Content Type Configuration
- `draftAndPublish`: false (data langsung tersimpan tanpa perlu publish)

---

## Relations

### Material Issuance Relations
- `project` (Many-to-One) → Proyek Perumahan (`api::proyek-perumahan.proyek-perumahan`)
- `material` (Many-to-One) → Jenis Material (`api::material.material`)
- `approver` (Many-to-One) → Karyawan (`api::karyawan.karyawan`)
- `warehouseSupervisor` (Many-to-One) → Karyawan (`api::karyawan.karyawan`)

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
    "message": "Quantity tidak boleh negatif atau 0"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Material issuance not found"
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
?sort=date:asc
```

### Filtering

```
?filters[approvalStatus][$eq]=pending
?filters[project][$eq]=1
?filters[status_issuance][$eq]=Pending
```

### Population (Relations)

```
?populate=project
?populate=material
?populate=approver
?populate=warehouseSupervisor
?populate=*
```

## Usage Examples

### Get All Pending Issuances

```javascript
// Example for fetching all pending material issuances
const response = await fetch(
  'http://localhost:1337/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[status_issuance][$eq]=Pending&populate=*&sort=date:desc',
  {
    headers: {
      'Authorization': 'Bearer <your-jwt-token>',
      'Content-Type': 'application/json'
    }
  }
);
const pendingIssuances = await response.json();
```

### Get All Issuances by Project

```javascript
// Example for fetching issuance records by specific project
const response = await fetch(
  'http://localhost:1337/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[project][$eq]=1&populate=*&sort=date:desc',
  {
    headers: {
      'Authorization': 'Bearer <your-jwt-token>',
      'Content-Type': 'application/json'
    }
  }
);
const projectIssuances = await response.json();
```

## Best Practices

1. **Always validate quantity** before creating or updating issuance records (min 1)
2. **Use proper date formats** for date and time fields
3. **Maintain consistency** in project and material naming
4. **Use pagination** for large datasets to avoid performance issues
5. **Populate relations** when needed to get complete information
6. **Validate data** on frontend before sending to API
7. **Monitor approval workflow** to ensure proper authorization
8. **Track status_issuance changes** for proper audit trail
9. **Maintain document references** for traceability

## Status Management

### Status Transitions
- `Pending` → `Sedang Diproses` → `Selesai`
- `Pending` → `Pending` (with approvalStatus `rejected`)

### Status_issuance Values
- `Pending`: Material issuance baru dibuat, menunggu approval
- `Sedang Diproses`: Material sedang dalam proses pengambilan
- `Selesai`: Material telah berhasil dikeluarkan dari gudang

## Testing Examples

### Test Material Issuance Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "mrNumber": "MR-2024-005",
    "date": "2024-03-21",
    "time": "10:00",
    "project": 1,
    "unit": "Blok C1",
    "material": 1,
    "quantity": 100,
    "unitMeasure": "m3",
    "requester": "Agus (Mandor)",
    "approver": 1,
    "warehouseSupervisor": 1,
    "approvalStatus": "pending",
    "notes": "Untuk pekerjaan cor beton",
    "documents": [],
    "status_issuance": "Pending"
  }'
```

### Test Material Issuance Status Update

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/5' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "approvalStatus": "approved",
    "status_issuance": "Selesai"
  }'
```

### Test Material Issuance Search

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[project][$eq]=1&pagination[page]=1&pagination[pageSize]=10' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json'
```

---

**Note**: Semua content types menggunakan draftAndPublish = false, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Status "status_issuance" digunakan untuk tracking dan reporting di laporan gudang. Material issuance harus melewati proses approval sebelum status berubah menjadi completed.