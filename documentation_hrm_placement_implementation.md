# Dokumentasi Implementasi Strapi - Data Penempatan Proyek (HRM Placement)

## Overview

Dokumentasi ini menjelaskan implementasi Content Type `placement` untuk sistem manajemen penempatan karyawan ke proyek dalam Strapi CMS. Sistem ini mengelola penugasan karyawan ke berbagai proyek, lokasi, dan periode penempatan.

## Content Type: Placement

### Schema Definition

**File**: `src/api/placement/content-types/placement/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "placements",
  "info": {
    "singularName": "placement",
    "pluralName": "placements",
    "displayName": "Data Penempatan Proyek",
    "description": "Manajemen penugasan karyawan ke proyek, lokasi, dan periode penempatan"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "project_name": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "location": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "start_date": {
      "type": "date",
      "required": true
    },
    "end_date": {
      "type": "date"
    },
    "role": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 50
    },
    "status": {
      "type": "enumeration",
      "enum": ["aktif", "selesai", "dipindahkan"],
      "required": true,
      "default": "aktif"
    },
    "notes": {
      "type": "text",
      "maxLength": 300
    },
    "employee": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "placements"
    }
  }
}
```

### Field Descriptions

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

### Relations

- `employee` (Many-to-One): Relation ke `karyawan` content type

## Lifecycle Hooks

### File: `src/api/placement/content-types/placement/lifecycles.js`

```javascript
"use strict";

/**
 * placement lifecycle callbacks
 */

module.exports = {
  /**
   * Triggered before placement creation
   * Validates business rules and auto-generates data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate date range
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (endDate <= startDate) {
        throw new Error("Tanggal selesai harus setelah tanggal mulai");
      }
    }

    // Auto-set status to 'aktif' if not provided
    if (!data.status) {
      data.status = "aktif";
    }

    // Validate employee exists and is active
    if (data.employee) {
      const employee = await strapi.entityService.findOne(
        "api::karyawan.karyawan",
        data.employee,
        {
          populate: ["status_kepegawaian"],
        }
      );

      if (!employee) {
        throw new Error("Karyawan tidak ditemukan");
      }

      if (
        employee.status_kepegawaian !== "Tetap" &&
        employee.status_kepegawaian !== "Kontrak"
      ) {
        throw new Error(
          "Hanya karyawan tetap dan kontrak yang dapat ditempatkan"
        );
      }
    }

    // Check for overlapping placements
    if (data.employee && data.start_date) {
      const existingPlacements = await strapi.entityService.findMany(
        "api::placement.placement",
        {
          filters: {
            employee: data.employee,
            status: "aktif",
            $or: [
              {
                start_date: {
                  $lte: data.end_date || data.start_date,
                },
                end_date: {
                  $gte: data.start_date,
                },
              },
            ],
          },
        }
      );

      if (existingPlacements.length > 0) {
        throw new Error(
          "Karyawan sudah memiliki penempatan aktif pada periode tersebut"
        );
      }
    }
  },

  /**
   * Triggered after placement creation
   * Updates employee status and sends notifications
   */
  async afterCreate(event) {
    const { result } = event;

    // Update employee current project if this is active placement
    if (result.status === "aktif" && result.employee) {
      await strapi.entityService.update(
        "api::karyawan.karyawan",
        result.employee,
        {
          data: {
            current_project: result.project_name,
            current_location: result.location,
          },
        }
      );
    }

    // Log placement activity
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "placement_created",
        entity_type: "placement",
        entity_id: result.id,
        description: `Penempatan baru: ${
          result.employee?.nama_lengkap || "Unknown"
        } ke ${result.project_name}`,
        user: event.params.user?.id || null,
      },
    });
  },

  /**
   * Triggered before placement update
   * Validates changes and business rules
   */
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Get current placement data
    const currentPlacement = await strapi.entityService.findOne(
      "api::placement.placement",
      where.id,
      {
        populate: ["employee"],
      }
    );

    if (!currentPlacement) {
      throw new Error("Penempatan tidak ditemukan");
    }

    // Validate date range if dates are being updated
    if (data.start_date || data.end_date) {
      const startDate = new Date(
        data.start_date || currentPlacement.start_date
      );
      const endDate = new Date(data.end_date || currentPlacement.end_date);

      if (endDate <= startDate) {
        throw new Error("Tanggal selesai harus setelah tanggal mulai");
      }
    }

    // Check for overlapping placements when changing dates or employee
    if (
      (data.start_date || data.end_date || data.employee) &&
      data.status !== "selesai"
    ) {
      const employeeId = data.employee || currentPlacement.employee?.id;
      const startDate = data.start_date || currentPlacement.start_date;
      const endDate = data.end_date || currentPlacement.end_date;

      const overlappingPlacements = await strapi.entityService.findMany(
        "api::placement.placement",
        {
          filters: {
            id: {
              $ne: where.id,
            },
            employee: employeeId,
            status: "aktif",
            $or: [
              {
                start_date: {
                  $lte: endDate,
                },
                end_date: {
                  $gte: startDate,
                },
              },
            ],
          },
        }
      );

      if (overlappingPlacements.length > 0) {
        throw new Error(
          "Karyawan sudah memiliki penempatan aktif pada periode tersebut"
        );
      }
    }

    // Auto-set end_date when status changes to 'selesai'
    if (
      data.status === "selesai" &&
      !data.end_date &&
      !currentPlacement.end_date
    ) {
      data.end_date = new Date().toISOString().split("T")[0];
    }
  },

  /**
   * Triggered after placement update
   * Updates related data and sends notifications
   */
  async afterUpdate(event) {
    const { result, params } = event;

    // Update employee current project based on status
    if (result.employee) {
      if (result.status === "aktif") {
        await strapi.entityService.update(
          "api::karyawan.karyawan",
          result.employee.id,
          {
            data: {
              current_project: result.project_name,
              current_location: result.location,
            },
          }
        );
      } else if (
        result.status === "selesai" ||
        result.status === "dipindahkan"
      ) {
        // Clear current project if placement ended
        await strapi.entityService.update(
          "api::karyawan.karyawan",
          result.employee.id,
          {
            data: {
              current_project: null,
              current_location: null,
            },
          }
        );
      }
    }

    // Log placement update activity
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "placement_updated",
        entity_type: "placement",
        entity_id: result.id,
        description: `Penempatan diupdate: ${
          result.employee?.nama_lengkap || "Unknown"
        } - ${result.project_name}`,
        user: params.user?.id || null,
      },
    });
  },

  /**
   * Triggered before placement deletion
   * Validates if placement can be deleted
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Get placement data
    const placement = await strapi.entityService.findOne(
      "api::placement.placement",
      where.id,
      {
        populate: ["employee"],
      }
    );

    if (!placement) {
      throw new Error("Penempatan tidak ditemukan");
    }

    // Prevent deletion of active placements
    if (placement.status === "aktif") {
      throw new Error(
        "Tidak dapat menghapus penempatan yang masih aktif. Ubah status terlebih dahulu."
      );
    }

    // Check if placement has related records (attendance, etc.)
    const attendanceRecords = await strapi.entityService.findMany(
      "api::absensi.absensi",
      {
        filters: {
          placement: where.id,
        },
      }
    );

    if (attendanceRecords.length > 0) {
      throw new Error(
        "Tidak dapat menghapus penempatan yang memiliki catatan absensi terkait"
      );
    }
  },

  /**
   * Triggered after placement deletion
   * Cleans up related data
   */
  async afterDelete(event) {
    const { result } = event;

    // Log placement deletion
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "placement_deleted",
        entity_type: "placement",
        entity_id: result.id,
        description: `Penempatan dihapus: ${result.project_name}`,
        user: event.params.user?.id || null,
      },
    });
  },
};
```

## API Endpoints

### Placement Endpoints

#### GET /api/placements

**Description**: Mendapatkan daftar penempatan dengan filtering dan pagination

**Query Parameters**:

- `filters[employee][id][$eq]`: Filter berdasarkan employee ID
- `filters[status][$eq]`: Filter berdasarkan status penempatan
- `filters[project_name][$containsi]`: Search berdasarkan nama proyek
- `filters[start_date][$gte]`: Filter berdasarkan tanggal mulai
- `filters[end_date][$lte]`: Filter berdasarkan tanggal selesai
- `populate`: Populate relations (employee, project)
- `sort`: Sort by field (created_at:desc, start_date:asc)
- `pagination[page]`: Page number
- `pagination[pageSize]`: Items per page

**Response Example**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "project_name": "Perumahan Taman Sari",
        "location": "Depok, Jawa Barat",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "role": "Marketing On Site",
        "status": "aktif",
        "notes": "Penempatan untuk proyek baru",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "employee": {
          "data": {
            "id": 1,
            "attributes": {
              "nik_karyawan": "1234567890123456",
              "nama_lengkap": "Ahmad Rizki",
              "jabatan": "Marketing Executive"
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
      "pageCount": 4,
      "total": 89
    }
  }
}
```

#### POST /api/placements

**Description**: Tambah penempatan baru

**Request Body**:

```json
{
  "data": {
    "project_name": "Perumahan Taman Sari",
    "location": "Depok, Jawa Barat",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "role": "Marketing On Site",
    "status": "aktif",
    "notes": "Penempatan untuk proyek baru",
    "employee": 1
  }
}
```

#### GET /api/placements/:id

**Description**: Mendapatkan detail penempatan berdasarkan ID

#### PUT /api/placements/:id

**Description**: Update penempatan

**Request Body**:

```json
{
  "data": {
    "status": "selesai",
    "end_date": "2024-03-31",
    "notes": "Penempatan selesai sesuai rencana"
  }
}
```

#### DELETE /api/placements/:id

**Description**: Hapus penempatan (hanya yang tidak aktif)

## Business Rules yang Diimplementasikan

1. **Date Validation**: Tanggal selesai harus setelah tanggal mulai
2. **Employee Validation**: Hanya karyawan tetap dan kontrak yang dapat ditempatkan
3. **Overlap Prevention**: Karyawan tidak dapat memiliki penempatan aktif yang overlapping
4. **Auto Status Management**: Status otomatis berubah berdasarkan kondisi
5. **Employee Project Update**: Project karyawan otomatis diupdate saat penempatan aktif
6. **Activity Logging**: Semua aktivitas penempatan dicatat dalam log
7. **Deletion Protection**: Penempatan aktif tidak dapat dihapus
8. **Related Data Check**: Cek relasi dengan data lain sebelum penghapusan

## Custom Controllers (Optional)

### File: `src/api/placement/controllers/placement.js`

```javascript
"use strict";

/**
 * placement controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::placement.placement",
  ({ strapi }) => ({
    // Custom method to get active placements by employee
    async getActiveByEmployee(ctx) {
      const { employeeId } = ctx.params;

      const placements = await strapi.entityService.findMany(
        "api::placement.placement",
        {
          filters: {
            employee: employeeId,
            status: "aktif",
          },
          populate: ["employee", "project"],
        }
      );

      return { data: placements };
    },

    // Custom method to get placement statistics
    async getStatistics(ctx) {
      const activePlacements = await strapi.entityService.count(
        "api::placement.placement",
        {
          filters: { status: "aktif" },
        }
      );

      const totalEmployees = await strapi.entityService.count(
        "api::karyawan.karyawan",
        {
          filters: { status_kepegawaian: { $in: ["Tetap", "Kontrak"] } },
        }
      );

      const endingSoon = await strapi.entityService.count(
        "api::placement.placement",
        {
          filters: {
            status: "aktif",
            end_date: {
              $lte: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          },
        }
      );

      return {
        data: {
          activePlacements,
          totalEmployees,
          endingSoon,
          placementRate:
            totalEmployees > 0
              ? ((activePlacements / totalEmployees) * 100).toFixed(1)
              : 0,
        },
      };
    },
  })
);
```

## Frontend Integration

### API Service Functions

```javascript
// src/lib/placementApi.js
export const placementApi = {
  // Get all placements with filters
  async getPlacements(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.status)
      queryParams.append("filters[status][$eq]", filters.status);
    if (filters.employee)
      queryParams.append("filters[employee][id][$eq]", filters.employee);
    if (filters.project)
      queryParams.append("filters[project_name][$containsi]", filters.project);
    if (filters.search)
      queryParams.append(
        "filters[$or][0][project_name][$containsi]",
        filters.search
      );
    if (filters.search)
      queryParams.append(
        "filters[$or][1][employee][nama_lengkap][$containsi]",
        filters.search
      );

    queryParams.append("populate", "employee");
    queryParams.append("sort", "created_at:desc");

    const response = await fetch(`/api/placements?${queryParams}`);
    return response.json();
  },

  // Create new placement
  async createPlacement(data) {
    const response = await fetch("/api/placements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    return response.json();
  },

  // Update placement
  async updatePlacement(id, data) {
    const response = await fetch(`/api/placements/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    return response.json();
  },

  // Get placement statistics
  async getStatistics() {
    const response = await fetch("/api/placements/statistics");
    return response.json();
  },
};
```

## Validation Schema

### File: `src/lib/placementValidation.js`

```javascript
import { z } from "zod";

export const placementSchema = z
  .object({
    project_name: z
      .string()
      .min(2, "Nama proyek minimal 2 karakter")
      .max(100, "Nama proyek maksimal 100 karakter"),

    location: z
      .string()
      .min(2, "Lokasi minimal 2 karakter")
      .max(100, "Lokasi maksimal 100 karakter"),

    start_date: z.string().min(1, "Tanggal mulai harus diisi"),

    end_date: z.string().optional(),

    role: z
      .string()
      .min(2, "Posisi minimal 2 karakter")
      .max(50, "Posisi maksimal 50 karakter"),

    status: z.enum(["aktif", "selesai", "dipindahkan"], {
      required_error: "Status penempatan harus dipilih",
    }),

    notes: z.string().max(300, "Catatan maksimal 300 karakter").optional(),

    employee: z.number().min(1, "Karyawan harus dipilih"),
  })
  .refine(
    (data) => {
      // Validate date range
      if (data.start_date && data.end_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return endDate > startDate;
      }
      return true;
    },
    {
      message: "Tanggal selesai harus setelah tanggal mulai",
      path: ["end_date"],
    }
  );

export const validatePlacement = (data) => {
  try {
    placementSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { isValid: false, errors };
  }
};
```

## Summary

Implementasi Content Type `placement` untuk Strapi mencakup:

1. **Schema Definition**: Struktur data lengkap dengan validasi field
2. **Lifecycle Hooks**: Business logic untuk validasi dan auto-update
3. **API Endpoints**: CRUD operations dengan filtering dan pagination
4. **Business Rules**: Validasi overlap, status management, dan data integrity
5. **Activity Logging**: Tracking semua perubahan penempatan
6. **Frontend Integration**: API service dan validation schema

Sistem ini memastikan integritas data penempatan karyawan dengan validasi yang ketat dan business rules yang sesuai dengan kebutuhan HRM.
