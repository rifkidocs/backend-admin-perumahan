# API Usage Documentation - Purchase Order Management System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Purchase Order Management dengan hubungan ke Purchase Request. Sistem ini mengelola purchase order untuk material dengan relasi ke supplier dan memiliki alur workflow yang terintegrasi dengan purchase request. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Purchase Order API (`api::purchase-order.purchase-order`)

#### Base URL

```
/content-manager/collection-types/api::purchase-order.purchase-order
```

#### Endpoints

| Method | Endpoint                                                                   | Description                |
| ------ | -------------------------------------------------------------------------- | -------------------------- |
| GET    | `/content-manager/collection-types/api::purchase-order.purchase-order`     | Get all purchase orders    |
| GET    | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Get purchase order by ID   |
| POST   | `/content-manager/collection-types/api::purchase-order.purchase-order`     | Create new purchase order  |
| PUT    | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Update purchase order      |
| DELETE | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Delete purchase order      |

#### Request Examples

**Create Purchase Order (Gudang Module - Based on Actual Implementation):**

```json
POST /content-manager/collection-types/api::purchase-order.purchase-order
Content-Type: application/json

{
  "kode": "PO-2409001",
  "tanggal": "2024-01-15",
  "supplier": 1,
  "status_po": "draft",
  "status_payment": "pending",
  "status_delivery": "pending",
  "status_price": "standard",
  "notes": "Purchase order untuk material proyek cluster A",
  "items": [
    {
      "material": 1,
      "jumlah": 50,
      "harga": 150000
    },
    {
      "material": 2,
      "jumlah": 25,
      "harga": 75000
    }
  ],
  "total_amount": 9375000
}
```

**Create Purchase Order (Materials Module - Alternative Implementation):**

```json
POST /content-manager/collection-types/api::purchase-order.purchase-order
Content-Type: application/json

{
  "nomor_po": "PO-2409001",
  "supplier": "PT. Material Jaya Abadi",
  "tanggal_order": "2024-01-15",
  "tanggal_estimasi_delivery": "2024-01-20",
  "status_po": "draft",
  "status_payment": "pending",
  "status_delivery": "pending",
  "status_quality": "pending",
  "catatan": "Purchase order untuk material proyek cluster A",
  "materials": [
    {
      "material": "material-document-id-1",
      "quantity": 50,
      "unit_price": 150000,
      "total_price": 7500000
    },
    {
      "material": "material-document-id-2",
      "quantity": 25,
      "unit_price": 75000,
      "total_price": 1875000
    }
  ]
}
```

**Update Purchase Order Status:**

```json
PUT /content-manager/collection-types/api::purchase-order.purchase-order/1
Content-Type: application/json

{
  "status_po": "dikirim",
  "notes": "PO telah dikirim ke supplier"
}
```

---

### 2. Purchase Request API (`api::purchase-request.purchase-request`)

#### Base URL

```
/content-manager/collection-types/api::purchase-request.purchase-request
```

#### Endpoints

| Method | Endpoint                                                                       | Description                   |
| ------ | ------------------------------------------------------------------------------ | ----------------------------- |
| GET    | `/content-manager/collection-types/api::purchase-request.purchase-request`     | Get all purchase requests     |
| GET    | `/content-manager/collection-types/api::purchase-request.purchase-request/:id` | Get purchase request by ID    |
| POST   | `/content-manager/collection-types/api::purchase-request.purchase-request`     | Create new purchase request   |
| PUT    | `/content-manager/collection-types/api::purchase-request.purchase-request/:id` | Update purchase request       |
| DELETE | `/content-manager/collection-types/api::purchase-request.purchase-request/:id` | Delete purchase request       |

#### Request Examples

**Create Purchase Request:**

```json
POST /content-manager/collection-types/api::purchase-request.purchase-request
Content-Type: application/json

{
  "pr_number": "PR-2024-001",
  "request_date": "2024-01-15",
  "requester": "John Doe",
  "request_type": "Proyek",
  "material_name": "Semen Portland",
  "quantity": 100,
  "unit": "sak",
  "unit_price": 75000,
  "total_price": 7500000,
  "needed_date": "2024-01-25",
  "priority": "normal",
  "status_purchase": "submitted",
  "proyek": 1,
  "supplier_id": 1,
  "notes": "Material dibutuhkan untuk pondasi cluster A"
}
```

---

### 3. Supplier API (`api::supplier.supplier`)

#### Base URL

```
/content-manager/collection-types/api::supplier.supplier
```

#### Endpoints

| Method | Endpoint                                                   | Description            |
| ------ | ---------------------------------------------------------- | ---------------------- |
| GET    | `/content-manager/collection-types/api::supplier.supplier` | Get all suppliers      |
| GET    | `/content-manager/collection-types/api::supplier.supplier/:id` | Get supplier by ID     |
| POST   | `/content-manager/collection-types/api::supplier.supplier` | Create new supplier    |
| PUT    | `/content-manager/collection-types/api::supplier.supplier/:id` | Update supplier        |
| DELETE | `/content-manager/collection-types/api::supplier.supplier/:id` | Delete supplier        |

#### Request Examples

**Create Supplier:**

```json
POST /content-manager/collection-types/api::supplier.supplier
Content-Type: application/json

{
  "code": "SUP-001",
  "name": "PT. Material Jaya Abadi",
  "type": "Perusahaan",
  "contact": {
    "name": "Budi Santoso",
    "position": "Sales Manager",
    "phone": "+62812345678",
    "email": "budi@materialjaya.com"
  },
  "address": "Jl. Industri Raya No. 123, Jakarta Utara",
  "materials": [1, 2, 3],
  "rating": 4.5,
  "status_supplier": "active",
  "documents": {
    "npwp": "123456789012345678",
    "siup": "SIUP-123-456-789",
    "akta": "AKTA-001"
  },
  "notes": "Supplier terpercaya untuk material bangunan"
}
```

---

### 4. Material API (`api::material.material`)

#### Base URL

```
/content-manager/collection-types/api::material.material
```

#### Endpoints

| Method | Endpoint                                                     | Description             |
| ------ | ------------------------------------------------------------ | ----------------------- |
| GET    | `/content-manager/collection-types/api::material.material`   | Get all materials       |
| GET    | `/content-manager/collection-types/api::material.material/:id` | Get material by ID      |
| POST   | `/content-manager/collection-types/api::material.material`   | Create new material     |
| PUT    | `/content-manager/collection-types/api::material.material/:id` | Update material         |
| DELETE | `/content-manager/collection-types/api::material.material/:id` | Delete material         |

#### Request Examples

**Create Material:**

```json
POST /content-manager/collection-types/api::material.material
Content-Type: application/json

{
  "kode_material": "MAT-001",
  "nama_material": "Semen Portland",
  "kategori": "Material Bangunan",
  "satuan": "sak",
  "harga_satuan": 75000,
  "suppliers": [1],
  "stok": 500,
  "minimum_stock": 50,
  "lokasi_gudang": "Gudang A",
  "deskripsi": "Semen Portland kualitas tinggi untuk konstruksi",
  "spesifikasi": "Berat: 50kg, Kekuatan: 32.5 MPa"
}
```

---

## Relations

### Purchase Order Relations

- `supplier` (Many-to-One) → Supplier (stores supplier ID)
- `materials` (Many-to-Many) → Material (API returns as `materials`, form sends as `items`)

### Purchase Request Relations

- `proyek` (Many-to-One) → Proyek Perumahan
- `supplier_id` (Many-to-One) → Supplier

### Supplier Relations

- `materials` (Many-to-Many) → Material
- `purchase_orders` (One-to-Many) → Purchase Order
- `evaluations` (One-to-Many) → Supplier Evaluation

### Material Relations

- `suppliers` (Many-to-Many) → Supplier

**Important Field Mapping Notes:**
- API Response uses: `poNumber`, `date`, `materials`, `totalAmount`, `notes`
- Gudang Form sends: `kode`, `tanggal`, `items`, `total_amount`, `notes`
- Materials Form sends: `nomor_po`, `tanggal_order`, `materials`, different structure
- Validation Schema expects: `kode_po`, `tanggal_po`, `harga_satuan`, `total_harga`, `catatan`

## Data Flow & Workflow

### Purchase Request to Purchase Order Flow

1. **Purchase Request Creation**
   - User membuat purchase request dengan status `submitted`
   - System menghasilkan PR number otomatis
   - Request ditujukan untuk proyek atau gudang

2. **Purchase Request Approval**
   - Status berubah menjadi `approved`
   - Purchase request dapat diproses menjadi purchase order

3. **Purchase Order Creation**
   - Berdasarkan approved purchase request
   - System menghasilkan PO code otomatis
   - Status awal: `draft`

4. **Purchase Order Processing**
   - Status berubah menjadi `dikirim` ketika dikirim ke supplier
   - Status `diterima_sebagian` untuk pengiriman parsial
   - Status `diterima` untuk pengiriman lengkap
   - Status `dibatalkan` untuk pembatalan

### Status Mapping

**Purchase Request Status:**
- `submitted` - Diajukan
- `approved` - Disetujui
- `processed` - Diproses (sudah dibuatkan PO)
- `completed` - Selesai
- `rejected` - Ditolak

**Purchase Order Status:**
- `draft` - Draft
- `dikirim` - Dikirim ke supplier
- `diterima_sebagian` - Diterima sebagian
- `diterima` - Diterima lengkap
- `dibatalkan` - Dibatalkan

**Purchase Order Payment Status:**
- `pending` - Menunggu pembayaran
- `partial` - Pembayaran sebagian
- `paid` - Lunas
- `overdue` - Terlambat bayar
- `cancelled` - Dibatalkan

**Purchase Order Delivery Status:**
- `pending` - Menunggu pengiriman
- `processing` - Sedang disiapkan
- `shipped` - Dikirim
- `partial_delivered` - Diterima sebagian
- `delivered` - Diterima lengkap
- `returned` - Dikembalikan

**Purchase Order Price Status:**
- `standard` - Harga standar
- `negotiated` - Harga negosiasi
- `promo` - Harga promo
- `special` - Harga khusus
- `emergency` - Harga darurat

**Purchase Order Quality Status:**
- `pending` - Menunggu inspeksi
- `passed` - Lolos QC
- `failed` - Gagal QC
- `conditional` - Diterima dengan syarat
- `rework` - Perlu perbaikan

**Supplier Status:**
- `active` - Aktif
- `inactive` - Tidak aktif
- `blacklist` - Blacklist

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

**Manager Level:**
- Approval untuk purchase request
- Perubahan status purchase order
- Supplier evaluation

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Total harga tidak boleh negatif"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Purchase order not found"
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
?page=1&pageSize=25
```

### Sorting

```
?sort=tanggal_po:desc
?sort=createdAt:desc
```

### Filtering

```
?filters[status][$eq]=draft
?filters[supplier][id][$eq]=1
?filters[tanggal_po][$gte]=2024-01-01
?filters[total_harga][$gte]=1000000
```

### Population (Relations)

```
?populate=supplier
?populate=materials
?populate=*
```

## Utility Functions

### Code Generation

**Generate PO Code:**
```javascript
// Format: PO-YYMMDDXXX
const generatePurchaseOrderCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}${day}${random}`;
};
```

**Generate PR Number:**
```javascript
// Format: PR-YYYY-XXX
const generatePRNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
    return `PR-${year}-${random}`;
};
```

### Currency Formatting

```javascript
// Format currency to Indonesian Rupiah
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return "Rp 0";

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
```

### Date Formatting

```javascript
// Format date for display
const formatDate = (date) => {
    if (!date) return "-";

    try {
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    } catch (error) {
        return "-";
    }
};

// Format date for input field
const formatDateForInput = (date) => {
    if (!date) return "";

    try {
        return new Date(date).toISOString().split('T')[0];
    } catch (error) {
        return "";
    }
};
```

### Status Color Helper

```javascript
// Get status color for badges
const getPurchaseOrderStatusColor = (status) => {
    switch (status) {
        case "draft":
            return "bg-gray-100 text-gray-800";
        case "dikirim":
            return "bg-blue-100 text-blue-800";
        case "diterima_sebagian":
            return "bg-amber-100 text-amber-800";
        case "diterima":
            return "bg-green-100 text-green-800";
        case "dibatalkan":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
```

## Validation Rules

### Purchase Order Validation

**Schema Validation (suppliersValidation.js):**
- `kode_po` - Required, max 20 characters (❌ Form uses `kode`)
- `supplier` - Required, must be valid supplier ID (✅ Matches)
- `tanggal_po` - Required, valid date (❌ Form uses `tanggal`)
- `tanggal_pengiriman` - Required, valid date (❌ Not used in current form)
- `items` - Required, min 1 item with structure:
  - `material` - Required, material ID
  - `jumlah` - Required, min 1, max 10000 (✅ Matches form)
  - `harga_satuan` - Required, min 0 (❌ Form uses `harga`)
  - `total` - Required, min 0 (❌ Form calculates `subtotal`)
- `total_harga` - Required, min 0 (❌ Form uses `total_amount`)
- `status_po` - Required, one of: `draft`, `dikirim`, `diterima_sebagian`, `diterima`, `dibatalkan`
- `catatan` - Optional, max 500 characters (❌ Form uses `notes`)

**Actual Form Fields (Gudang Module):**
- `kode` - PO code (auto-generated)
- `tanggal` - PO date
- `supplier` - Supplier ID
- `status_po` - PO status
- `status_payment` - Payment status (optional)
- `status_delivery` - Delivery status (optional)
- `status_price` - Price status (optional)
- `notes` - Notes field
- `items` - Array with: `material`, `jumlah`, `harga`
- `total_amount` - Calculated total

**Actual Form Fields (Materials Module):**
- `nomor_po` - PO number
- `supplier` - Supplier name (string)
- `tanggal_order` - Order date
- `tanggal_estimasi_delivery` - Estimated delivery date
- `status_po` - PO status
- `status_payment` - Payment status (optional)
- `status_delivery` - Delivery status (optional)
- `status_quality` - Quality status (optional)
- `catatan` - Notes
- `materials` - Array with: `material`, `quantity`, `unit_price`, `total_price`

### Purchase Request Validation

- `pr_number` - Required, unique
- `requester` - Required, max 50 characters
- `material_name` - Required, max 100 characters
- `quantity` - Required, min 1
- `unit_price` - Required, min 0
- `needed_date` - Required, valid date
- `priority` - Required, one of: `low`, `normal`, `high`, `urgent`
- `status_purchase` - Required, one of: `submitted`, `approved`, `processed`, `completed`, `rejected`

### Supplier Validation

- `code` - Required, unique, format: `SUP-XXX`
- `name` - Required, max 100 characters
- `type` - Required, one of: `Perusahaan`, `Individu`
- `contact.name` - Required, max 50 characters
- `contact.phone` - Required, valid phone format
- `contact.email` - Required, valid email format
- `address` - Required, max 500 characters
- `status_supplier` - Required, one of: `active`, `inactive`, `blacklist`

## Testing Examples

### Test Purchase Order Creation (Gudang Module)

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::purchase-order.purchase-order' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "kode": "PO-2409001",
    "tanggal": "2024-01-15",
    "supplier": 1,
    "status_po": "draft",
    "status_payment": "pending",
    "status_delivery": "pending",
    "status_price": "standard",
    "notes": "Test purchase order",
    "items": [
      {
        "material": 1,
        "jumlah": 50,
        "harga": 150000
      }
    ],
    "total_amount": 7500000
  }'
```

### Test Purchase Order Creation (Materials Module)

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::purchase-order.purchase-order' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nomor_po": "PO-2409001",
    "supplier": "PT. Material Jaya Abadi",
    "tanggal_order": "2024-01-15",
    "tanggal_estimasi_delivery": "2024-01-20",
    "status_po": "draft",
    "status_payment": "pending",
    "status_delivery": "pending",
    "status_quality": "pending",
    "catatan": "Test purchase order",
    "materials": [
      {
        "material": "material-document-id-1",
        "quantity": 50,
        "unit_price": 150000,
        "total_price": 7500000
      }
    ]
  }'
```

### Test Purchase Request Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::purchase-request.purchase-request' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "pr_number": "PR-2024-001",
    "request_date": "2024-01-15",
    "requester": "John Doe",
    "request_type": "Proyek",
    "material_name": "Semen Portland",
    "quantity": 100,
    "unit": "sak",
    "unit_price": 75000,
    "total_price": 7500000,
    "needed_date": "2024-01-25",
    "priority": "normal",
    "status_purchase": "submitted",
    "proyek": 1,
    "supplier_id": 1,
    "notes": "Test purchase request"
  }'
```

---

## ✅ Implementation Status

**Schema Implementation:**
All collection types have been successfully implemented with support for multiple field naming conventions to handle inconsistencies:

1. **Purchase Order Schema (`api::purchase-order.purchase-order`):**
   - Primary fields: `kode_po`, `tanggal_po`, `total_harga`, `catatan`
   - Alternative fields for backward compatibility: `kode`, `nomor_po`, `poNumber`, `tanggal`, `tanggal_order`, `date`, `total_amount`, `totalAmount`, `notes`
   - Complete status management: `status_po`, `status_payment`, `status_delivery`, `status_price`, `status_quality`
   - Auto-generation support through lifecycle hooks

2. **Purchase Request Schema (`api::purchase-request.purchase-request`):**
   - All required fields implemented: `pr_number`, `unit_price`, `total_price`
   - Status workflow: `submitted`, `approved`, `processed`, `completed`, `rejected`
   - Priority levels: `low`, `normal`, `high`, `urgent`
   - Relations to projects and suppliers

3. **Material Item Component (`shared.material-item`):**
   - Supports multiple field variations: `jumlah/quantity`, `harga/harga_satuan/unit_price/price`
   - Material relation linking
   - Price calculation support

4. **Supplier and Material Schemas:**
   - Existing schemas verified and confirmed to match requirements
   - All relations properly configured

**Lifecycle Hooks Implementation:**
- **Auto-code generation**: PO codes (PO-YYMMDDXXX) and PR numbers (PR-YYYY-XXX)
- **Total amount calculation**: Automatic calculation based on items
- **Default value setting**: Automatic assignment of dates and status defaults
- **Status workflow handling**: Automatic status updates for approval workflows

**API Structure:**
- Standard Strapi content-manager endpoints available
- Draft and publish disabled (`draftAndPublish = false`)
- All relationships properly configured
- Field mapping handled at schema level for maximum compatibility

**Field Mapping Resolution:**
The implementation supports all field naming conventions mentioned in the documentation:
- Gudang module fields (`kode`, `tanggal`, `harga`, `total_amount`, `notes`)
- Materials module fields (`nomor_po`, `tanggal_order`, `unit_price`)
- API response fields (`poNumber`, `date`, `materials`, `totalAmount`)
- Validation schema fields (`kode_po`, `tanggal_po`, `harga_satuan`, `total_harga`, `catatan`)

**Ready for Production:**
The system is now ready for production use with consistent data structure and support for multiple frontend implementations.