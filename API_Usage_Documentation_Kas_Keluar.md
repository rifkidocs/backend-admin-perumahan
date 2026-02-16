# API Usage Documentation - Kas Keluar (Cash Out) System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Kas Keluar (Pengeluaran Kas). Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel. Sistem ini mengelola semua pengeluaran kas termasuk pembayaran supplier, gaji tukang, biaya operasional, dan biaya legal.

## Content Types API Endpoints

### 1. Kas Keluar API (`api::kas-keluar.kas-keluar`)

#### Base URL

```
/content-manager/collection-types/api::kas-keluar.kas-keluar
```

#### Standard Endpoints

| Method | Endpoint                                                                       | Description                 |
| ------ | ------------------------------------------------------------------------------ | --------------------------- |
| GET    | `/content-manager/collection-types/api::kas-keluar.kas-keluar`                 | Get all cash out records    |
| GET    | `/content-manager/collection-types/api::kas-keluar.kas-keluar/:id`              | Get cash out record by ID   |
| POST   | `/content-manager/collection-types/api::kas-keluar.kas-keluar`                 | Create new cash out record  |
| PUT    | `/content-manager/collection-types/api::kas-keluar.kas-keluar/:id`              | Update cash out record      |
| DELETE | `/content-manager/collection-types/api::kas-keluar.kas-keluar/:id`              | Delete cash out record      |

#### Custom Endpoints

| Method | Endpoint                                                                       | Description                     |
| ------ | ------------------------------------------------------------------------------ | ------------------------------- |
| POST   | `/content-manager/collection-types/api::kas-keluar.kas-keluar/batch-approval`   | Batch approve/reject transactions|
| GET    | `/content-manager/collection-types/api::kas-keluar.kas-keluar/category-report`   | Get expense reports by category  |
| GET    | `/content-manager/collection-types/api::kas-keluar.kas-keluar/urgent-transactions` | Get pending urgent transactions|
| GET    | `/content-manager/collection-types/api::kas-keluar.kas-keluar/cash-flow-summary`  | Get cash flow reports           |
| GET    | `/content-manager/collection-types/api::kas-keluar.kas-keluar/check-duplicate-invoice` | Check duplicate invoice numbers |

## Request Examples

### Create Cash Out Record - Material Purchase

```json
POST /content-manager/collection-types/api::kas-keluar.kas-keluar
Content-Type: application/json

{
  "date": "2024-01-10",
  "category": "material",
  "amount": 25000000,
  "supplier": "supplier_document_id",
  "project": "project_document_id",
  "description": "Pembelian semen dan batu bata untuk proyek A",
  "paymentMethod": "transfer",
  "invoiceNumber": "INV-2024-001",
  "notes": "Pembayaran sesuai PO #123",
  "approval_status": "pending",
  "createdBy": "employee_document_id",
  "department": "project"
}
```

### Create Cash Out Record - Salary Payment

```json
POST /content-manager/collection-types/api::kas-keluar.kas-keluar
Content-Type: application/json

{
  "date": "2024-01-09",
  "category": "gaji",
  "amount": 15000000,
  "supplier": "supplier_document_id",
  "project": "project_document_id",
  "description": "Gaji tukang bulan Januari 2024",
  "paymentMethod": "cash",
  "invoiceNumber": "SLIP-2024-001",
  "notes": "Gaji harian 20 tukang x 25 hari x Rp 30.000",
  "approval_status": "pending",
  "createdBy": "employee_document_id",
  "department": "hrm"
}
```

### Create Urgent Cash Out Request

```json
POST /content-manager/collection-types/api::kas-keluar.kas-keluar
Content-Type: application/json

{
  "date": "2024-01-08",
  "category": "operasional",
  "amount": 5000000,
  "supplier": "supplier_document_id",
  "project": null,
  "description": "BBM darurat untuk kendaraan operasional",
  "paymentMethod": "transfer",
  "invoiceNumber": "URGENT-2024-001",
  "notes": "BBM dibutuhkan segera untuk kelanjutan proyek",
  "approval_status": "pending",
  "urgent": true,
  "department": "project",
  "createdBy": "employee_document_id"
}
```

### Update Cash Out Record Status

```json
PUT /content-manager/collection-types/api::kas-keluar.kas-keluar/1
Content-Type: application/json

{
  "approval_status": "approved",
  "approvedBy": "manager_document_id",
  "notes": "Pembayaran telah disetujui oleh manager keuangan"
}
```

### Batch Approval

```json
POST /content-manager/collection-types/api::kas-keluar.kas-keluar/batch-approval
Content-Type: application/json

{
  "ids": [1, 3, 5],
  "approval_status": "approved",
  "approvedBy": "manager_document_id",
  "notes": "Batch approval untuk material proyek A"
}
```

---

## Schema JSON

### Kas Keluar Schema

```json
{
  "kind": "collectionType",
  "collectionName": "kas_keluars",
  "info": {
    "singularName": "kas-keluar",
    "pluralName": "kas-keluars",
    "displayName": "Kas Keluar",
    "description": "Cash out management system for all expense transactions"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true,
      "description": "Tanggal transaksi pengeluaran"
    },
    "category": {
      "type": "enumeration",
      "enum": ["material", "gaji", "operasional", "legal", "lainnya"],
      "required": true,
      "description": "Kategori pengeluaran"
    },
    "amount": {
      "type": "integer",
      "required": true,
      "min": 1000,
      "max": 9999999999,
      "description": "Jumlah pengeluaran dalam Rupiah"
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "kas_keluars",
      "required": true,
      "description": "Supplier atau vendor"
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "kas_keluars",
      "nullable": true,
      "description": "Proyek terkait (opsional)"
    },
    "description": {
      "type": "string",
      "required": true,
      "minLength": 10,
      "maxLength": 500,
      "description": "Deskripsi lengkap pengeluaran"
    },
    "paymentMethod": {
      "type": "enumeration",
      "enum": ["transfer", "cash", "cek", "giro", "escrow"],
      "required": true,
      "description": "Metode pembayaran yang digunakan"
    },
    "invoiceNumber": {
      "type": "string",
      "maxLength": 50,
      "unique": true,
      "nullable": true,
      "description": "Nomor invoice atau dokumen referensi"
    },
    "notes": {
      "type": "text",
      "maxLength": 1000,
      "nullable": true,
      "description": "Catatan tambahan mengenai transaksi"
    },
    "approval_status": {
      "type": "enumeration",
      "enum": ["pending", "approved", "rejected"],
      "required": true,
      "default": "pending",
      "description": "Status persetujuan transaksi"
    },
    "createdBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "kas_keluars_created",
      "required": true,
      "description": "Karyawan yang membuat transaksi"
    },
    "approvedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "kas_keluars_approved",
      "nullable": true,
      "description": "Manager yang menyetujui transaksi"
    },
    "approvedAt": {
      "type": "datetime",
      "nullable": true,
      "description": "Tanggal dan waktu persetujuan"
    },
    "attachment": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files"],
      "description": "Dokumen pendukung (invoice, kwitansi, dll)"
    },
    "bankAccount": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::pos-keuangan.pos-keuangan",
      "inversedBy": "kas_keluars",
      "nullable": true,
      "description": "Rekening bank yang digunakan untuk pembayaran"
    },
    "department": {
      "type": "enumeration",
      "enum": ["keuangan", "gudang", "hrm", "project", "marketing"],
      "nullable": true,
      "description": "Departemen terkait pengeluaran"
    },
    "urgent": {
      "type": "boolean",
      "default": false,
      "description": "Status urgent untuk prioritas persetujuan"
    },
    "referenceDocument": {
      "type": "string",
      "maxLength": 100,
      "nullable": true,
      "description": "Nomor dokumen referensi terkait (PO, SPK, dll)"
    }
  }
}
```

### Bank Account Schema

```json
{
  "kind": "collectionType",
  "collectionName": "bank_accounts",
  "info": {
    "singularName": "pos-keuangan",
    "pluralName": "pos-keuangans",
    "displayName": "Bank Account",
    "description": "Bank account management for payment processing"
  },
  "attributes": {
    "nama_bank": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "nomor_rekening": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 50
    },
    "nama_pemilik": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "cabang": {
      "type": "string",
      "maxLength": 100
    },
    "jenis_rekening": {
      "type": "enumeration",
      "enum": ["giro", "tabungan", "deposito", "elektronik"],
      "default": "tabungan"
    },
    "mata_uang": {
      "type": "enumeration",
      "enum": ["IDR", "USD", "EUR"],
      "default": "IDR"
    },
    "saldo_minimum": {
      "type": "decimal"
    },
    "status_aktif": {
      "type": "boolean",
      "default": true
    },
    "deskripsi": {
      "type": "text",
      "maxLength": 500
    }
  }
}
```

---

## Relations

### Kas Keluar Relations

- `project` (Many-to-One) → Project Management (Proyek Perumahan)
- `supplier` (Many-to-One) → Supplier Management (Supplier)
- `createdBy` (Many-to-One) → Employee Management (Karyawan)
- `approvedBy` (Many-to-One) → Employee Management (Manager/Supervisor)
- `attachment` (Media) → Strapi Upload Files
- `bankAccount` (Many-to-One) → Bank Account Management

### Bank Account Relations
- `kas_keluars` (One-to-Many) ← Kas Keluar

### Supplier Relations
- `kas_keluars` (One-to-Many) ← Kas Keluar

---

## Category Details

### Material
- Pembelian material bangunan
- Pengeluaran terkait proyek konstruksi
- Biasanya terkait dengan Purchase Order

### Gaji/Tukang
- Penggajian harian atau mingguan
- Upah tenaga kerja proyek
- Bonus insentif karyawan

### Operasional
- BBM dan transportasi
- Biaya maintenance kendaraan
- Listrik, air, internet kantor
- ATK dan kebutuhan kantor

### Biaya Legal
- Notaris dan dokumen legal
- Perizinan proyek
- Konsultasi hukum
- Biaya pengurusan sertifikat

### Lainnya
- Pengeluaran tidak terduga
- Donasi atau CSR
- Pengeluaran kategori khusus lainnya

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

**Public (No Access):**
- Tidak ada akses publik untuk data keuangan

**Authenticated (Limited Access):**
- `find` - Get own records only
- `findOne` - Get own record by ID only

**Role-Based Access:**

- **Admin**: Full access to all operations
- **Keuangan**: Create, read, update cash out records
- **Manager**: Read access with approval capabilities
- **Gudang**: Create cash out requests for material purchases
- **HRM**: Create salary payment records

### Approval Workflow

1. **Draft**: Status otomatis `pending` saat dibuat
2. **Review**: Manager review dan approve/reject
3. **Approved**: Transaksi disetujui dan dapat diproses
4. **Rejected**: Transaksi ditolak dengan alasan

---

## Custom API Endpoints Details

### Batch Approval

**Endpoint:** `POST /batch-approval`

**Request:**
```json
{
  "ids": [1, 2, 3],
  "approval_status": "approved",
  "approvedBy": "manager_document_id",
  "notes": "Optional notes for batch approval"
}
```

**Response:**
```json
{
  "data": [
    { "id": 1, "approval_status": "approved", ... },
    { "id": 3, "approval_status": "approved", ... }
  ],
  "errors": [
    { "id": 2, "error": "Transaction already processed" }
  ],
  "processed": 2,
  "failed": 1
}
```

### Category Report

**Endpoint:** `GET /category-report`

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `status` (optional): Filter by status (default: approved)

**Response:**
```json
{
  "data": {
    "period": { "startDate": "2024-01-01", "endDate": "2024-01-31" },
    "totalTransactions": 45,
    "totalAmount": 250000000,
    "categoryBreakdown": {
      "material": 150000000,
      "gaji": 75000000,
      "operasional": 25000000
    },
    "transactions": [...]
  }
}
```

### Urgent Transactions

**Endpoint:** `GET /urgent-transactions`

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "date": "2024-01-10",
      "category": "material",
      "amount": 15000000,
      "urgent": true,
      "approval_status": "pending",
      "createdBy": { ... },
      "project": { ... }
    }
  ]
}
```

### Cash Flow Summary

**Endpoint:** `GET /cash-flow-summary`

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Response:**
```json
{
  "data": {
    "period": { "startDate": "2024-01-01", "endDate": "2024-01-31" },
    "totalCashIn": 500000000,
    "totalCashOut": 250000000,
    "netCashFlow": 250000000,
    "transactions": {
      "in": [...],
      "out": [...]
    }
  }
}
```

### Check Duplicate Invoice

**Endpoint:** `GET /check-duplicate-invoice`

**Query Parameters:**
- `invoiceNumber` (required): Invoice number to check

**Response:**
```json
{
  "data": {
    "exists": true,
    "invoiceNumber": "INV-2024-001",
    "existingRecord": { ... }
  }
}
```

---

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "approval_status": 400,
    "name": "ValidationError",
    "message": "Amount minimal 1.000",
    "details": {
      "amount": "Amount minimal 1.000"
    }
  }
}
```

**Unauthorized Approval (403):**

```json
{
  "error": {
    "approval_status": 403,
    "name": "ForbiddenError",
    "message": "Anda tidak memiliki wewenang untuk menyetujui transaksi ini"
  }
}
```

**Duplicate Invoice Number (409):**

```json
{
  "error": {
    "approval_status": 409,
    "name": "ConflictError",
    "message": "Nomor invoice sudah terdaftar dalam sistem"
  }
}
```

**Batch Processing Error (207):**

```json
{
  "error": {
    "approval_status": 207,
    "name": "MultiStatusError",
    "message": "Some items processed successfully, others failed"
  }
}
```

---

## Query Parameters

### Pagination

```
?page=1&pageSize=25
```

### Sorting

```
?sort=date:desc
?sort=amount:desc
?sort=createdAt:asc
```

### Filtering

```
?filters[approval_status][$eq]=pending
?filters[category][$eq]=material
?filters[project][documentId][$eq]=project_id
?filters[supplier][documentId][$eq]=supplier_id
?filters[date][$gte]=2024-01-01
?filters[date][$lte]=2024-01-31
?filters[amount][$gte]=10000000
?filters[urgent][$eq]=true
?filters[department][$eq]=keuangan
```

### Population (Relations)

```
?populate=*
?populate[0]=project&populate[1]=createdBy
?populate[0]=approvedBy&populate[1]=attachment
?populate[0]=project&populate[1]=supplier&populate[2]=createdBy&populate[3]=approvedBy&populate[4]=bankAccount
```

### Advanced Search

```
?filters[$or][0][supplier][$containsi]=PT%20Mandiri
?filters[$or][1][description][$containsi]=semen
?filters[$or][2][invoiceNumber][$containsi]=INV-001
```

---

## Usage Examples

### Get Cash Out Reports by Category

```javascript
const startDate = "2024-01-01";
const endDate = "2024-01-31";

// Using custom endpoint
const response = await api.get(
  "/content-manager/collection-types/api::kas-keluar.kas-keluar/category-report",
  {
    params: {
      startDate,
      endDate,
      status: "approved"
    }
  }
);

console.log(response.data);
```

### Get Urgent Transactions for Approval

```javascript
const urgentExpenses = await api.get(
  "/content-manager/collection-types/api::kas-keluar.kas-keluar/urgent-transactions"
);

// Process urgent expenses
if (urgentExpenses.data.length > 0) {
  console.log(`${urgentExpenses.data.length} urgent transactions need approval`);
}
```

### Generate Monthly Cash Flow Report

```javascript
const generateMonthlyReport = async (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const response = await api.get(
    "/content-manager/collection-types/api::kas-keluar.kas-keluar/cash-flow-summary",
    {
      params: { startDate, endDate }
    }
  );

  return response.data;
};
```

### File Upload with Cash Out Record

```javascript
// Step 1: Upload supporting document
const formData = new FormData();
formData.append("files", documentFile);
formData.append(
  "fileInfo",
  JSON.stringify({
    name: `invoice_${Date.now()}.pdf`,
    caption: "Invoice pembayaran material"
  })
);

const uploadResponse = await api.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

const attachmentId = uploadResponse.data[0]?.id;

// Step 2: Create cash out record with attachment
const expenseData = {
  date: "2024-01-10",
  category: "material",
  amount: 25000000,
  supplier: "CV Supplier Jaya",
  description: "Pembelian material proyek",
  paymentMethod: "transfer",
  invoiceNumber: `INV-${Date.now()}`,
  attachment: attachmentId,
  status: "pending",
  createdBy: "employee_document_id",
  department: "project"
};

const response = await api.post(
  "/content-manager/collection-types/api::kas-keluar.kas-keluar",
  expenseData
);
```

### Check Duplicate Invoice Before Creation

```javascript
const invoiceNumber = "INV-2024-001";

// Check if invoice exists
const checkResponse = await api.get(
  "/content-manager/collection-types/api::kas-keluar.kas-keluar/check-duplicate-invoice",
  {
    params: { invoiceNumber }
  }
);

if (checkResponse.data.exists) {
  throw new Error("Invoice number already exists");
}

// Proceed with creation if invoice doesn't exist
```

---

## Best Practices

1. **Always validate amount** - Ensure amounts are realistic and within budget limits
2. **Use proper category** - Categorize expenses correctly for accurate reporting
3. **Attach supporting documents** - Always upload invoices, receipts, or purchase orders
4. **Implement approval workflow** - Follow proper approval hierarchy for expenses
5. **Use unique invoice numbers** - Prevent duplicate transactions
6. **Regular reconciliation** - Reconcile cash out records with bank statements
7. **Budget monitoring** - Track expenses against budget allocations
8. **Emergency procedures** - Have workflow for urgent expenses requiring immediate payment
9. **Audit trail** - Maintain complete audit trail for compliance and accountability
10. **Security** - Implement proper access controls for financial data

---

## Testing Examples

### Test Cash Out Record Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::kas-keluar.kas-keluar' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "date": "2024-01-10",
    "category": "material",
    "amount": 10000000,
    "supplier": "supplier_document_id",
    "project": "project_document_id",
    "description": "Pembelian material test",
    "paymentMethod": "transfer",
    "invoiceNumber": "TEST-001",
    "notes": "Test expense creation",
    "approval_status": "pending",
    "createdBy": "employee_document_id"
  }'
```

### Test Batch Approval

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::kas-keluar.kas-keluar/batch-approval' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "ids": [1, 2, 3],
    "approval_status": "approved",
    "approvedBy": "manager_document_id",
    "notes": "Batch approval test"
  }'
```

### Test Category Report

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::kas-keluar.kas-keluar/category-report?startDate=2024-01-01&endDate=2024-01-31&status=approved' \
  -H 'Authorization: Bearer <token>'
```

### Test Advanced Filtering

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::kas-keluar.kas-keluar?filters[approval_status][$eq]=approved&filters[category][$eq]=material&filters[date][$gte]=2024-01-01&populate=project&populate=supplier&populate=createdBy&sort=date:desc&page=1&pageSize=50' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Gunakan format document ID untuk relasi antar content types. Sistem Kas Keluar ini terintegrasi dengan sistem kas masuk untuk pelaporan cash flow yang lengkap.