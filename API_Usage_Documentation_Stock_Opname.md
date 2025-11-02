# API Usage Documentation - Stock Opname System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Stock Opname (Pemeriksaan Stok) dengan 2 content types utama. Sistem ini dirancang untuk **Pemeriksaan fisik berkala**, **Input hasil opname (real vs sistem)**, **Selisih & alasan koreksi**, **Foto dokumentasi opname**, dan **Tanggal opname & PIC**.

## Content Types API Endpoints

### 1. Stock Opname API (`api::stock-opname.stock-opname`)

#### Base URL

```
/content-manager/collection-types/api::stock-opname.stock-opname
```

#### Endpoints

| Method | Endpoint                                                               | Description                |
| ------ | ---------------------------------------------------------------------- | -------------------------- |
| GET    | `/content-manager/collection-types/api::stock-opname.stock-opname`     | Get all stock opnames      |
| GET    | `/content-manager/collection-types/api::stock-opname.stock-opname/:id` | Get stock opname by ID     |
| POST   | `/content-manager/collection-types/api::stock-opname.stock-opname`     | Create new stock opname    |
| PUT    | `/content-manager/collection-types/api::stock-opname.stock-opname/:id` | Update stock opname        |
| DELETE | `/content-manager/collection-types/api::stock-opname.stock-opname/:id` | Delete stock opname        |
| GET    | `/content-manager/collection-types/api::stock-opname.stock-opname/:id/generate-report` | Generate stock opname report |

#### Request Examples

**Create Stock Opname:**

```json
POST /content-manager/collection-types/api::stock-opname.stock-opname
Content-Type: application/json

{
  "opname_number": "OP-2024-001",
  "opname_date": "2024-03-20",
  "opname_time": "09:30",
  "location": "Gudang Utama",
  "category": "Struktur",
  "status": "Draft",
  "pic": 1,
  "notes": "Opname rutin bulanan - Pemeriksaan fisik berkala material struktur",
  "document_attachment": ["foto-stock-opname.jpg", "berita-acara-opname.pdf"]
}
```

**Update Stock Opname Status:**

```json
PUT /content-manager/collection-types/api::stock-opname.stock-opname/1
Content-Type: application/json

{
  "status": "In Progress",
  "reviewer": 2,
  "notes": "Sedang proses perhitungan fisik material"
}
```

**Complete Stock Opname:**

```json
PUT /content-manager/collection-types/api::stock-opname.stock-opname/1
Content-Type: application/json

{
  "status": "Completed",
  "reviewer": 2,
  "total_items": 15,
  "total_variance": -7,
  "notes": "Opname selesai, ada 7 unit selisih stok"
}
```

---

### 2. Stock Opname Item API (`api::stock-opname-item.stock-opname-item`)

#### Base URL

```
/content-manager/collection-types/api::stock-opname-item.stock-opname-item
```

#### Endpoints

| Method | Endpoint                                                                         | Description                     |
| ------ | -------------------------------------------------------------------------------- | ------------------------------- |
| GET    | `/content-manager/collection-types/api::stock-opname-item.stock-opname-item`     | Get all stock opname items  |
| GET    | `/content-manager/collection-types/api::stock-opname-item.stock-opname-item/:id` | Get stock opname item by ID |
| POST   | `/content-manager/collection-types/api::stock-opname-item.stock-opname-item`     | Create new stock opname item|
| PUT    | `/content-manager/collection-types/api::stock-opname-item.stock-opname-item/:id` | Update stock opname item    |
| DELETE | `/content-manager/collection-types/api::stock-opname-item.stock-opname-item/:id` | Delete stock opname item    |
| POST   | `/content-manager/collection-types/api::stock-opname-item.stock-opname-item/batch` | Create batch items |

#### Request Examples

**Create Stock Opname Item:**

```json
POST /content-manager/collection-types/api::stock-opname-item.stock-opname-item
Content-Type: application/json

{
  "material_name": "Semen Portland",
  "system_stock": 100,
  "physical_stock": 98,
  "difference": -2,
  "unit": "sak",
  "notes": "2 sak rusak karena kelembaban",
  "stock_opname": 1,
  "material": 5,
  "variance_status": "Short",
  "adjustment_needed": true,
  "adjustment_reason": "Rusak/Tidak Layak Pakai"
}
```

**Create Batch Items:**

```json
POST /content-manager/collection-types/api::stock-opname-item.stock-opname-item/batch
Content-Type: application/json

{
  "items": [
    {
      "material_name": "Semen Portland",
      "system_stock": 100,
      "physical_stock": 98,
      "unit": "sak",
      "stock_opname": 1,
      "material": 5,
      "adjustment_reason": "Rusak/Tidak Layak Pakai"
    },
    {
      "material_name": "Batu Bata Merah",
      "system_stock": 5000,
      "physical_stock": 5020,
      "unit": "pcs",
      "stock_opname": 1,
      "material": 8,
      "adjustment_reason": "Kesalahan Input Sistem"
    }
  ]
}
```

**Update Stock Opname Item:**

```json
PUT /content-manager/collection-types/api::stock-opname-item.stock-opname-item/1
Content-Type: application/json

{
  "physical_stock": 95,
  "notes": "5 sak rusak dan tidak bisa digunakan",
  "adjustment_reason": "Rusak/Tidak Layak Pakai"
}
```

---

## Relations

### Stock Opname Relations

- `pic` (One-to-One) → Karyawan (Person In Charge)
- `reviewer` (One-to-One) → Karyawan (Reviewer/Approver)
- `stock_opname_items` (One-to-Many) → Stock Opname Items
- `document_attachment` (Media) → Foto dokumentasi opname

### Stock Opname Item Relations

- `stock_opname` (Many-to-One) → Stock Opname
- `material` (One-to-One) → Material Inventory Master

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

**Warehouse Staff (Limited Access):**

- `create` - Create new stock opname
- `update` - Update stock opname materials
- `find` - View stock opname records

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Physical stock tidak boleh negatif"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Stock opname not found"
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
?sort=opname_date:desc
?sort=createdAt:desc
```

### Filtering

```
?filters[status_opname][$eq]=completed
?filters[location][$eq]=Gudang Utama
?filters[category][$eq]=Struktur
?filters[opname_date][$gte]=2024-01-01
```

### Population (Relations)

```
?populate=project
?populate=warehouse
?populate=materials
?populate=materials.material
?populate=checker
```

## Field Definitions

### Stock Opname Fields

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `opname_number` | String | Yes | Nomor unik stock opname (auto-generated) | "OP-2024-001" |
| `opname_date` | Date | Yes | Tanggal pelaksanaan opname | "2024-03-20" |
| `opname_time` | Time | Yes | Waktu pelaksanaan opname | "09:30" |
| `location` | String | Yes | Lokasi stock opname | "Gudang Utama" |
| `category` | Enum | Yes | Kategori material diperiksa | "Struktur", "Finishing", "MEP", "Alat Bantu", "Semua Kategori" |
| `status` | Enum | Yes | Status opname | "Draft", "In Progress", "Completed", "Reviewed" |
| `pic` | Relation | No | Person In Charge (Karyawan) | 1 |
| `reviewer` | Relation | No | Reviewer/Approver (Karyawan) | 2 |
| `notes` | Text | No | Catatan tambahan | "Opname rutin bulanan" |
| `document_attachment` | Media | No | Foto dokumentasi opname | ["foto-stock.jpg"] |
| `total_items` | Integer | No | Total items diperiksa (auto-calculated) | 15 |
| `total_variance` | Integer | No | Total selisih stok (auto-calculated) | -7 |

### Stock Opname Item Fields

| Field Name | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `material_name` | String | Yes | Nama material | "Semen Portland" |
| `system_stock` | Integer | Yes | Stok sesuai sistem | 100 |
| `physical_stock` | Integer | Yes | Stok fisik hasil hitungan | 98 |
| `difference` | Integer | Auto | Selisih stok (physical - system) | -2 |
| `unit` | String | Yes | Satuan material | "sak", "pcs", "kg" |
| `notes` | Text | No | Catatan untuk material | "2 sak rusak" |
| `stock_opname` | Relation | Yes | ID stock opname terkait | 1 |
| `material` | Relation | No | ID material master | 5 |
| `variance_status` | Enum | Auto | Status selisih | "Match", "Over", "Short" |
| `adjustment_needed` | Boolean | Auto | Perlu penyesuaian stok? | true |
| `adjustment_reason` | Enum | No | Alasan koreksi/selisih | "Rusak/Tidak Layak Pakai", "Hilang/Pencurian", "Kesalahan Input Sistem", "Expired Date", "Transfer Antar Lokasi", "Retur Supplier", "Sample/Display", "Lainnya" |

## Status Definitions

### Stock Opname Status

- **Draft**: Baru dibuat, belum mulai pemeriksaan
- **In Progress**: Sedang dalam proses pemeriksaan fisik
- **Completed**: Pemeriksaan selesai, menunggu review
- **Reviewed**: Sudah direview dan disetujui

### Variance Status

- **Match**: Stok fisik sama dengan sistem
- **Over**: Stok fisik lebih banyak dari sistem
- **Short**: Stok fisik lebih sedikit dari sistem

### Adjustment Reason Categories

- **Rusak/Tidak Layak Pakai**: Material rusak atau tidak bisa digunakan
- **Hilang/Pencurian**: Material hilang atau dicuri
- **Kesalahan Input Sistem**: Salah input data di sistem
- **Expired Date**: Material kedaluwarsa
- **Transfer Antar Lokasi**: Material dipindahkan ke lokasi lain
- **Retur Supplier**: Material dikembalikan ke supplier
- **Sample/Display**: Material digunakan sebagai sample/display
- **Lainnya**: Alasan lainnya (catat di notes)

## Usage Examples

### Complete Stock Opname Workflow

```javascript
// 1. Create Stock Opname (Header)
const createStockOpname = async () => {
  const response = await fetch('/content-manager/collection-types/api::stock-opname.stock-opname', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      opname_date: "2024-03-20",
      opname_time: "09:30",
      location: "Gudang Utama",
      category: "Struktur",
      pic: 1,
      notes: "Opname rutin bulanan - Pemeriksaan fisik berkala material struktur"
    })
  });
  return response.json();
};

// 2. Add Items to Stock Opname
const addStockOpnameItems = async (stockOpnameId) => {
  const items = [
    {
      material_name: "Semen Portland",
      system_stock: 100,
      physical_stock: 98,
      unit: "sak",
      stock_opname: stockOpnameId,
      material: 5,
      adjustment_reason: "Rusak/Tidak Layak Pakai"
    },
    {
      material_name: "Batu Bata Merah",
      system_stock: 5000,
      physical_stock: 5020,
      unit: "pcs",
      stock_opname: stockOpnameId,
      material: 8,
      adjustment_reason: "Kesalahan Input Sistem"
    }
  ];

  const response = await fetch('/content-manager/collection-types/api::stock-opname-item.stock-opname-item/batch', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });
  return response.json();
};

// 3. Complete Stock Opname
const completeStockOpname = async (stockOpnameId) => {
  const response = await fetch(`/content-manager/collection-types/api::stock-opname.stock-opname/${stockOpnameId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer <token>',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: "Completed",
      reviewer: 2
    })
  });
  return response.json();
};
```

### Stock Difference Calculation

```javascript
// System automatically calculates:
// difference = physical_stock - system_stock
// variance_status = "Match" | "Over" | "Short"
// adjustment_needed = difference !== 0

// Manual calculation for validation
const calculateVariance = (systemStock, physicalStock) => {
  const difference = physicalStock - systemStock;

  let varianceStatus = "Match";
  if (difference > 0) {
    varianceStatus = "Over";
  } else if (difference < 0) {
    varianceStatus = "Short";
  }

  return {
    difference,
    varianceStatus,
    adjustmentNeeded: difference !== 0
  };
};
```

### Generate Report

```javascript
// Get comprehensive stock opname report
const generateStockOpnameReport = async (stockOpnameId) => {
  const response = await fetch(`/content-manager/collection-types/api::stock-opname.stock-opname/${stockOpnameId}/generate-report`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer <token>'
    }
  });

  const report = await response.json();

  // Report includes:
  // - Total items checked
  // - Match/Over/Short statistics
  // - Value variance calculations
  // - Detailed item analysis

  return report.data;
};
```

### Variance Analysis

```javascript
// Analyze stock variances for insights
const analyzeVariances = (stockOpnameItems) => {
  const analysis = {
    totalVariances: stockOpnameItems.filter(item => item.difference !== 0).length,
    overages: stockOpnameItems.filter(item => item.difference > 0),
    shortages: stockOpnameItems.filter(item => item.difference < 0),
    reasons: {},
    recommendations: []
  };

  // Group by adjustment reason
  stockOpnameItems.forEach(item => {
    const reason = item.adjustment_reason || 'Unknown';
    analysis.reasons[reason] = (analysis.reasons[reason] || 0) + 1;
  });

  // Generate recommendations
  if (analysis.overages.length > 0) {
    analysis.recommendations.push('Review receiving procedures for overages');
  }
  if (analysis.shortages.length > 0) {
    analysis.recommendations.push('Investigate causes of material shortages');
  }

  return analysis;
};

## Best Practices

1. **Pemeriksaan fisik berkala**: Schedule regular stock checks (daily, weekly, monthly)
2. **Input hasil opname (real vs sistem)**: Always compare physical count with system data
3. **Selisih & alasan koreksi**: Document all discrepancies with specific adjustment reasons
4. **Foto dokumentasi opname**: Upload photos as proof of physical inspection
5. **Tanggal opname & PIC**: Always record date/time and responsible person
6. **Use batch creation** for multiple items to improve efficiency
7. **Generate reports** for variance analysis and insights
8. **Set appropriate approval workflow** with PIC and reviewer roles
9. **Use proper filtering** for historical analysis and trend tracking
10. **Document adjustment reasons** for audit trail and process improvement

## MVP Implementation Status

✅ **Pemeriksaan fisik berkala** - Supported through scheduled opname_date and recurring workflows
✅ **Input hasil opname (real vs sistem)** - System vs physical stock comparison with automatic difference calculation
✅ **Selisih & alasan koreksi** - Comprehensive adjustment reason categories and variance status tracking
✅ **Foto dokumentasi opname** - Media upload support for photos and documents
✅ **Tanggal opname & PIC** - Date/time tracking with assigned person in charge and reviewer

## Testing Examples

### Create Complete Stock Opname

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::stock-opname.stock-opname' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "opname_date": "2024-03-20",
    "opname_time": "09:30",
    "location": "Gudang Utama",
    "category": "Struktur",
    "status": "Draft",
    "pic": 1,
    "notes": "Opname rutin bulanan - Pemeriksaan fisik berkala"
  }'
```

### Add Stock Opname Items

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::stock-opname-item.stock-opname-item/batch' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [
      {
        "material_name": "Semen Portland",
        "system_stock": 100,
        "physical_stock": 98,
        "unit": "sak",
        "stock_opname": 1,
        "material": 5,
        "adjustment_reason": "Rusak/Tidak Layak Pakai"
      }
    ]
  }'
```

### Complete Stock Opname

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::stock-opname.stock-opname/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "Completed",
    "reviewer": 2,
    "notes": "Pemeriksaan selesai, 2 unit variance tercatat"
  }'
```

### Filter Stock Opname by Status

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::stock-opname.stock-opname?filters[status][$eq]=Completed&populate=pic&populate=reviewer&populate=stock_opname_items' \
  -H 'Authorization: Bearer <token>'
```

### Generate Stock Opname Report

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::stock-opname.stock-opname/1/generate-report' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Sistem Stock Opname ini sepenuhnya sesuai dengan MVP requirements:
- ✅ Pemeriksaan fisik berkala (scheduled periodic checks)
- ✅ Input hasil opname real vs sistem (system vs physical stock comparison)
- ✅ Selisih & alasan koreksi (variance tracking with detailed adjustment reasons)
- ✅ Foto dokumentasi opname (media upload support for photos/documents)
- ✅ Tanggal opname & PIC (date/time tracking with person in charge)

System automatically calculates variances, maintains audit trails, and provides comprehensive reporting for inventory management.