# API Usage Documentation - Piutang Konsumen (Consumer Receivables)

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Piutang Konsumen yang dikelola secara terpisah dari sistem Booking. Piutang Konsumen fokus pada manajemen penagihan dan pelunasan pembayaran properti yang telah di-booking.

## Architecture

**Terpisah dari Booking:**

- **Booking**: Mengelola proses pemesanan awal (marketing stage)
- **Piutang Konsumen**: Mengelola penagihan dan pelunasan (finance stage)
- **Relasi**: Piutang Konsumen terhubung ke Booking (opsional) dan Konsumen

## Content Types API Endpoints

### 1. Piutang Konsumen API (`api::piutang-konsumen.piutang-konsumen`)

#### Base URL

```
/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen
```

#### Endpoints

| Method | Endpoint                                                                       | Description                    |
| ------ | ------------------------------------------------------------------------------ | ------------------------------ |
| GET    | `/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen`     | Get all consumer receivables   |
| GET    | `/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen/:id` | Get consumer receivable by ID  |
| POST   | `/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen`     | Create new consumer receivable |
| PUT    | `/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen/:id` | Update consumer receivable     |
| DELETE | `/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen/:id` | Delete consumer receivable     |

### Request Examples

**Create Consumer Receivable:**

```json
POST /content-manager/collection-types/api::piutang-konsumen.piutang-konsumen
Content-Type: application/json

{
  "customer": "Budi Santoso",
  "unit": "A-15",
  "project": "project_document_id",
  "booking": "booking_document_id",
  "total_price": 500000000,
  "booking_fee": 10000000,
  "down_payment": 50000000,
  "remaining_amount": 440000000,
  "payment_schedule": "dp",
  "kpr_status": "proses",
  "status_piutang": "active",
  "due_date": "2024-12-31",
  "next_payment": "2024-02-10",
  "notes": "KPR Bank Mandiri",
  "payment_history": [
    {
      "date": "2024-01-15",
      "amount": 10000000,
      "type": "booking-fee",
      "status": "paid",
      "paymentMethod": "transfer",
      "bankReference": "TRF-001"
    }
  ]
}
```

**Add Payment:**

```json
POST /piutang-konsumen/1/payment
Content-Type: application/json

{
  "date": "2024-02-10",
  "amount": 40000000,
  "type": "dp",
  "status": "paid",
  "paymentMethod": "transfer",
  "bankReference": "TRF-002",
  "notes": "DP ke-2"
}
```

**Update KPR Status:**

```json
PUT /piutang-konsumen/1/kpr-status
Content-Type: application/json

{
  "status": "disetujui",
  "notes": "KPR disetujui Bank Mandiri tanggal 15 Feb 2024"
}
```

**Complete Payment:**

```json
PUT /content-manager/collection-types/api::piutang-konsumen.piutang-konsumen/1
Content-Type: application/json

{
  "remaining_amount": 0,
  "status_piutang": "completed",
  "next_payment": null,
  "payment_history": [
    ...existing_payments,
    {
      "date": "2024-12-10",
      "amount": 400000000,
      "type": "pelunasan",
      "status": "paid",
      "paymentMethod": "kpr-disbursement",
      "bankReference": "KPR-DISB-001",
      "notes": "Pelunasan KPR"
    }
  ]
}
```

---

## Schema JSON

### Piutang Konsumen Schema

```json
{
  "kind": "collectionType",
  "collectionName": "piutang_konsumens",
  "info": {
    "singularName": "piutang-konsumen",
    "pluralName": "piutang-konsumens",
    "displayName": "Piutang Konsumen",
    "description": "Consumer receivables management for property sales"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "customer": {
      "type": "string",
      "required": true,
      "minLength": 3,
      "maxLength": 100
    },
    "unit": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 20
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "piutang_konsumens"
    },
    "booking": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::booking.booking",
      "inversedBy": "piutang_konsumens"
    },
    "customer_relationship": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::konsumen.konsumen",
      "inversedBy": "piutang_konsumens"
    },
    "total_price": {
      "type": "biginteger",
      "required": true
    },
    "booking_fee": {
      "type": "biginteger",
      "required": true,
      "min": "0"
    },
    "down_payment": {
      "type": "biginteger",
      "required": true,
      "min": "0"
    },
    "remaining_amount": {
      "type": "biginteger",
      "required": true,
      "min": "0"
    },
    "payment_schedule": {
      "type": "enumeration",
      "enum": ["cash", "dp", "termin", "kpr"],
      "required": true,
      "default": "dp"
    },
    "kpr_status": {
      "type": "enumeration",
      "enum": ["proses", "disetujui", "gagal", "tidak"],
      "required": true,
      "default": "tidak"
    },
    "status_piutang": {
      "type": "enumeration",
      "enum": ["active", "overdue", "completed", "cancelled"],
      "required": true,
      "default": "active"
    },
    "last_payment": {
      "type": "date"
    },
    "next_payment": {
      "type": "date"
    },
    "due_date": {
      "type": "date"
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "payment_history": {
      "type": "component",
      "repeatable": true,
      "component": "komponen.payment-history"
    }
  }
}
```

### Payment History Component

```json
{
  "collectionName": "components_payment_histories",
  "info": {
    "displayName": "Payment History",
    "description": "Payment history records for consumer receivables"
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true
    },
    "amount": {
      "type": "biginteger",
      "required": true,
      "min": "1000"
    },
    "type": {
      "type": "enumeration",
      "enum": ["booking-fee", "dp", "termin", "kpr", "pelunasan"],
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["paid", "pending", "failed"],
      "required": true,
      "default": "paid"
    },
    "notes": {
      "type": "text",
      "maxLength": 500
    },
    "paymentMethod": {
      "type": "enumeration",
      "enum": ["cash", "transfer", "check", "giro", "kpr-disbursement"]
    },
    "bankReference": {
      "type": "string",
      "maxLength": 100
    }
  }
}
```

---

## Relations

### Piutang Konsumen Relations

- `project` (Many-to-One) → Proyek Perumahan
- `booking` (Many-to-One, Optional) → Booking (untuk traceability)
- `customer_relationship` (Many-to-One) → Konsumen (master data)
- `payment_history` (Component) → Riwayat Pembayaran

### Connected Collections Updates

- **Konsumen**: Added `piutang_konsumens` relation
- **Booking**: Added `piutang_konsumens` relation
- **Proyek Perumahan**: Added `piutang_konsumens` relation

## Data Field Descriptions

### Core Information

- **customer**: Nama konsumen (denormalized untuk performance)
- **unit**: Kode unit properti
- **customer_relationship**: Link ke master data konsumen
- **booking**: Link ke booking asal (opsional)

### Financial Information

- **total_price**: Harga total jual properti (biginteger format)
- **booking_fee**: Biaya booking yang sudah dibayar (biginteger format)
- **down_payment**: Total DP yang sudah dibayar (biginteger format)
- **remaining_amount**: Sisa pembayaran yang belum lunas (biginteger format)

### Payment Configuration

- **payment_schedule**: Skema pembayaran
  - `cash`: Pembayaran tunai lunas
  - `dp`: DP + Pelunasan
  - `termin`: Pembayaran bertahap
  - `kpr`: Pembiayaan bank
- **kpr_status**: Status KPR (jika menggunakan KPR)
- **status_piutang**: Status piutang konsumen
  - `active`: Sedang dalam proses pembayaran
  - `overdue`: Telat pembayaran
  - `completed`: Lunas
  - `cancelled`: Dibatalkan

### Date Tracking

- **last_payment**: Tanggal pembayaran terakhir
- **next_payment**: Tanggal estimasi pembayaran berikutnya
- **due_date**: Tanggal jatuh tempo akhir

## Data Features

### Payment History

Setiap record Piutang Konsumen memiliki `payment_history` yang dapat digunakan untuk:

- **Track semua pembayaran**: Riwayat lengkap pembayaran yang sudah dilakukan
- **Calculate progress**: Hitung total yang sudah dibayar dan sisa pembayaran
- **Payment types**: booking-fee, dp, termin, kpr, pelunasan
- **Status tracking**: paid, pending, failed status per pembayaran

## Query Parameters

### Filtering Examples

**Active Receivables:**

```
?filters[status_piutang][$eq]=active
```

**Overdue Receivables:**

```
?filters[status_piutang][$eq]=active&filters[next_payment][$lt]=2024-11-01
```

**KPR Receivables:**

```
?filters[payment_schedule][$eq]=kpr&filters[kpr_status][$eq]=disetujui
```

**By Customer:**

```
?filters[customer][$containsi]=budi
```

**By Project:**

```
?filters[project][documentId][$eq]=project_id
```

### Population

```
?populate=*
?populate[0]=project&populate[1]=customer_relationship
?populate[0]=project&populate[1]=customer_relationship&populate[2]=payment_history
```

## Data Notes

### Data Type Information

- **Biginteger**: Semua field harga menggunakan `biginteger` untuk handling nilai yang besar
- **API Response**: Harga dikembalikan sebagai string untuk compatibility JSON
- **Payment History**: Component untuk tracking riwayat pembayaran

### Field Validation

- `total_price`: Required (no minimum)
- `booking_fee`: Required, min: 0
- `down_payment`: Required, min: 0
- `remaining_amount`: Required, min: 0
- `status_piutang`: Required, default: active

## Error Handling

Strapi akan mengembalikan error responses standard untuk:

- **Validation Errors**: Field tidak valid atau missing required fields
- **Not Found**: Record tidak ditemukan
- **Unauthorized**: Akses tidak diizinkan
- **Database Errors**: Connection atau constraint issues

Format error response mengikuti standar Strapi API.

## Best Practices

1. **Data Consistency**: Selalu update `remaining_amount` dan `payment_history` saat ada pembayaran
2. **Status Management**: Gunakan `status_piutang` yang tepat (active, overdue, completed, cancelled)
3. **Date Tracking**: Update `last_payment` dan `next_payment` secara konsisten
4. **Payment History**: Catat setiap pembayaran dengan detail yang lengkap
5. **Relations**: Gunakan relasi ke Booking dan Konsumen untuk data consistency
6. **Validation**: Pastikan `total_price >= booking_fee + down_payment`

## Testing Examples

### Create Piutang Konsumen

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer": "Andi Wijaya",
    "unit": "B-22",
    "project": "proj_001",
    "total_price": 450000000,
    "booking_fee": 5000000,
    "down_payment": 45000000,
    "remaining_amount": 400000000,
    "payment_schedule": "kpr",
    "kpr_status": "proses",
    "status_piutang": "active"
  }'
```

### Update Piutang dengan Payment History

```bash
curl -X PUT \
  'http://localhost:1340/content-manager/collection-types/api::piutang-konsumen.piutang-konsumen/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "remaining_amount": 350000000,
    "status_piutang": "active",
    "last_payment": "2024-11-15",
    "payment_history": [
      {
        "date": "2024-11-15",
        "amount": 50000000,
        "type": "dp",
        "status": "paid",
        "paymentMethod": "transfer",
        "bankReference": "TRF-123"
      }
    ]
  }'
```

---

**Note**: Piutang Konsumen dirancang sebagai entitas terpisah dari Booking untuk memisahkan concerns antara proses pemesanan (marketing) dan proses penagihan (finance). Relasi ke bersifat opsional untuk maintain traceability tanpa coupling yang kuat.
