# API Usage Documentation - Supplier Evaluation System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Supplier Evaluation (Evaluasi Supplier). Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Supplier Evaluation API (`api::supplier-evaluation.supplier-evaluation`)

#### Base URL

```
/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
```

#### Endpoints

| Method | Endpoint                                                                                 | Description                      |
| ------ | ---------------------------------------------------------------------------------------- | -------------------------------- |
| GET    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation`         | Get all evaluation records       |
| GET    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id`     | Get evaluation record by ID      |
| POST   | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation`         | Create new evaluation record     |
| PUT    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id`     | Update evaluation record         |
| DELETE | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id`     | Delete evaluation record         |

#### Request Examples

**Create Supplier Evaluation:**

```json
POST /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
Content-Type: application/json

{
  "kode": "EVAL-20241107001",
  "tanggal": "2024-11-07",
  "supplier": "supplier_document_id",
  "material": "material_document_id",
  "kualitas": 4,
  "ketepatan_waktu": 5,
  "pelayanan": 4,
  "harga": 4,
  "total_skor": 4.25,
  "catatan": "Supplier menunjukkan performa yang baik dalam hal pengiriman tepat waktu dan kualitas material yang sesuai",
  "evaluator": "Purchasing Manager",
  "evaluatedBy": "John Doe"
}
```

**Update Supplier Evaluation:**

```json
PUT /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/1
Content-Type: application/json

{
  "kualitas": 5,
  "ketepatan_waktu": 5,
  "pelayanan": 5,
  "harga": 4,
  "total_skor": 4.75,
  "catatan": "Update evaluasi setelah review ulang terhadap performa supplier",
  "evaluator": "Senior Purchasing Manager"
}
```

**Evaluation with Detailed Performance Metrics:**

```json
POST /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
Content-Type: application/json

{
  "kode": "EVAL-20241107002",
  "tanggal": "2024-11-07",
  "supplier": "supplier_document_id",
  "material": "material_document_id",
  "kualitas": 5,
  "ketepatan_waktu": 3,
  "pelayanan": 4,
  "harga": 4,
  "total_skor": 4.0,
  "catatan": "Kualitas produk sangat baik namun ada kendala pada ketepatan waktu pengiriman",
  "evaluator": "QC Team Lead",
  "evaluatedBy": "John Doe",
  "evaluation_period": "Monthly",
  "purchase_order_reference": "po_document_id",
  "goods_receipt_reference": "goods_receipt_document_id",
  "performance_kualitas": {
    "product_quality": 5,
    "specification_compliance": 5,
    "defect_rate": 4,
    "consistency": 5
  },
  "performance_waktu": {
    "delivery_on_time": 3,
    "lead_time": 4,
    "response_time": 4,
    "order_processing": 4
  },
  "performance_pelayanan": {
    "communication": 4,
    "problem_resolution": 4,
    "flexibility": 4,
    "documentation": 4
  },
  "performance_harga": {
    "price_competitiveness": 4,
    "payment_terms": 4,
    "discount_offers": 4,
    "cost_effectiveness": 4
  },
  "status_harga": "Good",
  "status_kualitas": "Excellent",
  "status_pengiriman": "Fair",
  "recommendation": "Continue",
  "next_evaluation_date": "2025-02-07",
  "improvement_notes": "Perlu diperhatikan untuk ketepatan waktu pengiriman agar lebih konsisten",
  "notes": "Evaluasi lengkap dengan metrik performa detail"
}
```

---

## Schema JSON

### Supplier Evaluation Schema

```json
{
  "kind": "collectionType",
  "collectionName": "supplier_evaluations",
  "info": {
    "singularName": "supplier-evaluation",
    "pluralName": "supplier-evaluations",
    "displayName": "Supplier Evaluation",
    "description": "Supplier performance evaluation system for purchasing management"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "kode": {
      "type": "string",
      "required": true,
      "unique": true,
      "maxLength": 50,
      "regex": "^EVAL-[0-9]{8,15}$"
    },
    "tanggal": {
      "type": "date",
      "required": true
    },
    "supplier": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::supplier.supplier",
      "inversedBy": "evaluations"
    },
    "material": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::material.material",
      "inversedBy": "evaluations"
    },
    "kualitas": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5,
      "default": 3
    },
    "ketepatan_waktu": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5,
      "default": 3
    },
    "pelayanan": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5,
      "default": 3
    },
    "harga": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5,
      "default": 3
    },
    "total_skor": {
      "type": "decimal",
      "required": true,
      "min": 1,
      "max": 5,
      "default": 3
    },
    "catatan": {
      "type": "text",
      "maxLength": 1000
    },
    "evaluator": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "evaluatedBy": {
      "type": "string",
      "maxLength": 100
    },
    "evaluation_period": {
      "type": "enumeration",
      "enum": ["Weekly", "Monthly", "Quarterly", "Annually", "Project-Based"],
      "default": "Monthly"
    },
    "purchase_order_reference": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::purchase-order.purchase-order",
      "inversedBy": "evaluations"
    },
    "goods_receipt_reference": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::penerimaan-material.penerimaan-material",
      "inversedBy": "evaluations"
    },
    "performance_kualitas": {
      "type": "json",
      "default": {
        "product_quality": 0,
        "specification_compliance": 0,
        "defect_rate": 0,
        "consistency": 0
      }
    },
    "performance_waktu": {
      "type": "json",
      "default": {
        "delivery_on_time": 0,
        "lead_time": 0,
        "response_time": 0,
        "order_processing": 0
      }
    },
    "performance_pelayanan": {
      "type": "json",
      "default": {
        "communication": 0,
        "problem_resolution": 0,
        "flexibility": 0,
        "documentation": 0
      }
    },
    "performance_harga": {
      "type": "json",
      "default": {
        "price_competitiveness": 0,
        "payment_terms": 0,
        "discount_offers": 0,
        "cost_effectiveness": 0
      }
    },
    "status_harga": {
      "type": "enumeration",
      "enum": ["Excellent", "Good", "Fair", "Poor"],
      "default": "Good"
    },
    "status_kualitas": {
      "type": "enumeration",
      "enum": ["Excellent", "Good", "Fair", "Poor"],
      "default": "Good"
    },
    "status_pengiriman": {
      "type": "enumeration",
      "enum": ["Excellent", "Good", "Fair", "Poor"],
      "default": "Good"
    },
    "recommendation": {
      "type": "enumeration",
      "enum": ["Continue", "Monitor", "Improve", "Terminate"],
      "default": "Continue"
    },
    "next_evaluation_date": {
      "type": "date"
    },
    "improvement_notes": {
      "type": "text",
      "maxLength": 2000
    },
    "notes": {
      "type": "text"
    }
  }
}
```

---

## Relations

### Supplier Evaluation Relations

- `supplier` (Many-to-One) → Supplier Management
- `material` (Many-to-One) → Material Management
- `evaluatedBy` (Text) → Name of evaluator
- `purchase_order_reference` (Many-to-One) → Purchase Order Management
- `goods_receipt_reference` (Many-to-One) → Goods Receipt System

### Related Systems Connection

The Supplier Evaluation system is connected with:

**Purchase Request Flow:**
- Purchase Request → Purchase Order → Goods Receipt → Supplier Evaluation

**Data Flow:**
1. **Purchase Request** (`api::permintaan-pembelian.permintaan-pembelian`) initiates procurement
2. **Purchase Order** (`api::purchase-order.purchase-order`) formalizes the purchase
3. **Goods Receipt** (`api::penerimaan-material.penerimaan-material`) records material delivery
4. **Supplier Evaluation** (`api::supplier-evaluation.supplier-evaluation`) evaluates supplier performance

**Connection Fields:**
- `purchase_order_reference` links to specific PO for evaluation context
- `goods_receipt_reference` links to specific goods receipt for quality verification
- `supplier` links to supplier being evaluated
- `material` links to specific material being evaluated
- `evaluatedBy` stores the name of user who performed the evaluation

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

- `find` - Get all evaluation records with basic filters
- `findOne` - Get single evaluation record by documentId

**Authenticated (Full Access):**

- `create` - Create new evaluation record
- `update` - Update existing evaluation record
- `delete` - Delete evaluation record

**Role-Based Access:**

- **Admin**: Full access to all operations
- **Purchasing**: Create, update, and delete evaluations
- **QC**: Update quality ratings and add quality notes
- **Manager**: Read-only access with approval capabilities
- **Supplier**: View own evaluations (limited access)

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Rating harus di antara 1 dan 5",
    "details": {
      "kualitas": "Rating kualitas harus di antara 1 dan 5"
    }
  }
}
```

**Duplicate Code Error (409):**

```json
{
  "error": {
    "status": 409,
    "name": "ConflictError",
    "message": "Kode evaluasi sudah ada"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Supplier evaluation not found"
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
?sort=tanggal:desc
?sort=createdAt:asc
?sort=total_skor:desc
```

### Filtering

```
?filters[supplier][documentId][$eq]=supplier_id
?filters[tanggal][$gte]=2024-11-01
?filters[tanggal][$lte]=2024-11-30
?filters[total_skor][$gte]=4
?filters[recommendation][$eq]=Continue
?filters[status_harga][$eq]=Excellent
?filters[material][documentId][$eq]=material_id
```

### Population (Relations)

```
?populate=*
?populate[0]=supplier&populate[1]=purchase_order_reference
?populate[0]=supplier&populate[1]=goods_receipt_reference
?populate[0]=supplier&populate[1]=material&populate[2]=evaluatedBy
```

## Usage Examples

### Advanced Filtering with Performance Metrics

```javascript
const params = {
  page: 1,
  pageSize: 25,
  supplier: "supplier_document_id",
  material: "material_document_id",
  startDate: "2024-11-01",
  endDate: "2024-11-30",
  minRating: 4,
  recommendation: "Continue",
  sort: "total_skor:desc",
  populate: "supplier,material,evaluatedBy",
};

// API call
const response = await api.get(
  "/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation",
  { params }
);
```

### Supplier Performance Analysis

```javascript
const analysisParams = {
  supplier: "supplier_document_id",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  populate: "supplier,material,evaluatedBy",
  sort: "tanggal:desc"
};

// Get all evaluations for a supplier
const response = await api.get(
  "/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation",
  { params: analysisParams }
);

// Calculate performance averages
const evaluations = response.data.results;
const avgQuality = evaluations.reduce((sum, eval) => sum + eval.kualitas, 0) / evaluations.length;
const avgTimeliness = evaluations.reduce((sum, eval) => sum + eval.ketepatan_waktu, 0) / evaluations.length;
const avgService = evaluations.reduce((sum, eval) => sum + eval.pelayanan, 0) / evaluations.length;
const avgPrice = evaluations.reduce((sum, eval) => sum + eval.harga, 0) / evaluations.length;
```

### Create Evaluation from Purchase Order and Goods Receipt

```javascript
const evaluationData = {
  kode: `EVAL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
  tanggal: new Date().toISOString().split('T')[0],
  supplier: purchaseOrder.supplier.documentId,
  material: goodsReceipt.material.documentId,
  purchase_order_reference: purchaseOrder.documentId,
  goods_receipt_reference: goodsReceipt.documentId,
  evaluatedBy: "John Doe",
  kualitas: 4,
  ketepatan_waktu: 5,
  pelayanan: 4,
  harga: 4,
  total_skor: 4.25,
  catatan: `Evaluasi berdasarkan PO ${purchaseOrder.kode} dan penerimaan material ${goodsReceipt.poNumber}`,
  evaluator: "Purchasing Department",
  evaluation_period: "Project-Based",
  performance_kualitas: {
    product_quality: 4,
    specification_compliance: 5,
    defect_rate: 4,
    consistency: 4
  },
  performance_waktu: {
    delivery_on_time: 5,
    lead_time: 4,
    response_time: 4,
    order_processing: 5
  },
  status_harga: "Good",
  status_kualitas: "Good",
  status_pengiriman: "Excellent",
  recommendation: "Continue",
  next_evaluation_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
};

const response = await api.post(
  "/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation",
  evaluationData
);
```

## Best Practices

1. **Always validate ratings** before creating or updating evaluations (1-5 scale)
2. **Use consistent evaluation codes** with format EVAL-YYYYMMDD-XXX
3. **Link evaluations to actual transactions** via purchase_order_reference and goods_receipt_reference
4. **Provide detailed notes** for ratings below 3 to justify low scores
5. **Use appropriate performance metrics** in JSON fields for detailed analysis
6. **Set next evaluation dates** for regular supplier monitoring
7. **Calculate total_skor** as average of all rating components
8. **Use proper date formats** (YYYY-MM-DD) for tanggal fields
9. **Document improvement recommendations** for suppliers with low ratings
10. **Maintain evaluation consistency** across the same supplier for fair comparison
11. **Always link to specific material** being evaluated for accurate tracking
12. **Assign proper evaluator** via evaluatedBy text field for accountability

## Testing Examples

### Test Supplier Evaluation Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "kode": "EVAL-20241107001",
    "tanggal": "2024-11-07",
    "supplier": "supplier_document_id",
    "material": "material_document_id",
    "kualitas": 4,
    "ketepatan_waktu": 5,
    "pelayanan": 4,
    "harga": 4,
    "total_skor": 4.25,
    "catatan": "Performa supplier sangat baik",
    "evaluator": "Test User",
    "evaluatedBy": "John Doe"
  }'
```

### Test Supplier Evaluation Search

```bash
curl -X GET \
  'http://localhost:1340/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation?filters[supplier][documentId][$eq]=supplier_id&filters[total_skor][$gte]=4&populate=supplier&populate=material' \
  -H 'Authorization: Bearer <token>'
```

## Integration with Related Systems

### Purchase Order Integration

```javascript
// After completing goods receipt, trigger supplier evaluation
const createEvaluationFromOrder = async (purchaseOrderId, goodsReceiptId, userId) => {
  const purchaseOrder = await getPurchaseOrder(purchaseOrderId);
  const goodsReceipt = await getGoodsReceipt(goodsReceiptId);

  const evaluationData = {
    kode: generateEvaluationCode(),
    tanggal: new Date().toISOString().split('T')[0],
    supplier: purchaseOrder.supplier.documentId,
    material: goodsReceipt.material.documentId,
    purchase_order_reference: purchaseOrder.documentId,
    goods_receipt_reference: goodsReceipt.documentId,
    evaluatedBy: "John Doe",
    // ... other evaluation fields based on actual performance
  };

  return await createSupplierEvaluation(evaluationData);
};
```

### Supplier Rating Update

```javascript
// Update supplier master data based on latest evaluations
const updateSupplierRating = async (supplierDocumentId) => {
  const evaluations = await getSupplierEvaluations({
    supplier: supplierDocumentId,
    pageSize: 100,
    populate: "material"
  });

  if (evaluations.results.length > 0) {
    const avgRating = evaluations.results.reduce((sum, eval) =>
      sum + eval.total_skor, 0) / evaluations.results.length;

    await updateSupplier(supplierDocumentId, {
      rating: Math.round(avgRating * 10) / 10,
      lastEvaluationDate: new Date().toISOString()
    });
  }
};
```

---

**Note**: Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten. Gunakan format document ID untuk relasi antar content types. Supplier Evaluation system terintegrasi dengan Purchase Request, Purchase Order, Goods Receipt, Material, dan User management systems untuk evaluasi performa supplier yang komprehensif.