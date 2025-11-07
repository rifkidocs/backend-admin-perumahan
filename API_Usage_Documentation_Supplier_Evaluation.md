# API Usage Documentation - Supplier Evaluation System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Supplier Evaluation (Evaluasi Supplier). Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Supplier Management API (`api::supplier.supplier`)

#### Base URL

```
/content-manager/collection-types/api::supplier.supplier
```

#### Endpoints

| Method | Endpoint                                              | Description             |
| ------ | ----------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::supplier.supplier`     | Get all suppliers       |
| GET    | `/content-manager/collection-types/api::supplier.supplier/:id` | Get supplier by ID      |
| POST   | `/content-manager/collection-types/api::supplier.supplier`     | Create new supplier     |
| PUT    | `/content-manager/collection-types/api::supplier.supplier/:id` | Update supplier         |
| DELETE | `/content-manager/collection-types/api::supplier.supplier/:id` | Delete supplier         |

#### Request Examples

**Create Supplier:**

```json
POST /content-manager/collection-types/api::supplier.supplier
Content-Type: application/json

{
  "code": "SUP-2024-001",
  "name": "PT. Material Jaya Abadi",
  "type": "Perusahaan",
  "contact": {
    "name": "Budi Santoso",
    "position": "Sales Manager",
    "phone": "+6221-1234-5678",
    "email": "budi@materialjaya.com"
  },
  "address": "Jl. Industri No. 123, Jakarta Selatan, DKI Jakarta 12345",
  "materials": ["Semen", "Pasir", "Besi", "Cat"],
  "rating": 4.5,
  "status_supplier": "active",
  "documents": {
    "npwp": "12345678901234567890",
    "siup": "SIUP-123-456-789",
    "akta": "AKTA-PENDIRIAN-001"
  },
  "notes": "Supplier terpercaya untuk material konstruksi"
}
```

**Update Supplier Status:**

```json
PUT /content-manager/collection-types/api::supplier.supplier/1
Content-Type: application/json

{
  "status_supplier": "blacklist",
  "rating": 2.1,
  "notes": "Blacklist due to consistent late deliveries and quality issues"
}
```

---

### 2. Supplier Evaluation API (`api::supplier-evaluation.supplier-evaluation`)

#### Base URL

```
/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
```

#### Endpoints

| Method | Endpoint                                                                      | Description                   |
| ------ | ----------------------------------------------------------------------------- | ----------------------------- |
| GET    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation`     | Get all supplier evaluations  |
| GET    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id` | Get evaluation by ID          |
| POST   | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation`     | Create new evaluation         |
| PUT    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id` | Update evaluation             |
| DELETE | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id` | Delete evaluation             |

#### Request Examples

**Create Supplier Evaluation:**

```json
POST /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
Content-Type: application/json

{
  "supplier": "supplier_document_id",
  "material": "material_document_id",
  "date": "2024-11-06",
  "priceRating": 4,
  "qualityRating": 5,
  "deliveryRating": 4,
  "overallRating": 4.3,
  "notes": "Supplier delivers good quality materials with reasonable pricing. Some delays in delivery noted.",
  "evaluatedBy": "user_document_id"
}
```

**Update Supplier Evaluation:**

```json
PUT /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/1
Content-Type: application/json

{
  "priceRating": 3,
  "qualityRating": 4,
  "deliveryRating": 3,
  "overallRating": 3.3,
  "notes": "Updated evaluation after considering recent performance issues with material quality"
}
```

---

### 3. Material Management API (`api::material.material`)

#### Base URL

```
/content-manager/collection-types/api::material.material
```

#### Endpoints

| Method | Endpoint                                              | Description                |
| ------ | ----------------------------------------------------- | -------------------------- |
| GET    | `/content-manager/collection-types/api::material.material`     | Get all materials          |
| GET    | `/content-manager/collection-types/api::material.material/:id` | Get material by ID         |
| POST   | `/content-manager/collection-types/api::material.material`     | Create new material        |
| PUT    | `/content-manager/collection-types/api::material.material/:id` | Update material            |
| DELETE | `/content-manager/collection-types/api::material.material/:id` | Delete material            |

#### Request Examples

**Create Material:**

```json
POST /content-manager/collection-types/api::material.material
Content-Type: application/json

{
  "kode_material": "MAT-SEM-001",
  "nama_material": "Semen Portland Tipe 1",
  "kategori": "Material Konstruksi",
  "satuan": "sak",
  "harga_satuan": 75000,
  "suppliers": "supplier_document_id",
  "stok": 500,
  "minimum_stock": 50,
  "lokasi_gudang": "Gudang A - Rak 1",
  "deskripsi": "Semen Portland berkualitas tinggi untuk konstruksi bangunan",
  "spesifikasi": "Berat 50kg, Mutu SNI 15-2049-2015, Kekuatan 32.5 MPa"
}
```

---

### 4. Purchase Order API (`api::purchase-order.purchase-order`)

#### Base URL

```
/content-manager/collection-types/api::purchase-order.purchase-order
```

#### Endpoints

| Method | Endpoint                                                        | Description                    |
| ------ | --------------------------------------------------------------- | ------------------------------ |
| GET    | `/content-manager/collection-types/api::purchase-order.purchase-order`     | Get all purchase orders        |
| GET    | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Get purchase order by ID       |
| POST   | `/content-manager/collection-types/api::purchase-order.purchase-order`     | Create new purchase order      |
| PUT    | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Update purchase order          |
| DELETE | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Delete purchase order          |

#### Request Examples

**Create Purchase Order:**

```json
POST /content-manager/collection-types/api::purchase-order.purchase-order
Content-Type: application/json

{
  "poNumber": "PO-202411-001",
  "date": "2024-11-06",
  "supplier": "supplier_document_id",
  "materials": [
    {
      "material": "material_document_id",
      "quantity": 100,
      "unitPrice": 75000,
      "total": 7500000
    }
  ],
  "totalAmount": 7500000,
  "status": "draft",
  "deliveryDate": "2024-11-15",
  "paymentTerms": "Net 30",
  "notes": "Purchase order for project A construction materials"
}
```

---

## Schema JSON

### Supplier Schema

```json
{
  "kind": "collectionType",
  "collectionName": "suppliers",
  "info": {
    "singularName": "supplier",
    "pluralName": "suppliers",
    "displayName": "Supplier",
    "description": "Supplier management for procurement system"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "code": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 20,
      "default": "SUP-001"
    },
    "name": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "type": {
      "type": "enumeration",
      "enum": ["Perusahaan", "Individu"],
      "required": true,
      "default": "Perusahaan"
    },
    "contact": {
      "type": "component",
      "repeatable": false,
      "component": "supplier.contact"
    },
    "address": {
      "type": "text",
      "required": true,
      "maxLength": 500
    },
    "materials": {
      "type": "json"
    },
    "rating": {
      "type": "decimal",
      "min": 1,
      "max": 5,
      "default": 3
    },
    "status_supplier": {
      "type": "enumeration",
      "enum": ["active", "inactive", "blacklist"],
      "required": true,
      "default": "active"
    },
    "documents": {
      "type": "component",
      "repeatable": false,
      "component": "supplier.documents"
    },
    "notes": {
      "type": "text",
      "maxLength": 500
    },
    "evaluations": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::supplier-evaluation.supplier-evaluation",
      "mappedBy": "supplier"
    },
    "purchase_orders": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::purchase-order.purchase-order",
      "mappedBy": "supplier"
    }
  }
}
```

### Supplier Evaluation Schema

```json
{
  "kind": "collectionType",
  "collectionName": "supplier_evaluations",
  "info": {
    "singularName": "supplier-evaluation",
    "pluralName": "supplier-evaluations",
    "displayName": "Supplier Evaluation",
    "description": "Evaluations of supplier performance"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "evaluations"
    },
    "date": {
      "type": "date",
      "required": true
    },
    "material": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::material.material",
      "inversedBy": "evaluations"
    },
    "priceRating": {
      "type": "integer",
      "min": 1,
      "max": 5,
      "required": true
    },
    "qualityRating": {
      "type": "integer",
      "min": 1,
      "max": 5,
      "required": true
    },
    "deliveryRating": {
      "type": "integer",
      "min": 1,
      "max": 5,
      "required": true
    },
    "overallRating": {
      "type": "decimal",
      "min": 1,
      "max": 5,
      "required": true
    },
    "notes": {
      "type": "text"
    },
    "evaluatedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
```

### Material Schema

```json
{
  "kind": "collectionType",
  "collectionName": "materials",
  "info": {
    "singularName": "material",
    "pluralName": "materials",
    "displayName": "Material",
    "description": "Manajemen inventaris material konstruksi"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "nama_material": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "kode_material": {
      "type": "string",
      "unique": true,
      "maxLength": 50
    },
    "kategori": {
      "type": "enumeration",
      "enum": ["Struktur", "Finishing", "MEP", "Alat Bantu"],
      "required": true
    },
    "satuan": {
      "type": "enumeration",
      "enum": ["sak", "pcs", "kg", "meter", "batang", "kaleng"],
      "required": true
    },
    "stok": {
      "type": "integer",
      "required": true,
      "min": 0
    },
    "sisa_proyek": {
      "type": "integer",
      "required": true,
      "min": 0,
      "max": 100
    },
    "status_material": {
      "type": "enumeration",
      "enum": ["Tersedia", "Segera Habis", "Habis"],
      "required": true,
      "default": "Tersedia"
    },
    "minimum_stock": {
      "type": "integer",
      "min": 0
    },
    "harga_satuan": {
      "type": "decimal",
      "min": 0
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::vendor.vendor",
      "inversedBy": "materials"
    },
    "suppliers": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::supplier.supplier",
      "inversedBy": "materials"
    },
    "lokasi_gudang": {
      "type": "string",
      "maxLength": 255
    },
    "deskripsi": {
      "type": "text"
    },
    "foto_material": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": ["images", "files"]
    },
    "penerimaan_materials": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::penerimaan-material.penerimaan-material",
      "mappedBy": "material"
    },
    "evaluations": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::supplier-evaluation.supplier-evaluation",
      "mappedBy": "material"
    }
  }
}
```

### Purchase Order Schema

```json
{
  "kind": "collectionType",
  "collectionName": "purchase_orders",
  "info": {
    "singularName": "purchase-order",
    "pluralName": "purchase-orders",
    "displayName": "Purchase Order",
    "description": "Purchase order management system"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "poNumber": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 20
    },
    "date": {
      "type": "date",
      "required": true
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "purchase_orders"
    },
    "materials": {
      "type": "json",
      "required": true
    },
    "totalAmount": {
      "type": "decimal",
      "required": true,
      "min": 0
    },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "dikirim", "diterima_sebagian", "diterima", "dibatalkan"],
      "required": true,
      "default": "draft"
    },
    "deliveryDate": {
      "type": "date"
    },
    "paymentTerms": {
      "type": "string",
      "maxLength": 50
    },
    "notes": {
      "type": "text",
      "maxLength": 500
    }
  }
}
```

### Components Schema

#### Supplier Contact Component

```json
{
  "collectionName": "components_supplier_contacts",
  "info": {
    "displayName": "Contact",
    "icon": "phone"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "maxLength": 50
    },
    "position": {
      "type": "string",
      "maxLength": 50
    },
    "phone": {
      "type": "string",
      "required": true,
      "regex": "^(\\+62|62|0)[0-9]{9,13}$"
    },
    "email": {
      "type": "email",
      "required": true
    }
  }
}
```

#### Supplier Documents Component

```json
{
  "collectionName": "components_supplier_documents",
  "info": {
    "displayName": "Documents",
    "icon": "file"
  },
  "attributes": {
    "npwp": {
      "type": "string",
      "maxLength": 20
    },
    "siup": {
      "type": "string",
      "maxLength": 50
    },
    "akta": {
      "type": "string",
      "maxLength": 50
    }
  }
}
```

---

## Relations

### Supplier Relations

- `evaluations` (One-to-Many) → Supplier Evaluation
- `purchase_orders` (One-to-Many) → Purchase Order
- `materials` (One-to-Many) → Material (as supplier)

### Supplier Evaluation Relations

- `supplier` (Many-to-One) → Supplier
- `material` (Many-to-One) → Material

### Material Relations

- `suppliers` (Many-to-One) → Supplier
- `evaluations` (One-to-Many) → Supplier Evaluation

### Purchase Order Relations

- `supplier` (Many-to-One) → Supplier

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

- `find` - Get all suppliers and evaluations with basic filters
- `findOne` - Get single supplier or evaluation by documentId

**Authenticated (Full Access):**

- `create` - Create new suppliers, evaluations, materials, and purchase orders
- `update` - Update existing supplier and evaluation data
- `delete` - Delete suppliers, evaluations, materials, and purchase orders

**Role-Based Access:**

- **Admin**: Full access to all operations
- **Purchasing**: Create and update suppliers, evaluations, and purchase orders
- **QC**: Create and update supplier evaluations
- **Manager**: Read-only access with approval capabilities
- **Gudang**: Read-only access to supplier and material information

---

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Nama supplier harus diisi",
    "details": {
      "name": "Nama supplier harus diisi"
    }
  }
}
```

**Rating Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Rating harus antara 1 dan 5",
    "details": {
      "rating": "Rating harus antara 1 dan 5"
    }
  }
}
```

**Phone Format Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Format telepon tidak valid",
    "details": {
      "contact.phone": "Format telepon tidak valid"
    }
  }
}
```

**Email Format Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Format email tidak valid",
    "details": {
      "contact.email": "Format email tidak valid"
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
    "message": "Supplier not found"
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

---

## Query Parameters

### Pagination

```
?page=1&pageSize=25
```

### Sorting

```
?sort=createdAt:desc
?sort=name:asc
?sort=rating:desc
```

### Filtering Suppliers

```
?filters[status_supplier][$eq]=active
?filters[type][$eq]=Perusahaan
?filters[name][$containsi]=material
?filters[rating][$gte]=4
?filters[createdAt][$gte]=2024-11-01
```

### Filtering Evaluations

```
?filters[supplier][documentId][$eq]=supplier_id
?filters[material][documentId][$eq]=material_id
?filters[date][$gte]=2024-11-01
?filters[total_skor][$gte]=4
```

### Population (Relations)

```
?populate=*
?populate[0]=evaluations&populate[1]=purchase_orders
?populate[0]=evaluations.supplier&populate[1]=evaluations.material
```

### Search

```
?_q=material jaya
?_q=PT. Material
```

---

## Usage Examples

### Advanced Supplier Search with Filters

```javascript
const params = {
  page: 1,
  pageSize: 25,
  search: "material",
  status: "active",
  type: "Perusahaan",
  sort: "rating:desc",
  populate: "specific"
};

// API call
const response = await api.get(
  "/content-manager/collection-types/api::supplier.supplier",
  { params }
);
```

### Create Supplier with Evaluation

```javascript
// Step 1: Create supplier
const supplierData = {
  code: "SUP-2024-002",
  name: "CV. Bangun Sejahtera",
  type: "Perusahaan",
  contact: {
    name: "Ahmad Wijaya",
    position: "Owner",
    phone: "+6221-9876-5432",
    email: "ahmad@bangunsejahtera.com"
  },
  address: "Jl. Raya Bogor No. 45, Jakarta Timur",
  materials: ["Besi", "Kayu", "Paku"],
  status_supplier: "active"
};

const supplierResponse = await api.post(
  "/content-manager/collection-types/api::supplier.supplier",
  supplierData
);

// Step 2: Create evaluation for the supplier
const evaluationData = {
  supplier: supplierResponse.data.documentId,
  material: "material_document_id",
  date: "2024-11-06",
  kualitas: 4.0,
  ketepatan_waktu: 4.5,
  pelayanan: 4.0,
  harga: 4.5,
  total_skor: 4.25,
  catatan: "Good performance overall, slight delay in delivery",
  evaluator: "Purchasing Department"
};

const evaluationResponse = await api.post(
  "/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation",
  evaluationData
);
```

### Get Supplier Performance Summary

```javascript
const params = {
  populate: "evaluations",
  filters: {
    status_supplier: {
      $eq: "active"
    }
  },
  sort: "rating:desc"
};

const response = await api.get(
  "/content-manager/collection-types/api::supplier.supplier",
  { params }
);

// Calculate performance metrics
const suppliers = response.data.results;
const performanceSummary = suppliers.map(supplier => {
  const evaluations = supplier.evaluations || [];
  const avgRating = evaluations.length > 0
    ? evaluations.reduce((sum, eval) => sum + eval.total_skor, 0) / evaluations.length
    : supplier.rating || 0;

  return {
    ...supplier,
    averageRating: avgRating,
    evaluationCount: evaluations.length,
    performanceLevel: avgRating >= 4.5 ? 'Excellent' :
                     avgRating >= 3.5 ? 'Good' :
                     avgRating >= 2.5 ? 'Fair' : 'Poor'
  };
});
```

### Update Supplier Rating Based on Evaluations

```javascript
// Get all evaluations for a supplier
const evaluationsResponse = await api.get(
  "/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation",
  {
    params: {
      filters: {
        supplier: {
          documentId: {
            $eq: supplierDocumentId
          }
        }
      }
    }
  }
);

// Calculate average rating
const evaluations = evaluationsResponse.data.results;
if (evaluations.length > 0) {
  const avgRating = evaluations.reduce((sum, eval) => sum + eval.total_skor, 0) / evaluations.length;

  // Update supplier with new rating
  await api.put(
    `/content-manager/collection-types/api::supplier.supplier/${supplierDocumentId}`,
    {
      rating: Math.round(avgRating * 10) / 10
    }
  );
}
```

### Filter Suppliers by Material Type

```javascript
const params = {
  filters: {
    materials: {
      $contains: "Semen"
    }
  },
  populate: "evaluations"
};

const response = await api.get(
  "/content-manager/collection-types/api::supplier.supplier",
  { params }
);
```

---

## Best Practices

1. **Always validate supplier data** before creating or updating supplier records
2. **Use proper Indonesian phone format** for contact phone numbers (+62, 62, or 0 prefix)
3. **Validate email addresses** using proper email format
4. **Maintain consistent rating scale** (1-5) across all evaluations
4. **Use document IDs** for relation fields instead of numeric IDs
5. **Implement proper status management** for supplier lifecycle
6. **Regular performance reviews** based on evaluation data
7. **Use pagination** for large datasets
8. **Populate relations** when needed to avoid additional API calls
9. **Handle evaluation score calculations** properly (average of all rating components)
10. **Implement proper error handling** for all API operations
11. **Keep supplier information up-to-date** with regular reviews
12. **Document evaluation criteria** consistently across all suppliers
13. **Monitor supplier performance trends** over time
14. **Use appropriate supplier status transitions** (active → evaluation → blacklist if needed)

---

## Testing Examples

### Test Supplier Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::supplier.supplier' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "SUP-TEST-001",
    "name": "PT. Test Supplier",
    "type": "Perusahaan",
    "contact": {
      "name": "Test Contact",
      "position": "Manager",
      "phone": "+6221-1234-5678",
      "email": "test@example.com"
    },
    "address": "Test Address",
    "materials": ["Test Material"],
    "status_supplier": "active"
  }'
```

### Test Supplier Evaluation Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "supplier": "supplier_document_id",
    "material": "material_document_id",
    "date": "2024-11-06",
    "kualitas": 4.5,
    "ketepatan_waktu": 4.0,
    "pelayanan": 4.5,
    "harga": 4.0,
    "total_skor": 4.25,
    "catatan": "Test evaluation",
    "evaluator": "Test User"
  }'
```

### Test Supplier Search

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::supplier.supplier?filters[status_supplier][$eq]=active&populate=evaluations' \
  -H 'Authorization: Bearer <token>'
```

---

**Note**: Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Gunakan format document ID untuk relasi antar content types. Sistem evaluasi supplier menggunakan skala rating 1-5 dengan komponen penilaian meliputi kualitas, ketepatan waktu, pelayanan, dan harga.