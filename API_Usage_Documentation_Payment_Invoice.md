# API Usage Documentation - Payment Invoice System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Payment Invoice yang telah diimplementasikan dalam backend Strapi. Sistem ini merupakan bagian dari alur proses purchasing yang mengelola pembayaran invoice dari supplier dan status pembayaran yang terhubung dengan Purchase Order dan Goods Receipt.

## Business Flow

```
Purchase Request → Purchase Order → Goods Receipt → Payment Invoice
```

1. **Purchase Request**: Pengajuan pembelian material
2. **Purchase Order**: Pemesanan resmi ke supplier
3. **Goods Receipt**: Penerimaan material dari supplier
4. **Payment Invoice**: Pembayaran invoice dari supplier

## Implementation Details

### Collection Type Information

- **Collection Name**: `payment_invoices`
- **API UID**: `api::payment-invoice.payment-invoice`
- **Schema Location**: `src/api/payment-invoice/content-types/payment-invoice/schema.json`
- **Component**: `payment-invoice.invoice-item` (line items)

### Related Collections

- **Supplier**: `api::supplier.supplier` (payment supplier)
- **Material**: `api::material.material` (item materials)
- **Purchasing**: `api::purchasing.purchasing` (related PO)
- **Penerimaan-material**: `api::penerimaan-material.penerimaan-material` (goods receipt)
- **Karyawan**: `api::karyawan.karyawan` (paid by, verified by)
- **Proyek-perumahan**: `api::proyek-perumahan.proyek-perumahan` (project)
- **Purchase-request**: `api::purchase-request.purchase-request` (original PR)

## Content Types API Endpoints

### 1. Payment Invoice API (`api::payment-invoice.payment-invoice`)

#### Base URL

```
/content-manager/collection-types/api::payment-invoice.payment-invoice
```

#### Endpoints

| Method | Endpoint                                                                               | Description                    |
| ------ | -------------------------------------------------------------------------------------- | ------------------------------ |
| GET    | `/content-manager/collection-types/api::payment-invoice.payment-invoice`               | Get all payment invoices       |
| GET    | `/content-manager/collection-types/api::payment-invoice.payment-invoice/:id`            | Get payment invoice by ID      |
| POST   | `/content-manager/collection-types/api::payment-invoice.payment-invoice`               | Create new payment invoice     |
| PUT    | `/content-manager/collection-types/api::payment-invoice.payment-invoice/:id`            | Update payment invoice         |
| DELETE | `/content-manager/collection-types/api::payment-invoice.payment-invoice/:id`            | Delete payment invoice         |

#### Request Examples

**Create Payment Invoice:**

```json
POST /content-manager/collection-types/api::payment-invoice.payment-invoice
Content-Type: application/json

{
  "invoiceNumber": "INV-2024-11-001",
  "invoiceDate": "2024-11-06",
  "dueDate": "2024-11-25",
  "poReference": "PO-2024-11-001",
  "supplier": "supplier_document_id",
  "material": "material_document_id",
  "amount": 15000000,
  "currency": "IDR",
  "paymentMethod": "Transfer Bank",
  "statusPayment": "pending",
  "statusInvoice": "received",
  "description": "Pembayaran material semen Portland",
  "notes": "Invoice dari supplier PT. Material Jaya untuk PO-2024-11-001",
  "goodsReceipt": "goods_receipt_document_id",
  "purchaseOrder": "purchase_order_document_id"
}
```

**Update Payment Status:**

```json
PUT /content-manager/collection-types/api::payment-invoice.payment-invoice/1
Content-Type: application/json

{
  "statusPayment": "paid",
  "paymentDate": "2024-11-20T10:30:00.000Z",
  "paymentAmount": 15000000,
  "paymentReference": "TRF-2024-11-001",
  "paymentNotes": "Transfer via BCA ke rekening supplier",
  "paidBy": "employee_document_id"
}
```

**Create Invoice with Multiple Items:**

```json
POST /content-manager/collection-types/api::payment-invoice.payment-invoice
Content-Type: application/json

{
  "invoiceNumber": "INV-2024-11-002",
  "invoiceDate": "2024-11-06",
  "dueDate": "2024-11-30",
  "poReference": "PO-2024-11-002",
  "supplier": "supplier_document_id",
  "amount": 25000000,
  "currency": "IDR",
  "paymentMethod": "Transfer Bank",
  "statusPayment": "pending",
  "statusInvoice": "received",
  "description": "Pembayaran berbagai material untuk proyek A",
  "notes": "Invoice mencakup multiple items sesuai PO",
  "purchaseOrder": "purchase_order_document_id",
  "items": [
    {
      "material": "material_document_id_1",
      "description": "Besi Beton",
      "quantity": 50,
      "unit": "batang",
      "unitPrice": 300000,
      "totalPrice": 15000000
    },
    {
      "material": "material_document_id_2",
      "description": "Pasir Halus",
      "quantity": 10,
      "unit": "m³",
      "unitPrice": 1000000,
      "totalPrice": 10000000
    }
  ]
}
```

---

## Schema Implementation

### Payment Invoice Schema

```json
{
  "kind": "collectionType",
  "collectionName": "payment_invoices",
  "info": {
    "singularName": "payment-invoice",
    "pluralName": "payment-invoices",
    "displayName": "Payment Invoice",
    "description": "Payment invoice management for supplier payments and PO settlement"
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
    "invoiceDate": {
      "type": "date",
      "required": true
    },
    "dueDate": {
      "type": "date",
      "required": true
    },
    "poReference": {
      "type": "string",
      "required": true,
      "maxLength": 50
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "payment_invoices"
    },
    "material": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::material.material",
      "inversedBy": "payment_invoices"
    },
    "amount": {
      "type": "decimal",
      "required": true,
      "min": 0,
      "max": 1000000000
    },
    "currency": {
      "type": "enumeration",
      "required": true,
      "default": "IDR",
      "enum": ["IDR", "USD", "EUR"]
    },
    "paymentMethod": {
      "type": "enumeration",
      "required": true,
      "enum": ["Transfer Bank", "Tunai", "Cek", "Giro", "Kartu Kredit", "E-Wallet"]
    },
    "statusPayment": {
      "type": "enumeration",
      "required": true,
      "default": "pending",
      "enum": ["pending", "paid", "partial", "overdue", "cancelled"]
    },
    "statusInvoice": {
      "type": "enumeration",
      "required": true,
      "default": "received",
      "enum": ["received", "verified", "rejected", "cancelled"]
    },
    "description": {
      "type": "string",
      "required": true,
      "minLength": 10,
      "maxLength": 500
    },
    "notes": {
      "type": "text",
      "maxLength": 2000
    },
    "paymentDate": {
      "type": "datetime"
    },
    "paymentAmount": {
      "type": "decimal",
      "min": 0,
      "max": 1000000000
    },
    "paymentReference": {
      "type": "string",
      "maxLength": 100
    },
    "paymentNotes": {
      "type": "text",
      "maxLength": 1000
    },
    "paidBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "payment_invoices_paid"
    },
    "verifiedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "payment_invoices_verified"
    },
    "verifiedDate": {
      "type": "datetime"
    },
    "goodsReceipt": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::penerimaan-material.penerimaan-material",
      "inversedBy": "payment_invoices"
    },
    "purchaseOrder": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::purchasing.purchasing",
      "inversedBy": "payment_invoices"
    },
    "purchaseRequest": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::purchase-request.purchase-request",
      "inversedBy": "payment_invoices"
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "payment_invoices"
    },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "payment-invoice.invoice-item"
    },
    "attachments": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": ["images", "files"]
    }
  }
}
```

### Invoice Item Component Schema

```json
{
  "collectionName": "components_payment_invoice_items",
  "info": {
    "displayName": "Invoice Item",
    "description": "Individual line items within a payment invoice"
  },
  "attributes": {
    "material": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::material.material"
    },
    "description": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "quantity": {
      "type": "decimal",
      "required": true,
      "min": 0.01,
      "max": 1000000
    },
    "unit": {
      "type": "string",
      "required": true,
      "maxLength": 20
    },
    "unitPrice": {
      "type": "decimal",
      "required": true,
      "min": 0,
      "max": 1000000000
    },
    "totalPrice": {
      "type": "decimal",
      "required": true,
      "min": 0,
      "max": 1000000000
    },
    "notes": {
      "type": "string",
      "maxLength": 500
    },
    "goodsReceiptItem": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::penerimaan-material.penerimaan-material"
    }
  }
}
```

---

## Database Relations

### Payment Invoice Relations

- `supplier` (Many-to-One) → `api::supplier.supplier` → `payment_invoices`
- `material` (Many-to-One) → `api::material.material` → `payment_invoices`
- `paidBy` (Many-to-One) → `api::karyawan.karyawan` → `payment_invoices_paid`
- `verifiedBy` (Many-to-One) → `api::karyawan.karyawan` → `payment_invoices_verified`
- `goodsReceipt` (Many-to-One) → `api::penerimaan-material.penerimaan-material` → `payment_invoices`
- `purchaseOrder` (Many-to-One) → `api::purchasing.purchasing` → `payment_invoices`
- `purchaseRequest` (Many-to-One) → `api::purchase-request.purchase-request` → `payment_invoices`
- `project` (Many-to-One) → `api::proyek-perumahan.proyek-perumahan` → `payment_invoices`
- `items` (Component) → `payment-invoice.invoice-item` (Repeatable)
- `attachments` (Media) → Strapi Upload Files (Multiple)

### Updated Related Collections

**Supplier Collection:**
- Added `payment_invoices` (oneToMany) relation

**Material Collection:**
- Added `payment_invoices` (oneToMany) relation

**Purchasing Collection:**
- Added `payment_invoices` (oneToMany) relation mapped by `purchaseOrder`

**Penerimaan-material Collection:**
- Added `payment_invoices` (oneToMany) relation mapped by `goodsReceipt`

**Karyawan Collection:**
- Added `payment_invoices_paid` (oneToMany) relation
- Added `payment_invoices_verified` (oneToMany) relation

**Proyek-perumahan Collection:**
- Added `payment_invoices` (oneToMany) relation

**Purchase-request Collection:**
- Added `payment_invoices` (oneToMany) relation

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

- `find` - Get all invoices with basic filters
- `findOne` - Get single invoice by documentId

**Authenticated (Full Access):**

- `create` - Create new payment invoice
- `update` - Update existing payment invoice
- `delete` - Delete payment invoice
- `upload` - Upload invoice documents and attachments

**Role-Based Access:**

- **Admin**: Full access to all operations
- **Finance**: Create, update, and process payment invoices
- **Purchasing**: View and create invoices related to POs
- **Project Manager**: View invoices for their projects
- **Supplier**: View their own invoices (read-only)

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

**Business Logic Error (422):**

```json
{
  "error": {
    "status": 422,
    "name": "BusinessLogicError",
    "message": "Invoice tidak bisa dibuat sebelum goods receipt selesai",
    "details": {
      "goodsReceipt": "Goods receipt status must be 'completed' before creating invoice"
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
    "message": "Payment invoice not found"
  }
}
```

**Unauthorized Error (401):**

```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Unauthorized - Invalid or missing token"
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
?sort=invoiceDate:desc
?sort=dueDate:asc
?sort=amount:desc
```

### Filtering

```
?filters[statusPayment][$eq]=pending
?filters[supplier][documentId][$eq]=supplier_id
?filters[poReference][$containsi]=PO-2024
?filters[invoiceDate][$gte]=2024-11-01
?filters[invoiceDate][$lte]=2024-11-30
?filters[amount][$gte]=1000000
?filters[amount][$lte]=50000000
```

### Population (Relations)

```
?populate=*
?populate[0]=supplier&populate[1]=material
?populate[0]=supplier&populate[1]=purchaseOrder&populate[2]=goodsReceipt
?populate[0]=items.material&populate[1]=paidBy
```

## Usage Examples

### Advanced Filtering with Search

```javascript
const params = {
  page: 1,
  pageSize: 25,
  search: "INV-2024-11",
  statusPayment: "pending",
  supplier: "supplier_document_id",
  startDate: "2024-11-01",
  endDate: "2024-11-30",
  sort: "dueDate:asc",
  populate: "specific",
};

// API call
const response = await api.get(
  "/content-manager/collection-types/api::payment-invoice.payment-invoice",
  { params }
);
```

### Create Invoice from Purchase Order

```javascript
// First, get the purchase order details
const poResponse = await api.get(
  `/content-manager/collection-types/api::purchasing.purchasing/${poDocumentId}`,
  { populate: ['supplier', 'materials'] }
);

const purchaseOrder = poResponse.data;

// Create payment invoice based on PO
const invoiceData = {
  invoiceNumber: `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-001`,
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: calculateDueDate(new Date(), 30), // 30 days from invoice date
  poReference: purchaseOrder.nomor_po,
  supplier: purchaseOrder.supplier, // Assuming supplier is a relation in PO
  amount: purchaseOrder.total_harga,
  currency: "IDR",
  paymentMethod: "Transfer Bank",
  statusPayment: "pending",
  statusInvoice: "received",
  description: `Pembayaran untuk PO ${purchaseOrder.nomor_po}`,
  notes: `Invoice terkait PO ${purchaseOrder.nomor_po}`,
  purchaseOrder: purchaseOrder.documentId,
  items: purchaseOrder.materials.map(item => ({
    material: item.material.documentId,
    description: item.material.nama_material,
    quantity: item.quantity,
    unit: item.material.satuan,
    unitPrice: item.unit_price,
    totalPrice: item.total_price,
    notes: `Referensi PO item ${item.id}`
  }))
};

const response = await api.post(
  "/content-manager/collection-types/api::payment-invoice.payment-invoice",
  invoiceData
);
```

### Payment Processing Workflow

```javascript
const processPayment = async (invoiceId, paymentData) => {
  try {
    // Step 1: Update invoice with payment information
    const updateData = {
      statusPayment: "paid",
      paymentDate: new Date().toISOString(),
      paymentAmount: paymentData.amount,
      paymentReference: paymentData.reference,
      paymentNotes: paymentData.notes,
      paidBy: paymentData.paidBy
    };

    const response = await api.put(
      `/content-manager/collection-types/api::payment-invoice.payment-invoice/${invoiceId}`,
      updateData
    );

    return response.data;
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw error;
  }
};
```

### Invoice Status Tracking

```javascript
const getInvoiceStatusSummary = async (filters = {}) => {
  const params = {
    filters: {
      ...filters,
      statusPayment: { $in: ['pending', 'paid', 'partial', 'overdue'] }
    },
    populate: ['supplier', 'purchaseOrder']
  };

  const response = await api.get(
    "/content-manager/collection-types/api::payment-invoice.payment-invoice",
    { params }
  );

  const invoices = response.data.results || [];

  return {
    total: invoices.length,
    pending: invoices.filter(inv => inv.statusPayment === 'pending').length,
    paid: invoices.filter(inv => inv.statusPayment === 'paid').length,
    partial: invoices.filter(inv => inv.statusPayment === 'partial').length,
    overdue: invoices.filter(inv => inv.statusPayment === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices
      .filter(inv => inv.statusPayment === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0)
  };
};
```

## Business Rules & Validation

### Invoice Creation Rules

1. **Goods Receipt Completion**: Invoice hanya bisa dibuat jika status goods receipt = "completed"
2. **PO Reference Validation**: PO reference harus valid dan status PO = "Diterima"
3. **Amount Validation**: Invoice amount tidak boleh melebihi PO amount + 10%
4. **Due Date Validation**: Due date harus minimal 7 hari dari invoice date
5. **Duplicate Prevention**: Invoice number harus unik per supplier

### Payment Processing Rules

1. **Payment Amount**: Pembayaran tidak boleh melebihi outstanding amount
2. **Partial Payments**: Mendukung pembayaran sebagian dengan tracking sisa
3. **Payment Reference**: Wajib menyertakan referensi pembayaran (transfer number, etc.)
4. **Authorization**: Pembayaran harus divalidasi oleh user dengan role Finance/Admin

### Status Flow

```
received → verified → pending → paid/overdue
    ↓           ↓         ↓
cancelled   rejected   cancelled
```

## Testing Examples

### Test Invoice Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::payment-invoice.payment-invoice' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "invoiceNumber": "INV-2024-TEST-001",
    "invoiceDate": "2024-11-06",
    "dueDate": "2024-11-25",
    "poReference": "PO-2024-TEST-001",
    "supplier": "supplier_document_id",
    "amount": 15000000,
    "currency": "IDR",
    "paymentMethod": "Transfer Bank",
    "statusPayment": "pending",
    "statusInvoice": "received",
    "description": "Test invoice for API documentation"
  }'
```

### Test Invoice Search with Filters

```bash
curl -X GET \
  'http://localhost:1337/content-manager/collection-types/api::payment-invoice.payment-invoice?filters[statusPayment][$eq]=pending&populate=supplier&populate=purchaseOrder' \
  -H 'Authorization: Bearer <token>'
```

### Test Payment Update

```bash
curl -X PUT \
  'http://localhost:1337/content-manager/collection-types/api::payment-invoice.payment-invoice/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "statusPayment": "paid",
    "paymentDate": "2024-11-20T10:30:00.000Z",
    "paymentAmount": 15000000,
    "paymentReference": "TRF-2024-11-001",
    "paymentNotes": "Paid via BCA transfer",
    "paidBy": "employee_document_id"
  }'
```

---

## Implementation Notes

### File Structure

```
src/
├── api/
│   └── payment-invoice/
│       └── content-types/
│           └── payment-invoice/
│               └── schema.json
└── components/
    └── payment-invoice/
        └── invoice-item.json
```

### Key Implementation Features

1. **No Draft/Publish**: All collections use `draftAndPublish: false` for direct data storage
2. **Comprehensive Relations**: 8 relation types connecting to existing modules
3. **Component-based Items**: Using `payment-invoice.invoice-item` for line items
4. **Media Support**: Multiple file attachments for invoice documents
5. **Status Management**: Separate tracking for payment status and invoice status
6. **Audit Trail**: Payment reference, notes, and employee tracking

### Integration Points

- **Purchasing Module**: Direct relation to `purchasing` collection
- **Goods Receipt**: Validation integration with `penerimaan-material`
- **Supplier Management**: Relation to `supplier` collection
- **Project Tracking**: Relation to `proyek-perumahan` collection
- **Employee System**: Relations for payment processing and verification

---

## Best Practices

1. **Always validate business rules** before creating invoices (check GR completion, PO status)
2. **Use proper date formats** (YYYY-MM-DD) for invoice and due dates
3. **Maintain referential integrity** with PO, GR, and PR references
4. **Implement proper approval workflow** for payment processing
5. **Use pagination** for large datasets to improve performance
6. **Populate relations** when needed to avoid additional API calls
7. **Validate amounts** against PO to prevent overpayment
8. **Track payment references** properly for audit trail
9. **Monitor overdue invoices** and implement reminder system
10. **Implement proper error handling** for all API operations
11. **Use appropriate status transitions** for workflow management
12. **Keep audit trail** for all payment changes and updates

---

**Note**: Payment Invoice system telah diimplementasikan penuh dalam backend Strapi dan terintegrasi dengan sistem Purchase Order dan Goods Receipt yang sudah ada. Gunakan format document ID untuk relasi antar content types. Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish.