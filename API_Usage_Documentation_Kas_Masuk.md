# API Usage Documentation - Kas Masuk (Cash In) System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Kas Masuk (Penerimaan Pembayaran). Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Kas Masuk API (`api::kas-masuk.kas-masuk`)

#### Base URL

```
/content-manager/collection-types/api::kas-masuk.kas-masuk
```

#### Endpoints

| Method | Endpoint                                                                       | Description                    |
| ------ | ------------------------------------------------------------------------------ | ------------------------------ |
| GET    | `/content-manager/collection-types/api::kas-masuk.kas-masuk`                   | Get all cash in records        |
| GET    | `/content-manager/collection-types/api::kas-masuk.kas-masuk/:id`               | Get cash in record by ID       |
| POST   | `/content-manager/collection-types/api::kas-masuk.kas-masuk`                   | Create new cash in record      |
| PUT    | `/content-manager/collection-types/api::kas-masuk.kas-masuk/:id`               | Update cash in record          |
| DELETE | `/content-manager/collection-types/api::kas-masuk.kas-masuk/:id`               | Delete cash in record          |

#### Request Examples

**Create Cash In Record:**

```json
POST /content-manager/collection-types/api::kas-masuk.kas-masuk
Content-Type: application/json

{
  "date": "2024-11-12",
  "type": "dp",
  "amount": 50000000,
  "customer": "Budi Santoso",
  "unit": "A-15",
  "description": "Pembayaran DP Unit A-15",
  "paymentMethod": "transfer",
  "reference": "TRF001234",
  "notes": "Pembayaran sesuai jadwal",
  "status": "confirmed"
}
```

**Create Cash In Record for KPR Disbursement:**

```json
POST /content-manager/collection-types/api::kas-masuk.kas-masuk
Content-Type: application/json

{
  "date": "2024-11-12",
  "type": "kpr",
  "amount": 200000000,
  "customer": "Siti Rahayu",
  "unit": "B-8",
  "description": "Pencairan KPR Unit B-8",
  "paymentMethod": "transfer",
  "reference": "KPR001567",
  "notes": "KPR Bank Mandiri",
  "status": "confirmed",
  "statusPayment": "verified"
}
```

**Update Cash In Record Status:**

```json
PUT /content-manager/collection-types/api::kas-masuk.kas-masuk/1
Content-Type: application/json

{
  "status": "confirmed",
  "statusPayment": "verified",
  "verifiedBy": "employee_document_id",
  "verifiedDate": "2024-11-12T10:00:00.000Z",
  "notes": "Pembayaran telah diverifikasi"
}
```

**Create Cash In Record for Booking Fee:**

```json
POST /content-manager/collection-types/api::kas-masuk.kas-masuk
Content-Type: application/json

{
  "date": "2024-11-12",
  "type": "booking",
  "amount": 10000000,
  "customer": "Ahmad Wijaya",
  "unit": "C-12",
  "description": "Booking Fee Unit C-12",
  "paymentMethod": "cash",
  "reference": "CASH001",
  "notes": "Pembayaran tunai di lokasi",
  "status": "pending",
  "paymentProof": proof_file_id
}
```

---

## Schema JSON

### Kas Masuk Schema

```json
{
  "kind": "collectionType",
  "collectionName": "kas_masuks",
  "info": {
    "singularName": "kas-masuk",
    "pluralName": "kas-masuks",
    "displayName": "Kas Masuk",
    "description": "Cash in system for tracking customer payments and KPR disbursements"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true
    },
    "type": {
      "type": "enumeration",
      "enum": ["booking", "dp", "pelunasan", "kpr", "lainnya"],
      "required": true
    },
    "amount": {
      "type": "decimal",
      "required": true,
      "min": 1,
      "max": 9999999999
    },
    "customer": {
      "type": "string",
      "required": true,
      "minLength": 3,
      "maxLength": 200
    },
    "unit": {
      "type": "string",
      "maxLength": 50,
      "default": ""
    },
    "description": {
      "type": "text",
      "required": true,
      "maxLength": 500
    },
    "paymentMethod": {
      "type": "enumeration",
      "enum": ["transfer", "cash", "cek", "giro"],
      "required": true
    },
    "reference": {
      "type": "string",
      "maxLength": 100,
      "default": ""
    },
    "notes": {
      "type": "text",
      "maxLength": 1000,
      "default": ""
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "confirmed", "rejected"],
      "required": true,
      "default": "pending"
    },
    "statusPayment": {
      "type": "enumeration",
      "enum": ["pending", "verified", "rejected"],
      "required": true,
      "default": "pending"
    },
    "statusPrice": {
      "type": "enumeration",
      "enum": ["standard", "discount", "premium"],
      "default": "standard"
    },
    "verifiedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "kas_masuks_verified"
    },
    "verifiedDate": {
      "type": "datetime"
    },
    "paymentProof": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": [
        "images",
        "files",
        "videos",
        "audios"
      ]
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "kas_masuks"
    },
    "customerRelation": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::customer.customer",
      "inversedBy": "kas_masuks"
    },
    "unitRelation": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::unit.unit",
      "inversedBy": "kas_masuks"
    }
  }
}
```

---

## Relations

### Kas Masuk Relations

- `verifiedBy` (Many-to-One) → Employee Management (Verifier)
- `paymentProof` (Media) → Strapi Media Files (Payment Proof)
- `project` (Many-to-One) → Project Management
- `customerRelation` (Many-to-One) → Customer Management (Konsumen)
- `unitRelation` (Many-to-One) → Unit Management

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

- `find` - Get all records with basic filters
- `findOne` - Get single record by documentId

**Authenticated (Full Access):**

- `create` - Create new cash in record
- `update` - Update existing cash in record
- `delete` - Delete cash in record

**Role-Based Access:**

- **Admin**: Full access to all operations
- **Keuangan**: Create, update, verify, and delete cash in records
- **Marketing**: Create and update cash in records
- **Manager**: Read-only access with verification capabilities
- **Sales**: Read-only access with limited view permissions

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

**Invalid Payment Type Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Tipe pembayaran tidak valid",
    "details": {
      "type": "Tipe pembayaran harus salah satu dari: booking, dp, pelunasan, kpr, lainnya"
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
    "message": "Cash in record not found"
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

**Conflict Error (409):**

```json
{
  "error": {
    "status": 409,
    "name": "ConflictError",
    "message": "Payment reference already exists"
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
?sort=date:desc
?sort=createdAt:asc
?sort=amount:desc
```

### Filtering

```
?filters[status][$eq]=confirmed
?filters[type][$eq]=dp
?filters[paymentMethod][$eq]=transfer
?filters[date][$gte]=2024-11-01
?filters[date][$lte]=2024-11-30
?filters[customer][$containsi]=budi
?filters[reference][$eq]=TRF001234
```

### Population (Relations)

```
?populate=*
?populate[0]=verifiedBy&populate[1]=project
?populate[0]=customerRelation&populate[1]=unitRelation&populate[2]=paymentProof
```

## Usage Examples

### Advanced Filtering with Search

```javascript
const params = {
  page: 1,
  pageSize: 25,
  search: "Budi",
  filters: {
    status: { $eq: "confirmed" },
    type: { $in: ["dp", "pelunasan"] },
    date: {
      $gte: "2024-11-01",
      $lte: "2024-11-30"
    }
  },
  sort: "date:desc",
  populate: ["customerRelation", "unitRelation", "verifiedBy"]
};

// API call
const response = await api.get(
  "/content-manager/collection-types/api::kas-masuk.kas-masuk",
  { params }
);
```

### Payment Verification Workflow

```javascript
// Step 1: Get pending payments
const pendingPayments = await api.get(
  "/content-manager/collection-types/api::kas-masuk.kas-masuk",
  {
    params: {
      filters: {
        status: { $eq: "pending" },
        statusPayment: { $eq: "pending" }
      },
      populate: ["customerRelation", "paymentProof"]
    }
  }
);

// Step 2: Verify payment
const verificationData = {
  status: "confirmed",
  statusPayment: "verified",
  verifiedBy: "employee_document_id",
  verifiedDate: new Date().toISOString(),
  notes: "Pembayaran telah diverifikasi dan dikonfirmasi"
};

const response = await api.put(
  `/content-manager/collection-types/api::kas-masuk.kas-masuk/${documentId}`,
  verificationData
);
```

### File Upload for Payment Proof

```javascript
// Step 1: Upload payment proof file
const formData = new FormData();
formData.append("files", fileObject);
formData.append(
  "fileInfo",
  JSON.stringify({
    name: `bukti_pembayaran_${Date.now()}.jpg`,
    caption: `Bukti pembayaran - ${new Date().toISOString()}`,
  })
);

const uploadResponse = await api.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

const fileId = uploadResponse.data[0]?.id;

// Step 2: Create cash in record with payment proof
const cashInData = {
  date: "2024-11-12",
  type: "dp",
  amount: 50000000,
  customer: "Budi Santoso",
  unit: "A-15",
  description: "Pembayaran DP Unit A-15",
  paymentMethod: "transfer",
  reference: "TRF001234",
  status: "pending",
  paymentProof: fileId
};

const response = await api.post(
  "/content-manager/collection-types/api::kas-masuk.kas-masuk",
  cashInData
);
```

### Cash In Report Generation

```javascript
const generateReport = async (startDate, endDate, type) => {
  const params = {
    filters: {
      date: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $eq: "confirmed" }
    },
    populate: ["customerRelation", "project"],
    sort: "date:desc"
  };

  if (type && type !== "all") {
    params.filters.type = { $eq: type };
  }

  const response = await api.get(
    "/content-manager/collection-types/api::kas-masuk.kas-masuk",
    { params }
  );

  // Process report data
  const records = response.data.results || [];
  const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.amount), 0);

  return {
    records,
    summary: {
      totalRecords: records.length,
      totalAmount,
      period: { startDate, endDate },
      type
    }
  };
};
```

## Best Practices

1. **Always validate payment amount** before creating records
2. **Use proper date formats** (YYYY-MM-DD) for date field
3. **Validate payment references** to avoid duplicates
4. **Upload payment proof files** with proper naming conventions
5. **Use pagination** for large datasets
6. **Populate relations** when needed to avoid additional API calls
7. **Implement proper status workflow** for payment verification
8. **Use appropriate payment types** for different transaction types
9. **Handle file uploads** separately with proper error handling
10. **Implement proper error handling** for all API operations
11. **Validate customer information** before creating records
12. **Use consistent reference numbering** for payment tracking

## Payment Type Definitions

### Payment Types

- **booking**: Booking fee for unit reservation
- **dp**: Down payment (Uang Muka)
- **pelunasan**: Final payment completion
- **kpr**: KPR (Kredit Pemilikan Rumah) disbursement from bank
- **lainnya**: Other payment types (additional fees, etc.)

### Payment Methods

- **transfer**: Bank transfer
- **cash**: Physical cash payment
- **cek**: Check payment
- **giro**: Giro payment

### Status Workflow

1. **pending** → Payment received but not verified
2. **confirmed** → Payment verified and approved
3. **rejected** → Payment rejected or returned

## Testing Examples

### Test Cash In Record Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::kas-masuk.kas-masuk' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "date": "2024-11-12",
    "type": "dp",
    "amount": 50000000,
    "customer": "Test Customer",
    "unit": "TEST-001",
    "description": "Test DP payment",
    "paymentMethod": "transfer",
    "reference": "TEST-REF-001",
    "status": "pending"
  }'
```

### Test Cash In Record Search

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::kas-masuk.kas-masuk?filters[status][$eq]=pending&populate=customerRelation&populate=unitRelation' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Gunakan format document ID untuk relasi antar content types.