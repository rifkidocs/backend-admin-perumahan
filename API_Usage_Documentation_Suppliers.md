# API Usage Documentation - Suppliers System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Suppliers dengan 2 content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Data Models

### Material Model

```json
{
  "id": 1,
  "name": "Portland Cement",
  "code": "CEM-001",
  "category": "Cement",
  "unit": "Bag",
  "description": "High-quality Portland cement for construction",
  "specifications": {
    "strength": "32.5 MPa",
    "settingTime": "45 min",
    "color": "Grey"
  },
  "suppliers": [
    {
      "id": 1,
      "name": "PT. Material Supplier",
      "price": 75000,
      "currency": "IDR",
      "unit": "Bag",
      "minOrderQuantity": 100,
      "leadTime": 7,
      "isPreferred": true
    }
  ],
  "status": "active",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Supplier Model

```json
{
  "id": 1,
  "name": "PT. Material Supplier",
  "email": "info@materialsupplier.com",
  "phone": "+62-21-12345678",
  "address": "Jl. Supplier No. 123, Jakarta",
  "website": "https://www.materialsupplier.com",
  "taxId": "12.345.678.9-012.000",
  "registrationNumber": "1234567890123456",
  "establishedDate": "2010-01-15",
  "businessType": "Construction Materials",
  "specialization": "Cement, Steel, Bricks",
  "certifications": ["ISO 9001:2015", "SNI"],
  "status": "active",
  "rating": 4.5,
  "paymentTerms": "Net 30",
  "deliveryTerms": "FOB",
  "notes": "Reliable supplier with good quality materials",
  "materials": [
    {
      "id": 1,
      "name": "Portland Cement",
      "price": 75000,
      "currency": "IDR",
      "unit": "Bag",
      "minOrderQuantity": 100,
      "leadTime": 7,
      "isPreferred": true
    },
    {
      "id": 2,
      "name": "Steel Rebar",
      "price": 15000,
      "currency": "IDR",
      "unit": "Meter",
      "minOrderQuantity": 500,
      "leadTime": 14,
      "isPreferred": false
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Content Types API Endpoints

### 1. Materials API (`api::material.material`)

#### Base URL

```
/content-manager/collection-types/api::material.material
```

#### Fields
- `name` (String, Required): Material name
- `code` (String, Required): Unique material code
- `category` (String, Required): Material category
- `unit` (String, Required): Unit of measurement
- `description` (Text): Material description
- `specifications` (Object): Material specifications
  - `weight` (Number): Weight per unit
  - `dimensions` (Object): Dimensions (length, width, height)
  - `color` (String): Color
  - `brand` (String): Brand
  - `model` (String): Model
- `price` (Number): Standard price per unit
- `stock` (Integer): Current stock quantity
- `minStock` (Integer): Minimum stock level
- `suppliers` (Array of Integers): List of supplier IDs
- `status` (String): Material status (active/discontinued)
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

#### Endpoints

| Method | Endpoint                                                               | Description             |
| ------ | ---------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::material.material`              | Get all materials       |
| GET    | `/content-manager/collection-types/api::material.material/:id`          | Get material by ID      |
| POST   | `/content-manager/collection-types/api::material.material`             | Create new material     |
| PUT    | `/content-manager/collection-types/api::material.material/:id`          | Update material         |
| DELETE | `/content-manager/collection-types/api::material.material/:id`          | Delete material         |
| GET    | `/content-manager/collection-types/api::material.material/:id/suppliers` | Get suppliers for a material |

#### Request Examples

**Create Material:**

```json
POST /content-manager/collection-types/api::material.material
Content-Type: application/json

{
  "name": "Semen Portland",
  "code": "MAT-001",
  "category": "Material Bangunan",
  "unit": "sak",
  "description": "Semen Portland berkualitas tinggi untuk konstruksi",
  "specifications": {
    "weight": 50,
    "dimensions": {
      "length": 60,
      "width": 40,
      "height": 15
    },
    "color": "Abu-abu",
    "brand": "Holcim",
    "model": "Portland Type 1"
  },
  "price": 85000,
  "stock": 500,
  "minStock": 100,
  "suppliers": [1, 2, 3],
  "status": "active"
}
```

**Update Material:**

```json
PUT /content-manager/collection-types/api::material.material/1
Content-Type: application/json

{
  "price": 90000,
  "stock": 450,
  "status": "active"
}
```

**Associate Material with Supplier:**

```json
POST /content-manager/collection-types/api::material.material/1/suppliers
Content-Type: application/json

{
  "supplierId": 1,
  "price": 75000,
  "currency": "IDR",
  "unit": "sak",
  "minOrderQuantity": 100,
  "leadTime": 7,
  "isPreferred": true
}
```

**Get Suppliers for a Material:**

```json
GET /content-manager/collection-types/api::material.material/1/suppliers
Content-Type: application/json
```

---

### 2. Suppliers API (`api::supplier.supplier`)

#### Base URL

```
/content-manager/collection-types/api::supplier.supplier
```

#### Fields
- `code` (String, Required): Unique supplier code
- `name` (String, Required): Supplier name
- `type` (String, Required): Supplier type (Perusahaan/Individu)
- `contact` (Object, Required): Contact information
  - `name` (String): Contact person name
  - `position` (String): Contact person position
  - `phone` (String): Phone number
  - `email` (String): Email address
- `address` (String, Required): Supplier address
- `materials` (Array of Strings): List of materials supplied
- `rating` (Number): Supplier rating (1-5)
- `status` (String): Supplier status (active/inactive)
- `lastPurchase` (Date): Last purchase date
- `totalPurchases` (Integer): Total purchase amount
- `documents` (Array of Strings): List of document files
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

#### Endpoints

| Method | Endpoint                                                               | Description             |
| ------ | ---------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::supplier.supplier`             | Get all suppliers       |
| GET    | `/content-manager/collection-types/api::supplier.supplier/:id`          | Get supplier by ID      |
| POST   | `/content-manager/collection-types/api::supplier.supplier`             | Create new supplier     |
| PUT    | `/content-manager/collection-types/api::supplier.supplier/:id`          | Update supplier         |
| DELETE | `/content-manager/collection-types/api::supplier.supplier/:id`          | Delete supplier         |

#### Request Examples

**Create Supplier:**

```json
POST /content-manager/collection-types/api::supplier.supplier
Content-Type: application/json

{
  "code": "SUP-001",
  "name": "PT Bangun Jaya",
  "type": "Perusahaan",
  "contact": {
    "name": "Budi Santoso",
    "position": "Manager",
    "phone": "081234567891",
    "email": "budi@bangunjaya.com"
  },
  "address": "Jl. Industri No. 123, Jakarta Timur",
  "materials": ["Semen", "Bata", "Cat"],
  "rating": 4.5,
  "status": "active",
  "lastPurchase": "2024-03-15",
  "totalPurchases": 1500000000,
  "documents": ["npwp.pdf", "siup.pdf", "akta.pdf"]
}
```

**Update Supplier:**

```json
PUT /content-manager/collection-types/api::supplier.supplier/1
Content-Type: application/json

{
  "name": "PT Bangun Jaya Updated",
  "status": "inactive",
  "rating": 4.2
}
```

---

### 2. Purchase Orders API (`api::purchase-order.purchase-order`)

#### Base URL

```
/content-manager/collection-types/api::purchase-order.purchase-order
```

#### Fields
- `poNumber` (String, Required): Unique purchase order number
- `date` (Date, Required): Purchase order date
- `supplier` (Integer, Required): Supplier ID (relation)
- `materials` (Array of Objects, Required): List of materials
  - `name` (String): Material name
  - `quantity` (Integer): Quantity
  - `unit` (String): Unit of measurement
  - `price` (Integer): Price per unit
  - `quality` (Number): Quality rating (1-5)
- `totalAmount` (Integer): Total amount
- `status` (String): Order status (pending/processing/completed/delivered/cancelled)
- `deliveryDate` (Date): Expected delivery date
- `paymentTerms` (String): Payment terms
- `notes` (String): Additional notes
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

#### Endpoints

| Method | Endpoint                                                               | Description             |
| ------ | ---------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::purchase-order.purchase-order`  | Get all purchase orders |
| GET    | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Get PO by ID            |
| POST   | `/content-manager/collection-types/api::purchase-order.purchase-order`  | Create new PO           |
| PUT    | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Update PO               |
| DELETE | `/content-manager/collection-types/api::purchase-order.purchase-order/:id` | Delete PO               |

#### Request Examples

**Create Purchase Order:**

```json
POST /content-manager/collection-types/api::purchase-order.purchase-order
Content-Type: application/json

{
  "poNumber": "PO-2024-001",
  "date": "2024-03-15",
  "supplier": 1,
  "materials": [
    {
      "name": "Semen Portland",
      "quantity": 100,
      "unit": "sak",
      "price": 85000,
      "quality": 4.5
    }
  ],
  "totalAmount": 8500000,
  "status": "completed",
  "deliveryDate": "2024-03-20",
  "paymentTerms": "Net 30",
  "notes": "Pengiriman ke gudang utama"
}
```

**Update Purchase Order Status:**

```json
PUT /content-manager/collection-types/api::purchase-order.purchase-order/1
Content-Type: application/json

{
  "status": "delivered",
  "deliveryDate": "2024-03-19",
  "notes": "Diterima dengan baik, kualitas sesuai"
}
```

---

### 3. Supplier Evaluations API (`api::supplier-evaluation.supplier-evaluation`)

#### Base URL

```
/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
```

#### Fields
- `supplier` (Integer, Required): Supplier ID (relation)
- `date` (Date, Required): Evaluation date
- `material` (String): Material being evaluated
- `priceRating` (Number): Price rating (1-5)
- `qualityRating` (Number): Quality rating (1-5)
- `deliveryRating` (Number): Delivery rating (1-5)
- `overallRating` (Number): Overall rating (1-5)
- `notes` (String): Evaluation notes
- `evaluatedBy` (Integer, Required): User ID who performed evaluation
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

#### Endpoints

| Method | Endpoint                                                               | Description             |
| ------ | ---------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation` | Get all evaluations |
| GET    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id` | Get evaluation by ID |
| POST   | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation` | Create new evaluation |
| PUT    | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id` | Update evaluation |
| DELETE | `/content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/:id` | Delete evaluation |

#### Request Examples

**Create Supplier Evaluation:**

```json
POST /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation
Content-Type: application/json

{
  "supplier": 1,
  "date": "2024-03-15",
  "material": "Semen Portland",
  "priceRating": 4,
  "qualityRating": 5,
  "deliveryRating": 4,
  "overallRating": 4.3,
  "notes": "Kualitas sangat baik, harga kompetitif",
  "evaluatedBy": 1
}
```

**Update Supplier Evaluation:**

```json
PUT /content-manager/collection-types/api::supplier-evaluation.supplier-evaluation/1
Content-Type: application/json

{
  "priceRating": 3,
  "overallRating": 4.0,
  "notes": "Harga sedikit naik namun kualitas tetap baik"
}
```

---

## Relations

### Material Relations

- `suppliers` (Many-to-Many) → Suppliers that provide this material

### Supplier Relations

- `contact` (One-to-One) → Contact Information
- `materials` (Many-to-Many) → Materials supplied by this supplier
- `documents` (One-to-Many) → Documents

### Purchase Order Relations

- `supplier` (Many-to-One) → Supplier
- `materials` (One-to-Many) → Order Items

### Supplier Evaluation Relations

- `supplier` (Many-to-One) → Supplier
- `evaluatedBy` (Many-to-One) → User

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

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "path": ["name"],
          "message": "name is a required field",
          "code": "required"
        }
      ]
    }
  },
  "meta": {}
}
```

**Not Found Error (404):**

```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Entity not found",
    "details": {}
  },
  "meta": {}
}
```

**Unauthorized Error (401):**

```json
{
  "data": null,
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Unauthorized",
    "details": {}
  },
  "meta": {}
}
```

### Material-Specific Errors

**Duplicate Material Code Error:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Material code already exists",
    "details": {}
  },
  "meta": {}
}
```

**Invalid Category Error:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Invalid material category",
    "details": {}
  },
  "meta": {}
}
```

**Insufficient Stock Error:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Insufficient stock for material",
    "details": {
      "materialId": 1,
      "materialName": "Portland Cement",
      "requested": 100,
      "available": 50,
      "unit": "Bag"
    }
  },
  "meta": {}
}
```

**Material Below Minimum Stock:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Material stock is below minimum level",
    "details": {
      "materialId": 1,
      "materialName": "Steel Rebar",
      "currentStock": 5,
      "minStock": 10,
      "unit": "Meter"
    }
  },
  "meta": {}
}
```

### Supplier-Specific Errors

**Duplicate Supplier Code Error:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Supplier code already exists",
    "details": {}
  },
  "meta": {}
}
```

**Duplicate Email Error:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Email already exists",
    "details": {}
  },
  "meta": {}
}
```

**Invalid Tax ID Format:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Invalid tax ID format",
    "details": {}
  },
  "meta": {}
}
```

**Supplier Rating Out of Range:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Supplier rating must be between 1 and 5",
    "details": {
      "provided": 6,
      "min": 1,
      "max": 5
    }
  },
  "meta": {}
}
```

### Material-Supplier Relationship Errors

**Material Already Associated with Supplier:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Material is already associated with this supplier",
    "details": {
      "materialId": 1,
      "materialName": "Portland Cement",
      "supplierId": 2,
      "supplierName": "PT. Material Supplier"
    }
  },
  "meta": {}
}
```

**Invalid Price Value:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "Application Error",
    "message": "Price must be a positive number",
    "details": {
      "provided": -50000,
      "materialId": 1,
      "supplierId": 2
    }
  },
  "meta": {}
}
```

**Invalid Lead Time:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Lead time must be a positive integer",
    "details": {
      "provided": -5,
      "materialId": 1,
      "supplierId": 2
    }
  },
  "meta": {}
}
```

### Purchase Order Errors

**Invalid PO Number:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Purchase order number already exists",
    "details": {
      "poNumber": "PO-2024-001"
    }
  },
  "meta": {}
}
```

**Invalid Total Amount:**

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Total amount does not match sum of material prices",
    "details": {
      "calculated": 8500000,
      "provided": 8000000
    }
  },
  "meta": {}
}
```

## Query Parameters

### Pagination

- `pagination[page]`: Page number (default: 1)
- `pagination[pageSize]`: Number of items per page (default: 25, max: 100)

Example: `GET /api/suppliers?pagination[page]=2&pagination[pageSize]=10`

Example: `GET /api/materials?pagination[page]=2&pagination[pageSize]=10`

### Sorting

- `sort`: Field to sort by (prefix with `-` for descending order)

Example: `GET /api/suppliers?sort=name` or `GET /api/suppliers?sort=-createdAt`

Example: `GET /api/materials?sort=name` or `GET /api/materials?sort=-createdAt`

### Filtering

- `filters[field][$eq]`: Exact match
- `filters[field][$ne]`: Not equal
- `filters[field][$lt]`: Less than
- `filters[field][$lte]`: Less than or equal
- `filters[field][$gt]`: Greater than
- `filters[field][$gte]`: Greater than or equal
- `filters[field][$in]`: In array
- `filters[field][$nin]`: Not in array
- `filters[field][$contains]`: Contains (string)
- `filters[field][$containsi]`: Contains (case-insensitive)
- `filters[field][$startsWith]`: Starts with
- `filters[field][$endsWith]`: Ends with

Example: `GET /api/suppliers?filters[name][$containsi]=construction&filters[isActive][$eq]=true`

Example: `GET /api/materials?filters[name][$containsi]=cement&filters[category][$eq]=Material Bangunan`

Example: `GET /api/materials?filters[stock][$lt]=10` (Get materials with low stock)

### Population

- `populate`: Specify related fields to populate

Example: `GET /api/suppliers?populate=purchaseOrders&populate=evaluations&populate=materials`

Example: `GET /api/materials?populate=suppliers`

Example: `GET /api/materials?populate=suppliers&filters[suppliers][id][$eq]=1` (Get materials from a specific supplier)

## Usage Examples

### JavaScript Examples

#### Fetching All Suppliers

```javascript
// Using fetch API
const getSuppliers = async () => {
  try {
    const response = await fetch('/content-manager/collection-types/api::supplier.supplier', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

// Usage
getSuppliers()
  .then(suppliers => {
    console.log('Suppliers:', suppliers);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Creating a New Supplier

```javascript
const createSupplier = async (supplierData) => {
  try {
    const response = await fetch('/content-manager/collection-types/api::supplier.supplier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify(supplierData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to create supplier');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

// Usage
const newSupplier = {
  code: 'SUP-001',
  name: 'PT. Material Supplier',
  type: 'Perusahaan',
  contact: {
    name: 'John Doe',
    position: 'Manager',
    phone: '+62-21-12345678',
    email: 'info@materialsupplier.com'
  },
  address: 'Jakarta, Indonesia',
  rating: 4
};

createSupplier(newSupplier)
  .then(supplier => {
    console.log('Created supplier:', supplier);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Managing Materials

```javascript
// Get all materials
const getMaterials = async () => {
  try {
    const response = await fetch('/content-manager/collection-types/api::material.material', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

// Create a new material
const createMaterial = async (materialData) => {
  try {
    const response = await fetch('/content-manager/collection-types/api::material.material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify(materialData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to create material');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

// Usage
const newMaterial = {
  name: 'Portland Cement',
  code: 'CEM-001',
  category: 'Cement',
  unit: 'Bag',
  description: 'High-quality Portland cement for construction',
  price: 75000,
  stock: 100,
  minStock: 20
};

createMaterial(newMaterial)
  .then(material => {
    console.log('Created material:', material);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Managing Supplier-Material Relationships

```javascript
// Associate material with supplier
const associateMaterialWithSupplier = async (materialId, supplierData) => {
  try {
    const response = await fetch(`/content-manager/collection-types/api::material.material/${materialId}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify(supplierData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to associate material with supplier');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error associating material with supplier:', error);
    throw error;
  }
};

// Usage
const materialAssociation = {
  supplierId: 1,
  price: 75000,
  currency: 'IDR',
  unit: 'Bag',
  minOrderQuantity: 100,
  leadTime: 7,
  isPreferred: true
};

associateMaterialWithSupplier(1, materialAssociation)
  .then(association => {
    console.log('Created association:', association);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

#### Calculate Supplier Performance

```javascript
// Calculate average rating for a supplier
async function calculateSupplierPerformance(supplierId) {
  const response = await fetch(`/content-manager/collection-types/api::supplier.supplier/${supplierId}?populate=evaluations`);
  const data = await response.json();
  
  const evaluations = data.data.attributes.evaluations.data;
  
  if (evaluations.length === 0) {
    return 0;
  }
  
  const totalRating = evaluations.reduce((sum, evaluation) => {
    return sum + evaluation.attributes.overallRating;
  }, 0);
  
  return totalRating / evaluations.length;
}
```

#### Calculate Purchase Order Total

```javascript
// Calculate total amount for a purchase order
async function calculatePurchaseOrderTotal(purchaseOrderId) {
  const response = await fetch(`/content-manager/collection-types/api::purchase-order.purchase-order/${purchaseOrderId}?populate=materials`);
  const data = await response.json();
  
  const materials = data.data.attributes.materials;
  
  const total = materials.reduce((sum, material) => {
    return sum + (material.quantity * material.price);
  }, 0);
  
  return total;
}
```

#### Get Materials with Low Stock

```javascript
// Get materials with stock below minimum level
async function getLowStockMaterials() {
  const response = await fetch('/content-manager/collection-types/api::material.material?filters[stock][$lt]=minStock');
  const data = await response.json();
  
  return data.data;
}
```

#### Find Suppliers for a Material

```javascript
// Find all suppliers for a specific material
async function findSuppliersForMaterial(materialId) {
  const response = await fetch(`/content-manager/collection-types/api::material.material/${materialId}/suppliers`);
  const data = await response.json();
  
  return data.data;
}
```

#### Calculate Material Value

```javascript
// Calculate total value of all materials in stock
async function calculateTotalMaterialValue() {
  const response = await fetch('/content-manager/collection-types/api::material.material');
  const data = await response.json();
  
  const totalValue = data.data.reduce((sum, material) => {
    return sum + (material.attributes.price * material.attributes.stock);
  }, 0);
  
  return totalValue;
}
```

#### Supplier Performance Analysis

```javascript
// Example calculation for supplier performance
const supplier = {
  totalPurchases: 1500000000,
  purchaseCount: 25,
  averageRating: 4.5,
  onTimeDeliveryRate: 0.92,
  qualityScore: 4.3
};

const averagePurchaseValue = supplier.totalPurchases / supplier.purchaseCount;
const performanceScore = (
  supplier.averageRating * 0.3 +
  supplier.onTimeDeliveryRate * 5 * 0.4 +
  supplier.qualityScore * 0.3
);

console.log(`Average Purchase Value: ${averagePurchaseValue}`);
console.log(`Performance Score: ${performanceScore}`);
```

#### Purchase Order Total Calculation

```javascript
// Example calculation for PO total
const materials = [
  { name: "Semen", quantity: 100, unit: "sak", price: 85000 },
  { name: "Bata", quantity: 5000, unit: "pcs", price: 1200 },
  { name: "Cat", quantity: 20, unit: "kaleng", price: 75000 }
];

const subtotal = materials.reduce((total, material) => {
  return total + (material.quantity * material.price);
}, 0);

const taxRate = 0.11; // 11% PPN
const taxAmount = subtotal * taxRate;
const totalAmount = subtotal + taxAmount;

console.log(`Subtotal: ${subtotal}`);
console.log(`Tax Amount: ${taxAmount}`);
console.log(`Total Amount: ${totalAmount}`);
```

### Python

#### Fetching All Suppliers

```python
import requests

def get_suppliers():
    url = 'https://api.example.com/content-manager/collection-types/api::supplier.supplier'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['data']
    except requests.exceptions.RequestException as e:
        print(f'Error fetching suppliers: {e}')
        raise

# Usage
try:
    suppliers = get_suppliers()
    print('Suppliers:', suppliers)
except Exception as e:
    print(f'Error: {e}')
```

#### Creating a New Supplier

```python
import requests

def create_supplier(supplier_data):
    url = 'https://api.example.com/content-manager/collection-types/api::supplier.supplier'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    }
    
    try:
        response = requests.post(url, headers=headers, json=supplier_data)
        response.raise_for_status()
        return response.json()['data']
    except requests.exceptions.RequestException as e:
        print(f'Error creating supplier: {e}')
        raise

# Usage
new_supplier = {
    'code': 'SUP-001',
    'name': 'PT. Material Supplier',
    'type': 'Perusahaan',
    'contact': {
        'name': 'John Doe',
        'position': 'Manager',
        'phone': '+62-21-12345678',
        'email': 'info@materialsupplier.com'
    },
    'address': 'Jakarta, Indonesia',
    'rating': 4
}

try:
    supplier = create_supplier(new_supplier)
    print('Created supplier:', supplier)
except Exception as e:
    print(f'Error: {e}')
```

#### Managing Materials

```python
import requests

def get_materials():
    url = 'https://api.example.com/content-manager/collection-types/api::material.material'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['data']
    except requests.exceptions.RequestException as e:
        print(f'Error fetching materials: {e}')
        raise

def create_material(material_data):
    url = 'https://api.example.com/content-manager/collection-types/api::material.material'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    }
    
    try:
        response = requests.post(url, headers=headers, json=material_data)
        response.raise_for_status()
        return response.json()['data']
    except requests.exceptions.RequestException as e:
        print(f'Error creating material: {e}')
        raise

# Usage
new_material = {
    'name': 'Portland Cement',
    'code': 'CEM-001',
    'category': 'Cement',
    'unit': 'Bag',
    'description': 'High-quality Portland cement for construction',
    'price': 75000,
    'stock': 100,
    'minStock': 20
}

try:
    material = create_material(new_material)
    print('Created material:', material)
except Exception as e:
    print(f'Error: {e}')
```

#### Managing Supplier-Material Relationships

```python
import requests

def associate_material_with_supplier(material_id, supplier_data):
    url = f'https://api.example.com/content-manager/collection-types/api::material.material/{material_id}/suppliers'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    }
    
    try:
        response = requests.post(url, headers=headers, json=supplier_data)
        response.raise_for_status()
        return response.json()['data']
    except requests.exceptions.RequestException as e:
        print(f'Error associating material with supplier: {e}')
        raise

# Usage
material_association = {
    'supplierId': 1,
    'price': 75000,
    'currency': 'IDR',
    'unit': 'Bag',
    'minOrderQuantity': 100,
    'leadTime': 7,
    'isPreferred': True
}

try:
    association = associate_material_with_supplier(1, material_association)
    print('Created association:', association)
except Exception as e:
    print(f'Error: {e}')
```

## Testing the API

### Testing with curl

#### Test Supplier Endpoints

```bash
# Get all suppliers
curl -X GET "https://api.example.com/content-manager/collection-types/api::supplier.supplier" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a new supplier
curl -X POST "https://api.example.com/content-manager/collection-types/api::supplier.supplier" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "SUP-001",
    "name": "PT. Material Supplier",
    "type": "Perusahaan",
    "contact": {
      "name": "John Doe",
      "position": "Manager",
      "phone": "+62-21-12345678",
      "email": "info@materialsupplier.com"
    },
    "address": "Jakarta, Indonesia",
    "rating": 4
  }'

# Get a specific supplier
curl -X GET "https://api.example.com/content-manager/collection-types/api::supplier.supplier/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update a supplier
curl -X PUT "https://api.example.com/content-manager/collection-types/api::supplier.supplier/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 5
  }'

# Delete a supplier
curl -X DELETE "https://api.example.com/content-manager/collection-types/api::supplier.supplier/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Material Endpoints

```bash
# Get all materials
curl -X GET "https://api.example.com/content-manager/collection-types/api::material.material" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a new material
curl -X POST "https://api.example.com/content-manager/collection-types/api::material.material" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Portland Cement",
    "code": "CEM-001",
    "category": "Cement",
    "unit": "Bag",
    "description": "High-quality Portland cement for construction",
    "price": 75000,
    "stock": 100,
    "minStock": 20
  }'

# Get a specific material
curl -X GET "https://api.example.com/content-manager/collection-types/api::material.material/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update a material
curl -X PUT "https://api.example.com/content-manager/collection-types/api::material.material/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "price": 80000,
    "stock": 150
  }'

# Delete a material
curl -X DELETE "https://api.example.com/content-manager/collection-types/api::material.material/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Supplier-Material Relationships

```bash
# Get suppliers for a material
curl -X GET "https://api.example.com/content-manager/collection-types/api::material.material/1/suppliers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Associate a material with a supplier
curl -X POST "https://api.example.com/content-manager/collection-types/api::material.material/1/suppliers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "supplierId": 1,
    "price": 75000,
    "currency": "IDR",
    "unit": "Bag",
    "minOrderQuantity": 100,
    "leadTime": 7,
    "isPreferred": true
  }'

# Get materials from a supplier
curl -X GET "https://api.example.com/content-manager/collection-types/api::supplier.supplier/1/materials" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test Purchase Order Endpoints

```bash
# Get all purchase orders
curl -X GET "https://api.example.com/content-manager/collection-types/api::purchase-order.purchase-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a new purchase order
curl -X POST "https://api.example.com/content-manager/collection-types/api::purchase-order.purchase-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "poNumber": "PO-2023-001",
    "supplier": 1,
    "items": [
      {
        "material": 1,
        "quantity": 100,
        "unitPrice": 75000
      }
    ],
    "deliveryDate": "2023-12-15",
    "paymentTerms": "Net 30",
    "notes": "Urgent delivery required"
  }'

# Update purchase order status
curl -X PUT "https://api.example.com/content-manager/collection-types/api::purchase-order.purchase-order/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "Delivered"
  }'
```

## Best Practices

1. **Always validate supplier data** before creating or updating suppliers
2. **Use proper date formats** for purchase dates and delivery dates
3. **Handle supplier code uniqueness** to avoid conflicts
4. **Use pagination** for large datasets
5. **Populate relations** when needed to avoid additional API calls
6. **Validate data** on frontend before sending to API
7. **Monitor supplier performance** regularly to maintain quality
8. **Keep track of purchase history** for better supplier evaluation
9. **Testing**: Use the curl examples above to test API endpoints before integration

## Testing Examples

### Test Supplier Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::supplier.supplier' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "SUP-001",
    "name": "PT Test Supplier",
    "type": "Perusahaan",
    "contact": {
      "name": "Test Contact",
      "position": "Manager",
      "phone": "081234567891",
      "email": "test@example.com"
    },
    "address": "Test Address",
    "materials": ["Semen", "Bata"],
    "status": "active"
  }'
```

### Test Purchase Order Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::purchase-order.purchase-order' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "poNumber": "PO-TEST-001",
    "date": "2024-03-15",
    "supplier": 1,
    "materials": [
      {
        "name": "Semen Portland",
        "quantity": 100,
        "unit": "sak",
        "price": 85000
      }
    ],
    "totalAmount": 8500000,
    "status": "pending"
  }'
```

---

## Response Examples

### Create/Update Material Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Ceramic Tiles",
      "code": "TIL-001",
      "category": "Tiles",
      "unit": "Box",
      "description": "High-quality ceramic tiles for flooring",
      "specifications": {
        "size": "30x30 cm",
        "thickness": "8 mm",
        "finish": "Matte",
        "color": "White"
      },
      "status": "active",
      "createdAt": "2023-06-15T10:30:00.000Z",
      "updatedAt": "2023-06-15T10:30:00.000Z",
      "publishedAt": "2023-06-15T10:30:00.000Z"
    }
  },
  "meta": {}
}
```

### Create/Update Supplier Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "code": "SUP-001",
      "name": "PT. New Supplier",
      "type": "Perusahaan",
      "contact": {
        "name": "John Doe",
        "position": "Manager",
        "phone": "+62-21-98765432",
        "email": "contact@newsupplier.com"
      },
      "address": "Jl. New Address No. 456, Jakarta",
      "materials": ["Semen", "Bata", "Cat"],
      "rating": 4.2,
      "status": "active",
      "lastPurchase": "2024-03-15",
      "totalPurchases": 1500000000,
      "documents": ["npwp.pdf", "siup.pdf"],
      "createdAt": "2023-06-15T10:30:00.000Z",
      "updatedAt": "2023-06-15T10:30:00.000Z",
      "publishedAt": "2023-06-15T10:30:00.000Z"
    }
  },
  "meta": {}
}
```

### Associate Material with Supplier Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "price": 85000,
      "currency": "IDR",
      "unit": "Box",
      "minOrderQuantity": 50,
      "leadTime": 10,
      "isPreferred": true,
      "createdAt": "2023-06-15T11:00:00.000Z",
      "updatedAt": "2023-06-15T11:00:00.000Z",
      "publishedAt": "2023-06-15T11:00:00.000Z"
    }
  },
  "meta": {}
}
```

### Get All Materials Response

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Ceramic Tiles",
        "code": "TIL-001",
        "category": "Tiles",
        "unit": "Box",
        "description": "High-quality ceramic tiles for flooring",
        "specifications": {
          "size": "30x30 cm",
          "thickness": "8 mm",
          "finish": "Matte",
          "color": "White"
        },
        "status": "active",
        "createdAt": "2023-06-15T10:30:00.000Z",
        "updatedAt": "2023-06-15T10:30:00.000Z",
        "publishedAt": "2023-06-15T10:30:00.000Z"
      }
    },
    {
      "id": 2,
      "attributes": {
        "name": "Portland Cement",
        "code": "CEM-001",
        "category": "Cement",
        "unit": "Sack",
        "description": "Standard Portland cement for construction",
        "specifications": {
          "type": "Type I",
          "weight": "40 kg",
          "strength": "32.5 MPa",
          "color": "Grey"
        },
        "status": "active",
        "createdAt": "2023-06-15T10:45:00.000Z",
        "updatedAt": "2023-06-15T10:45:00.000Z",
        "publishedAt": "2023-06-15T10:45:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

### Get All Suppliers Response

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "code": "SUP-001",
        "name": "PT. Supplier A",
        "type": "Perusahaan",
        "contact": {
          "name": "Budi Santoso",
          "position": "Manager",
          "phone": "+62-21-12345678",
          "email": "contact@supplier-a.com"
        },
        "address": "Jl. Address A No. 123, Jakarta",
        "materials": ["Semen", "Bata", "Cat"],
        "rating": 4.5,
        "status": "active",
        "lastPurchase": "2024-03-15",
        "totalPurchases": 1500000000,
        "documents": ["npwp.pdf", "siup.pdf"],
        "createdAt": "2023-01-10T08:00:00.000Z",
        "updatedAt": "2023-06-15T09:30:00.000Z",
        "publishedAt": "2023-01-10T08:00:00.000Z"
      }
    },
    {
      "id": 2,
      "attributes": {
        "code": "SUP-002",
        "name": "PT. Supplier B",
        "type": "Perusahaan",
        "contact": {
          "name": "Ahmad Wijaya",
          "position": "Director",
          "phone": "+62-21-87654321",
          "email": "contact@supplier-b.com"
        },
        "address": "Jl. Address B No. 456, Surabaya",
        "materials": ["Besi", "Pipa", "Kawat"],
        "rating": 4.2,
        "status": "active",
        "lastPurchase": "2024-03-10",
        "totalPurchases": 1200000000,
        "documents": ["npwp.pdf", "siup.pdf", "akta.pdf"],
        "createdAt": "2023-02-20T10:15:00.000Z",
        "updatedAt": "2023-06-14T14:20:00.000Z",
        "publishedAt": "2023-02-20T10:15:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

### Get Single Material Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Ceramic Tiles",
      "code": "TIL-001",
      "category": "Tiles",
      "unit": "Box",
      "description": "High-quality ceramic tiles for flooring",
      "specifications": {
        "size": "30x30 cm",
        "thickness": "8 mm",
        "finish": "Matte",
        "color": "White"
      },
      "status": "active",
      "createdAt": "2023-06-15T10:30:00.000Z",
      "updatedAt": "2023-06-15T10:30:00.000Z",
      "publishedAt": "2023-06-15T10:30:00.000Z"
    }
  },
  "meta": {}
}
```

### Get Single Supplier Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "code": "SUP-001",
      "name": "PT. Supplier A",
      "type": "Perusahaan",
      "contact": {
        "name": "Budi Santoso",
        "position": "Manager",
        "phone": "+62-21-12345678",
        "email": "contact@supplier-a.com"
      },
      "address": "Jl. Address A No. 123, Jakarta",
      "materials": ["Semen", "Bata", "Cat"],
      "rating": 4.5,
      "status": "active",
      "lastPurchase": "2024-03-15",
      "totalPurchases": 1500000000,
      "documents": ["npwp.pdf", "siup.pdf"],
      "createdAt": "2023-01-10T08:00:00.000Z",
      "updatedAt": "2023-06-15T09:30:00.000Z",
      "publishedAt": "2023-01-10T08:00:00.000Z"
    }
  },
  "meta": {}
}
```

### Get Suppliers for a Material Response

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "code": "SUP-001",
        "name": "PT. Supplier A",
        "type": "Perusahaan",
        "contact": {
          "name": "Budi Santoso",
          "position": "Manager",
          "phone": "+62-21-12345678",
          "email": "contact@supplier-a.com"
        },
        "address": "Jl. Address A No. 123, Jakarta",
        "materials": ["Semen", "Bata", "Cat"],
        "rating": 4.5,
        "status": "active",
        "lastPurchase": "2024-03-15",
        "totalPurchases": 1500000000,
        "documents": ["npwp.pdf", "siup.pdf"],
        "createdAt": "2023-01-10T08:00:00.000Z",
        "updatedAt": "2023-06-15T09:30:00.000Z",
        "publishedAt": "2023-01-10T08:00:00.000Z"
      },
      "pivot": {
        "price": 85000,
        "currency": "IDR",
        "unit": "Box",
        "minOrderQuantity": 50,
        "leadTime": 10,
        "isPreferred": true
      }
    },
    {
      "id": 2,
      "attributes": {
        "code": "SUP-002",
        "name": "PT. Supplier B",
        "type": "Perusahaan",
        "contact": {
          "name": "Ahmad Wijaya",
          "position": "Director",
          "phone": "+62-21-87654321",
          "email": "contact@supplier-b.com"
        },
        "address": "Jl. Address B No. 456, Surabaya",
        "materials": ["Besi", "Pipa", "Kawat"],
        "rating": 4.2,
        "status": "active",
        "lastPurchase": "2024-03-10",
        "totalPurchases": 1200000000,
        "documents": ["npwp.pdf", "siup.pdf", "akta.pdf"],
        "createdAt": "2023-02-20T10:15:00.000Z",
        "updatedAt": "2023-06-14T14:20:00.000Z",
        "publishedAt": "2023-02-20T10:15:00.000Z"
      },
      "pivot": {
        "price": 82000,
        "currency": "IDR",
        "unit": "Box",
        "minOrderQuantity": 100,
        "leadTime": 14,
        "isPreferred": false
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

### Delete Material Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Ceramic Tiles",
      "code": "TIL-001",
      "category": "Tiles",
      "unit": "Box",
      "description": "High-quality ceramic tiles for flooring",
      "specifications": {
        "size": "30x30 cm",
        "thickness": "8 mm",
        "finish": "Matte",
        "color": "White"
      },
      "status": "active",
      "createdAt": "2023-06-15T10:30:00.000Z",
      "updatedAt": "2023-06-15T10:30:00.000Z",
      "publishedAt": "2023-06-15T10:30:00.000Z"
    }
  },
  "meta": {}
}
```

### Delete Supplier Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "code": "SUP-001",
      "name": "PT. Supplier A",
      "type": "Perusahaan",
      "contact": {
        "name": "Budi Santoso",
        "position": "Manager",
        "phone": "+62-21-12345678",
        "email": "contact@supplier-a.com"
      },
      "address": "Jl. Address A No. 123, Jakarta",
      "materials": ["Semen", "Bata", "Cat"],
      "rating": 4.5,
      "status": "active",
      "lastPurchase": "2024-03-15",
      "totalPurchases": 1500000000,
      "documents": ["npwp.pdf", "siup.pdf"],
      "createdAt": "2023-01-10T08:00:00.000Z",
      "updatedAt": "2023-06-15T09:30:00.000Z",
      "publishedAt": "2023-01-10T08:00:00.000Z"
    }
  },
  "meta": {}
}
```

---

**Note**: Semua content types menggunakan draftAndPublish = false, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten.