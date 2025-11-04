# API Usage Documentation - Purchase Request System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Purchase Request (PR) dengan multiple content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Purchase Request API (`api::purchase-request.purchase-request`)

#### Base URL

```
/content-manager/collection-types/api::purchase-request.purchase-request
```

#### Endpoints

| Method | Endpoint                                                                             | Description                  |
| ------ | ------------------------------------------------------------------------------------ | ---------------------------- |
| GET    | `/content-manager/collection-types/api::purchase-request.purchase-request`           | Get all purchase requests    |
| GET    | `/content-manager/collection-types/api::purchase-request.purchase-request/:id`       | Get purchase request by ID   |
| POST   | `/content-manager/collection-types/api::purchase-request.purchase-request`           | Create new purchase request  |
| PUT    | `/content-manager/collection-types/api::purchase-request.purchase-request/:id`       | Update purchase request      |
| DELETE | `/content-manager/collection-types/api::purchase-request.purchase-request/:id`       | Delete purchase request      |

#### Request Examples

**Create Purchase Request:**

```json
POST /content-manager/collection-types/api::purchase-request.purchase-request
Content-Type: application/json

{
  "pr_number": "PR-2024-001",
  "request_date": "2024-01-10T00:00:00.000Z",
  "needed_date": "2024-01-15T00:00:00.000Z",
  "material_name": "Semen Portland",
  "quantity": 50,
  "unit": "ton",
  "estimated_price": 15000000,
  "requester": "Ahmad Supriadi",
  "proyek": 1,
  "request_type": "Proyek",
  "status": "submitted",
  "priority": "normal",
  "notes": "Material untuk pondasi cluster A1",
  "supplier_id": null,
  "approved_by": null,
  "approved_date": null,
  "po_reference": null
}
```

**Update Purchase Request Status:**

```json
PUT /content-manager/collection-types/api::purchase-request.purchase-request/1
Content-Type: application/json

{
  "status": "approved",
  "approved_by": 2,
  "approved_date": "2024-01-12T00:00:00.000Z",
  "notes": "Disetujui untuk pembelian ke supplier rutin"
}
```

---

### 2. Material Request API (`api::permintaan-material.permintaan-material`)

#### Base URL

```
/content-manager/collection-types/api::permintaan-material.permintaan-material
```

#### Endpoints

| Method | Endpoint                                                                             | Description               |
| ------ | ------------------------------------------------------------------------------------ | ------------------------- |
| GET    | `/content-manager/collection-types/api::permintaan-material.permintaan-material`     | Get all material requests |
| GET    | `/content-manager/collection-types/api::permintaan-material.permintaan-material/:id` | Get material request by ID|
| POST   | `/content-manager/collection-types/api::permintaan-material.permintaan-material`     | Create new material request|
| PUT    | `/content-manager/collection-types/api::permintaan-material.permintaan-material/:id` | Update material request   |
| DELETE | `/content-manager/collection-types/api::permintaan-material.permintaan-material/:id` | Delete material request   |

---

### 3. Supplier API (`api::supplier.supplier`)

#### Base URL

```
/content-manager/collection-types/api::supplier.supplier
```

#### Endpoints

| Method | Endpoint                                                       | Description         |
| ------ | -------------------------------------------------------------- | ------------------- |
| GET    | `/content-manager/collection-types/api::supplier.supplier`     | Get all suppliers   |
| GET    | `/content-manager/collection-types/api::supplier.supplier/:id` | Get supplier by ID  |
| POST   | `/content-manager/collection-types/api::supplier.supplier`     | Create new supplier |
| PUT    | `/content-manager/collection-types/api::supplier.supplier/:id` | Update supplier     |
| DELETE | `/content-manager/collection-types/api::supplier.supplier/:id` | Delete supplier     |

#### Request Examples

**Create Supplier:**

```json
POST /content-manager/collection-types/api::supplier.supplier
Content-Type: application/json

{
  "name": "PT. Material Jaya",
  "code": "SUP-2024-001",
  "type": "Perusahaan",
  "status_supplier": "active",
  "address": "Jl. Industri Raya No. 123, Jakarta",
  "rating": 4.5,
  "contact": {
    "nama": "Budi Santoso",
    "telepon": "+62-21-5551234",
    "email": "info@materialjaya.com"
  },
  "notes": "Supplier terpercaya untuk material bangunan"
}
```

---

### 4. Proyek Perumahan API (`api::proyek-perumahan.proyek-perumahan`)

#### Base URL

```
/content-manager/collection-types/api::proyek-perumahan.proyek-perumahan
```

#### Endpoints

| Method | Endpoint                                                                             | Description            |
| ------ | ------------------------------------------------------------------------------------ | ---------------------- |
| GET    | `/content-manager/collection-types/api::proyek-perumahan.proyek-perumahan`           | Get all projects       |
| GET    | `/content-manager/collection-types/api::proyek-perumahan.proyek-perumahan/:id`       | Get project by ID      |
| POST   | `/content-manager/collection-types/api::proyek-perumahan.proyek-perumahan`           | Create new project     |
| PUT    | `/content-manager/collection-types/api::proyek-perumahan.proyek-perumahan/:id`       | Update project         |
| DELETE | `/content-manager/collection-types/api::proyek-perumahan.proyek-perumahan/:id`       | Delete project         |

#### Request Examples

**Create Project for PR:**

```json
POST /content-manager/collection-types/api::proyek-perumahan.proyek-perumahan
Content-Type: application/json

{
  "nama_proyek": "Cluster A1",
  "kode_proyek": "PROJ-000001",
  "lokasi": "Jakarta Selatan",
  "status": "pembangunan",
  "tanggal_mulai": "2024-01-01T00:00:00.000Z",
  "tanggal_selesai": "2024-12-31T00:00:00.000Z",
  "description": "Pembangunan Cluster A1 dengan 50 unit rumah"
}
```

---

## Data Structure & Field Definitions

### Purchase Request Fields

| Field             | Type     | Required | Description            | Options                                               |
| ----------------- | -------- | -------- | ---------------------- | ----------------------------------------------------- |
| `pr_number`       | String   | Yes      | Unique PR number       | Format: PR-YYYY-XXX                                   |
| `request_date`    | Date     | Yes      | Request date           | ISO format                                            |
| `needed_date`     | Date     | Yes      | Needed date            | ISO format                                            |
| `material_name`   | String   | Yes      | Material name          | Max: 200 chars                                        |
| `quantity`        | Decimal  | Yes      | Quantity needed        | Min: 1                                                |
| `unit`            | String   | Yes      | Unit of measurement    | ton, kg, m³, pcs, dll                                 |
| `estimated_price` | Decimal  | Yes      | Estimated total price  | Min: 0                                                |
| `requester`       | String   | Yes      | Requester name         | Max: 100 chars                                        |
| `proyek`          | Relation | Yes      | Related project        | Proyek Perumahan entity                               |
| `request_type`    | Enum     | Yes      | Request type           | "Proyek", "Gudang" (default: Proyek)                  |
| `status`          | Enum     | Yes      | PR status              | "submitted", "approved", "processed", "completed", "rejected" |
| `priority`        | Enum     | No       | Priority level         | "low", "normal", "high", "urgent" (default: normal)   |
| `notes`           | Text     | No       | Additional notes       | Max: 500 chars                                        |
| `supplier_id`     | Relation | No       | Preferred supplier     | Supplier entity                                       |
| `approved_by`     | Relation | No       | Approved by            | Karyawan entity                                       |
| `approved_date`   | Date     | No       | Approval date          | ISO format                                            |
| `po_reference`    | String   | No       | Related PO number      | Max: 50 chars                                         |

### Material Request Fields (Existing - Gudang Module)

| Field                  | Type     | Required | Description             | Options                                                   |
| ---------------------- | -------- | -------- | ----------------------- | --------------------------------------------------------- |
| `nomor_permintaan`     | String   | Yes      | Unique request number   | Format: MR-YYYYMMDD-XXX                                   |
| `tanggal_permintaan`   | Date     | Yes      | Request date            | ISO format                                                |
| `tanggal_kebutuhan`    | Date     | Yes      | Required date           | ISO format                                                |
| `material_type`        | String   | Yes      | Material category       | "semen", "batubata", "besi", "keramik", "lainnya"         |
| `quantity`             | Number   | Yes      | Total quantity          | Min: 0.01                                                 |
| `unit_measurement`     | String   | Yes      | Unit of measurement     | Max: 20 chars                                             |
| `specification`        | String   | No       | Material specifications | Max: 300 chars                                            |
| `priority`             | String   | Yes      | Priority level          | "low", "medium", "high", "urgent"                         |
| `status_permintaan`    | String   | Yes      | Request status          | "pending", "approved", "ordered", "delivered", "rejected" |
| `status_price`         | String   | Yes      | Price status            | "quoted", "confirmed", "paid", "cancelled"                |
| `estimated_cost`       | Number   | No       | Estimated unit cost     | Min: 0                                                    |
| `estimated_cost_total` | Number   | No       | Total estimated cost    | Min: 0                                                    |
| `actual_cost`          | Number   | No       | Actual cost             | Min: 0                                                    |
| `delivery_date`        | Date     | No       | Expected delivery date  | ISO format                                                |
| `received_by`          | String   | No       | Receiver name           | Max: 100 chars                                            |
| `keterangan`           | String   | No       | Notes/remarks           | Max: 500 chars                                            |
| `proyek`               | Relation | No       | Related project         | Project entity                                            |
| `unit_rumah`           | Relation | No       | Related house unit      | Unit entity                                               |
| `pemohon`              | Relation | No       | Requester               | User entity                                               |
| `penyetuju`            | Relation | No       | Approver                | User entity                                               |
| `item_material`        | Array    | Yes      | List of materials       | Min: 1 item                                               |
| `documents`            | Array    | No       | Attached documents      | File references                                           |

### Item Material Structure

| Field           | Type   | Required | Description      |
| --------------- | ------ | -------- | ---------------- |
| `material_name` | String | Yes      | Material name    |
| `quantity`      | Number | Yes      | Quantity         |
| `unit`          | String | Yes      | Unit             |
| `notes`         | String | No       | Additional notes |

### Supplier Fields

| Field            | Type     | Required | Description               |
| ---------------- | -------- | -------- | ------------------------- |
| `name`           | String   | Yes      | Supplier name             |
| `code`           | String   | Yes      | Supplier code (unique)    |
| `type`           | Enum     | No       | Supplier type             | "Perusahaan", "Individu" |
| `status_supplier`| Enum     | No       | Status                    | "active", "inactive", "blacklist" (default: active) |
| `contact`        | Component| No       | Contact information       | Komponen kontak           |
| `address`        | Text     | No       | Address                   |
| `rating`         | Decimal  | No       | Rating (1-5)              |
| `lastOrderDate`  | Date     | No       | Last order date           |
| `totalPurchases` | Decimal  | No       | Total purchases amount    |
| `documents`      | Component| No       | Attached documents        | Komponen dokumen (repeatable) |
| `notes`          | Text     | No       | Notes                     |

### Proyek Perumahan Fields (Selected for PR Integration)

| Field              | Type     | Required | Description           |
| ------------------ | -------- | -------- | --------------------- |
| `nama_proyek`      | String   | Yes      | Project name          |
| `kode_proyek`      | String   | Yes      | Project code          |
| `lokasi`           | String   | Yes      | Location              |
| `status`           | Enum     | No       | Project status        | "perencanaan", "pembangunan", "terjual habis" |
| `tanggal_mulai`    | Date     | No       | Start date            |
| `tanggal_selesai`  | Date     | No       | End date              |
| `description`      | Text     | No       | Description           |

---

## Relations

### Purchase Request Relations

- `proyek` (Many-to-One) → Proyek Perumahan
- `supplier_id` (Many-to-One) → Supplier
- `approved_by` (Many-to-One) → Karyawan

### Material Request Relations

- `proyek` (Many-to-One) → Proyek Perumahan
- `unit_rumah` (Many-to-One) → Unit Rumah
- `pemohon` (Many-to-One) → Karyawan
- `penyetuju` (Many-to-One) → Karyawan
- `purchasings` (One-to-Many) → Purchasing

### Supplier Relations

- `materials` (Many-to-Many) → Materials
- `purchase_orders` (One-to-Many) → Purchase Orders
- `evaluations` (One-to-Many) → Supplier Evaluations
- `purchase_requests` (One-to-Many) → Purchase Requests
- `penerimaan_materials` (One-to-Many) → Penerimaan Material

---

## Status Workflows

### Purchase Request Status Workflow

```
submitted → approved → processed → completed
    ↓
  rejected
```

### Material Request Status Workflow

```
pending → approved → ordered → delivered
    ↓
  rejected
```

### Material Request Price Status Workflow

```
quoted → confirmed → paid
    ↓
  cancelled
```

### Priority Levels

- `low` - Low priority (can be delayed)
- `normal` - Normal priority
- `high` - High priority (urgent attention needed)
- `urgent` - Critical priority (immediate action required)

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

---

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Material request validation failed",
    "details": [
      {
        "path": ["nomor_permintaan"],
        "message": "Nomor permintaan wajib diisi"
      }
    ]
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

---

## Query Parameters

### Pagination

```
?pagination[page]=1&pagination[pageSize]=25
```

### Sorting

```
?sort=tanggal_permintaan:desc
?sort=nomor_permintaan:asc
```

### Filtering

**Purchase Request Filters:**
```
?filters[status][$eq]=submitted
?filters[priority][$eq]=high
?filters[request_type][$eq]=Proyek
?filters[proyek][$eq]=1
?filters[supplier_id][$eq]=1
?filters[request_date][$gte]=2024-01-01
?filters[request_date][$lte]=2024-12-31
```

**Material Request Filters:**
```
?filters[status_permintaan][$eq]=pending
?filters[priority][$eq]=high
?filters[proyek][documentId][$eq]=1
?filters[tanggal_permintaan][$gte]=2024-01-01
?filters[tanggal_permintaan][$lte]=2024-12-31
```

### Search

```
?_q=semen
```

### Population (Relations)

**Purchase Request Relations:**
```
?populate=*
?populate[0]=proyek
?populate[1]=supplier_id
?populate[2]=approved_by
```

**Material Request Relations:**
```
?populate=*
?populate[0]=proyek
?populate[1]=unit_rumah
?populate[2]=pemohon
?populate[3]=penyetuju
```

---

## Usage Examples

### Create Purchase Request

```javascript
// Example: Creating a purchase request
const purchaseRequest = {
  pr_number: "PR-2024-001",
  request_date: new Date().toISOString(),
  needed_date: "2024-01-20T00:00:00.000Z",
  material_name: "Semen Portland",
  quantity: 50,
  unit: "ton",
  estimated_price: 15000000,
  requester: "Ahmad Supriadi",
  proyek: 1,
  request_type: "Proyek",
  status: "submitted",
  priority: "normal",
  notes: "Material untuk pondasi cluster A1"
};

// POST to /content-manager/collection-types/api::purchase-request.purchase-request
```

### Create Material Request with Project and User

```javascript
// Example: Creating a material request
const materialRequest = {
  nomor_permintaan: "MR-20240104-002",
  tanggal_permintaan: new Date().toISOString(),
  tanggal_kebutuhan: "2024-01-20T00:00:00.000Z",
  material_type: "besi",
  quantity: 2,
  unit_measurement: "ton",
  specification: "Besi beton SNI",
  priority: "medium",
  status_permintaan: "pending",
  status_price: "quoted",
  estimated_cost: 8500000,
  estimated_cost_total: 8700000,
  proyek: 1, // Project ID
  unit_rumah: 1, // Unit ID
  pemohon: 1, // User ID
  item_material: [
    {
      material_name: "Besi Beton Polos",
      quantity: 2,
      unit: "ton",
      notes: "Diameter 13mm, SNI",
    },
  ],
};

// POST to /content-manager/collection-types/api::permintaan-material.permintaan-material
```

### Filter Requests by Status and Priority

**Purchase Request:**
```javascript
// GET: Get high priority submitted purchase requests
const params = {
  filters: {
    status: { $eq: "submitted" },
    priority: { $eq: "high" },
    request_type: { $eq: "Proyek" },
  },
  sort: "needed_date:asc",
  populate: ["proyek", "supplier_id", "approved_by"],
};

// GET /content-manager/collection-types/api::purchase-request.purchase-request?filters[status][$eq]=submitted&filters[priority][$eq]=high&filters[request_type][$eq]=Proyek&sort=needed_date:asc&populate[0]=proyek&populate[1]=supplier_id&populate[2]=approved_by
```

**Material Request:**
```javascript
// GET: Get high priority pending requests
const params = {
  filters: {
    status_permintaan: { $eq: "pending" },
    priority: { $eq: "high" },
  },
  sort: "tanggal_kebutuhan:asc",
  populate: ["proyek", "pemohon"],
};

// GET /content-manager/collection-types/api::permintaan-material.permintaan-material?filters[status_permintaan][$eq]=pending&filters[priority][$eq]=high&sort=tanggal_kebutuhan:asc&populate[0]=proyek&populate[1]=pemohon
```

### Update Request Status Workflow

**Purchase Request:**
```javascript
// Approve purchase request
const approvePRData = {
  status: "approved",
  approved_by: 2, // Approver user ID
  approved_date: new Date().toISOString(),
  notes: "Disetujui untuk pembelian ke supplier rutin"
};

// PUT to /content-manager/collection-types/api::purchase-request.purchase-request/{id}
```

**Material Request:**
```javascript
// Approve material request
const approveMRData = {
  status_permintaan: "approved",
  status_price: "confirmed",
  penyetuju: 2, // Approver user ID
  actual_cost: 8600000,
};

// PUT to /content-manager/collection-types/api::permintaan-material.permintaan-material/{id}
```

### Generate Request Number

```javascript
// Purchase Request Number
const generatePRNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `PR-${year}-${random}`;
};
// Result: "PR-2024-123"

// Material Request Number
const generateMRNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `MR-${year}${month}${day}-${random}`;
};
// Result: "MR-20240104-123"
```

### Calculate Total Cost

```javascript
// Example calculation for total cost
const calculateTotalCost = (estimatedCost, quantity, additionalFees = 0) => {
  const baseCost = Number(estimatedCost) || 0;
  const qty = Number(quantity) || 0;
  const fees = Number(additionalFees) || 0;

  return baseCost * qty + fees;
};

// Usage
const unitCost = 300000; // per ton
const quantity = 50; // ton
const deliveryFee = 500000;
const totalCost = calculateTotalCost(unitCost, quantity, deliveryFee);
// Result: 15,500,000
```

---

## Best Practices

1. **Always validate request numbers** to ensure uniqueness and proper format
2. **Use proper date formats** (ISO 8601) for all date fields
3. **Maintain status workflow integrity** - don't skip status transitions
4. **Use meaningful priority levels** to help with resource allocation
5. **Populate relations** when needed to avoid additional API calls
6. **Implement proper filtering** for large datasets
7. **Validate material items** to ensure at least one item exists
8. **Use consistent currency formatting** for cost fields
9. **Document material specifications** clearly for procurement accuracy
10. **Track delivery dates** and update actual costs for budget management

---

## Testing Examples

### Test Purchase Request Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::purchase-request.purchase-request' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "pr_number": "PR-2024-003",
    "request_date": "2024-01-04T00:00:00.000Z",
    "needed_date": "2024-01-25T00:00:00.000Z",
    "material_name": "Semen Portland",
    "quantity": 30,
    "unit": "sak",
    "estimated_price": 9000000,
    "requester": "Ahmad Supriadi",
    "proyek": 1,
    "request_type": "Proyek",
    "status": "submitted",
    "priority": "medium",
    "notes": "Material untuk cor pondasi cluster A1"
  }'
```

### Test Material Request Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::permintaan-material.permintaan-material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nomor_permintaan": "MR-20240104-003",
    "tanggal_permintaan": "2024-01-04T00:00:00.000Z",
    "tanggal_kebutuhan": "2024-01-25T00:00:00.000Z",
    "material_type": "pasir",
    "quantity": 30,
    "unit_measurement": "m³",
    "specification": "Pasir halus untuk cor",
    "priority": "medium",
    "status_permintaan": "pending",
    "status_price": "quoted",
    "estimated_cost": 100000,
    "estimated_cost_total": 3000000,
    "proyek": 1,
    "pemohon": 1,
    "item_material": [
      {
        "material_name": "Pasir Halus",
        "quantity": 30,
        "unit": "m³",
        "notes": "Kualitas bagus"
      }
    ]
  }'
```

### Test Filter and Search

**Purchase Request:**
```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::purchase-request.purchase-request?filters[status][$eq]=submitted&filters[priority][$eq]=high&filters[request_type][$eq]=Proyek&sort=needed_date:asc&populate=proyek&populate=supplier_id' \
  -H 'Authorization: Bearer <token>'
```

**Material Request:**
```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::permintaan-material.permintaan-material?filters[status_permintaan][$eq]=pending&filters[priority][$eq]=high&sort=tanggal_kebutuhan:asc&populate=proyek' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Semua content types menggunakan draftAndPublish = false, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Workflow status untuk Purchase Request dan Material Request harus diikuti secara proper untuk maintain integrity sistem.
