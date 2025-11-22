# API Usage Documentation - Goods Receipt System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Goods Receipt (Penerimaan Material). Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Penerimaan Material API (`api::penerimaan-material.penerimaan-material`)

#### Base URL

```
/content-manager/collection-types/api::penerimaan-material.penerimaan-material
```

#### Endpoints

| Method | Endpoint                                                                       | Description                 |
| ------ | ------------------------------------------------------------------------------ | --------------------------- |
| GET    | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material`     | Get all receiving records   |
| GET    | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/:id` | Get receiving record by ID  |
| POST   | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material`     | Create new receiving record |
| PUT    | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/:id` | Update receiving record     |
| DELETE | `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/:id` | Delete receiving record     |

#### Request Examples

**Create Receiving Record:**

```json
POST /content-manager/collection-types/api::penerimaan-material.penerimaan-material
Content-Type: application/json

{
  "poNumber": "PO-2024-11-001",
  "receivingDate": "2024-11-06",
  "receivingTime": "09:30",
  "supplier": "supplier_document_id",
  "deliveryPerson": "Ahmad Supirman",
  "deliveryPersonPhone": "08123456789",
  "material": "material_document_id",
  "quantity": 50,
  "unit": "sak",
  "condition": "Baik",
  "gudang": "gudang_document_id",
  "project": "project_document_id",
  "qualityChecked": false,
  "temperature": 25.5,
  "humidity": 65,
  "notes": "Material diterima dalam kondisi baik",
  "receivedBy": "employee_document_id",
  "statusReceiving": "pending",
  "nota": 123,
  "penerima": "employee_document_id",
  "purchasing": "po_document_id"
}
```

**Update Receiving Record Status:**

```json
PUT /content-manager/collection-types/api::penerimaan-material.penerimaan-material/1
Content-Type: application/json

{
  "statusReceiving": "completed",
  "qualityChecked": true,
  "qualityCheckDate": "2024-11-06T10:00:00.000Z",
  "qualityChecker": "QC Officer Name",
  "temperature": 25.5,
  "humidity": 65,
  "notes": "Quality check completed - all good"
}
```

**File Upload with Receiving Record:**

```json
POST /content-manager/collection-types/api::penerimaan-material.penerimaan-material
Content-Type: application/json

{
  "poNumber": "PO-2024-11-002",
  "receivingDate": "2024-11-06",
  "receivingTime": "14:15",
  "supplier": "supplier_document_id",
  "deliveryPerson": "Budi Transporter",
  "deliveryPersonPhone": "08234567890",
  "material": "material_document_id",
  "quantity": 100,
  "unit": "pcs",
  "condition": "Baik",
  "gudang": "gudang_document_id",
  "project": "project_document_id",
  "receivedBy": "employee_document_id",
  "statusReceiving": "pending",
  "nota": 124
}
```

---

## Schema JSON

### Penerimaan Material Schema

```json
{
  "kind": "collectionType",
  "collectionName": "penerimaan_materials",
  "info": {
    "singularName": "penerimaan-material",
    "pluralName": "penerimaan-materials",
    "displayName": "Penerimaan Material",
    "description": "Material receiving system for warehouse management"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "poNumber": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 50
    },
    "receivingDate": {
      "type": "date",
      "required": true
    },
    "receivingTime": {
      "type": "string",
      "required": true,
      "regex": "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "penerimaan_materials"
    },
    "deliveryPerson": {
      "type": "string",
      "required": true,
      "minLength": 3,
      "maxLength": 100
    },
    "deliveryPersonPhone": {
      "type": "string",
      "regex": "^(\\+62|62|0)[0-9]{9,13}$"
    },
    "material": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::material.material",
      "inversedBy": "penerimaan_materials"
    },
    "quantity": {
      "type": "decimal",
      "required": true,
      "min": 0.01,
      "max": 1000000
    },
    "unit": {
      "type": "enumeration",
      "enum": ["sak", "pcs", "kg", "kaleng", "meter", "batang", "liter", "dus"],
      "required": true
    },
    "condition": {
      "type": "enumeration",
      "required": true,
      "default": "Baik",
      "enum": [
        "Baik",
        "Rusak",
        "Kurang"
      ]
    },
    "gudang": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::gudang.gudang"
    },
    "statusReceiving": {
      "type": "enumeration",
      "required": true,
      "default": "pending",
      "enum": [
        "pending",
        "in-progress",
        "completed",
        "rejected"
      ]
    },
    "qualityChecked": {
      "type": "boolean",
      "default": false
    },
    "qualityCheckDate": {
      "type": "datetime"
    },
    "temperature": {
      "type": "decimal",
      "min": -10,
      "max": 50
    },
    "humidity": {
      "type": "decimal",
      "min": 0,
      "max": 100
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "receivedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "penerimaan_materials_received"
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "penerimaan_materials"
    },
    "purchasing": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::purchasing.purchasing",
      "inversedBy": "penerimaan_materials"
    },
    "qualityChecker": {
      "type": "string",
      "maxLength": 100
    },
    "penerima": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "penerimaan_materials"
    },
    "nota": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    }
  }
}
```

---

## Relations

### Penerimaan Material Relations

- `supplier` (Many-to-One) → Supplier Management
- `material` (Many-to-One) → Material Master Data
- `project` (Many-to-One) → Project Management
- `receivedBy` (Many-to-One) → Employee Management
- `penerima` (Many-to-One) → Employee Management (Receiver)
- `purchasing` (Many-to-One) → Purchase Order
- `nota` (Media) → Strapi Upload Files

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

- `create` - Create new receiving record
- `update` - Update existing receiving record
- `delete` - Delete receiving record
- `upload` - Upload documents and images

**Role-Based Access:**

- **Admin**: Full access to all operations
- **Gudang**: Create, update, and delete receiving records
- **QC**: Update quality check status and add QC notes
- **Manager**: Read-only access with approval capabilities

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Quantity harus lebih dari 0",
    "details": {
      "quantity": "Quantity harus lebih dari 0"
    }
  }
}
```

**File Upload Error (413):**

```json
{
  "error": {
    "status": 413,
    "name": "PayloadTooLargeError",
    "message": "File size exceeds maximum limit of 10MB"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Receiving record not found"
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
?sort=receivingDate:desc
?sort=createdAt:asc
```

### Filtering

```
?filters[statusReceiving][$eq]=pending
?filters[supplier][documentId][$eq]=supplier_id
?filters[material][documentId][$eq]=material_id
?filters[receivingDate][$gte]=2024-11-01
?filters[receivingDate][$lte]=2024-11-30
```

### Population (Relations)

```
?populate=*
?populate[0]=supplier&populate[1]=material
?populate[0]=supplier&populate[1]=material&populate[2]=project
```

## Usage Examples

### Advanced Filtering with Search

```javascript
const params = {
  page: 1,
  pageSize: 25,
  search: "PO-2024-11",
  status: "pending",
  supplier: "supplier_document_id",
  startDate: "2024-11-01",
  endDate: "2024-11-30",
  sort: "receivingDate:desc",
  populate: "specific",
};

// API call
const response = await api.get(
  "/content-manager/collection-types/api::penerimaan-material.penerimaan-material",
  { params }
);
```

### File Upload Workflow

```javascript
// Step 1: Upload file to get file ID
const formData = new FormData();
formData.append("files", fileObject);
formData.append(
  "fileInfo",
  JSON.stringify({
    name: "nota_penerimaan_001.jpg",
    caption: `Nota penerimaan material - ${new Date().toISOString()}`,
  })
);

const uploadResponse = await api.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

const fileId = uploadResponse.data[0]?.id;

// Step 2: Create receiving record with file ID
const receivingData = {
  poNumber: "PO-2024-11-003",
  receivingDate: "2024-11-06",
  receivingTime: "16:45",
  supplier: "supplier_document_id",
  material: "material_document_id",
  quantity: 25,
  unit: "sak",
  condition: "Baik",
  gudang: "gudang_document_id",
  receivedBy: "employee_document_id",
  statusReceiving: "pending",
  nota: fileId,
};

const response = await api.post(
  "/content-manager/collection-types/api::penerimaan-material.penerimaan-material",
  receivingData
);
```

### Quality Check Update

```javascript
const qualityUpdateData = {
  statusReceiving: "completed",
  qualityChecked: true,
  qualityCheckDate: new Date().toISOString(),
  qualityChecker: "QC Officer Name",
  temperature: 24.5,
  humidity: 70,
  notes: "Quality check completed - material meets specifications",
  visualCondition: "Baik",
  quantityMatch: true,
  packagingCondition: "Baik",
};

const response = await api.put(
  `/content-manager/collection-types/api::penerimaan-material.penerimaan-material/${documentId}`,
  qualityUpdateData
);
```

## Best Practices

1. **Always validate data** before creating or updating receiving records
2. **Use proper date formats** (YYYY-MM-DD) for receivingDate
3. **Use time format (HH:MM)** for receivingTime
4. **Handle file uploads** separately with proper error handling
5. **Use pagination** for large datasets
6. **Populate relations** when needed to avoid additional API calls
7. **Validate phone numbers** using Indonesian format
8. **Monitor quality control workflow** to ensure proper material verification
9. **Use appropriate status transitions** for workflow management
10. **Implement proper error handling** for all API operations

## Testing Examples

### Test Receiving Record Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::penerimaan-material.penerimaan-material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "poNumber": "PO-2024-TEST-001",
    "receivingDate": "2024-11-06",
    "receivingTime": "10:00",
    "supplier": "supplier_document_id",
    "deliveryPerson": "Test Delivery Person",
    "deliveryPersonPhone": "08123456789",
    "material": "material_document_id",
    "quantity": 10,
    "unit": "sak",
    "condition": "Baik",
    "gudang": "gudang_document_id",
    "project": "project_document_id",
    "receivedBy": "employee_document_id",
    "statusReceiving": "pending"
  }'
```

### Test Receiving Record Search

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::penerimaan-material.penerimaan-material?filters[statusReceiving][$eq]=pending&populate=supplier&populate=material' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Gunakan format document ID untuk relasi antar content types.