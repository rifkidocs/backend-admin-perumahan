# API Usage Documentation - Data Harga & Promo System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Data Harga & Promo dengan 2 content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Unit Pricing API (`api::unit-pricing.unit-pricing`)

#### Base URL

```
/content-manager/collection-types/api::unit-pricing.unit-pricing
```

#### Endpoints

| Method | Endpoint                                                               | Description             |
| ------ | ---------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::unit-pricing.unit-pricing`     | Get all unit pricings   |
| GET    | `/content-manager/collection-types/api::unit-pricing.unit-pricing/:id` | Get unit pricing by ID  |
| POST   | `/content-manager/collection-types/api::unit-pricing.unit-pricing`     | Create new unit pricing |
| PUT    | `/content-manager/collection-types/api::unit-pricing.unit-pricing/:id` | Update unit pricing     |
| DELETE | `/content-manager/collection-types/api::unit-pricing.unit-pricing/:id` | Delete unit pricing     |

#### Request Examples

**Create Unit Pricing:**

```json
POST /content-manager/collection-types/api::unit-pricing.unit-pricing
Content-Type: application/json

{
  "unit_type": "Tipe 36/72",
  "price_base": 350000000,
  "price_with_ppn": 385000000,
  "price_with_extras": 400000000,
  "project": 1,
  "unit_rumah": 1,
  "unit_specification": {
    "land_area": 72,
    "building_area": 36
  },
  "payment_options": "KPR",  // Options: "KPR", "Cash", "Installment", "KPR + Cash"
  "availability_status": "Available",
  "is_active": true,
  "effective_date": "2023-09-01",
  "notes": "Harga untuk cluster baru"
}
```

**Update Unit Pricing:**

```json
PUT /content-manager/collection-types/api::unit-pricing.unit-pricing/1
Content-Type: application/json

{
  "price_base": 360000000,
  "price_with_ppn": 396000000,
  "price_with_extras": 410000000,
  "availability_status": "Sold"
}
```

---

### 2. Promotion API (`api::promo.promo`)

#### Base URL

```
/content-manager/collection-types/api::promo.promo
```

#### Endpoints

| Method | Endpoint                                                 | Description          |
| ------ | -------------------------------------------------------- | -------------------- |
| GET    | `/content-manager/collection-types/api::promo.promo`     | Get all promotions   |
| GET    | `/content-manager/collection-types/api::promo.promo/:id` | Get promotion by ID  |
| POST   | `/content-manager/collection-types/api::promo.promo`     | Create new promotion |
| PUT    | `/content-manager/collection-types/api::promo.promo/:id` | Update promotion     |
| DELETE | `/content-manager/collection-types/api::promo.promo/:id` | Delete promotion     |

#### Request Examples

**Create Promotion:**

```json
POST /content-manager/collection-types/api::promo.promo
Content-Type: application/json

{
  "name": "Grand Opening Special",
  "code": "GO2023",
  "type": "Diskon Langsung",
  "value": 10000000,
  "value_type": "Fixed",
  "start_date": "2023-09-01",
  "end_date": "2023-09-30",
  "unit_types": ["Tipe 36/72", "Tipe 45/90"],
  "project": 1,
  "min_purchase": 300000000,
  "max_discount": 50000000,
  "usage_limit": 100,
  "description": "Diskon khusus untuk pembukaan proyek baru",
  "terms_conditions": "Syarat dan ketentuan berlaku",
  "status_promotion": "Aktif"
}
```

**Update Promotion Status:**

```json
PUT /content-manager/collection-types/api::promo.promo/1
Content-Type: application/json

{
  "status_promotion": "Tidak Aktif",
  "used_count": 25
}
```

---

## Relations

### Unit Pricing Relations

- `project` (Many-to-One) → Proyek Perumahan
- `unit_rumah` (Many-to-One) → Unit Rumah

### Promotion Relations

- `project` (Many-to-One) → Proyek Perumahan

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
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Price tidak boleh negatif"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Unit pricing not found"
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
?sort=createdAt:desc
```

### Filtering

```
?filters[availability_status][$eq]=Available
?filters[price_base][$gte]=300000000
?filters[status_promotion][$eq]=Aktif
```

### Population (Relations)

```
?populate=project
?populate=unit_rumah
```

## Usage Examples

### Mortgage Simulation Calculation

```javascript
// Example calculation for KPR simulation
const unitPrice = 385000000;
const downPaymentPercent = 20;
const loanTerm = 15; // years
const interestRate = 5.75; // annual percentage

const downPaymentAmount = unitPrice * (downPaymentPercent / 100);
const loanAmount = unitPrice - downPaymentAmount;
const monthlyInterestRate = interestRate / 100 / 12;
const totalMonths = loanTerm * 12;

const monthlyPayment =
  (loanAmount *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) /
  (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

const totalPayments = monthlyPayment * totalMonths;
const totalInterest = totalPayments - loanAmount;
```

### Total Cost Estimation

```javascript
// Example calculation for total cost estimation
const unitPrice = 385000000;
const bookingFee = 5000000;
const downPayment = 77000000;
const administrationFee = 5000000;
const notaryFee = unitPrice * 0.01; // 1% of unit price
const taxFee = unitPrice * 0.025; // 2.5% of unit price
const insuranceFee = unitPrice * 0.005; // 0.5% of unit price
const maintenanceFee = 2500000;

const totalAdditionalCosts =
  bookingFee +
  downPayment +
  administrationFee +
  notaryFee +
  taxFee +
  insuranceFee +
  maintenanceFee;
const grandTotal = unitPrice + totalAdditionalCosts;
```

## Best Practices

1. **Always validate price data** before creating or updating unit pricing
2. **Use proper date formats** for effective_date and expiry_date
3. **Handle promotion codes uniqueness** to avoid conflicts
4. **Use pagination** for large datasets
5. **Populate relations** when needed to avoid additional API calls
6. **Validate data** on frontend before sending to API
7. **Monitor promotion usage** to prevent over-usage

## Testing Examples

### Test Unit Pricing Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::unit-pricing.unit-pricing' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "unit_type": "Tipe 36/72",
    "price_base": 350000000,
    "price_with_ppn": 385000000,
    "price_with_extras": 400000000,
    "project": 1,
    "unit_rumah": 1,
    "payment_options": "KPR",  // Options: "KPR", "Cash", "Installment", "KPR + Cash"
    "availability_status": "Available",
    "is_active": true,
    "effective_date": "2023-09-01"
  }'
```

### Test Promotion Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::promo.promo' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Promotion",
    "code": "TEST2023",
    "type": "Diskon Langsung",
    "value": 10000000,
    "value_type": "Fixed",
    "start_date": "2023-09-01",
    "end_date": "2023-09-30",
    "unit_types": ["Tipe 36/72"],
    "project": 1,
    "status_promotion": "Aktif"
  }'
```

---

**Note**: Semua content types menggunakan draftAndPublish = false, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types untuk menghindari error dan memastikan data konsisten.
