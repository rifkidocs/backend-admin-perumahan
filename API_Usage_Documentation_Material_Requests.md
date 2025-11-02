# API Usage Documentation - Material Requests System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Material Requests (Permintaan Material) dengan content type utama. Semua endpoint menggunakan format `/api/permintaan-materials` untuk akses melalui Strapi API publik atau `/content-manager/collection-types/api::permintaan-material.permintaan-material` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Material Request API (`api::permintaan-material.permintaan-material`)

#### Base URL

```
/api/permintaan-materials
```

Atau untuk Admin Panel:
```
/content-manager/collection-types/api::permintaan-material.permintaan-material
```

#### Endpoints

| Method | Endpoint                                                   | Description                    |
| ------ | ---------------------------------------------------------- | ------------------------------ |
| GET    | `/api/permintaan-materials`                                   | Get all material requests      |
| GET    | `/api/permintaan-materials/:id`                               | Get material request by ID     |
| POST   | `/api/permintaan-materials`                                   | Create new material request    |
| PUT    | `/api/permintaan-materials/:id`                               | Update material request        |
| DELETE | `/api/permintaan-materials/:id`                               | Delete material request        |

#### Request Examples

**Create Material Request:**

```json
POST /api/permintaan-materials
Content-Type: application/json

{
  "data": {
    "nomor_permintaan": "MR-2024-001",
    "tanggal_permintaan": "2024-03-20",
    "material_type": "semen",
    "quantity": 50,
    "unit_measurement": "sak",
    "specification": "Semen Portland Tipe I",
    "priority": "high",
    "tanggal_kebutuhan": "2024-03-25",
    "status_permintaan": "pending",
    "status_price": "quoted", // Status untuk harga yang akan ditambahkan
    "estimated_cost": 8000000,
    "estimated_cost_total": 400000000, // Total biaya estimasi
    "actual_cost": 0,
    "delivery_date": null,
    "received_by": "",
    "keterangan": "Material untuk pondasi unit A1",
    "proyek": 1,
    "unit_rumah": 1
  }
}
```

**Update Material Request:**

```json
PUT /api/permintaan-materials/1
Content-Type: application/json

{
  "data": {
    "status_permintaan": "approved",
    "status_price": "confirmed", // Status harga yang telah dikonfirmasi
    "estimated_cost": 8200000,
    "actual_cost": 8200000,
    "delivery_date": "2024-03-24",
    "received_by": "Budi (Site Supervisor)",
    "keterangan": "Material telah diterima sesuai spesifikasi"
  }
}
```

**Update Material Request Status:**

```json
PUT /api/permintaan-materials/1
Content-Type: application/json

{
  "data": {
    "status_permintaan": "delivered",
    "status_price": "paid", // Status harga setelah pembayaran
    "delivery_date": "2024-03-24",
    "received_by": "Budi (Site Supervisor)"
  }
}
```

---

## Relations

### Material Request Relations

- `unit_rumah` (Many-to-One) → Unit Rumah
- `proyek` (Many-to-One) → Proyek Perumahan
- `pemohon` (Many-to-One) → Karyawan (Requester)
- `penyetuju` (Many-to-One) → Karyawan (Approver)
- `purchasings` (One-to-Many) → Purchasing Orders

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
    "message": "Quantity tidak boleh negatif"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Material request not found"
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
?sort=required_date:desc
```

### Filtering

```
?filters[status_permintaan][$eq]=pending
?filters[material_type][$eq]=semen
?filters[tanggal_kebutuhan][$gte]=2024-03-01
?filters[unit_rumah][id][$eq]=1
?filters[proyek][id][$eq]=1
?filters[status_price][$eq]=quoted
```

### Population (Relations)

```
?populate=unit_rumah
?populate=proyek
?populate=unit_rumah,proyek
?populate=pemohon
?populate=penyetuju
?populate=purchasings
```

## Usage Examples

### Material Request Workflow

```javascript
// Example workflow for material request processing
const materialRequest = {
  nomor_permintaan: "MR-2024-001",
  tanggal_permintaan: "2024-03-20",
  material_type: "semen",
  quantity: 50,
  unit_measurement: "sak",
  specification: "Semen Portland Tipe I",
  priority: "high",
  tanggal_kebutuhan: "2024-03-25",
  status_permintaan: "pending",        // pending → approved → ordered → delivered
  status_price: "quoted",   // quoted → confirmed → paid
  estimated_cost: 8000000,
  actual_cost: 0,
  unit_rumah: 1,
  proyek: 1
};

// Step 1: Create material request
// status_permintaan: pending, status_price: quoted

// Step 2: Approve request
// status_permintaan: approved, status_price: confirmed

// Step 3: Receive materials
// status_permintaan: delivered, status_price: paid
```

### Cost Calculation

```javascript
// Example calculation for total cost estimation
const unitPrice = 8000000;  // per 50 sak
const quantity = 50;
const unitPricePerItem = unitPrice / quantity; // 160,000 per sak
const taxPercentage = 11; // 11% PPN
const discountPercentage = 5; // 5% discount

const subtotal = unitPrice * quantity;
const discountAmount = subtotal * (discountPercentage / 100);
const taxableAmount = subtotal - discountAmount;
const taxAmount = taxableAmount * (taxPercentage / 100);
const totalCost = taxableAmount + taxAmount;

const materialCostEstimation = {
  unit_price: unitPrice,
  quantity: quantity,
  subtotal: subtotal,
  discount: discountAmount,
  taxable_amount: taxableAmount,
  tax: taxAmount,
  total: totalCost
};
```

## Best Practices

1. **Always validate material request data** before creating or updating
2. **Use proper date formats** for request_date, required_date, and delivery_date
3. **Maintain unique request_number** format (MR-XXX)
4. **Use pagination** for large datasets of material requests
5. **Populate relations** when needed to avoid additional API calls
6. **Validate data** on frontend before sending to API
7. **Track both status and status_price** separately for comprehensive monitoring
8. **Include project and unit relations** for proper material tracking
9. **Monitor material requirements** against inventory levels
10. **Update status_price** as financial stages are completed

## Testing Examples

### Test Material Request Creation

```bash
curl -X POST \
  'http://localhost:1337/api/permintaan-materials' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "data": {
      "tanggal_permintaan": "2024-03-20",
      "material_type": "semen",
      "quantity": 50,
      "unit_measurement": "sak",
      "specification": "Semen Portland Tipe I",
      "priority": "high",
      "tanggal_kebutuhan": "2024-03-25",
      "status_permintaan": "pending",
      "status_price": "quoted",
      "estimated_cost": 8000000,
      "unit_rumah": 1,
      "proyek": 1
    }
  }'
```

### Test Material Request Status Update

```bash
curl -X PUT \
  'http://localhost:1337/api/permintaan-materials/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "data": {
      "status_permintaan": "approved",
      "status_price": "confirmed",
      "delivery_date": "2024-03-24",
      "received_by": "Budi (Site Supervisor)"
    }
  }'
```

### Get All Pending Material Requests with Unit Details

```bash
curl -X GET \
  'http://localhost:1337/api/permintaan-materials?filters[status_permintaan][$eq]=pending&populate=unit_rumah,proyek' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json'
```

## Fields Definition

### Material Request Fields

| Field Name               | Type           | Required | Description                          | Validation                                  |
| ------------------------ | -------------- | -------- | ------------------------------------ | ------------------------------------------- |
| `nomor_permintaan`       | String         | Yes      | Nomor permintaan (format: MR-XXX)    | Unique, Pattern: MR-XXX                     |
| `tanggal_permintaan`     | Date           | No       | Tanggal permintaan                   | Required                                    |
| `status_permintaan`      | Enumeration    | No       | Status permintaan                    | Options: pending, approved, ordered, delivered |
| `tanggal_kebutuhan`      | Date           | No       | Tanggal material dibutuhkan          | Required                                    |
| `keterangan`             | String         | No       | Catatan tambahan                     | Max: 200                                    |
| `material_type`          | Enumeration    | Yes      | Jenis material yang diminta          | Options: semen, batubata, besi, keramik, lainnya |
| `quantity`               | Decimal        | Yes      | Jumlah kuantitas yang diminta        | Min: 0.01                                   |
| `unit_measurement`       | String         | Yes      | Satuan pengukuran                    | Max: 20 (sak, kg, pcs, m, dll)              |
| `specification`          | Text           | No       | Spesifikasi teknis material          | Max: 300                                    |
| `priority`               | Enumeration    | Yes      | Prioritas permintaan                 | Options: low, medium, high, urgent          |
| `status_price`           | Enumeration    | Yes      | Status harga/finansial               | Options: quoted, confirmed, paid            |
| `estimated_cost`         | Decimal        | No       | Estimasi biaya                       | Min: 0                                      |
| `estimated_cost_total`   | Decimal        | No       | Total biaya estimasi                 | Min: 0                                      |
| `actual_cost`            | Decimal        | No       | Biaya aktual setelah penerimaan      | Min: 0                                      |
| `delivery_date`          | Date           | No       | Tanggal pengiriman                   | Date format                                 |
| `received_by`            | String         | No       | Nama orang yang menerima             | Max: 100                                    |
| `item_material`          | JSON           | No       | Item material (flexible structure)   | JSON object                                 |
| `proyek`                 | Relation       | No       | Proyek terkait                       | Many-to-One ke project                      |
| `unit_rumah`             | Relation       | No       | Unit yang membutuhkan material       | Many-to-One ke unit                         |
| `pemohon`                | Relation       | No       | Karyawan pemohon                     | Many-to-One ke karyawan                     |
| `penyetuju`              | Relation       | No       | Karyawan penyetuju                   | Many-to-One ke karyawan                     |
| `purchasings`            | Relation       | No       | Purchase orders terkait              | One-to-Many ke purchasing                   |

---

**Note**: Semua content types menggunakan draftAndPublish = false, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Gunakan status_price untuk melacak status finansial secara terpisah dari status permintaan.