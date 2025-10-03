# API Documentation - Marketing Bookings System

## Overview

Dokumentasi API untuk sistem manajemen booking dan pemesanan unit perumahan menggunakan Strapi CMS. Sistem ini mendukung CRUD operations untuk data booking, unit, customer, dan dokumen terkait proses pemesanan unit.

## ⚠️ Implementation Update

**Status**: ✅ **IMPLEMENTED** - Sistem booking telah diimplementasikan dengan modifikasi pada content types yang sudah ada.

### Perubahan dari Dokumentasi Awal:

1. **Content Type Names**: Menggunakan content types yang sudah ada:

   - `unit` → `unit-rumah` (existing, modified)
   - `customer` → `konsumen` (existing, modified)
   - `marketing-staff` → `karyawan` (existing, modified)
   - `booking-document` → baru dibuat

2. **API Endpoints**: Menggunakan endpoint sesuai content type yang ada:

   - `/api/units` → `/api/unit-rumahs`
   - `/api/customers` → `/api/konsumens`
   - `/api/marketing-staffs` → `/api/karyawans`

3. **Integration**: Sistem terintegrasi dengan modul existing:

   - HRM system (karyawan, jabatan, departemen)
   - Financial system (kas-masuk, kas-keluar)
   - Project management (proyek-perumahan, progres-harian)
   - Lead management (lead-marketing, target-marketing)

4. **Business Logic**: Diimplementasikan via lifecycle hooks tanpa custom API.

## Content Types

### 1. Booking (Content Type: `booking`)

#### Fields

| Field Name       | Type        | Required | Description            | Validation                                               |
| ---------------- | ----------- | -------- | ---------------------- | -------------------------------------------------------- |
| `booking_id`     | String      | Yes      | ID unik booking        | Unique, Pattern: BK-YYYY-XXX                             |
| `booking_date`   | Date        | Yes      | Tanggal booking dibuat | Auto-generated on create                                 |
| `booking_fee`    | Decimal     | Yes      | Nominal booking fee    | Min: 0                                                   |
| `payment_status` | Enumeration | Yes      | Status pembayaran      | Options: pending, lunas, overdue                         |
| `booking_status` | Enumeration | Yes      | Status booking         | Options: aktif, menunggu-pembayaran, dibatalkan, selesai |
| `payment_date`   | Date        | No       | Tanggal pembayaran     | Date format                                              |
| `payment_method` | Enumeration | No       | Metode pembayaran      | Options: transfer, cash, check, kredit                   |
| `payment_proof`  | Media       | No       | Bukti pembayaran       | Image/PDF file (max 5MB)                                 |
| `notes`          | Text        | No       | Catatan booking        | Max: 1000                                                |
| `created_at`     | DateTime    | Auto     | Tanggal dibuat         | Auto-generated                                           |
| `updated_at`     | DateTime    | Auto     | Tanggal diupdate       | Auto-generated                                           |

#### Relations

- `unit` (Many-to-One): Relation ke `unit-rumah`
- `customer` (Many-to-One): Relation ke `konsumen`
- `documents` (One-to-Many): Relation ke `booking-document`
- `marketing_staff` (Many-to-One): Relation ke `karyawan`

### 2. Unit Rumah (Content Type: `unit-rumah`)

#### Fields

| Field Name       | Type        | Required | Description          | Validation                                       |
| ---------------- | ----------- | -------- | -------------------- | ------------------------------------------------ |
| `unit_id`        | String      | Yes      | ID unik unit         | Unique, Pattern: UNIT-XXX                        |
| `unit_type`      | String      | Yes      | Tipe unit            | Max: 50 (e.g., "Tipe 36/72")                     |
| `block`          | String      | Yes      | Blok unit            | Max: 10                                          |
| `number`         | String      | Yes      | Nomor unit           | Max: 10                                          |
| `price`          | Decimal     | Yes      | Harga unit           | Min: 0                                           |
| `land_area`      | Integer     | Yes      | Luas tanah (m²)      | Min: 1                                           |
| `building_area`  | Integer     | Yes      | Luas bangunan (m²)   | Min: 1                                           |
| `bedrooms`       | Integer     | Yes      | Jumlah kamar tidur   | Min: 1                                           |
| `bathrooms`      | Integer     | Yes      | Jumlah kamar mandi   | Min: 1                                           |
| `garage`         | Integer     | No       | Jumlah garasi        | Min: 0                                           |
| `location`       | String      | No       | Lokasi detail unit   | Max: 100                                         |
| `status`         | Enumeration | Yes      | Status unit          | Options: tersedia, dipesan, terjual, maintenance |
| `specifications` | JSON        | No       | Spesifikasi tambahan | JSON object                                      |
| `images`         | Media       | No       | Foto unit            | Multiple images (max 10MB total)                 |
| `created_at`     | DateTime    | Auto     | Tanggal dibuat       | Auto-generated                                   |
| `updated_at`     | DateTime    | Auto     | Tanggal diupdate     | Auto-generated                                   |

#### Relations

- `bookings` (One-to-Many): Relation ke `booking`
- `customer` (Many-to-One): Relation ke `konsumen`
- `marketing_staff` (Many-to-One): Relation ke `karyawan`

**Note**: Unit Rumah juga memiliki fields tambahan dari sistem existing seperti:

- `harga` (Component): Komponen harga dengan detail pricing
- `estimasi_biaya_pembangunan` (Decimal): Estimasi biaya pembangunan
- `gambar_3d`, `gambar_denah`, `foto_progress` (Media): Various images
- `status_pembangunan` (Component): Progress pembangunan
- `dokumen_unit` (Component): Dokumen terkait unit
- `proyek_perumahan` (Relation): Relasi ke proyek perumahan

### 3. Konsumen/Customer (Content Type: `konsumen`)

#### Fields

| Field Name          | Type     | Required | Description         | Validation                       |
| ------------------- | -------- | -------- | ------------------- | -------------------------------- |
| `customer_id`       | String   | Yes      | ID unik customer    | Unique, Pattern: CUST-XXX        |
| `name`              | String   | Yes      | Nama lengkap        | Min: 2, Max: 100                 |
| `phone`             | String   | Yes      | Nomor telepon       | Pattern: Indonesian phone format |
| `email`             | Email    | Yes      | Alamat email        | Valid email format               |
| `address`           | Text     | No       | Alamat lengkap      | Max: 500                         |
| `ktp_number`        | String   | Yes      | Nomor KTP           | Pattern: [0-9]{16}               |
| `npwp_number`       | String   | No       | Nomor NPWP          | Pattern: [0-9]{15}               |
| `birth_date`        | Date     | No       | Tanggal lahir       | Date format                      |
| `birth_place`       | String   | No       | Tempat lahir        | Max: 50                          |
| `occupation`        | String   | No       | Pekerjaan           | Max: 50                          |
| `monthly_income`    | Decimal  | No       | Penghasilan bulanan | Min: 0                           |
| `emergency_contact` | Text     | No       | Kontak darurat      | Max: 200                         |
| `created_at`        | DateTime | Auto     | Tanggal dibuat      | Auto-generated                   |
| `updated_at`        | DateTime | Auto     | Tanggal diupdate    | Auto-generated                   |

#### Relations

- `bookings` (One-to-Many): Relation ke `booking`
- `units` (One-to-Many): Relation ke `unit-rumah`
- `marketing_staff` (Many-to-One): Relation ke `karyawan`
- `bank_kpr` (Many-to-One): Relation ke `bank`

**Note**: Konsumen juga memiliki fields tambahan dari sistem existing seperti:

- `status_kpr` (Enumeration): Status KPR (Belum Mengajukan, Dalam Proses, Disetujui, Ditolak)
- `metode_pembayaran` (Enumeration): Metode pembayaran (KPR, Tunai Keras, Tunai Bertahap)
- `dokumen_konsumen` (Component): Dokumen konsumen
- `riwayat_pembayaran` (Component): Riwayat transaksi

### 4. Booking Document (Content Type: `booking-document`)

#### Fields

| Field Name      | Type        | Required | Description        | Validation                                 |
| --------------- | ----------- | -------- | ------------------ | ------------------------------------------ |
| `document_type` | Enumeration | Yes      | Jenis dokumen      | Options: ktp, npwp, slip-gaji, kk, lainnya |
| `document_name` | String      | Yes      | Nama dokumen       | Max: 100                                   |
| `file`          | Media       | Yes      | File dokumen       | PDF/Image file (max 5MB)                   |
| `upload_date`   | Date        | Yes      | Tanggal upload     | Auto-generated on create                   |
| `verified`      | Boolean     | Yes      | Status verifikasi  | Default: false                             |
| `verified_by`   | String      | No       | Diverifikasi oleh  | Max: 100                                   |
| `verified_date` | Date        | No       | Tanggal verifikasi | Date format                                |
| `notes`         | Text        | No       | Catatan dokumen    | Max: 500                                   |
| `created_at`    | DateTime    | Auto     | Tanggal dibuat     | Auto-generated                             |
| `updated_at`    | DateTime    | Auto     | Tanggal diupdate   | Auto-generated                             |

#### Relations

- `booking` (Many-to-One): Relation ke `booking`

### 5. Karyawan/Marketing Staff (Content Type: `karyawan`)

#### Fields (Marketing-specific)

| Field Name           | Type      | Required | Description           | Validation                        |
| -------------------- | --------- | -------- | --------------------- | --------------------------------- |
| `staff_id`           | String    | Yes      | ID unik staff         | Unique, Max: 20                   |
| `nik_karyawan`       | String    | Yes      | NIK Karyawan          | Unique                            |
| `nama_lengkap`       | String    | Yes      | Nama marketing staff  | Min: 2, Max: 100                  |
| `code`               | String    | No       | Kode unik staff       | Unique, Max: 20 (e.g., "Sales A") |
| `kontak`             | Component | No       | Kontak (phone, email) | Component: komponen.kontak        |
| `jabatan`            | Relation  | No       | Jabatan               | Relation ke jabatan               |
| `status_kepegawaian` | Enum      | Yes      | Status kepegawaian    | Tetap, Kontrak, Freelance         |
| `created_at`         | DateTime  | Auto     | Tanggal dibuat        | Auto-generated                    |
| `updated_at`         | DateTime  | Auto     | Tanggal diupdate      | Auto-generated                    |

#### Relations

- `bookings` (One-to-Many): Relation ke `booking`
- `customers` (One-to-Many): Relation ke `konsumen`
- `unit_sales` (One-to-Many): Relation ke `unit-rumah`
- `lead_marketings` (One-to-Many): Relation ke `lead-marketing`
- `target_marketings` (One-to-Many): Relation ke `target-marketing`

**Note**: Karyawan memiliki fields lengkap untuk HRM seperti:

- Data personal (tempat/tanggal lahir, alamat, jenis kelamin, status pernikahan)
- Data kepegawaian (tanggal masuk, status, penggajian, rekening bank)
- Dokumen karyawan, foto, NPWP, kontak darurat
- Relasi ke berbagai modul (absensi, cuti, performance review, placement, dll)

## API Endpoints

### Booking Endpoints

#### GET /api/bookings

**Description**: Mendapatkan daftar semua booking dengan filtering dan pagination
**Query Parameters**:

- `filters[booking_status][$eq]`: Filter berdasarkan status booking
- `filters[payment_status][$eq]`: Filter berdasarkan status pembayaran
- `filters[unit][id][$eq]`: Filter berdasarkan unit ID
- `filters[customer][id][$eq]`: Filter berdasarkan customer ID
- `filters[marketing_staff][id][$eq]`: Filter berdasarkan marketing staff
- `filters[booking_id][$containsi]`: Search berdasarkan booking ID
- `filters[booking_date][$gte]`: Filter dari tanggal booking
- `filters[booking_date][$lte]`: Filter sampai tanggal booking
- `populate`: Populate relations (unit, customer, documents, marketing_staff)
- `sort`: Sorting (created_at:desc, booking_date:desc, etc.)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "booking_id": "BK-2023-001",
        "booking_date": "2023-10-15",
        "booking_fee": 25000000,
        "payment_status": "lunas",
        "booking_status": "aktif",
        "payment_date": "2023-10-16",
        "payment_method": "transfer",
        "notes": "Booking untuk unit tipe 36/72",
        "created_at": "2023-10-15T08:00:00.000Z",
        "updated_at": "2023-10-16T10:00:00.000Z",
        "unit": {
          "data": {
            "id": 1,
            "attributes": {
              "unit_id": "UNIT-001",
              "unit_type": "Tipe 36/72",
              "block": "A",
              "number": "12",
              "price": 450000000,
              "land_area": 72,
              "building_area": 36,
              "bedrooms": 2,
              "bathrooms": 1,
              "garage": 1,
              "status": "dipesan"
            }
          }
        },
        "customer": {
          "data": {
            "id": 1,
            "attributes": {
              "customer_id": "CUST-001",
              "name": "Budi Santoso",
              "phone": "081234567890",
              "email": "budi.s@gmail.com",
              "ktp_number": "3171234567890001"
            }
          }
        },
        "documents": {
          "data": [...]
        },
        "marketing_staff": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Ahmad Rizki",
              "code": "Sales A"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 3,
      "total": 67
    }
  }
}
```

#### GET /api/bookings/:id

**Description**: Mendapatkan detail booking berdasarkan ID
**Query Parameters**:

- `populate`: Populate relations

#### POST /api/bookings

**Description**: Membuat booking baru
**Request Body**:

```json
{
  "data": {
    "booking_fee": 25000000,
    "payment_status": "pending",
    "booking_status": "menunggu-pembayaran",
    "notes": "Booking untuk unit tipe 36/72",
    "unit": 1,
    "customer": 1,
    "marketing_staff": 1
  }
}
```

#### PUT /api/bookings/:id

**Description**: Update booking
**Request Body**: Same as POST with additional fields

```json
{
  "data": {
    "payment_status": "lunas",
    "booking_status": "aktif",
    "payment_date": "2023-10-16",
    "payment_method": "transfer"
  }
}
```

#### DELETE /api/bookings/:id

**Description**: Hapus booking (soft delete - ubah status menjadi dibatalkan)

### Unit Endpoints

#### GET /api/unit-rumahs

**Description**: Mendapatkan daftar unit
**Query Parameters**:

- `filters[status][$eq]`: Filter berdasarkan status unit
- `filters[unit_type][$containsi]`: Search berdasarkan tipe unit
- `filters[block][$eq]`: Filter berdasarkan blok
- `filters[price][$gte]`: Filter harga minimum
- `filters[price][$lte]`: Filter harga maksimum
- `populate`: Populate bookings relation
- `sort`: Sorting (price:asc, unit_id:asc, etc.)

#### POST /api/unit-rumahs

**Description**: Tambah unit baru
**Request Body**:

```json
{
  "data": {
    "unit_id": "UNIT-005",
    "unit_type": "Tipe 36/72",
    "block": "A",
    "number": "13",
    "price": 450000000,
    "land_area": 72,
    "building_area": 36,
    "bedrooms": 2,
    "bathrooms": 1,
    "garage": 1,
    "location": "Blok A - Row 3",
    "status": "tersedia",
    "specifications": {
      "carport": true,
      "garden": false,
      "furnished": false
    }
  }
}
```

### Customer Endpoints

#### GET /api/konsumens

**Description**: Mendapatkan daftar customer
**Query Parameters**:

- `filters[name][$containsi]`: Search berdasarkan nama
- `filters[phone][$containsi]`: Search berdasarkan telepon
- `filters[email][$containsi]`: Search berdasarkan email
- `filters[ktp_number][$eq]`: Filter berdasarkan KTP
- `populate`: Populate bookings relation
- `sort`: Sorting (name:asc, created_at:desc, etc.)

#### POST /api/konsumens

**Description**: Tambah customer baru
**Request Body**:

```json
{
  "data": {
    "name": "John Doe",
    "phone": "081234567890",
    "email": "john@example.com",
    "address": "Jl. Contoh No. 1, Jakarta",
    "ktp_number": "3171234567890001",
    "npwp_number": "123456789012345",
    "birth_date": "1985-05-15",
    "birth_place": "Jakarta",
    "occupation": "Karyawan Swasta",
    "monthly_income": 8000000,
    "emergency_contact": "Jane Doe - 081234567891"
  }
}
```

### Booking Document Endpoints

#### GET /api/booking-documents

**Description**: Mendapatkan daftar dokumen booking
**Query Parameters**:

- `filters[booking][id][$eq]`: Filter berdasarkan booking ID
- `filters[document_type][$eq]`: Filter berdasarkan jenis dokumen
- `filters[verified][$eq]`: Filter berdasarkan status verifikasi
- `populate`: Populate booking relation
- `sort`: Sorting (upload_date:desc)

#### POST /api/booking-documents

**Description**: Upload dokumen booking
**Request Body** (multipart/form-data):

```json
{
  "data": {
    "document_type": "ktp",
    "document_name": "KTP Budi Santoso",
    "booking": 1
  },
  "files": {
    "file": [uploaded_file]
  }
}
```

#### PUT /api/booking-documents/:id

**Description**: Update status verifikasi dokumen
**Request Body**:

```json
{
  "data": {
    "verified": true,
    "verified_by": "Admin Marketing",
    "verified_date": "2023-10-17",
    "notes": "Dokumen valid dan sesuai"
  }
}
```

### Marketing Staff Endpoints

#### GET /api/karyawans

**Description**: Mendapatkan daftar marketing staff
**Query Parameters**:

- `filters[is_active][$eq]`: Filter staff aktif
- `filters[name][$containsi]`: Search berdasarkan nama
- `populate`: Populate bookings relation

#### POST /api/karyawans

**Description**: Tambah marketing staff baru
**Request Body**:

```json
{
  "data": {
    "staff_id": "STF-001",
    "nik_karyawan": "3171234567890001",
    "nama_lengkap": "Ahmad Rizki",
    "code": "Sales A",
    "kontak": {
      "telepon": "081234567890",
      "email": "ahmad@company.com"
    },
    "jenis_kelamin": "Laki-laki",
    "tempat_lahir": "Jakarta",
    "tanggal_lahir": "1990-01-15",
    "alamat": "Jl. Contoh No. 123, Jakarta",
    "status_pernikahan": "Menikah",
    "status_kepegawaian": "Tetap",
    "tanggal_masuk": "2023-01-01",
    "jabatan": 1
  }
}
```

## Strapi Configuration

### Content Type Builder Settings

#### Booking Content Type (Modified)

```json
{
  "kind": "collectionType",
  "collectionName": "bookings",
  "info": {
    "singularName": "booking",
    "pluralName": "bookings",
    "displayName": "Booking",
    "description": "Marketing bookings management system"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "booking_id": {
      "type": "string",
      "required": true,
      "unique": true,
      "regex": "^BK-[0-9]{4}-[0-9]{3}$"
    },
    "booking_date": {
      "type": "date",
      "required": true
    },
    "booking_fee": {
      "type": "decimal",
      "required": true,
      "min": 0
    },
    "payment_status": {
      "type": "enumeration",
      "enum": ["pending", "lunas", "overdue"],
      "required": true,
      "default": "pending"
    },
    "booking_status": {
      "type": "enumeration",
      "enum": ["aktif", "menunggu-pembayaran", "dibatalkan", "selesai"],
      "required": true,
      "default": "menunggu-pembayaran"
    },
    "payment_date": {
      "type": "date",
      "required": false
    },
    "payment_method": {
      "type": "enumeration",
      "enum": ["transfer", "cash", "check", "kredit"],
      "required": false
    },
    "payment_proof": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files"]
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "unit": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::unit-rumah.unit-rumah",
      "inversedBy": "bookings"
    },
    "customer": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::konsumen.konsumen",
      "inversedBy": "bookings"
    },
    "documents": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::booking-document.booking-document",
      "mappedBy": "booking"
    },
    "marketing_staff": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "bookings"
    }
  }
}
```

### Permissions

Set permissions untuk:

- `booking`: find, findOne, create, update, delete
- `unit-rumah`: find, findOne, create, update, delete
- `konsumen`: find, findOne, create, update, delete
- `booking-document`: find, findOne, create, update, delete
- `karyawan`: find, findOne, create, update, delete

### Lifecycle Hooks

```javascript
// api/booking/content-types/booking/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate booking ID if not provided
    if (!data.booking_id) {
      const currentYear = new Date().getFullYear();
      const lastBooking = await strapi.entityService.findMany(
        "api::booking.booking",
        {
          filters: {
            booking_id: {
              $startsWith: `BK-${currentYear}-`,
            },
          },
          sort: { booking_id: "desc" },
          limit: 1,
        }
      );

      let nextNumber = 1;
      if (lastBooking.length > 0) {
        const lastId = lastBooking[0].booking_id;
        const lastNumber = parseInt(lastId.split("-")[2]);
        nextNumber = lastNumber + 1;
      }

      data.booking_id = `BK-${currentYear}-${nextNumber
        .toString()
        .padStart(3, "0")}`;
    }

    // Set booking date if not provided
    if (!data.booking_date) {
      data.booking_date = new Date().toISOString().split("T")[0];
    }

    // Update unit status to 'dipesan'
    if (data.unit) {
      await strapi.entityService.update(
        "api::unit-rumah.unit-rumah",
        data.unit,
        {
          data: { status: "dipesan" },
        }
      );
    }
  },

  async afterUpdate(event) {
    const { data, where } = event.params;
    const { result } = event;

    // Update unit status based on booking status
    if (data.booking_status && result.unit) {
      let unitStatus = "tersedia";

      switch (data.booking_status) {
        case "aktif":
          unitStatus = "dipesan";
          break;
        case "selesai":
          unitStatus = "terjual";
          break;
        case "dibatalkan":
          unitStatus = "tersedia";
          break;
        default:
          unitStatus = "dipesan";
      }

      await strapi.entityService.update(
        "api::unit-rumah.unit-rumah",
        result.unit.id,
        {
          data: { status: unitStatus },
        }
      );
    }
  },
};

// api/booking-document/content-types/booking-document/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Set upload date
    if (!data.upload_date) {
      data.upload_date = new Date().toISOString().split("T")[0];
    }
  },
};
```

## Frontend Integration Notes

### State Management

- Gunakan React Query/SWR untuk caching dan synchronization
- Implement optimistic updates untuk UX yang lebih baik
- Cache unit availability data dengan TTL yang sesuai
- Real-time updates untuk status booking dan pembayaran

### Form Validation

- Validasi booking ID format (BK-YYYY-XXX)
- Validasi email format di frontend
- Validasi nomor telepon Indonesia
- Validasi KTP dan NPWP format
- Required field validation
- File type dan size validation untuk upload dokumen

### Multi-Step Booking Process

1. **Unit Selection**: Pilih unit dari daftar ketersediaan
2. **Customer Data**: Input/pilih data customer
3. **Document Upload**: Upload dokumen persyaratan
4. **Booking Form**: Generate dan cetak form booking
5. **Payment Status**: Track status pembayaran booking fee

### File Upload

- Support multiple file upload untuk dokumen
- File type validation (PDF, JPG, PNG)
- File size limit (max 5MB per file)
- Image compression untuk foto
- Progress indicator untuk upload

### Real-time Updates

- WebSocket untuk real-time notification
- Auto-refresh booking status
- Notification untuk pembayaran dan verifikasi dokumen
- Live unit availability updates

### Data Export

- Export booking data ke Excel/CSV
- Export laporan pembayaran per periode
- Export data unit dan ketersediaan
- Template download untuk import data

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (Admin, Marketing, Sales, Customer)
3. **Data Validation**: Server-side validation untuk semua input
4. **Rate Limiting**: Implement rate limiting untuk API endpoints
5. **CORS**: Configure CORS untuk frontend domain
6. **File Security**: Secure file upload dan storage dengan virus scanning
7. **Data Privacy**: Encrypt sensitive data seperti KTP dan NPWP
8. **Audit Trail**: Log semua perubahan booking dan pembayaran
9. **Payment Security**: Secure handling untuk bukti pembayaran

## Performance Optimization

1. **Database Indexing**: Index pada field yang sering di-query (booking_id, booking_date, payment_status, booking_status)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk unit availability dan customer data
4. **Image Optimization**: Compress dan optimize uploaded images
5. **API Response**: Minimize response size dengan selective field population
6. **Lazy Loading**: Load relations only when needed
7. **Search Optimization**: Implement full-text search untuk booking dan customer data

## Business Rules

1. **Booking ID Generation**: ✅ Auto-generate booking ID dengan format BK-YYYY-XXX
2. **Unit Status Management**: ✅ Auto-update status unit berdasarkan booking status
3. **Payment Validation**: ⚠️ Validasi pembayaran booking fee (manual via admin)
4. **Document Verification**: ✅ Document verification workflow implemented
5. **Booking Expiry**: ⚠️ Auto-cancel booking (perlu implementasi cron job)
6. **Unit Availability**: ✅ Real-time update ketersediaan unit via lifecycle hooks
7. **Customer Duplicate Check**: ⚠️ Prevent duplicate booking (perlu custom validation)
8. **Marketing Assignment**: ✅ Marketing staff assignment via relasi
9. **Booking Fee Calculation**: ⚠️ Calculate booking fee (perlu custom logic)
10. **Status Workflow**: ✅ Status transition workflow via lifecycle hooks

### Implementation Status:

- ✅ **Core Functionality**: Booking CRUD, unit status management, document upload
- ✅ **Data Structure**: All content types and relations implemented
- ✅ **Auto ID Generation**: Booking, unit, customer ID auto-generation
- ✅ **Lifecycle Hooks**: Business logic implemented
- ⚠️ **Advanced Features**: Payment validation, booking expiry, duplicate check (future enhancement)

## Reporting & Analytics

### Dashboard Metrics

- Total booking aktif
- Unit tersedia vs terjual
- Revenue dari booking fee
- Conversion rate dari lead ke booking
- Performance marketing staff

### Reports

- Laporan booking harian/bulanan
- Laporan pembayaran dan outstanding
- Laporan ketersediaan unit
- Laporan performance marketing
- Laporan dokumen verification status

### Export Features

- Export booking data dengan filter tanggal
- Export customer database
- Export unit inventory
- Export payment reports
- Bulk export untuk accounting integration
