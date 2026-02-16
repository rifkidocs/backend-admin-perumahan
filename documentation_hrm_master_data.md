# API Documentation - HRM Master Data System

## Overview

Dokumentasi API untuk sistem manajemen master data HRM (Human Resource Management) perumahan menggunakan Strapi CMS. Sistem ini mendukung CRUD operations untuk data karyawan, gaji, kontrak, dan informasi HR lainnya.

## Content Types

### 1. Employee (Content Type: `employee`)

#### Fields

| Field Name          | Type        | Required | Description              | Validation                                               |
| ------------------- | ----------- | -------- | ------------------------ | -------------------------------------------------------- |
| `nik`               | String      | Yes      | Nomor Induk Karyawan     | Unique, Pattern: EMP[0-9]{3}                             |
| `name`              | String      | Yes      | Nama lengkap karyawan    | Min: 2, Max: 100                                         |
| `gender`            | Enumeration | Yes      | Jenis kelamin            | Options: laki-laki, perempuan                            |
| `birth_date`        | Date        | Yes      | Tanggal lahir            | Required                                                 |
| `birth_place`       | String      | Yes      | Tempat lahir             | Min: 2, Max: 50                                          |
| `address`           | Text        | Yes      | Alamat lengkap           | Min: 10, Max: 500                                        |
| `phone`             | String      | Yes      | Nomor telepon            | Pattern: Indonesian phone format                         |
| `email`             | Email       | Yes      | Alamat email             | Valid email format                                       |
| `photo`             | Media       | No       | Foto profil karyawan     | Image file (jpg, png, max 2MB)                           |
| `position`          | String      | Yes      | Jabatan/posisi           | Min: 2, Max: 50                                          |
| `department`        | Enumeration | Yes      | Departemen               | Options: marketing, project, admin, gudang, legal-teknis |
| `employment_type`   | Enumeration | Yes      | Jenis kepegawaian        | Options: tetap, kontrak, magang                          |
| `join_date`         | Date        | Yes      | Tanggal bergabung        | Required                                                 |
| `contract_end`      | Date        | No       | Tanggal berakhir kontrak | Required if employment_type = kontrak                    |
| `status`            | Enumeration | Yes      | Status karyawan          | Options: aktif, nonaktif, kontrak-berakhir               |
| `emergency_contact` | Text        | No       | Kontak darurat           | Max: 200                                                 |
| `bank_account`      | String      | No       | Nomor rekening bank      | Max: 20                                                  |
| `bank_name`         | String      | No       | Nama bank                | Max: 50                                                  |
| `tax_id`            | String      | No       | NPWP                     | Pattern: [0-9]{15}                                       |
| `notes`             | Text        | No       | Catatan tambahan         | Max: 1000                                                |
| `created_at`        | DateTime    | Auto     | Tanggal dibuat           | Auto-generated                                           |
| `updated_at`        | DateTime    | Auto     | Tanggal diupdate         | Auto-generated                                           |

#### Relations

- `salary` (One-to-One): Relation ke `salary`
- `contracts` (One-to-Many): Relation ke `contract`
- `attendances` (One-to-Many): Relation ke `attendance`
- `leaves` (One-to-Many): Relation ke `leave`
- `performance_reviews` (One-to-Many): Relation ke `performance-review`
- `placements` (One-to-Many): Relation ke `placement`

### 2. Salary (Content Type: `salary`)

#### Fields

| Field Name            | Type        | Required | Description          | Validation                     |
| --------------------- | ----------- | -------- | -------------------- | ------------------------------ |
| `basic_salary`        | Decimal     | Yes      | Gaji pokok           | Min: 0                         |
| `position_allowance`  | Decimal     | No       | Tunjangan jabatan    | Min: 0                         |
| `tunjangan_kinerja`   | Decimal     | No       | Tunjangan kinerja    | Min: 0                         |
| `harian`              | Decimal     | No       | Harian               | Min: 0                         |
| `bonus`               | Decimal     | No       | Bonus/komisi         | Min: 0                         |
| `deductions`          | Decimal     | No       | Total potongan       | Min: 0                         |
| `net_salary`          | Decimal     | Auto     | Gaji bersih          | Auto-calculated                |
| `effective_date`      | Date        | Yes      | Tanggal efektif gaji | Required                       |
| `currency`            | String      | Yes      | Mata uang            | Default: "IDR"                 |
| `payment_method`      | Enumeration | Yes      | Metode pembayaran    | Options: transfer, cash, check |
| `created_at`          | DateTime    | Auto     | Tanggal dibuat       | Auto-generated                 |
| `updated_at`          | DateTime    | Auto     | Tanggal diupdate     | Auto-generated                 |

#### Relations

- `employee` (One-to-One): Relation ke `employee`

### 3. Contract (Content Type: `contract`)

#### Fields

| Field Name        | Type        | Required | Description              | Validation                            |
| ----------------- | ----------- | -------- | ------------------------ | ------------------------------------- |
| `contract_number` | String      | Yes      | Nomor kontrak            | Unique, Max: 50                       |
| `contract_type`   | Enumeration | Yes      | Jenis kontrak            | Options: pkwt, pkwtt, magang, lainnya |
| `start_date`      | Date        | Yes      | Tanggal mulai kontrak    | Required                              |
| `end_date`        | Date        | No       | Tanggal berakhir kontrak | Required for temporary contracts      |
| `position`        | String      | Yes      | Posisi dalam kontrak     | Min: 2, Max: 50                       |
| `salary`          | Decimal     | Yes      | Gaji dalam kontrak       | Min: 0                                |
| `status`          | Enumeration | Yes      | Status kontrak           | Options: aktif, berakhir, dibatalkan  |
| `document_url`    | String      | No       | URL dokumen kontrak      | Valid URL format                      |
| `notes`           | Text        | No       | Catatan kontrak          | Max: 500                              |
| `created_at`      | DateTime    | Auto     | Tanggal dibuat           | Auto-generated                        |
| `updated_at`      | DateTime    | Auto     | Tanggal diupdate         | Auto-generated                        |

#### Relations

- `employee` (Many-to-One): Relation ke `employee`

### 4. Attendance (Content Type: `attendance`)

#### Fields

| Field Name       | Type        | Required | Description       | Validation                             |
| ---------------- | ----------- | -------- | ----------------- | -------------------------------------- |
| `date`           | Date        | Yes      | Tanggal kehadiran | Required                               |
| `check_in`       | Time        | No       | Jam masuk         | Time format                            |
| `check_out`      | Time        | No       | Jam keluar        | Time format                            |
| `status`         | Enumeration | Yes      | Status kehadiran  | Options: hadir, terlambat, absen, izin |
| `overtime_hours` | Decimal     | No       | Jam lembur        | Min: 0                                 |
| `notes`          | Text        | No       | Catatan kehadiran | Max: 200                               |
| `created_at`     | DateTime    | Auto     | Tanggal dibuat    | Auto-generated                         |
| `updated_at`     | DateTime    | Auto     | Tanggal diupdate  | Auto-generated                         |

#### Relations

- `employee` (Many-to-One): Relation ke `employee`

### 5. Leave (Content Type: `leave`)

#### Fields

| Field Name      | Type        | Required | Description          | Validation                                            |
| --------------- | ----------- | -------- | -------------------- | ----------------------------------------------------- |
| `leave_type`    | Enumeration | Yes      | Jenis cuti           | Options: tahunan, sakit, melahirkan, darurat, lainnya |
| `start_date`    | Date        | Yes      | Tanggal mulai cuti   | Required                                              |
| `end_date`      | Date        | Yes      | Tanggal selesai cuti | Required                                              |
| `total_days`    | Integer     | Auto     | Total hari cuti      | Auto-calculated                                       |
| `reason`        | Text        | Yes      | Alasan cuti          | Min: 10, Max: 500                                     |
| `status`        | Enumeration | Yes      | Status pengajuan     | Options: pending, approved, rejected                  |
| `approved_by`   | String      | No       | Disetujui oleh       | Max: 100                                              |
| `approved_date` | Date        | No       | Tanggal persetujuan  | Date format                                           |
| `notes`         | Text        | No       | Catatan tambahan     | Max: 200                                              |
| `created_at`    | DateTime    | Auto     | Tanggal dibuat       | Auto-generated                                        |
| `updated_at`    | DateTime    | Auto     | Tanggal diupdate     | Auto-generated                                        |

#### Relations

- `employee` (Many-to-One): Relation ke `employee`

### 6. Performance Review (Content Type: `performance-review`)

#### Fields

| Field Name        | Type        | Required | Description         | Validation                          |
| ----------------- | ----------- | -------- | ------------------- | ----------------------------------- |
| `review_period`   | String      | Yes      | Periode penilaian   | Max: 50 (e.g., "Q1 2023")           |
| `review_date`     | Date        | Yes      | Tanggal penilaian   | Required                            |
| `overall_score`   | Decimal     | Yes      | Skor keseluruhan    | Min: 0, Max: 100                    |
| `goals_achieved`  | Integer     | Yes      | Target yang dicapai | Min: 0                              |
| `goals_total`     | Integer     | Yes      | Total target        | Min: 1                              |
| `strengths`       | Text        | No       | Kelebihan           | Max: 500                            |
| `improvements`    | Text        | No       | Area perbaikan      | Max: 500                            |
| `recommendations` | Text        | No       | Rekomendasi         | Max: 500                            |
| `reviewer`        | String      | Yes      | Penilai             | Max: 100                            |
| `status`          | Enumeration | Yes      | Status penilaian    | Options: draft, completed, approved |
| `created_at`      | DateTime    | Auto     | Tanggal dibuat      | Auto-generated                      |
| `updated_at`      | DateTime    | Auto     | Tanggal diupdate    | Auto-generated                      |

#### Relations

- `employee` (Many-to-One): Relation ke `employee`

### 7. Placement (Content Type: `placement`)

#### Fields

| Field Name     | Type        | Required | Description                | Validation                           |
| -------------- | ----------- | -------- | -------------------------- | ------------------------------------ |
| `project_name` | String      | Yes      | Nama proyek                | Min: 2, Max: 100                     |
| `location`     | String      | Yes      | Lokasi penempatan          | Min: 2, Max: 100                     |
| `start_date`   | Date        | Yes      | Tanggal mulai penempatan   | Required                             |
| `end_date`     | Date        | No       | Tanggal selesai penempatan | Date format                          |
| `role`         | String      | Yes      | Peran dalam proyek         | Min: 2, Max: 50                      |
| `status`       | Enumeration | Yes      | Status penempatan          | Options: aktif, selesai, dipindahkan |
| `notes`        | Text        | No       | Catatan penempatan         | Max: 300                             |
| `created_at`   | DateTime    | Auto     | Tanggal dibuat             | Auto-generated                       |
| `updated_at`   | DateTime    | Auto     | Tanggal diupdate           | Auto-generated                       |

#### Relations

- `employee` (Many-to-One): Relation ke `employee`

## API Endpoints

### Employee Endpoints

#### GET /api/employees

**Description**: Mendapatkan daftar semua karyawan dengan filtering dan pagination
**Query Parameters**:

- `filters[status][$eq]`: Filter berdasarkan status (aktif, nonaktif, kontrak-berakhir)
- `filters[department][$eq]`: Filter berdasarkan departemen
- `filters[employment_type][$eq]`: Filter berdasarkan jenis kepegawaian
- `filters[name][$containsi]`: Search berdasarkan nama
- `filters[nik][$containsi]`: Search berdasarkan NIK
- `filters[position][$containsi]`: Search berdasarkan jabatan
- `populate`: Populate relations (salary, contracts, attendances, leaves, performance_reviews, placements)
- `sort`: Sorting (created_at:desc, name:asc, nik:asc, etc.)
- `pagination[page]`: Halaman
- `pagination[pageSize]`: Jumlah data per halaman

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nik": "EMP001",
        "name": "Ahmad Rizki",
        "gender": "laki-laki",
        "birth_date": "1995-03-15",
        "birth_place": "Jakarta",
        "address": "Jl. Mawar No. 10, Jakarta Selatan",
        "phone": "081234567891",
        "email": "ahmad@company.com",
        "photo": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/ahmad_rizki.jpg"
            }
          }
        },
        "position": "Marketing Executive",
        "department": "marketing",
        "employment_type": "tetap",
        "join_date": "2022-01-15",
        "contract_end": null,
        "status": "aktif",
        "emergency_contact": "Siti Rizki - 081234567892",
        "bank_account": "1234567890",
        "bank_name": "BCA",
        "tax_id": "123456789012345",
        "notes": "Karyawan berprestasi",
        "created_at": "2022-01-15T08:00:00.000Z",
        "updated_at": "2023-09-12T10:00:00.000Z",
        "salary": {
          "data": {
            "id": 1,
            "attributes": {
              "basic_salary": 5000000,
              "position_allowance": 1000000,
              "tunjangan_kinerja": 500000,
              "net_salary": 8200000
            }
          }
        },
        "contracts": {
          "data": [...]
        },
        "attendances": {
          "data": [...]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 7,
      "total": 156
    }
  }
}
```

#### GET /api/employees/:id

**Description**: Mendapatkan detail karyawan berdasarkan ID
**Query Parameters**:

- `populate`: Populate relations

#### POST /api/employees

**Description**: Membuat karyawan baru
**Request Body**:

```json
{
  "data": {
    "nik": "EMP001",
    "name": "Ahmad Rizki",
    "gender": "laki-laki",
    "birth_date": "1995-03-15",
    "birth_place": "Jakarta",
    "address": "Jl. Mawar No. 10, Jakarta Selatan",
    "phone": "081234567891",
    "email": "ahmad@company.com",
    "position": "Marketing Executive",
    "department": "marketing",
    "employment_type": "tetap",
    "join_date": "2022-01-15",
    "status": "aktif",
    "emergency_contact": "Siti Rizki - 081234567892",
    "bank_account": "1234567890",
    "bank_name": "BCA",
    "tax_id": "123456789012345"
  }
}
```

#### PUT /api/employees/:id

**Description**: Update data karyawan
**Request Body**: Same as POST

#### DELETE /api/employees/:id

**Description**: Hapus karyawan

### Salary Endpoints

#### GET /api/salaries

**Description**: Mendapatkan daftar data gaji
**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[effective_date][$gte]`: Filter gaji efektif dari tanggal
- `populate`: Populate employee relation
- `sort`: Sorting (effective_date:desc)

#### POST /api/salaries

**Description**: Tambah data gaji baru
**Request Body**:

```json
{
  "data": {
    "basic_salary": 5000000,
    "position_allowance": 1000000,
    "tunjangan_kinerja": 500000,
    "harian": 300000,
    "effective_date": "2023-01-01",
    "currency": "IDR",
    "payment_method": "transfer",
    "employee": 1
  }
}
```

### Contract Endpoints

#### GET /api/contracts

**Description**: Mendapatkan daftar kontrak
**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[status][$eq]`: Filter berdasarkan status kontrak
- `filters[contract_type][$eq]`: Filter berdasarkan jenis kontrak
- `populate`: Populate employee relation
- `sort`: Sorting (start_date:desc)

#### POST /api/contracts

**Description**: Tambah kontrak baru
**Request Body**:

```json
{
  "data": {
    "contract_number": "PKWT-2023-001",
    "contract_type": "pkwt",
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "position": "Marketing Executive",
    "salary": 5000000,
    "status": "aktif",
    "document_url": "https://example.com/contracts/pkwt-2023-001.pdf",
    "employee": 1
  }
}
```

### Attendance Endpoints

#### GET /api/attendances

**Description**: Mendapatkan daftar kehadiran
**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[date][$gte]`: Filter dari tanggal
- `filters[date][$lte]`: Filter sampai tanggal
- `filters[status][$eq]`: Filter berdasarkan status kehadiran
- `populate`: Populate employee relation
- `sort`: Sorting (date:desc)

#### POST /api/attendances

**Description**: Tambah data kehadiran
**Request Body**:

```json
{
  "data": {
    "date": "2023-09-15",
    "check_in": "08:00:00",
    "check_out": "17:00:00",
    "status": "hadir",
    "overtime_hours": 2,
    "notes": "Lembur untuk rapat proyek",
    "employee": 1
  }
}
```

### Leave Endpoints

#### GET /api/leaves

**Description**: Mendapatkan daftar cuti
**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[status][$eq]`: Filter berdasarkan status pengajuan
- `filters[leave_type][$eq]`: Filter berdasarkan jenis cuti
- `filters[start_date][$gte]`: Filter dari tanggal mulai
- `populate`: Populate employee relation
- `sort`: Sorting (start_date:desc)

#### POST /api/leaves

**Description**: Ajukan cuti baru
**Request Body**:

```json
{
  "data": {
    "leave_type": "tahunan",
    "start_date": "2023-10-01",
    "end_date": "2023-10-03",
    "reason": "Liburan keluarga",
    "status": "pending",
    "employee": 1
  }
}
```

#### PUT /api/leaves/:id

**Description**: Update status pengajuan cuti
**Request Body**:

```json
{
  "data": {
    "status": "approved",
    "approved_by": "HR Manager",
    "approved_date": "2023-09-20"
  }
}
```

### Performance Review Endpoints

#### GET /api/performance-reviews

**Description**: Mendapatkan daftar penilaian kinerja
**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[review_period][$containsi]`: Filter berdasarkan periode
- `filters[status][$eq]`: Filter berdasarkan status penilaian
- `populate`: Populate employee relation
- `sort`: Sorting (review_date:desc)

#### POST /api/performance-reviews

**Description**: Buat penilaian kinerja baru
**Request Body**:

```json
{
  "data": {
    "review_period": "Q3 2023",
    "review_date": "2023-09-30",
    "overall_score": 85.5,
    "goals_achieved": 8,
    "goals_total": 10,
    "strengths": "Komunikasi yang baik, inisiatif tinggi",
    "improvements": "Perlu meningkatkan manajemen waktu",
    "recommendations": "Ikuti training time management",
    "reviewer": "Manager Marketing",
    "status": "completed",
    "employee": 1
  }
}
```

### Placement Endpoints

#### GET /api/placements

**Description**: Mendapatkan daftar penempatan
**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[status][$eq]`: Filter berdasarkan status penempatan
- `filters[project_name][$containsi]`: Search berdasarkan nama proyek
- `populate`: Populate employee relation
- `sort`: Sorting (start_date:desc)

#### POST /api/placements

**Description**: Tambah penempatan baru
**Request Body**:

```json
{
  "data": {
    "project_name": "Perumahan Taman Sari",
    "location": "Bekasi, Jawa Barat",
    "start_date": "2023-09-01",
    "end_date": "2024-03-31",
    "role": "Site Supervisor",
    "status": "aktif",
    "notes": "Penempatan untuk proyek baru",
    "employee": 1
  }
}
```

## Strapi Configuration

### Content Type Builder Settings

#### Employee Content Type

```json
{
  "kind": "collectionType",
  "collectionName": "employees",
  "info": {
    "singularName": "employee",
    "pluralName": "employees",
    "displayName": "Employee"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "nik": {
      "type": "string",
      "required": true,
      "unique": true,
      "regex": "^EMP[0-9]{3}$"
    },
    "name": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "gender": {
      "type": "enumeration",
      "enum": ["laki-laki", "perempuan"],
      "required": true
    },
    "birth_date": {
      "type": "date",
      "required": true
    },
    "birth_place": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 50
    },
    "address": {
      "type": "text",
      "required": true,
      "minLength": 10,
      "maxLength": 500
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
    "photo": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "position": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 50
    },
    "department": {
      "type": "enumeration",
      "enum": ["marketing", "project", "admin", "gudang", "legal-teknis"],
      "required": true
    },
    "employment_type": {
      "type": "enumeration",
      "enum": ["tetap", "kontrak", "magang"],
      "required": true
    },
    "join_date": {
      "type": "date",
      "required": true
    },
    "contract_end": {
      "type": "date",
      "required": false
    },
    "status": {
      "type": "enumeration",
      "enum": ["aktif", "nonaktif", "kontrak-berakhir"],
      "required": true,
      "default": "aktif"
    },
    "emergency_contact": {
      "type": "text",
      "maxLength": 200
    },
    "bank_account": {
      "type": "string",
      "maxLength": 20
    },
    "bank_name": {
      "type": "string",
      "maxLength": 50
    },
    "tax_id": {
      "type": "string",
      "regex": "^[0-9]{15}$"
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "salary": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::salary.salary",
      "mappedBy": "employee"
    },
    "contracts": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::contract.contract",
      "mappedBy": "employee"
    },
    "attendances": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::attendance.attendance",
      "mappedBy": "employee"
    },
    "leaves": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::leave.leave",
      "mappedBy": "employee"
    },
    "performance_reviews": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::performance-review.performance-review",
      "mappedBy": "employee"
    },
    "placements": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::placement.placement",
      "mappedBy": "employee"
    }
  }
}
```

### Permissions

Set permissions untuk:

- `employee`: find, findOne, create, update, delete
- `salary`: find, findOne, create, update, delete
- `contract`: find, findOne, create, update, delete
- `attendance`: find, findOne, create, update, delete
- `leave`: find, findOne, create, update, delete
- `performance-review`: find, findOne, create, update, delete
- `placement`: find, findOne, create, update, delete

### Lifecycle Hooks

```javascript
// api/employee/content-types/employee/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate NIK if not provided
    if (!data.nik) {
      const lastEmployee = await strapi.entityService.findMany(
        "api::employee.employee",
        {
          sort: { nik: "desc" },
          limit: 1,
        }
      );

      const lastNik = lastEmployee[0]?.attributes?.nik || "EMP000";
      const nextNumber = parseInt(lastNik.replace("EMP", "")) + 1;
      data.nik = `EMP${nextNumber.toString().padStart(3, "0")}`;
    }

    // Set default status
    if (!data.status) {
      data.status = "aktif";
    }
  },
};

// api/salary/content-types/salary/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Calculate net salary
    const basic = data.basic_salary || 0;
    const positionAllowance = data.position_allowance || 0;
    const tunjanganKinerja = data.tunjangan_kinerja || 0;
    const harian = data.harian || 0;
    const bonus = data.bonus || 0;
    const deductions = data.deductions || 0;

    data.net_salary =
      basic +
      positionAllowance +
      tunjanganKinerja +
      harian +
      bonus -
      deductions;
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Recalculate net salary on update
    if (
      data.basic_salary ||
      data.position_allowance ||
      data.tunjangan_kinerja ||
      data.harian ||
      data.bonus ||
      data.deductions
    ) {
      const basic = data.basic_salary || 0;
      const positionAllowance = data.position_allowance || 0;
      const tunjanganKinerja = data.tunjangan_kinerja || 0;
      const harian = data.harian || 0;
      const bonus = data.bonus || 0;
      const deductions = data.deductions || 0;

      data.net_salary =
        basic +
        positionAllowance +
        tunjanganKinerja +
        harian +
        bonus -
        deductions;
    }
  },
};

// api/leave/content-types/leave/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Calculate total days
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      data.total_days = diffDays;
    }
  },
};
```

## Frontend Integration Notes

### State Management

- Gunakan React Query/SWR untuk caching dan synchronization
- Implement optimistic updates untuk UX yang lebih baik
- Cache employee data dengan TTL yang sesuai

### Form Validation

- Validasi NIK format (EMP + 3 digit)
- Validasi email format di frontend
- Validasi nomor telepon Indonesia
- Required field validation
- Date range validation untuk kontrak dan cuti

### Real-time Updates

- Implement WebSocket untuk real-time notification
- Auto-refresh data ketika ada perubahan status
- Notification untuk approval cuti dan kontrak

### File Upload

- Support upload foto profil karyawan
- Support upload dokumen kontrak
- Image compression untuk foto profil
- File type validation

### Data Export

- Export data karyawan ke Excel/CSV
- Export laporan gaji per periode
- Export data kehadiran per bulan
- Template download untuk import data

## Security Considerations

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Role-based access control (Admin, HR, Manager, Employee)
3. **Data Validation**: Server-side validation untuk semua input
4. **Rate Limiting**: Implement rate limiting untuk API endpoints
5. **CORS**: Configure CORS untuk frontend domain
6. **Data Privacy**: Encrypt sensitive data seperti gaji dan informasi personal
7. **Audit Trail**: Log semua perubahan data karyawan
8. **File Security**: Secure file upload dan storage

## Performance Optimization

1. **Database Indexing**: Index pada field yang sering di-query (nik, status, department, join_date)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk frequently accessed data
4. **Image Optimization**: Compress dan optimize employee photos
5. **API Response**: Minimize response size dengan selective field population
6. **Lazy Loading**: Load relations only when needed
7. **Search Optimization**: Implement full-text search untuk employee data

## Business Rules

1. **NIK Generation**: Auto-generate NIK dengan format EMP + 3 digit sequential
2. **Salary Calculation**: Auto-calculate net salary dari komponen gaji
3. **Contract Validation**: Kontrak sementara harus memiliki end_date
4. **Leave Balance**: Track sisa cuti tahunan per karyawan
5. **Attendance Rules**: Validasi jam masuk/keluar sesuai shift
6. **Performance Review**: Lock review periode yang sudah selesai
7. **Data Retention**: Archive data karyawan yang sudah tidak aktif
