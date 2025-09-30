# API Documentation - Marketing Leads System

## Overview

Dokumentasi API untuk sistem manajemen leads marketing perumahan menggunakan Strapi CMS. Sistem ini mendukung CRUD operations untuk data leads, komunikasi, dan reminder follow-up.

## Content Types

### 1. Lead (Content Type: `lead`)

#### Fields

| Field Name   | Type        | Required | Description                | Validation                                                   |
| ------------ | ----------- | -------- | -------------------------- | ------------------------------------------------------------ |
| `name`       | String      | Yes      | Nama lengkap calon pembeli | Min: 2, Max: 100                                             |
| `phone`      | String      | Yes      | Nomor telepon              | Pattern: Indonesian phone format                             |
| `email`      | Email       | Yes      | Alamat email               | Valid email format                                           |
| `address`    | Text        | No       | Alamat lengkap             | Max: 500                                                     |
| `source`     | Enumeration | Yes      | Sumber lead                | Options: website, pameran, referensi, iklan, sosmed, lainnya |
| `interest`   | String      | No       | Tipe rumah yang diminati   | Max: 50 (e.g., "Tipe 45/90")                                 |
| `budget`     | String      | No       | Range budget               | Max: 50 (e.g., "400-500 Juta")                               |
| `status`     | Enumeration | Yes      | Status lead                | Options: baru, berminat, prioritas                           |
| `date`       | Date        | Yes      | Tanggal lead masuk         | Auto-generated on create                                     |
| `notes`      | Text        | No       | Catatan tambahan           | Max: 1000                                                    |
| `created_at` | DateTime    | Auto     | Tanggal dibuat             | Auto-generated                                               |
| `updated_at` | DateTime    | Auto     | Tanggal diupdate           | Auto-generated                                               |

#### Relations

- `marketing` (Many-to-One): Relation ke `marketing-staff`
- `communications` (One-to-Many): Relation ke `communication`
- `reminders` (One-to-Many): Relation ke `reminder`

### 2. Marketing Staff (Content Type: `marketing-staff`)

#### Fields

| Field Name   | Type     | Required | Description          | Validation                        |
| ------------ | -------- | -------- | -------------------- | --------------------------------- |
| `name`       | String   | Yes      | Nama marketing staff | Min: 2, Max: 100                  |
| `code`       | String   | Yes      | Kode unik staff      | Unique, Max: 20 (e.g., "Sales A") |
| `phone`      | String   | No       | Nomor telepon staff  | Pattern: Indonesian phone format  |
| `email`      | Email    | No       | Email staff          | Valid email format                |
| `is_active`  | Boolean  | Yes      | Status aktif         | Default: true                     |
| `created_at` | DateTime | Auto     | Tanggal dibuat       | Auto-generated                    |
| `updated_at` | DateTime | Auto     | Tanggal diupdate     | Auto-generated                    |

#### Relations

- `leads` (One-to-Many): Relation ke `lead`

### 3. Communication (Content Type: `communication`)

#### Fields

| Field Name   | Type        | Required | Description        | Validation                                            |
| ------------ | ----------- | -------- | ------------------ | ----------------------------------------------------- |
| `date`       | Date        | Yes      | Tanggal komunikasi | Required                                              |
| `type`       | Enumeration | Yes      | Jenis komunikasi   | Options: telepon, whatsapp, email, kunjungan, lainnya |
| `notes`      | Text        | Yes      | Catatan komunikasi | Min: 10, Max: 1000                                    |
| `created_at` | DateTime    | Auto     | Tanggal dibuat     | Auto-generated                                        |
| `updated_at` | DateTime    | Auto     | Tanggal diupdate   | Auto-generated                                        |

#### Relations

- `lead` (Many-to-One): Relation ke `lead`

### 4. Reminder (Content Type: `reminder`)

#### Fields

| Field Name   | Type        | Required | Description                    | Validation                             |
| ------------ | ----------- | -------- | ------------------------------ | -------------------------------------- |
| `date`       | Date        | Yes      | Tanggal reminder               | Required                               |
| `activity`   | String      | Yes      | Aktivitas yang harus dilakukan | Min: 5, Max: 200                       |
| `status`     | Enumeration | Yes      | Status reminder                | Options: pending, completed, cancelled |
| `created_at` | DateTime    | Auto     | Tanggal dibuat                 | Auto-generated                         |
| `updated_at` | DateTime    | Auto     | Tanggal diupdate               | Auto-generated                         |

#### Relations

- `lead` (Many-to-One): Relation ke `lead`

## API Endpoints

### Lead Endpoints

#### GET /api/leads

**Description**: Mendapatkan daftar semua leads dengan filtering dan pagination
**Query Parameters**:

- `filters[status][$eq]`: Filter berdasarkan status (baru, berminat, prioritas)
- `filters[source][$eq]`: Filter berdasarkan sumber
- `filters[marketing][id][$eq]`: Filter berdasarkan marketing staff
- `filters[name][$containsi]`: Search berdasarkan nama
- `filters[phone][$containsi]`: Search berdasarkan telepon
- `filters[email][$containsi]`: Search berdasarkan email
- `populate`: Populate relations (communications, reminders, marketing)
- `sort`: Sorting (created_at:desc, name:asc, etc.)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Agus Santoso",
        "phone": "081234567891",
        "email": "agus.s@gmail.com",
        "address": "Jl. Mawar No. 10, Jakarta Selatan",
        "source": "website",
        "interest": "Tipe 45/90",
        "budget": "400-500 Juta",
        "status": "prioritas",
        "date": "2023-09-12",
        "notes": "Klien sangat tertarik",
        "created_at": "2023-09-12T10:00:00.000Z",
        "updated_at": "2023-09-12T10:00:00.000Z",
        "marketing": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Budi",
              "code": "Sales A"
            }
          }
        },
        "communications": {
          "data": [...]
        },
        "reminders": {
          "data": [...]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 2,
      "total": 42
    }
  }
}
```

#### GET /api/leads/:id

**Description**: Mendapatkan detail lead berdasarkan ID
**Query Parameters**:

- `populate`: Populate relations

#### POST /api/leads

**Description**: Membuat lead baru
**Request Body**:

```json
{
  "data": {
    "name": "John Doe",
    "phone": "081234567890",
    "email": "john@example.com",
    "address": "Jl. Contoh No. 1",
    "source": "website",
    "interest": "Tipe 36/72",
    "budget": "300-400 Juta",
    "status": "baru",
    "notes": "Catatan tambahan",
    "marketing": 1
  }
}
```

#### PUT /api/leads/:id

**Description**: Update lead
**Request Body**: Same as POST

#### DELETE /api/leads/:id

**Description**: Hapus lead

### Communication Endpoints

#### GET /api/communications

**Description**: Mendapatkan daftar komunikasi
**Query Parameters**:

- `filters[lead][id][$eq]`: Filter berdasarkan lead ID
- `filters[type][$eq]`: Filter berdasarkan jenis komunikasi
- `populate`: Populate lead relation
- `sort`: Sorting (date:desc)

#### POST /api/communications

**Description**: Tambah komunikasi baru
**Request Body**:

```json
{
  "data": {
    "date": "2023-09-15",
    "type": "telepon",
    "notes": "Follow-up pembelian",
    "lead": 1
  }
}
```

### Reminder Endpoints

#### GET /api/reminders

**Description**: Mendapatkan daftar reminder
**Query Parameters**:

- `filters[lead][id][$eq]`: Filter berdasarkan lead ID
- `filters[status][$eq]`: Filter berdasarkan status
- `filters[date][$lte]`: Filter reminder yang sudah lewat
- `populate`: Populate lead relation

#### POST /api/reminders

**Description**: Tambah reminder baru
**Request Body**:

```json
{
  "data": {
    "date": "2023-09-20",
    "activity": "Follow-up keputusan pembelian",
    "status": "pending",
    "lead": 1
  }
}
```

#### PUT /api/reminders/:id

**Description**: Update status reminder
**Request Body**:

```json
{
  "data": {
    "status": "completed"
  }
}
```

### Marketing Staff Endpoints

#### GET /api/marketing-staffs

**Description**: Mendapatkan daftar marketing staff
**Query Parameters**:

- `filters[is_active][$eq]`: Filter staff aktif
- `populate`: Populate leads relation

#### POST /api/marketing-staffs

**Description**: Tambah marketing staff baru
**Request Body**:

```json
{
  "data": {
    "name": "Budi Santoso",
    "code": "Sales A",
    "phone": "081234567890",
    "email": "budi@company.com",
    "is_active": true
  }
}
```

## Strapi Configuration

### Content Type Builder Settings

#### Lead Content Type

```json
{
  "kind": "collectionType",
  "collectionName": "leads",
  "info": {
    "singularName": "lead",
    "pluralName": "leads",
    "displayName": "Lead"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "phone": {
      "type": "string",
      "required": true,
      "regex": "^08[0-9]{8,11}$"
    },
    "email": {
      "type": "email",
      "required": true
    },
    "address": {
      "type": "text",
      "maxLength": 500
    },
    "source": {
      "type": "enumeration",
      "enum": ["website", "pameran", "referensi", "iklan", "sosmed", "lainnya"],
      "required": true
    },
    "interest": {
      "type": "string",
      "maxLength": 50
    },
    "budget": {
      "type": "string",
      "maxLength": 50
    },
    "status": {
      "type": "enumeration",
      "enum": ["baru", "berminat", "prioritas"],
      "required": true,
      "default": "baru"
    },
    "date": {
      "type": "date",
      "required": true
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "marketing": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::marketing-staff.marketing-staff",
      "inversedBy": "leads"
    },
    "communications": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::communication.communication",
      "mappedBy": "lead"
    },
    "reminders": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::reminder.reminder",
      "mappedBy": "lead"
    }
  }
}
```

### Permissions

Set permissions untuk:

- `lead`: find, findOne, create, update, delete
- `communication`: find, findOne, create, update, delete
- `reminder`: find, findOne, create, update, delete
- `marketing-staff`: find, findOne, create, update, delete

### Lifecycle Hooks

```javascript
// api/lead/content-types/lead/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (!data.date) {
      data.date = new Date().toISOString().split("T")[0];
    }
  },
};
```

## Frontend Integration Notes

### State Management

- Gunakan React Query/SWR untuk caching dan synchronization
- Implement optimistic updates untuk UX yang lebih baik

### Form Validation

- Validasi email format di frontend
- Validasi nomor telepon Indonesia
- Required field validation

### Real-time Updates

- Implement WebSocket untuk real-time notification
- Auto-refresh data ketika ada perubahan

### File Upload

- Support import Excel/CSV untuk bulk data
- Template download untuk import

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (Admin, Marketing, Sales)
3. **Data Validation**: Server-side validation untuk semua input
4. **Rate Limiting**: Implement rate limiting untuk API endpoints
5. **CORS**: Configure CORS untuk frontend domain
6. **Data Privacy**: Encrypt sensitive data seperti nomor telepon

## Performance Optimization

1. **Database Indexing**: Index pada field yang sering di-query (status, source, date)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk frequently accessed data
4. **Image Optimization**: Compress dan optimize images
5. **API Response**: Minimize response size dengan selective field population
