# API Usage Documentation - Material Distribution System

## Implementation Status: ✅ COMPLETED & FULLY IMPLEMENTED

**🎯 Summary**: Material Distribution System telah berhasil diimplementasikan dengan **meningkatkan existing `pengeluaran-material` collection type** daripada membuat collection type baru. Pendekatan ini menjaga konsistensi data dan backward compatibility.

### 📁 Files Modified/Created:

- ✅ `schema.json` - Enhanced dengan distribution fields
- ✅ `controllers/pengeluaran-material.js` - Standard Strapi controller (no custom methods)
- ✅ `services/pengeluaran-material.js` - Enhanced dengan distribution logic
- ✅ `routes/pengeluaran-material.js` - Standard routes (no custom routes)
- ✅ Service Layer Methods - Complete business logic implementation
- ✅ Stock Validation & Status Transition Logic
- ✅ Auto-numbering System for Distribution Numbers

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Material Distribution (Distribusi Material ke Proyek) yang telah **diimplementasikan pada content type `pengeluaran-material`** yang sudah ada dan ditingkatkan fungsionalitasnya. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

Sistem ini mengelola pengiriman material dari gudang ke lokasi proyek dengan tracking status lengkap, manajemen dokumen, dan integrasi dengan modul terkait.

**⚠️ PENTING**: Sistem ini menggunakan existing `pengeluaran-material` collection type yang telah di-enhance, bukan collection type `distribusi-material` baru.

### 🔄 Dual System Support:

- **New Distribution System**: `distributionNumber`, status `pending/in-transit/delivered`
- **Legacy System**: `mrNumber`, status `Pending/Sedang Diproses/Selesai`
- **Full Backward Compatibility**: Existing data dan workflow tetap berfungsi

## Content Type API Endpoints

### Material Distribution API (`api::pengeluaran-material.pengeluaran-material`)

#### Base URL

```
/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
```

#### Endpoints

| Method | Endpoint                                                                               | Description             |
| ------ | -------------------------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material`     | Get all distributions   |
| GET    | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/:id` | Get distribution by ID  |
| POST   | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material`     | Create new distribution |
| PUT    | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/:id` | Update distribution     |
| DELETE | `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/:id` | Delete distribution     |

#### Request Examples

**Create Material Distribution (Auto-generated Distribution Number):**

```json
POST /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
Content-Type: application/json

{
  "date": "2024-03-20",
  "time": "09:30",
  "project": 1,
  "unit": "Blok A1",
  "material": 5,
  "quantity": 50,
  "unitMeasure": "sak",
  "requester": "Site Manager",
  "driver": 12,
  "escort": 8,
  "supervisor": 15,
  "vehicle": "Truck L-300",
  "priorityLevel": "normal",
  "estimatedArrival": "2024-03-20T12:00:00.000Z",
  "notes": "Material untuk pekerjaan pondasi"
}
```

**Create Distribution with Custom Distribution Number:**

```json
POST /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
Content-Type: application/json

{
  "distributionNumber": "DIST-2024-001",
  "date": "2024-03-20",
  "time": "09:30",
  "project": 1,
  "unit": "Blok A1",
  "material": 5,
  "quantity": 50,
  "unitMeasure": "sak",
  "requester": "Site Manager",
  "driver": "Budi Santoso",
  "escort": "Ahmad Wijaya",
  "supervisor": "Supervisor Proyek",
  "vehicle": "Truck L-300",
  "priorityLevel": "normal",
  "estimatedArrival": "2024-03-20T12:00:00.000Z",
  "status_issuance": "pending",
  "notes": "Material untuk pekerjaan pondasi"
}
```

**Create Distribution with MR Number (Legacy Support):**

```json
POST /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
Content-Type: application/json

{
  "mrNumber": "MR-2024-001",
  "date": "2024-03-20",
  "time": "09:30",
  "project": 1,
  "unit": "Blok A1",
  "material": 5,
  "quantity": 50,
  "unitMeasure": "sak",
  "requester": "Site Manager",
  "status_issuance": "Pending"
}
```

**Create Distribution with Complete Transport Details:**

```json
POST /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material
Content-Type: application/json

{
  "distributionNumber": "DIST-2024-002",
  "date": "2024-03-20",
  "time": "10:00",
  "project": 1,
  "unit": "Blok A2",
  "material": 3,
  "quantity": 2000,
  "unitMeasure": "pcs",
  "requester": "Project Manager",
  "driver": "Sutrisno",
  "escort": "Joko Susilo",
  "supervisor": "Supervisor Proyek Utama",
  "vehicle": "Truck Colt Diesel",
  "vehicleNumber": "B 1234 ABC",
  "vehicleCapacity": "3 ton",
  "transportType": "truck",
  "priorityLevel": "high",
  "estimatedArrival": "2024-03-20T14:00:00.000Z",
  "deliveryCost": 150000,
  "needCrane": false,
  "needHelper": true,
  "specialInstructions": "Material untuk pekerjaan dinding",
  "status_issuance": "pending",
  "approvalStatus": "approved",
  "approver": 7,
  "warehouseSupervisor": 9,
  "unit_rumah": 12
}
```

**Update Distribution Status (Standard Update):**

```json
PUT /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1
Content-Type: application/json

{
  "status_issuance": "delivered",
  "actualArrival": "2024-03-20T11:45:00.000Z",
  "deliveryNotes": "Material diterima dengan baik oleh pihak proyek",
  "receiverName": "Ahmad Wijaya",
  "receiverPosition": "Site Manager"
}
```

**Update Distribution to In-Transit:**

```json
PUT /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1
Content-Type: application/json

{
  "status_issuance": "in-transit",
  "departureTime": "2024-03-20T09:35:00.000Z",
  "trackingNotes": "Keluar dari gudang, menuju lokasi proyek"
}
```

**Update Distribution to Delivered with Complete Information:**

```json
PUT /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1
Content-Type: application/json

{
  "status_issuance": "delivered",
  "actualArrival": "2024-03-20T11:45:00.000Z",
  "trackingNotes": "Material sampai dengan selamat",
  "deliveryNotes": "Semua material dalam kondisi baik",
  "receiverName": "Budi Santoso",
  "receiverPosition": "Supervisor Proyek"
}
```

**Get Distribution Statistics (Using Filters):**

```bash
GET /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[date][$gte]=2024-03-01&filters[date][$lte]=2024-03-31&filters[project][id][$eq]=1&populate=material,project
```

**Find Distributions by Project:**

```bash
GET /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[project][id][$eq]=1&filters[status_issuance][$eq]=pending
```

**Find Distributions by Driver:**

```bash
GET /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[driver][$containsi]=Budi&filters[date][$gte]=2024-03-01&filters[date][$lte]=2024-03-31&populate=project,material
```

**Search Distributions:**

```bash
GET /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[$or][distributionNumber][$containsi]=TRUCK&filters[$or][vehicle][$containsi]=TRUCK&filters[status_issuance][$eq]=delivered
```

**Find Distributions by Date Range:**

```bash
GET /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[date][$between]=2024-03-01,2024-03-31&filters[project][id][$eq]=1&populate=*
```

---

## Relations

### Material Distribution Relations

- `project` (Many-to-One) → Proyek Perumahan (`api::proyek-perumahan.proyek-perumahan`)
- `material` (Many-to-One) → Material (`api::material.material`)
- `unit_rumah` (Many-to-One) → Unit Rumah (`api::unit-rumah.unit-rumah`)
- `approver` (Many-to-One) → Karyawan/Employee (`api::karyawan.karyawan`)
- `warehouseSupervisor` (Many-to-One) → Karyawan/Employee (`api::karyawan.karyawan`)
- `documents` (Media) → Upload Files (multiple files allowed)

### Related Content Types

**Proyek Perumahan (`api::proyek-perumahan.proyek-perumahan`)**

- `nama_proyek` - Nama proyek tujuan
- `lokasi` - Lokasi proyek
- `status_proyek` - Status proyek

**Employees (`api::employee.employee`)**

- `nama_lengkap` - Nama lengkap karyawan
- `posisi` - Posisi/jabatan
- `departemen` - Departemen

## Field Definitions

### Core Fields

| Field Name           | Type     | Required | Default     | Description                                                                |
| -------------------- | -------- | -------- | ----------- | -------------------------------------------------------------------------- |
| `mrNumber`           | String   | No       | -           | MR Number (Legacy Support) - Unique                                        |
| `distributionNumber` | String   | No       | Auto-gen    | Distribution Number (Format: DIST-YYYY-NNN) - Unique                       |
| `date`               | Date     | Yes      | -           | Tanggal distribusi                                                         |
| `time`               | Time     | Yes      | -           | Waktu distribusi                                                           |
| `project`            | Relation | Yes      | -           | Proyek tujuan (relation ke proyek-perumahan)                               |
| `unit`               | String   | Yes      | -           | Unit/lokasi spesifik dalam proyek (max 255 chars)                          |
| `material`           | Relation | Yes      | -           | Material yang didistribusikan (relation ke material)                       |
| `quantity`           | Integer  | Yes      | -           | Jumlah material (min: 1)                                                   |
| `unitMeasure`        | String   | Yes      | -           | Satuan material (sak, pcs, kg, dll) (max 50 chars)                         |
| `requester`          | String   | Yes      | -           | Pemohon material (max 255 chars)                                           |
| `status_issuance`    | Enum     | Yes      | `pending`   | Status (pending, in-transit, delivered, Pending, Sedang Diproses, Selesai) |
| `approvalStatus`     | Enum     | No       | `pending`   | Status approval (pending, approved, rejected)                              |
| `priorityLevel`      | Enum     | No       | `normal`    | Priority level (low, normal, high, urgent)                                 |
| `notes`              | Text     | No       | -           | Catatan tambahan                                                           |
| `unit_rumah`         | Relation | No       | -           | Unit Rumah spesifik (relation ke unit-rumah)                               |

### Personnel Fields

| Field Name            | Type     | Required | Description                                    |
| --------------------- | -------- | -------- | ---------------------------------------------- |
| `driver`              | String   | No       | Nama supir pengangkut (max 255 chars)          |
| `escort`              | String   | No       | Nama staff gudang pendamping (max 255 chars)   |
| `supervisor`          | String   | No       | Nama supervisor proyek (max 255 chars)         |
| `approver`            | Relation | No       | Approver (relation ke karyawan)                |
| `warehouseSupervisor` | Relation | No       | Warehouse supervisor (relation ke karyawan)    |

### Logistics Fields

| Field Name            | Type    | Required | Description                                |
| --------------------- | ------- | -------- | ------------------------------------------ |
| `vehicle`             | String  | No       | Jenis kendaraan                            |
| `vehicleNumber`       | String  | No       | Nomor polisi kendaraan                     |
| `vehicleCapacity`     | String  | No       | Kapasitas angkut kendaraan                 |
| `transportType`       | String  | No       | Tipe transportasi                          |
| `needCrane`           | Boolean | No       | Butuh crane untuk bongkar (default: false) |
| `needHelper`          | Boolean | No       | Butuh tenaga bantuan (default: false)      |
| `specialInstructions` | Text    | No       | Instruksi khusus pengiriman                |

### Personnel Fields

| Field Name            | Type     | Required | Description                                    |
| --------------------- | -------- | -------- | ---------------------------------------------- |
| `driver`              | String   | No       | Nama supir pengangkut (max 255 chars)          |
| `escort`              | String   | No       | Nama staff gudang pendamping (max 255 chars)   |
| `supervisor`          | String   | No       | Nama supervisor proyek (max 255 chars)         |
| `approver`            | Relation | No       | Approver (relation ke karyawan)                |
| `warehouseSupervisor` | Relation | No       | Warehouse supervisor (relation ke karyawan)    |


### Status & Tracking Fields

| Field Name         | Type     | Required | Description                        |
| ------------------ | -------- | -------- | ---------------------------------- |
| `estimatedArrival` | DateTime | No       | Perkiraan waktu tiba               |
| `actualArrival`    | DateTime | No       | Waktu tiba aktual                  |
| `departureTime`    | DateTime | No       | Waktu keberangkatan aktual         |
| `deliveryCost`     | Decimal  | No       | Biaya pengiriman                   |
| `trackingNotes`    | Text     | No       | Catatan tracking selama perjalanan |
| `deliveryNotes`    | Text     | No       | Catatan delivery/penerimaan        |
| `receiverName`     | String   | No       | Nama penerima di lokasi            |
| `receiverPosition` | String   | No       | Jabatan penerima                   |

### Document Fields

| Field Name  | Type  | Required | Description                                     |
| ----------- | ----- | -------- | ----------------------------------------------- |
| `documents` | Media | No       | Dokumen terkait (multiple files: images, files) |

### Legacy Fields (For Backward Compatibility)

| Field Name                 | Type   | Required | Description                                       |
| -------------------------- | ------ | -------- | ------------------------------------------------- |
| `status_issuance` (Legacy) | Enum   | Yes      | Status legacy (Pending, Sedang Diproses, Selesai) |
| `mrNumber`                 | String | No       | MR Number untuk legacy system                     |

## Status Distribution Flow

### Status Workflow

#### Distribution Status (New System)

1. **pending**

   - Material siap dikirim
   - Menunggu konfirmasi proyek
   - Belum ada keberangkatan

2. **in-transit**

   - Sedang dalam perjalanan
   - Departure time tercatat
   - Bisa ditracking

3. **delivered**
   - Sudah sampai lokasi
   - Actual arrival tercatat
   - Dokumen penerimaan lengkap

#### Legacy Status (Backward Compatibility)

1. **Pending**

   - Material siap diproses
   - Menunggu persetujuan

2. **Sedang Diproses**

   - Sedang diproses oleh gudang

3. **Selesai**
   - Proses selesai

### Status Transitions Rules

```javascript
// Distribution Status Transitions (New System)
pending → in-transit
pending → delivered ( langsung jika jarak dekat )
in-transit → delivered

// Legacy Status Transitions
Pending → Sedang Diproses
Sedang Diproses → Selesai

// Status validation
const statusTransitions = {
  // New Distribution System
  'pending': ['in-transit', 'delivered', 'approved', 'rejected'],
  'in-transit': ['delivered'],
  'delivered': [],
  // Legacy System
  'Pending': ['Sedang Diproses', 'Selesai'],
  'Sedang Diproses': ['Selesai'],
  'Selesai': [],
  // Additional states
  'approved': ['in-transit', 'delivered'],
  'rejected': []
};
```

## Authentication & Permissions

### Required Headers

```json
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}
```

### Permission Levels

**Gudang Staff (Full Access):**

- `create` - Create new distribution
- `update` - Update distribution (all fields)
- `delete` - Delete distribution
- `find` - View all distributions
- `findOne` - View single distribution

**Proyek Manager (Limited Access):**

- `find` - View distributions for their projects only
- `findOne` - View single distribution for their projects
- `update` - Update status to "delivered" only
- Can upload receiving documents

**Supervisor (Read Only):**

- `find` - View distributions for their projects
- `findOne` - View single distribution

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Distribution number already exists",
    "details": {
      "field": "distribution_number",
      "error": "Distribution number must be unique"
    }
  }
}
```

**Invalid Status Transition (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid status transition",
    "details": {
      "from": "delivered",
      "to": "pending",
      "allowed": ["delivered"]
    }
  }
}
```

**Insufficient Stock (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Insufficient stock for material",
    "details": {
      "material": "Semen Portland",
      "requested": 50,
      "available": 30
    }
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Distribution not found"
  }
}
```

**Unauthorized Error (401):**

```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Unauthorized access to distribution"
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
?sort=date:desc
?sort=createdAt:desc
?sort=status_issuance:asc
?sort=distributionNumber:desc
?sort=estimatedArrival:asc
```

### Filtering

```
?filters[status_issuance][$eq]=pending
?filters[status_issuance][$eq]=in-transit
?filters[project][id][$eq]=1
?filters[date][$gte]=2024-03-01&filters[date][$lte]=2024-03-31
?filters[driver][nama_lengkap][$containsi]=budi
?filters[distributionNumber][$startsWith]=DIST-2024
?filters[mrNumber][$startsWith]=MR-2024
?filters[vehicle][$containsi]=truck
?filters[priorityLevel][$eq]=high
```

### Population (Relations)

```
?populate=project
?populate=driver,escort,supervisor
?populate=documents.surat_jalan,documents.foto_penerimaan
?populate=*
```

### Filters by Date Range

```
?filters[date][$between]=2024-03-01,2024-03-31
?filters[createdAt][$between]=2024-03-01T00:00:00.000Z,2024-03-31T23:59:59.999Z
```

## Document Upload

### Upload Delivery Documents

```javascript
// Upload surat jalan
const formData = new FormData();
formData.append("files", fileSuratJalan);
formData.append(
  "fileInfo",
  JSON.stringify({
    name: "surat-jalan-dist-001.pdf",
    folder: "/distribution-documents/surat-jalan",
    caption: "Surat jalan distribusi DIST-2024-001",
  })
);

const response = await api.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Use returned file ID in distribution update
const fileId = response.data[0].id;
```

### Update Distribution with Documents

```json
PUT /content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1
Content-Type: application/json

{
  "documents": [fileId1, fileId2, fileId3]
}
```

## Usage Examples

### Complete Distribution Workflow

```javascript
// 1. Create distribution (auto-generated number)
const createDistribution = async () => {
  // First generate distribution number
  const distributionNumber = await generateDistributionNumber();

  const distributionData = {
    distributionNumber: distributionNumber,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    project: selectedProject,
    unit: selectedUnit,
    material: selectedMaterial,
    quantity: selectedQuantity,
    unitMeasure: selectedUnitMeasure,
    requester: "Site Manager",
    driver: "Budi Santoso",
    escort: "Ahmad Wijaya",
    supervisor: "Supervisor Proyek",
    vehicle: selectedVehicle,
    priorityLevel: "normal",
    estimatedArrival: estimatedTime,
    notes: "Material untuk pekerjaan pondasi"
  };

  return await api.post(
    "/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material",
    distributionData
  );
};

// 2. Update to in-transit when departing
const updateToInTransit = async (id) => {
  return await api.put(
    `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/${id}`,
    {
      status_issuance: "in-transit",
      departureTime: new Date().toISOString(),
      trackingNotes: "Keluar dari gudang, menuju lokasi proyek",
    }
  );
};

// 3. Update to delivered when arrived
const updateToDelivered = async (id, files) => {
  // Upload documents first
  const uploadedFiles = await Promise.all(
    files.map((file) => uploadFile(file))
  );

  return await api.put(
    `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/${id}`,
    {
      status_issuance: "delivered",
      actualArrival: new Date().toISOString(),
      deliveryNotes: "Material diterima dengan baik",
      receiverName: receiverData.name,
      receiverPosition: receiverData.position,
      documents: uploadedFiles.map((f) => f.id)
    }
  );
};
```

### Generate Distribution Number

```javascript
const generateDistributionNumber = async () => {
  const currentYear = new Date().getFullYear();

  // Get count for this year
  const response = await api.get(
    `/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material`,
    {
      params: {
        filters: {
          distributionNumber: {
            $startsWith: `DIST-${currentYear}`,
          },
        },
        pagination: {
          pageSize: 1,
        },
      },
    }
  );

  const count = response.data.meta.pagination.total;
  const nextNumber = String(count + 1).padStart(3, "0");

  return `DIST-${currentYear}-${nextNumber}`;
};
```

### Stock Integration Check

```javascript
const checkStockAvailability = async (materialId, requestedQuantity) => {
  const stockResponse = await api.get(`/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material`, {
    params: {
      filters: {
        material: { id: { $eq: materialId } }
      },
      populate: ['material']
    }
  });

  return stockResponse.data; // Check material stock via service layer
};
```

### Dashboard Statistics (Using Filters)

```javascript
const getDistributionStats = async (filters = {}) => {
  const startDate = filters.startDate || new Date(new Date().setDate(1)).toISOString().split("T")[0];
  const endDate = filters.endDate || new Date().toISOString().split("T")[0];

  const queryParams = {
    filters: {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    },
    populate: ['material', 'project']
  };

  if (filters.projectId) {
    queryParams.filters.project = { id: { $eq: filters.projectId } };
  }

  const response = await api.get(
    "/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material",
    { params: queryParams }
  );

  const distributions = response.data.data;

  return {
    total: distributions.length,
    pending: distributions.filter(d => d.attributes.status_issuance === 'pending' || d.attributes.status_issuance === 'Pending').length,
    inTransit: distributions.filter(d => d.attributes.status_issuance === 'in-transit' || d.attributes.status_issuance === 'Sedang Diproses').length,
    delivered: distributions.filter(d => d.attributes.status_issuance === 'delivered' || d.attributes.status_issuance === 'Selesai').length,
    totalQuantity: distributions.reduce((sum, d) => sum + (d.attributes.quantity || 0), 0),
    totalCost: distributions.reduce((sum, d) => sum + (d.attributes.deliveryCost || 0), 0)
  };
};

// Example: Get stats for this month
const monthlyStats = await getDistributionStats();
console.log(monthlyStats);
// Output: { total: 25, pending: 8, inTransit: 5, delivered: 12, totalQuantity: 1500, totalCost: 2500000 }
```

### Find Distributions by Project

```javascript
const getProjectDistributions = async (projectId, status = null) => {
  const params = {
    filters: {
      project: { id: { $eq: projectId } }
    },
    populate: ['material']
  };

  if (status) {
    params.filters.status_issuance = { $eq: status };
  }

  const response = await api.get(
    "/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material",
    { params }
  );

  return response.data.data;
};
```

### Search Distributions

```javascript
const searchDistributions = async (query, filters = {}) => {
  const searchFilters = {
    $or: [
      { distributionNumber: { $containsi: query } },
      { mrNumber: { $containsi: query } },
      { unit: { $containsi: query } },
      { notes: { $containsi: query } },
      { vehicle: { $containsi: query } },
      { vehicleNumber: { $containsi: query } },
      { driver: { $containsi: query } },
      { escort: { $containsi: query } },
      { supervisor: { $containsi: query } }
    ],
    ...filters
  };

  const response = await api.get(
    "/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material",
    {
      params: {
        filters: searchFilters,
        populate: ['project', 'material']
      }
    }
  );

  return response.data.data;
};
```

## Testing Examples

### Test Distribution Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "date": "2024-03-20",
    "time": "09:30",
    "project": 1,
    "unit": "Blok A1",
    "material": 5,
    "quantity": 50,
    "unitMeasure": "sak",
    "requester": "Site Manager",
    "driver": "Budi Santoso",
    "escort": "Ahmad Wijaya",
    "vehicle": "Truck L-300",
    "priorityLevel": "normal",
    "estimatedArrival": "2024-03-20T12:00:00.000Z",
    "notes": "Material untuk pekerjaan pondasi"
  }'
```

### Test Status Update (Standard Update)

```bash
curl -X PUT \
  'http://localhost:1340/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "status_issuance": "in-transit",
    "departureTime": "2024-03-20T09:35:00.000Z",
    "trackingNotes": "Keluar dari gudang"
  }'
```

### Test with Filters

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[status_issuance][$eq]=pending&populate=project,driver,escort' \
  -H 'Authorization: Bearer <token>'
```

### Test Statistics Using Filters

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[date][$gte]=2024-03-01&filters[date][$lte]=2024-03-31&populate=material,project' \
  -H 'Authorization: Bearer <token>'
```

### Test Search Using Filters

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[$or][distributionNumber][$containsi]=TRUCK&filters[status_issuance][$eq]=delivered&populate=*' \
  -H 'Authorization: Bearer <token>'
```

### Test Find by Project Using Filters

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::pengeluaran-material.pengeluaran-material?filters[project][id][$eq]=1&filters[status_issuance][$eq]=pending&populate=material,project' \
  -H 'Authorization: Bearer <token>'
```

## Best Practices

1. **Always generate unique distribution numbers** with proper format (DIST-YYYY-NNN)
2. **Validate stock availability** before creating distribution
3. **Use proper status transitions** to maintain workflow integrity
4. **Upload documents immediately** when materials are delivered
5. **Set proper permissions** based on user roles and responsibilities
6. **Use population** when displaying related data to reduce API calls
7. **Implement proper error handling** for network and validation errors
8. **Track departure and arrival times** accurately for reporting
9. **Validate material data** before submission to ensure consistency
10. **Use pagination** for large datasets to improve performance

## Integration Points

### With Warehouse Issuance System

- Check material availability before distribution
- Update stock levels when distribution is confirmed
- Link to related issuance records

### With Project Management

- Link distributions to specific projects and units
- Update project material requirements
- Track material delivery progress

### With HRM System

- Get driver and escort information
- Log transportation activities
- Monitor staff performance

### With Inventory Management

- Real-time stock updates
- Material requirement planning
- Cost tracking per distribution

---

## Implementation Notes

### 🎯 Why We Enhanced `pengeluaran-material` Instead of Creating `distribusi-material`:

1. **Functional Overlap**: 95% overlap antara pengeluaran-material dan distribusi-material requirements
2. **Data Consistency**: Menghindari duplikasi data dan redundancy
3. **Backward Compatibility**: Existing data dan workflows tetap berfungsi
4. **Unified System**: Single source of truth untuk material flow dari gudang ke proyek
5. **Development Efficiency**: Lebih cepat dan maintainable

### 🔧 Key Implementation Decisions:

- **Dual Numbering System**: Support both `mrNumber` (legacy) and `distributionNumber` (new)
- **Enhanced Status Enum**: Combines new distribution status dan legacy status
- **Comprehensive Fields**: Logistics, personnel, tracking, dan document management
- **Service Layer**: Rich functionality untuk distribution management
- **No Lifecycle Hooks**: Simplified implementation per user request

### 📋 Migration Strategy:

1. **Existing Data**: Semua existing `pengeluaran-material` data tetap valid
2. **Gradual Adoption**: Bisa menggunakan sistem baru atau legacy system
3. **Field Mapping**: Clear mapping antara legacy dan new fields
4. **Status Mapping**: Support untuk kedua status workflows

---

**Note**:

- Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish
- Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten
- Document uploads harus melalui upload endpoint terlebih dahulu sebelum di-link ke distribution record
- Status transitions harus mengikuti workflow yang telah ditentukan untuk menjaga integritas data
- **⚠️ PENTING**: Gunakan `pengeluaran-material` collection type, bukan `distribusi-material` yang tidak ada
