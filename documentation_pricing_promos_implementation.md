# Strapi Documentation - Data Harga & Promo System

## Overview

Dokumentasi ini menjelaskan implementasi backend Strapi untuk sistem Data Harga & Promo yang mencakup manajemen harga unit perumahan, promosi aktif, simulasi KPR, dan estimasi biaya total pembelian. Sistem ini mendukung berbagai jenis promosi seperti diskon langsung, cashback, dan free item.

## ✅ Implementation Status

**IMPLEMENTASI SELESAI** - Semua content types dan fitur telah diimplementasikan dengan sukses.

### Yang Telah Diimplementasikan:

1. ✅ **Unit Pricing** - Content type untuk harga unit perumahan
2. ✅ **Promotions** - Content type untuk promosi dan penawaran khusus
3. ✅ **Mortgage Simulation** - Sistem simulasi KPR terintegrasi
4. ✅ **Cost Estimation** - Estimasi biaya total pembelian
5. ✅ **Price History** - Riwayat perubahan harga
6. ✅ **Promotion Analytics** - Analitik efektivitas promosi

## Content Types

### 1. Unit Pricing (api::unit-pricing.unit-pricing)

**Collection Type**: Unit Pricing

#### Fields

| Field Name           | Type        | Required | Description                                     |
| -------------------- | ----------- | -------- | ----------------------------------------------- |
| `cluster`            | String      | Yes      | Nama cluster perumahan                          |
| `unit_type`          | String      | Yes      | Tipe unit (Tipe 36/72, Tipe 45/90, dll)         |
| `price_base`         | Decimal     | Yes      | Harga dasar unit                                |
| `price_with_ppn`     | Decimal     | Yes      | Harga dengan PPN (10%)                          |
| `price_with_extras`  | Decimal     | Yes      | Harga total dengan biaya tambahan               |
| `project`            | Relation    | Yes      | Relasi ke project perumahan                     |
| `unit_specification` | JSON        | No       | Spesifikasi unit (luas tanah, luas bangunan)    |
| `payment_options`    | JSON        | No       | Opsi pembayaran (KPR, Cash, Bertahap)           |
| `availability`       | Enumeration | Yes      | Status ketersediaan (Available, Sold, Reserved) |
| `is_active`          | Boolean     | Yes      | Status aktif harga                              |
| `effective_date`     | Date        | Yes      | Tanggal efektif harga                           |
| `expiry_date`        | Date        | No       | Tanggal berakhir harga                          |
| `notes`              | Text        | No       | Catatan tambahan                                |
| `created_at`         | DateTime    | Auto     | Tanggal dibuat                                  |
| `updated_at`         | DateTime    | Auto     | Tanggal diupdate                                |

### 2. Promotions (api::promotion.promotion)

**Collection Type**: Promotion

#### Fields

| Field Name         | Type        | Required | Description                                          |
| ------------------ | ----------- | -------- | ---------------------------------------------------- |
| `name`             | String      | Yes      | Nama promosi                                         |
| `code`             | String      | Yes      | Kode promosi (unik)                                  |
| `type`             | Enumeration | Yes      | Jenis promosi (Diskon Langsung, Cashback, Free Item) |
| `value`            | Decimal     | Yes      | Nilai promosi                                        |
| `value_type`       | Enumeration | Yes      | Tipe nilai (Fixed, Percentage, Item Value)           |
| `start_date`       | Date        | Yes      | Tanggal mulai promosi                                |
| `end_date`         | Date        | Yes      | Tanggal berakhir promosi                             |
| `clusters`         | JSON        | Yes      | Array cluster yang tercakup                          |
| `unit_types`       | JSON        | Yes      | Array tipe unit yang tercakup                        |
| `project`          | Relation    | Yes      | Relasi ke project                                    |
| `min_purchase`     | Decimal     | No       | Minimum pembelian untuk mendapat promosi             |
| `max_discount`     | Decimal     | No       | Maksimal diskon (untuk persentase)                   |
| `usage_limit`      | Number      | No       | Batas penggunaan promosi                             |
| `used_count`       | Number      | No       | Jumlah penggunaan saat ini                           |
| `description`      | Text        | No       | Deskripsi promosi                                    |
| `terms_conditions` | RichText    | No       | Syarat dan ketentuan                                 |
| `is_active`        | Boolean     | Yes      | Status aktif promosi                                 |
| `created_at`       | DateTime    | Auto     | Tanggal dibuat                                       |
| `updated_at`       | DateTime    | Auto     | Tanggal diupdate                                     |

### 3. Price History (api::price-history.price-history)

**Collection Type**: Price History

#### Fields

| Field Name       | Type        | Required | Description                                     |
| ---------------- | ----------- | -------- | ----------------------------------------------- |
| `unit_pricing`   | Relation    | Yes      | Relasi ke unit pricing                          |
| `action`         | Enumeration | Yes      | Aksi yang dilakukan (created, updated, deleted) |
| `old_price`      | Decimal     | No       | Harga lama                                      |
| `new_price`      | Decimal     | Yes      | Harga baru                                      |
| `effective_date` | Date        | Yes      | Tanggal efektif perubahan                       |
| `reason`         | String      | No       | Alasan perubahan harga                          |
| `notes`          | Text        | No       | Catatan tambahan                                |
| `created_by`     | Relation    | No       | User yang melakukan perubahan                   |
| `created_at`     | DateTime    | Auto     | Tanggal dibuat                                  |
| `updated_at`     | DateTime    | Auto     | Tanggal diupdate                                |

### 4. Promotion Analytics (api::promotion-analytics.promotion-analytics)

**Collection Type**: Promotion Analytics

#### Fields

| Field Name             | Type     | Required | Description                 |
| ---------------------- | -------- | -------- | --------------------------- |
| `promotion`            | Relation | Yes      | Relasi ke promotion         |
| `views`                | Number   | Yes      | Jumlah view promosi         |
| `applications`         | Number   | Yes      | Jumlah aplikasi promosi     |
| `conversions`          | Number   | Yes      | Jumlah konversi             |
| `total_discount_given` | Decimal  | Yes      | Total diskon yang diberikan |
| `start_date`           | Date     | Yes      | Tanggal mulai tracking      |
| `end_date`             | Date     | Yes      | Tanggal akhir tracking      |
| `created_at`           | DateTime | Auto     | Tanggal dibuat              |
| `updated_at`           | DateTime | Auto     | Tanggal diupdate            |

## API Endpoints

### Unit Pricing Endpoints

- `GET /api/unit-pricings` - Get all unit pricings
- `GET /api/unit-pricings/:id` - Get unit pricing by ID
- `POST /api/unit-pricings` - Create new unit pricing
- `PUT /api/unit-pricings/:id` - Update unit pricing
- `DELETE /api/unit-pricings/:id` - Delete unit pricing

### Promotion Endpoints

- `GET /api/promotions` - Get all promotions
- `GET /api/promotions/:id` - Get promotion by ID
- `POST /api/promotions` - Create new promotion
- `PUT /api/promotions/:id` - Update promotion
- `DELETE /api/promotions/:id` - Delete promotion

### Price History Endpoints

- `GET /api/price-histories` - Get all price histories
- `GET /api/price-histories/:id` - Get price history by ID
- `GET /api/price-histories/unit/:unitId` - Get price history for specific unit

### Promotion Analytics Endpoints

- `GET /api/promotion-analytics` - Get all promotion analytics
- `GET /api/promotion-analytics/:id` - Get promotion analytics by ID
- `GET /api/promotion-analytics/promotion/:promotionId` - Get analytics for specific promotion

## Relations

### Unit Pricing Relations

- `project` (Many-to-One) → Project
- `price_histories` (One-to-Many) → Price History

### Promotion Relations

- `project` (Many-to-One) → Project
- `promotion_analytics` (One-to-One) → Promotion Analytics

### Price History Relations

- `unit_pricing` (Many-to-One) → Unit Pricing
- `created_by` (Many-to-One) → User

### Promotion Analytics Relations

- `promotion` (One-to-One) → Promotion

## Usage Examples

### Creating Unit Pricing

```javascript
// POST /api/unit-pricings
{
  "data": {
    "cluster": "Cluster Anggrek",
    "unit_type": "Tipe 36/72",
    "price_base": 350000000,
    "project": 1,
    "unit_specification": {
      "land_area": 72,
      "building_area": 36
    },
    "payment_options": ["KPR", "Cash", "Installment"],
    "availability": "Available",
    "is_active": true,
    "effective_date": "2023-09-01",
    "notes": "Harga untuk cluster baru"
  }
}
```

### Creating Promotion

```javascript
// POST /api/promotions
{
  "data": {
    "name": "Grand Opening Special",
    "code": "GO2023",
    "type": "Diskon Langsung",
    "value": 10000000,
    "value_type": "Fixed",
    "start_date": "2023-09-01",
    "end_date": "2023-09-30",
    "clusters": ["Cluster Anggrek", "Cluster Dahlia"],
    "unit_types": ["Tipe 36/72", "Tipe 45/90"],
    "project": 1,
    "min_purchase": 300000000,
    "max_discount": 50000000,
    "usage_limit": 100,
    "description": "Diskon khusus untuk pembukaan cluster baru",
    "terms_conditions": "Syarat dan ketentuan berlaku",
    "is_active": true
  }
}
```

### Mortgage Simulation Calculation

```javascript
// GET /api/mortgage-simulation
{
  "unit_price": 385000000,
  "down_payment_percent": 20,
  "loan_term": 15,
  "interest_rate": 5.75
}

// Response
{
  "unit_price": 385000000,
  "down_payment_amount": 77000000,
  "loan_amount": 308000000,
  "monthly_payment": 2550000,
  "total_payments": 459000000,
  "total_interest": 151000000
}
```

### Total Cost Estimation

```javascript
// GET /api/cost-estimation
{
  "unit_price": 385000000,
  "payment_method": "KPR"
}

// Response
{
  "unit_price": 385000000,
  "booking_fee": 5000000,
  "down_payment": 77000000,
  "administration_fee": 5000000,
  "notary_fee": 3850000,
  "tax_fee": 9625000,
  "insurance_fee": 1925000,
  "maintenance_fee": 2500000,
  "total_additional_costs": 105000000,
  "grand_total": 490000000
}
```

## Security & Permissions

### Role-Based Access Control

- **Marketing Manager**: Full access to pricing and promotions
- **Marketing Staff**: Create, read, update pricing and promotions
- **Sales Team**: Read-only access to pricing and active promotions
- **Finance Team**: Read access to pricing and promotion analytics
- **Admin**: Full administrative access

### Data Validation

- Price validation (positive numbers only)
- Date range validation
- Promotion code uniqueness
- Availability status validation
- Payment options validation

## Performance Optimization

### Caching Strategy

- API response caching for pricing data
- Promotion status caching
- Mortgage calculation caching
- Cost estimation caching

### Database Optimization

- Indexed fields for search and filtering
- Optimized queries with proper relations
- Pagination support for large datasets
- Price history archiving

## Monitoring & Analytics

### Pricing Analytics

- Price change tracking
- Unit availability monitoring
- Revenue impact analysis
- Market trend analysis

### Promotion Analytics

- Promotion effectiveness tracking
- Conversion rate monitoring
- Usage statistics
- ROI calculation

### Error Monitoring

- Lifecycle hook error logging
- API performance monitoring
- Data validation error tracking
- System health monitoring

## Integration Features

### Mortgage Simulation

- Real-time KPR calculation
- Multiple bank interest rates
- Flexible payment terms
- Down payment optimization

### Cost Estimation

- Comprehensive cost breakdown
- Multiple payment methods
- Tax and fee calculations
- Additional cost tracking

### Promotion Management

- Automatic activation/deactivation
- Usage limit enforcement
- Cluster and unit type targeting
- Analytics integration

## Conclusion

Sistem Data Harga & Promo telah diimplementasikan dengan lengkap menggunakan Strapi CMS dengan fitur-fitur berikut:

1. **4 Content Types** untuk manajemen harga dan promosi
2. **Mortgage Simulation** terintegrasi dengan perhitungan real-time
3. **Cost Estimation** dengan breakdown biaya lengkap
4. **Promotion Management** dengan analytics dan tracking
5. **Price History** untuk audit trail perubahan harga
6. **Security & Permissions** berbasis role
7. **Performance Optimization** dengan caching dan indexing
8. **Monitoring & Analytics** untuk tracking efektivitas

Sistem ini mendukung berbagai skenario bisnis perumahan dengan fleksibilitas tinggi dan dapat diintegrasikan dengan frontend yang sudah ada.
