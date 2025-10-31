# API Usage Documentation - Material Receiving System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Penerimaan Material Gudang dengan 2 content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Material Receiving API (`api::penerimaan-material.penerimaan-material`)

#### Base URL

```
/content-manager/collection-types/api::penerimaan-material.penerimaan-material
```

#### Endpoints

| Method | Endpoint                                                                               | Description                    |
| ------ | -------------------------------------------------------------------------------------- | ------------------------------ |
| GET    | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material`       | Get all receiving records      |
| GET    | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/:id`   | Get receiving record by ID     |
| POST   | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material`       | Create new receiving record    |
| PUT    | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/:id`   | Update receiving record        |
| DELETE | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/:id`   | Delete receiving record        |

#### Request Examples

**Create Material Receiving:**

```json
POST /content-manager/collection-types/api::penerimaan-material.penerimaan-material
Content-Type: application/json

{
  "poNumber": "PO-2024-001",
  "receivingDate": "2024-03-20",
  "receivingTime": "09:30",
  "supplier": 1,
  "deliveryPerson": "Budi Santoso",
  "deliveryPersonPhone": "+62812345678",
  "material": 1,
  "quantity": 100,
  "unit": "sak",
  "condition": "Baik",
  "storageLocation": "Gudang A - Rak 1",
  "statusReceiving": "completed",
  "qualityChecked": true,
  "qualityCheckDate": "2024-03-20T10:00:00Z",
  "qualityChecker": "John Doe",
  "temperature": 28.5,
  "humidity": 65.2,
  "notes": "Pengiriman sesuai PO, kualitas baik",
  "receivedBy": "Admin Gudang",
  "project": 1
}
```

**Update Receiving Status:**

```json
PUT /content-manager/collection-types/api::penerimaan-material.penerimaan-material/1
Content-Type: application/json

{
  "statusReceiving": "completed",
  "qualityChecked": true,
  "qualityCheckDate": "2024-03-20T14:30:00Z",
  "notes": "Material sudah diperiksa dan disimpan dengan baik"
}
```

---

### 2. Receiving Documents API (`api::penerimaan-material-document.penerimaan-material-document`)

#### Base URL

```
/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document
```

#### Endpoints

| Method | Endpoint                                                                                        | Description                        |
| ------ | ----------------------------------------------------------------------------------------------- | ---------------------------------- |
| GET    | `/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document`       | Get all receiving documents        |
| GET    | `/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document/:id`   | Get receiving document by ID       |
| POST   | `/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document`       | Upload new receiving document      |
| PUT    | `/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document/:id`   | Update receiving document metadata |
| DELETE | `/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document/:id`   | Delete receiving document          |

#### Request Examples

**Upload Receiving Document:**

```json
POST /content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document
Content-Type: application/json

{
  "receivingRecord": 1,
  "documentName": "Nota Penerimaan",
  "documentType": "nota_penerimaan",
  "fileType": "pdf",
  "fileName": "nota-penerimaan-PO-2024-001.pdf",
  "fileUrl": "/uploads/nota_penerimaan_po_2024_001.pdf",
  "fileSize": 1024576,
  "uploadedBy": "Admin Gudang",
  "description": "Nota penerimaan untuk PO-2024-001 dari PT Semen Indonesia",
  "tags": ["nota", "penerimaan", "semen"],
  "isPublic": false,
  "expiryDate": "2027-03-20"
}
```

**Update Document Metadata:**

```json
PUT /content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document/1
Content-Type: application/json

{
  "description": "Nota penerimaan untuk PO-2024-001 - Diperbarui",
  "tags": ["nota", "penerimaan", "semen", "verifikasi"],
  "verified": true,
  "verifiedBy": "Supervisor Gudang",
  "verifiedAt": "2024-03-20T15:00:00Z"
}
```

---

## Relations

### Material Receiving Relations

- `supplier` (Many-to-One) → Suppliers (`api::supplier.supplier`)
- `material` (Many-to-One) → Materials (`api::material.material`)
- `project` (Many-to-One) → Projects (`api::proyek-perumahan.proyek-perumahan`)
- `receivingDocuments` (One-to-Many) → Receiving Documents (`api::penerimaan-material-document.penerimaan-material-document`)
- `purchasing` (Many-to-One) → Purchasing (`api::purchasing.purchasing`)
- `penerima` (Many-to-One) → Karyawan (`api::karyawan.karyawan`)

### Receiving Documents Relations

- `receivingRecord` (Many-to-One) → Material Receiving (`api::penerimaan-material.penerimaan-material`)

## Field Definitions

### Material Receiving Fields

| Field | Type | Required | Description | Options |
| ----- | ---- | -------- | ----------- | ------- |
| `poNumber` | String | Yes | Nomor Purchase Order | Format: PO-YYYY-NNN |
| `receivingDate` | Date | Yes | Tanggal penerimaan | YYYY-MM-DD |
| `receivingTime` | Time | Yes | Waktu penerimaan | HH:MM |
| `supplier` | Relation | Yes | Supplier pengirim | Document ID |
| `deliveryPerson` | String | Yes | Nama pengantar barang | |
| `deliveryPersonPhone` | String | No | Telepon pengantar | Format: +62xxx |
| `material` | Relation | Yes | Material yang diterima | Document ID |
| `quantity` | Number | Yes | Jumlah material | > 0 |
| `unit` | String | Yes | Satuan material | sak, pcs, kg, kaleng, dll |
| `condition` | String | Yes | Kondisi material | Baik, Rusak, Kurang |
| `storageLocation` | String | Yes | Lokasi penyimpanan | Contoh: Gudang A - Rak 1 |
| `statusReceiving` | String | Yes | Status penerimaan | pending, in-progress, completed |
| `qualityChecked` | Boolean | No | Status QC | true/false |
| `qualityCheckDate` | DateTime | No | Tanggal QC | ISO 8601 |
| `qualityChecker` | String | No | Nama pemeriksa QC | |
| `temperature` | Number | No | Suhu saat penerimaan | Celsius |
| `humidity` | Number | No | Kelembaban saat penerimaan | Persentase |
| `notes` | Text | No | Catatan tambahan | |
| `receivedBy` | String | Yes | Penerima material | |
| `project` | Relation | No | Project terkait | Document ID |

### Receiving Documents Fields

| Field | Type | Required | Description | Options |
| ----- | ---- | -------- | ----------- | ------- |
| `receivingRecord` | Relation | Yes | Record penerimaan terkait | Document ID |
| `documentName` | String | Yes | Nama dokumen | |
| `documentType` | String | Yes | Tipe dokumen | nota_penerimaan, foto_barang, surat_jalan |
| `fileType` | String | Yes | Tipe file | pdf, jpg, jpeg, png |
| `fileName` | String | Yes | Nama file | |
| `fileUrl` | String | Yes | URL file | |
| `fileSize` | Number | Yes | Ukuran file (bytes) | |
| `uploadedBy` | String | Yes | Pengunggah dokumen | |
| `description` | Text | No | Deskripsi dokumen | |
| `tags` | Array | No | Tag dokumen | Array of strings |
| `isPublic` | Boolean | No | Akses publik | Default: false |
| `expiryDate` | Date | No | Tanggal kedaluwarsa | YYYY-MM-DD |
| `verified` | Boolean | No | Status verifikasi | Default: false |
| `verifiedBy` | String | No | Verifikator | |
| `verifiedAt` | DateTime | No | Tanggal verifikasi | ISO 8601 |

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

**Gudang Staff (Full Access):**

- `create` - Create new receiving record
- `update` - Update receiving record
- `delete` - Delete receiving record

**Supervisor (Verifikasi):**

- `update` - Update verification status
- `verify` - Verify documents

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Quantity harus lebih dari 0"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Material receiving not found"
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

**File Upload Error (413):**

```json
{
  "error": {
    "status": 413,
    "name": "PayloadTooLargeError",
    "message": "File too large"
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
?sort=receivingDate:desc
?sort=createdAt:asc
```

### Filtering

```
?filters[statusReceiving][$eq]=completed
?filters[supplier][name][$eq]=PT Semen Indonesia
?filters[receivingDate][$gte]=2024-03-01
?filters[receivingDate][$lte]=2024-03-31
?filters[material][name][$containsi]=semen
```

### Population (Relations)

```
?populate=*
?populate=supplier&populate=material
?populate=project&populate=receivingDocuments
```

### Search

```
?_q=PO-2024-001
?_q=semen
```

## Status Flow

### Material Receiving Status

```
pending → in-progress → completed
    ↓
   rejected (kondisi rusak/tidak sesuai)
```

**Status Descriptions:**

- `pending`: Material baru tiba, menunggu proses penerimaan
- `in-progress`: Sedang proses pemeriksaan kualitas dan kuantitas
- `completed`: Material sudah diterima dan disimpan dengan baik
- `rejected`: Material ditolak karena tidak sesuai spesifikasi

## Quality Control Process

### Quality Check Parameters

```javascript
// Example quality check validation
const qualityCheck = {
  visualCondition: "Baik", // Baik, Rusak, Kurang
  quantityMatch: true,     // Sesuai/tidak dengan PO
  packagingCondition: "Baik", // Kemasan utuh/rusak
  expirationDate: "2025-12-31", // Untuk material kadaluarsa
  batchNumber: "BATCH-12345",
  serialNumbers: ["SN001", "SN002"],
  temperature: 28.5,       // Celsius
  humidity: 65.2,          // Persentase
  damageNotes: "",         // Catatan kerusakan jika ada
  photos: ["damage1.jpg", "damage2.jpg"] // Foto kerusakan
};
```

## Usage Examples

### Material Receiving Workflow

```javascript
// 1. Create receiving record
const receivingData = {
  poNumber: "PO-2024-001",
  receivingDate: "2024-03-20",
  receivingTime: "09:30",
  supplier: "supplier-doc-123",
  deliveryPerson: "Budi Santoso",
  material: "material-doc-456",
  quantity: 100,
  unit: "sak",
  condition: "Baik",
  storageLocation: "Gudang A - Rak 1",
  statusReceiving: "pending",
  receivedBy: "Admin Gudang"
};

// 2. Update status to in-progress (quality check)
await api.put(`/receiving/${id}`, {
  statusReceiving: "in-progress",
  qualityCheckDate: new Date().toISOString(),
  qualityChecker: "QC Inspector"
});

// 3. Complete receiving after quality check
await api.put(`/receiving/${id}`, {
  statusReceiving: "completed",
  qualityChecked: true,
  temperature: 28.5,
  humidity: 65.2,
  notes: "Material sesuai spesifikasi dan kualitas baik"
});

// 4. Upload supporting documents
const documentData = {
  receivingRecord: receivingId,
  documentName: "Nota Penerimaan",
  documentType: "nota_penerimaan",
  fileType: "pdf",
  fileName: "nota-penerimaan.pdf",
  fileUrl: "/uploads/nota_penerimaan.pdf",
  fileSize: 1024576,
  uploadedBy: "Admin Gudang"
};
```

### Generate Receiving Report

```javascript
// Monthly receiving report
const monthlyReport = await api.get('/receiving', {
  params: {
    'filters[receivingDate][$gte]': '2024-03-01',
    'filters[receivingDate][$lte]': '2024-03-31',
    'filters[statusReceiving][$eq]': 'completed',
    'populate': 'supplier,material,project',
    'sort': 'receivingDate:desc'
  }
});

// Calculate statistics
const stats = {
  totalReceiving: monthlyReport.data.results.length,
  totalSuppliers: new Set(monthlyReport.data.results.map(r => r.supplier.documentId)).size,
  totalMaterials: new Set(monthlyReport.data.results.map(r => r.material.documentId)).size,
  quantityByMaterial: {},
  receivingBySupplier: {}
};

monthlyReport.data.results.forEach(receiving => {
  // Group by material
  if (!stats.quantityByMaterial[receiving.material.name]) {
    stats.quantityByMaterial[receiving.material.name] = 0;
  }
  stats.quantityByMaterial[receiving.material.name] += receiving.quantity;

  // Group by supplier
  if (!stats.receivingBySupplier[receiving.supplier.name]) {
    stats.receivingBySupplier[receiving.supplier.name] = 0;
  }
  stats.receivingBySupplier[receiving.supplier.name] += 1;
});
```

## Best Practices

1. **Always verify PO number** sebelum membuat record penerimaan
2. **Check material condition** sebelum menyimpan di gudang
3. **Upload supporting documents** untuk setiap penerimaan
4. **Use proper date formats** untuk tracking dan reporting
5. **Monitor storage locations** untuk optimasi ruang gudang
6. **Implement quality control** untuk semua material masuk
7. **Maintain supplier performance tracking** untuk evaluasi
8. **Regular inventory reconciliation** dengan sistem stok

## Testing Examples

### Test Material Receiving Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::penerimaan-material.penerimaan-material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "poNumber": "PO-2024-TEST-001",
    "receivingDate": "2024-03-20",
    "receivingTime": "09:30",
    "supplier": 1,
    "deliveryPerson": "Test Delivery",
    "material": 1,
    "quantity": 10,
    "unit": "sak",
    "condition": "Baik",
    "storageLocation": "Gudang Test - Rak 1",
    "statusReceiving": "pending",
    "receivedBy": "Test Admin"
  }'
```

### Test Document Upload

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::penerimaan-material-document.penerimaan-material-document' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "receivingRecord": 1,
    "documentName": "Test Document",
    "documentType": "nota_penerimaan",
    "fileType": "pdf",
    "fileName": "test-document.pdf",
    "fileUrl": "/uploads/test_document.pdf",
    "fileSize": 1024000,
    "uploadedBy": "Test Admin",
    "description": "Test document for receiving"
  }'
```

---

**Note**:
- Semua content types menggunakan draftAndPublish = false, sehingga data langsung tersimpan tanpa perlu publish.
- Sistem penerimaan material terintegrasi dengan sistem stok dan purchasing untuk maintain data consistency.
- API menggunakan existing collection types: `penerimaan-material` (dimodifikasi) dan `penerimaan-material-document` (baru).
- Relations menggunakan ID numerik untuk referensi ke collection types lainnya (supplier, material, project).
- Sistem terintegrasi dengan existing purchasing, material, supplier, dan project management.