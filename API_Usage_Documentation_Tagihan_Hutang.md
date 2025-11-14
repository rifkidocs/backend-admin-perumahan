# API Usage Documentation - Tagihan & Hutang System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Tagihan & Hutang. Sistem ini menggunakan collection type `payment-invoice` yang sudah dimodifikasi untuk mengelola invoice dari supplier dengan tracking pembayaran lengkap.

## Architecture

### Single Collection Type, Dual Interfaces

- **Collection Type**: `payment-invoice` (satu database untuk semua data)
- **Purchasing Interface**: `/purchasing/payment-invoice` - Create dan manage invoices
- **Keuangan Interface**: `/keuangan/tagihan-hutang` - Process payments dan approval

## Content Types API Endpoints

### 1. Tagihan Hutang API (`api::payment-invoice.payment-invoice`)

#### Base URL

```
/api/payment-invoices
```

#### Standard CRUD Endpoints

| Method | Endpoint                               | Description                  |
| ------ | -------------------------------------- | ---------------------------- |
| GET    | `/api/payment-invoices`                | Get all invoice records      |
| GET    | `/api/payment-invoices/:id`            | Get invoice record by ID     |
| POST   | `/api/payment-invoices`                | Create new invoice record    |
| PUT    | `/api/payment-invoices/:id`            | Update invoice record        |
| DELETE | `/api/payment-invoices/:id`            | Delete invoice record        |

#### Custom Endpoints

| Method | Endpoint                                     | Description                         |
| ------ | -------------------------------------------- | ----------------------------------- |
| GET    | `/api/payment-invoices/overdue`              | Get overdue invoices                 |
| PUT    | `/api/payment-invoices/:id/update-payment`   | Update payment status                |
| GET    | `/api/payment-invoices/supplier/:supplierId` | Get invoices by supplier            |
| GET    | `/api/payment-invoices/project/:projectId`   | Get invoices by project             |
| GET    | `/api/payment-invoices/status/:status`       | Get invoices by status              |
| GET    | `/api/payment-invoices/summary`              | Get payment summary statistics      |
| PUT    | `/api/payment-invoices/:id/approve`          | Approve invoice                    |
| PUT    | `/api/payment-invoices/:id/cancel`           | Cancel invoice                     |

## Request Examples

### Create New Invoice (Purchasing)

```json
POST /api/payment-invoices
Content-Type: application/json

{
  "invoiceNumber": "INV-2024-11-001",
  "supplier": "supplier_document_id",
  "amount": 25000000,
  "dueDate": "2024-12-15",
  "description": "Pembelian semen dan batu bata",
  "category": "material",
  "project": "project_document_id",
  "paymentTerms": "net30",
  "notes": "Pembayaran sesuai PO",
  "department": "gudang"
}
```

### Update Payment Status (Keuangan)

```json
PUT /api/payment-invoices/1/update-payment
Content-Type: application/json

{
  "paymentData": {
    "paidAmount": 15000000,
    "paymentMethod": "transfer",
    "paymentEntry": {
      "date": "2024-11-10",
      "amount": 15000000,
      "method": "transfer",
      "reference": "TRF001",
      "bankAccount": "BCA 1234567890",
      "paidBy": "employee_document_id",
      "notes": "Pembayaran termin pertama"
    }
  }
}
```

### Approve Invoice (Keuangan)

```json
PUT /api/payment-invoices/1/approve
Content-Type: application/json

{
  "approvedBy": "manager_document_id"
}
```

### Cancel Invoice

```json
PUT /api/payment-invoices/1/cancel
Content-Type: application/json

{
  "reason": "Duplicate invoice"
}
```

---

## Schema

### Tagihan Hutang Schema

```json
{
  "kind": "collectionType",
  "collectionName": "payment_invoices",
  "info": {
    "singularName": "payment-invoice",
    "pluralName": "payment-invoices",
    "displayName": "Tagihan & Hutang",
    "description": "Accounts payable management system for supplier invoices and payment tracking"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "invoiceNumber": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 50
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "payment_invoices"
    },
    "amount": {
      "type": "decimal",
      "required": true,
      "min": 0.01,
      "max": 999999999
    },
    "dueDate": {
      "type": "date",
      "required": true
    },
    "description": {
      "type": "text",
      "required": true,
      "minLength": 10,
      "maxLength": 1000
    },
    "category": {
      "type": "enumeration",
      "required": true,
      "enum": ["material", "jasa", "operasional", "legal", "lainnya"]
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "payment_invoices"
    },
    "paymentTerms": {
      "type": "enumeration",
      "required": true,
      "enum": ["cash", "dp", "termin", "net30", "net60"]
    },
    "notes": {
      "type": "text",
      "maxLength": 2000
    },
    "status_pembayaran": {
      "type": "enumeration",
      "required": true,
      "default": "pending",
      "enum": ["pending", "partial", "paid", "overdue", "cancelled"]
    },
    "paidAmount": {
      "type": "decimal",
      "required": true,
      "default": 0,
      "min": 0
    },
    "remainingAmount": {
      "type": "decimal",
      "required": true,
      "min": 0
    },
    "paymentHistory": {
      "type": "json",
      "default": []
    },
    "invoiceDocument": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files"]
    },
    "approvedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "approved_payables"
    },
    "approvedDate": {
      "type": "datetime"
    },
    "paymentMethod": {
      "type": "enumeration",
      "enum": ["transfer", "cash", "check", "giro", "others"]
    },
    "bankAccount": {
      "type": "string",
      "maxLength": 100
    },
    "lastPaymentDate": {
      "type": "datetime"
    },
    "fullyPaidDate": {
      "type": "datetime"
    },
    "overdueNotified": {
      "type": "boolean",
      "default": false
    },
    "priority": {
      "type": "enumeration",
      "default": "normal",
      "enum": ["low", "normal", "high", "urgent"]
    },
    "taxIncluded": {
      "type": "boolean",
      "default": false
    },
    "taxAmount": {
      "type": "decimal",
      "min": 0
    },
    "discountAmount": {
      "type": "decimal",
      "min": 0
    },
    "penaltyAmount": {
      "type": "decimal",
      "default": 0,
      "min": 0
    },
    "referenceNumber": {
      "type": "string",
      "maxLength": 50
    },
    "department": {
      "type": "enumeration",
      "enum": ["gudang", "proyek", "hrm", "marketing", "operasional", "umum"]
    },
    "createdBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "created_payables"
    }
  }
}
```

---

## Relations

### Payment Invoice Relations

- `supplier` (Many-to-One) → Supplier Management
- `project` (Many-to-One) → Project Management
- `approvedBy` (Many-to-One) → Employee Management (Approver)
- `createdBy` (Many-to-One) → Employee Management (Creator)
- `invoiceDocument` (Media) → Strapi Upload Files

### Payment History Schema

The `paymentHistory` field contains an array of payment objects:

```json
{
  "date": "2024-11-10",
  "amount": 15000000,
  "method": "transfer",
  "reference": "TRF001",
  "bankAccount": "BCA 1234567890",
  "paidBy": "employee_document_id",
  "notes": "Pembayaran termin pertama",
  "receiptDocument": "media_document_id"
}
```

## Authentication

### Required Headers

```json
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
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
?sort=dueDate:asc
?sort=amount:desc
?sort=createdAt:desc
```

### Filtering

```
?filters[status_pembayaran][$eq]=pending
?filters[supplier][documentId][$eq]=supplier_id
?filters[category][$eq]=material
?filters[dueDate][$gte]=2024-11-01
?filters[dueDate][$lte]=2024-11-30
?filters[project][documentId][$eq]=project_id
?filters[paymentTerms][$eq]=net30
```

### Advanced Filtering

```
?filters[$and][0][status_pembayaran][$eq]=pending
?filters[$and][1][dueDate][$lte]=2024-11-15
?filters[$or][0][category][$eq]=material
?filters[$or][1][category][$eq]=jasa
```

### Population (Relations)

```
?populate=*
?populate[0]=supplier&populate[1]=project
?populate[0]=supplier&populate[1]=project&populate[2]=approvedBy
```

## Usage Examples

### Get Overdue Invoices

```javascript
const response = await api.get('/api/payment-invoices/overdue');
```

### Get Payment Summary

```javascript
const params = {
  startDate: "2024-11-01",
  endDate: "2024-11-30",
  supplierId: "supplier_document_id"
};

const response = await api.get('/api/payment-invoices/summary', { params });
```

### Process Payment

```javascript
const paymentData = {
  paymentData: {
    paidAmount: 15000000,
    paymentMethod: "transfer",
    paymentEntry: {
      date: new Date().toISOString().split('T')[0],
      amount: 15000000,
      method: "transfer",
      reference: "TRF001",
      bankAccount: "BCA 1234567890",
      paidBy: "employee_document_id",
      notes: "Pembayaran termin pertama"
    }
  }
};

const response = await api.put(`/api/payment-invoices/${documentId}/update-payment`, paymentData);
```

### File Upload

```javascript
// Upload invoice document
const formData = new FormData();
formData.append("files", invoiceFile);
formData.append("fileInfo", JSON.stringify({
  name: "invoice_001.pdf",
  caption: `Invoice ${invoiceNumber} - ${supplierName}`,
}));

const uploadResponse = await api.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

const fileId = uploadResponse.data[0]?.id;

// Create invoice with document
const invoiceData = {
  invoiceNumber: "INV-2024-11-001",
  supplier: "supplier_document_id",
  amount: 25000000,
  dueDate: "2024-12-15",
  description: "Pembelian semen dan batu bata",
  category: "material",
  invoiceDocument: fileId
};

const response = await api.post("/api/payment-invoices", invoiceData);
```

## Status Workflow

### Payment Status Transitions

1. **pending** → **partial** (Partial payment made)
2. **pending** → **paid** (Full payment made)
3. **partial** → **paid** (Remaining payment completed)
4. **pending** → **cancelled** (Invoice cancelled)
5. **partial** → **cancelled** (Invoice cancelled with refund)

### Automatic Status Updates

- **overdue**: Automatically set when `dueDate` < current date and `status_pembayaran` != 'paid'
- **overdueNotified**: Flag to track if overdue notification has been sent

### Invoice Status Transitions

1. **received** → **verified** (Invoice verified and approved)
2. **received** → **rejected** (Invoice rejected)
3. **verified** → **cancelled** (Verified invoice cancelled)


## Interface Separation

### Purchasing Interface Features

- Create new invoices
- Upload invoice documents
- Edit invoice details
- Submit to finance for approval
- View all invoice statuses
- Export invoice lists

### Keuangan Interface Features

- Review submitted invoices
- Approve/reject invoices
- Process payments
- Update payment statuses
- Track overdue invoices
- Generate payment reports
- Cash flow projections

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Amount harus lebih dari 0",
    "details": {
      "amount": "Amount harus lebih dari 0"
    }
  }
}
```

**Duplicate Invoice Error (409):**

```json
{
  "error": {
    "status": 409,
    "name": "DuplicateError",
    "message": "Invoice number already exists"
  }
}
```

**Payment Exceeds Amount Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "PaymentError",
    "message": "Payment amount exceeds remaining amount"
  }
}
```

## Best Practices

1. **Invoice Numbers**: Use auto-generated format `INV-YYYY-MM-XXX`
2. **Due Dates**: Always validate against invoice date
3. **Payment History**: Maintain detailed transaction records
4. **Document Management**: Upload supporting documents for each invoice
5. **Status Updates**: Use proper status transitions
6. **Data Relations**: Populate related entities to avoid additional API calls
7. **Overdue Management**: Regularly track and update overdue invoices
8. **Category Management**: Use categories for financial reporting
9. **Department Tracking**: Assign invoices to appropriate departments
10. **Approval Workflow**: Maintain clear audit trails

---

**Note**: This system uses a single collection type `payment-invoice` with dual interfaces for Purchasing and Keuangan departments. All data is centralized with different access patterns based on department workflows.