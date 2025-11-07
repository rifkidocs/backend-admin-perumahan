# Shift Management API Documentation

This document provides comprehensive information about the Shift Management System API implementation for the housing development management backend.

## Overview

The Shift Management System has been implemented to handle employee scheduling with the following components:

1. **Master Shift** - Core shift definitions (Pagi, Siang, Malam)
2. **Updated Worker Schedule** - Employee scheduling linked to shifts
3. **Enhanced Employee** - Employee data with scheduling capabilities

## Content Types

### 1. Shift (Master Shift)

**Schema:**
- `nama_shift` (String, Required, Unique) - Nama shift: "Pagi", "Siang", "Malam"
- `jam_mulai` (String, Required) - Format HH:MM (24 jam): "07:00", "15:00", "23:00"
- `jam_selesai` (String, Required) - Format HH:MM (24 jam): "15:00", "23:00", "07:00"
- `kode_shift` (String, Required, Unique) - Format "SHIFT-XXX": "SHIFT-001", "SHIFT-002", "SHIFT-003"
- `keterangan` (Text, Optional) - Deskripsi shift
- `is_active` (Boolean, Default: true) - Status aktif shift

**Validation Rules:**
- `nama_shift` harus unique
- Format waktu HH:MM (24 jam) dengan regex `^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$`
- `jam_mulai` tidak boleh sama dengan `jam_selesai`
- `kode_shift` format `^SHIFT-[0-9]{3}$`

### 2. Worker Schedule (Updated from Jadwal Kerja)

**Schema:**
- `tanggal` (Date, Required)
- `shift` (Relation to Shift, Required) - Menggantikan enum dan jam manual
- `proyek` (Relation to Proyek Perumahan, Required)
- `lokasi_kerja` (String, Required)
- `pekerjas` (Relation to Pekerja, ManyToMany) - Daftar pekerja
- `target_pekerjaan` (Text, Optional)
- `catatan` (Text, Optional)
- `status_jadwal` (Enum) - "scheduled", "in_progress", "completed", "cancelled"

**Removed Fields:**
- `mandor` - Tidak lagi diperlukan
- `jam_mulai` - Sudah ada di master shift
- `jam_selesai` - Sudah ada di master shift

### 3. Employee (Enhanced Karyawan)

**Added Fields:**
- `is_security_personnel` (Boolean, Default: false) - Filter untuk security
- `can_be_scheduled` (Boolean, Default: true) - Filter untuk karyawan yang bisa dijadwalkan
- `shift_preference` (Relation to Shift, Optional) - Preferensi shift karyawan

## API Endpoints

### Shift Management

#### GET /api/shifts
List all active shifts (default filter: is_active=true)

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nama_shift": "Pagi",
        "jam_mulai": "07:00",
        "jam_selesai": "15:00",
        "kode_shift": "SHIFT-001",
        "keterangan": "Shift kerja pagi hari (8 jam)",
        "is_active": true
      }
    }
  ],
  "meta": {}
}
```

#### GET /api/shifts/active
List only active shifts

#### POST /api/shifts
Create new shift

**Request Body:**
```json
{
  "data": {
    "nama_shift": "Pagi",
    "jam_mulai": "07:00",
    "jam_selesai": "15:00",
    "kode_shift": "SHIFT-001",
    "keterangan": "Shift kerja pagi hari (8 jam)",
    "is_active": true
  }
}
```

#### PUT /api/shifts/:id
Update existing shift

#### DELETE /api/shifts/:id
Delete shift (soft delete by setting is_active=false)

### Employee Management

#### GET /api/karyawans
List all employees with pagination and filters

#### GET /api/karyawans/schedulable
List employees that can be scheduled (can_be_scheduled=true)

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nama_lengkap": "Budi Santoso",
        "nik_karyawan": "1234567890123456",
        "jabatan": {
          "data": {
            "id": 1,
            "attributes": {
              "nama_jabatan": "Security"
            }
          }
        },
        "is_security_personnel": true,
        "can_be_scheduled": true,
        "shift_preference": {
          "data": {
            "id": 1,
            "attributes": {
              "nama_shift": "Pagi",
              "jam_mulai": "07:00",
              "jam_selesai": "15:00"
            }
          }
        }
      }
    }
  ],
  "meta": {}
}
```

### Worker Schedule Management

#### GET /api/jadwal-kerjas
List all work schedules

**Request with population:**
```
GET /api/jadwal-kerjas?populate=shift,proyek,pekerjas
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "tanggal": "2024-01-15",
        "shift": {
          "data": {
            "id": 1,
            "attributes": {
              "nama_shift": "Pagi",
              "jam_mulai": "07:00",
              "jam_selesai": "15:00"
            }
          }
        },
        "proyek": {
          "data": {
            "id": 1,
            "attributes": {
              "nama_proyek": "Perumahan Green Valley"
            }
          }
        },
        "lokasi_kerja": "Site A - Block 1",
        "target_pekerjaan": "Pekerjaan fondasi",
        "status_jadwal": "scheduled",
        "catatan": "Siapkan alat bor"
      }
    }
  ],
  "meta": {}
}
```

#### POST /api/jadwal-kerjas
Create new work schedule

**Request Body:**
```json
{
  "data": {
    "tanggal": "2024-01-15",
    "shift": 1,
    "proyek": 1,
    "lokasi_kerja": "Site A - Block 1",
    "target_pekerjaan": "Pekerjaan fondasi",
    "status_jadwal": "scheduled",
    "catatan": "Siapkan alat bor",
    "pekerjas": [1, 2, 3]
  }
}
```

#### PUT /api/jadwal-kerjas/:id
Update work schedule

#### DELETE /api/jadwal-kerjas/:id
Delete work schedule

## Sample Data

### Master Shift Sample Data
```json
[
  {
    "id": 1,
    "nama_shift": "Pagi",
    "jam_mulai": "07:00",
    "jam_selesai": "15:00",
    "kode_shift": "SHIFT-001",
    "keterangan": "Shift kerja pagi hari (8 jam)",
    "is_active": true
  },
  {
    "id": 2,
    "nama_shift": "Siang",
    "jam_mulai": "15:00",
    "jam_selesai": "23:00",
    "kode_shift": "SHIFT-002",
    "keterangan": "Shift kerja siang hari (8 jam)",
    "is_active": true
  },
  {
    "id": 3,
    "nama_shift": "Malam",
    "jam_mulai": "23:00",
    "jam_selesai": "07:00",
    "kode_shift": "SHIFT-003",
    "keterangan": "Shift kerja malam hari (8 jam)",
    "is_active": true
  }
]
```

## Business Logic

### 1. Auto-populate Jam Kerja
Sistem otomatis mengisi jam mulai dan selesai dari master shift ketika user memilih shift:
- User pilih "Pagi" → Jam: 07:00 - 15:00
- User pilih "Siang" → Jam: 15:00 - 23:00
- User pilih "Malam" → Jam: 23:00 - 07:00

### 2. Employee Filtering
API mendukung filter untuk:
- `can_be_scheduled=true` - Karyawan yang bisa dijadwalkan
- `is_security_personnel=true` - Karyawan security
- `shift_preference=ID` - Karyawan dengan preferensi shift tertentu

### 3. Schedule Conflict Prevention
Sistem mencegah double scheduling:
- Cek apakah karyawan sudah ada jadwal di tanggal & jam yang sama
- Prevent overlap scheduling pada karyawan yang sama

### 4. Validation Rules

#### Shift Validation:
- `nama_shift` harus unique
- Format waktu HH:MM (24 jam)
- `jam_mulai` tidak boleh sama dengan `jam_selesai`
- `kode_shift` format "SHIFT-XXX"

#### Schedule Validation:
- `tanggal` tidak boleh di masa lalu
- Minimal 1 karyawan harus dipilih
- Shift dan proyek harus valid
- Cek conflict dengan jadwal existing

## Setup Instructions

### 1. Run Database Migration
```bash
npm run dev  # This will auto-migrate the schema
```

### 2. Insert Sample Shift Data
```bash
# Option 1: Using npm script (after Strapi is running)
npm run seed:shifts

# Option 2: Using Strapi console
npm run console
# Then run:
# const { seedShifts } = require('./scripts/seed-shifts');
# await seedShifts();

# Option 3: Direct SQL
# Run scripts/seed-shifts.sql in your database
```

### 3. Test API Endpoints
Use curl, Postman, or API testing tools to test the endpoints described above.

## Error Handling

### Common Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Jam mulai dan jam selesai tidak boleh sama",
    "details": {}
  }
}
```

#### 404 Not Found
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found"
  }
}
```

#### 403 Forbidden
```json
{
  "data": null,
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Forbidden"
  }
}
```

## Permissions

All API endpoints require admin authentication with scope `['admin']`. Configure in Strapi Admin Panel:

1. Go to Settings → Roles
2. Edit "Admin" role
3. Add permissions for:
   - Shift: find, findOne, create, update, delete
   - Karyawan: find, findOne, create, update, delete
   - Jadwal Kerja: find, findOne, create, update, delete

## Implementation Notes

- Uses Strapi v5 with modern REST API format
- Implemented with lifecycle hooks for validation
- Custom controllers for specialized endpoints
- Proper error handling and validation
- Follows Indonesian business practices
- Supports both security personnel and regular workers