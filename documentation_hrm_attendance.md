# Dokumentasi Strapi Backend - HRM Attendance System

## Overview

Dokumentasi ini menjelaskan implementasi backend Strapi untuk sistem absensi HRM yang mendukung:

- Check-in berbasis lokasi dengan radius area target
- Pengambilan foto selfie untuk verifikasi
- Manajemen area target dan radius untuk tim marketing
- Tracking kehadiran, keterlambatan, dan status absensi
- Role-based access (Admin dan Marketing User)

## Content Types

### 1. Employee Location Settings (`employee-location-settings`)

**Deskripsi**: Pengaturan lokasi dan radius area target untuk setiap karyawan marketing.

```json
{
  "employee": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::karyawan.karyawan",
    "required": true
  },
  "target_area_name": {
    "type": "string",
    "required": true,
    "maxLength": 100
  },
  "target_coordinates": {
    "type": "json",
    "required": true,
    "schema": {
      "lat": "number",
      "lng": "number"
    }
  },
  "radius_km": {
    "type": "decimal",
    "required": true,
    "min": 1,
    "max": 50
  },
  "monthly_target": {
    "type": "string",
    "required": true,
    "maxLength": 50
  },
  "is_active": {
    "type": "boolean",
    "default": true
  },
  "created_by": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "plugin::users-permissions.user"
  }
}
```

### 2. Attendance Records (`attendance-records`)

**Deskripsi**: Record absensi harian dengan lokasi dan foto verifikasi.

```json
{
  "employee": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::karyawan.karyawan",
    "required": true
  },
  "attendance_date": {
    "type": "date",
    "required": true
  },
  "check_in_time": {
    "type": "datetime",
    "required": true
  },
  "check_out_time": {
    "type": "datetime"
  },
  "attendance_status": {
    "type": "enumeration",
    "enum": ["present", "late", "absent", "sick", "leave", "overtime"],
    "required": true,
    "default": "present"
  },
  "location_data": {
    "type": "json",
    "required": true,
    "schema": {
      "check_in_location": {
        "lat": "number",
        "lng": "number",
        "address": "string",
        "accuracy": "number"
      },
      "check_out_location": {
        "lat": "number",
        "lng": "number",
        "address": "string",
        "accuracy": "number"
      }
    }
  },
  "selfie_photo": {
    "type": "media",
    "multiple": false,
    "required": true,
    "allowedTypes": ["images"]
  },
  "is_within_radius": {
    "type": "boolean",
    "required": true
  },
  "distance_from_target": {
    "type": "decimal",
    "required": true
  },
  "notes": {
    "type": "text",
    "maxLength": 500
  },
  "approved_by": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "plugin::users-permissions.user"
  },
  "approval_status": {
    "type": "enumeration",
    "enum": ["pending", "approved", "rejected"],
    "default": "pending"
  },
  "rejection_reason": {
    "type": "text",
    "maxLength": 200
  }
}
```

### 3. Attendance Summary (`attendance-summary`)

**Deskripsi**: Ringkasan bulanan absensi untuk setiap karyawan.

```json
{
  "employee": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::karyawan.karyawan",
    "required": true
  },
  "year": {
    "type": "integer",
    "required": true,
    "min": 2020,
    "max": 2030
  },
  "month": {
    "type": "integer",
    "required": true,
    "min": 1,
    "max": 12
  },
  "total_working_days": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "total_present": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "total_late": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "total_absent": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "total_sick": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "total_leave": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "total_overtime": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "attendance_percentage": {
    "type": "decimal",
    "required": true,
    "min": 0,
    "max": 100
  },
  "is_finalized": {
    "type": "boolean",
    "default": false
  }
}
```

### 4. Location Verification Logs (`location-verification-logs`)

**Deskripsi**: Log verifikasi lokasi untuk audit dan monitoring.

```json
{
  "employee": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::karyawan.karyawan",
    "required": true
  },
  "verification_date": {
    "type": "datetime",
    "required": true
  },
  "requested_location": {
    "type": "json",
    "required": true,
    "schema": {
      "lat": "number",
      "lng": "number",
      "accuracy": "number"
    }
  },
  "target_location": {
    "type": "json",
    "required": true,
    "schema": {
      "lat": "number",
      "lng": "number"
    }
  },
  "calculated_distance": {
    "type": "decimal",
    "required": true
  },
  "allowed_radius": {
    "type": "decimal",
    "required": true
  },
  "is_within_radius": {
    "type": "boolean",
    "required": true
  },
  "verification_status": {
    "type": "enumeration",
    "enum": ["success", "failed", "manual_override"],
    "required": true
  },
  "device_info": {
    "type": "json",
    "schema": {
      "userAgent": "string",
      "platform": "string",
      "browser": "string"
    }
  },
  "ip_address": {
    "type": "string",
    "maxLength": 45
  }
}
```

## API Endpoints

### 1. Employee Location Settings

#### GET `/api/employee-location-settings`

**Deskripsi**: Mendapatkan daftar pengaturan lokasi karyawan.

**Query Parameters**:

- `page`: Halaman (default: 1)
- `pageSize`: Jumlah data per halaman (default: 25)
- `employee`: Filter berdasarkan ID karyawan
- `is_active`: Filter berdasarkan status aktif
- `populate`: Populate relasi (default: "\*")

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "target_area_name": "Jakarta Selatan",
        "target_coordinates": {
          "lat": -6.2615,
          "lng": 106.8106
        },
        "radius_km": 5.0,
        "monthly_target": "100 leads",
        "is_active": true,
        "employee": {
          "data": {
            "id": 1,
            "attributes": {
              "nik_karyawan": "123456",
              "nama_lengkap": "Ahmad Rizki"
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
      "pageCount": 1,
      "total": 1
    }
  }
}
```

#### POST `/api/employee-location-settings`

**Deskripsi**: Membuat pengaturan lokasi baru untuk karyawan.

**Request Body**:

```json
{
  "data": {
    "employee": 1,
    "target_area_name": "Jakarta Pusat",
    "target_coordinates": {
      "lat": -6.2088,
      "lng": 106.8456
    },
    "radius_km": 3.0,
    "monthly_target": "150 leads",
    "is_active": true
  }
}
```

#### PUT `/api/employee-location-settings/:id`

**Deskripsi**: Update pengaturan lokasi karyawan.

#### DELETE `/api/employee-location-settings/:id`

**Deskripsi**: Hapus pengaturan lokasi karyawan.

### 2. Attendance Records

#### GET `/api/attendance-records`

**Deskripsi**: Mendapatkan daftar record absensi.

**Query Parameters**:

- `page`: Halaman (default: 1)
- `pageSize`: Jumlah data per halaman (default: 25)
- `employee`: Filter berdasarkan ID karyawan
- `attendance_date`: Filter berdasarkan tanggal (format: YYYY-MM-DD)
- `attendance_status`: Filter berdasarkan status absensi
- `is_within_radius`: Filter berdasarkan status radius
- `populate`: Populate relasi (default: "\*")

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "attendance_date": "2024-12-15",
        "check_in_time": "2024-12-15T08:30:00.000Z",
        "attendance_status": "present",
        "location_data": {
          "check_in_location": {
            "lat": -6.2615,
            "lng": 106.8106,
            "address": "Jl. Sudirman, Jakarta Selatan",
            "accuracy": 10.5
          }
        },
        "is_within_radius": true,
        "distance_from_target": 2.3,
        "selfie_photo": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/selfie_123456_20241215.jpg"
            }
          }
        },
        "employee": {
          "data": {
            "id": 1,
            "attributes": {
              "nik_karyawan": "123456",
              "nama_lengkap": "Ahmad Rizki"
            }
          }
        }
      }
    }
  ]
}
```

#### POST `/api/attendance-records`

**Deskripsi**: Membuat record absensi baru (check-in).

**Request Body**:

```json
{
  "data": {
    "employee": 1,
    "attendance_date": "2024-12-15",
    "check_in_time": "2024-12-15T08:30:00.000Z",
    "attendance_status": "present",
    "location_data": {
      "check_in_location": {
        "lat": -6.2615,
        "lng": 106.8106,
        "address": "Jl. Sudirman, Jakarta Selatan",
        "accuracy": 10.5
      }
    },
    "selfie_photo": "file_upload_id",
    "is_within_radius": true,
    "distance_from_target": 2.3,
    "notes": "Check-in pagi hari"
  }
}
```

#### PUT `/api/attendance-records/:id`

**Deskripsi**: Update record absensi (check-out atau edit status).

**Request Body**:

```json
{
  "data": {
    "check_out_time": "2024-12-15T17:30:00.000Z",
    "location_data": {
      "check_in_location": {
        "lat": -6.2615,
        "lng": 106.8106,
        "address": "Jl. Sudirman, Jakarta Selatan",
        "accuracy": 10.5
      },
      "check_out_location": {
        "lat": -6.2615,
        "lng": 106.8106,
        "address": "Jl. Sudirman, Jakarta Selatan",
        "accuracy": 8.2
      }
    },
    "attendance_status": "overtime",
    "notes": "Lembur hingga jam 17:30"
  }
}
```

### 3. Attendance Summary

#### GET `/api/attendance-summary`

**Deskripsi**: Mendapatkan ringkasan absensi bulanan.

**Query Parameters**:

- `employee`: Filter berdasarkan ID karyawan
- `year`: Filter berdasarkan tahun
- `month`: Filter berdasarkan bulan
- `populate`: Populate relasi (default: "\*")

#### POST `/api/attendance-summary/generate`

**Deskripsi**: Generate ringkasan absensi untuk bulan tertentu.

**Request Body**:

```json
{
  "data": {
    "year": 2024,
    "month": 12,
    "employee": 1
  }
}
```

### 4. Location Verification

#### POST `/api/location-verification/check`

**Deskripsi**: Verifikasi lokasi karyawan terhadap area target.

**Request Body**:

```json
{
  "data": {
    "employee_id": 1,
    "current_location": {
      "lat": -6.2615,
      "lng": 106.8106,
      "accuracy": 10.5
    }
  }
}
```

**Response**:

```json
{
  "data": {
    "is_within_radius": true,
    "distance_from_target": 2.3,
    "allowed_radius": 5.0,
    "target_area": "Jakarta Selatan",
    "verification_status": "success"
  }
}
```

## Business Logic & Validation

### 1. Location Verification Logic

```javascript
// Calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Verify if location is within allowed radius
function verifyLocation(employeeId, currentLocation) {
  const employeeSettings = getEmployeeLocationSettings(employeeId);
  const distance = calculateDistance(
    currentLocation.lat,
    currentLocation.lng,
    employeeSettings.target_coordinates.lat,
    employeeSettings.target_coordinates.lng
  );

  return {
    is_within_radius: distance <= employeeSettings.radius_km,
    distance_from_target: distance,
    allowed_radius: employeeSettings.radius_km,
  };
}
```

### 2. Attendance Status Logic

```javascript
// Determine attendance status based on check-in time
function determineAttendanceStatus(checkInTime, workStartTime = "08:00") {
  const checkInHour = new Date(checkInTime).getHours();
  const checkInMinute = new Date(checkInTime).getMinutes();
  const workStartHour = parseInt(workStartTime.split(":")[0]);
  const workStartMinute = parseInt(workStartTime.split(":")[1]);

  const checkInMinutes = checkInHour * 60 + checkInMinute;
  const workStartMinutes = workStartHour * 60 + workStartMinute;

  if (checkInMinutes <= workStartMinutes) {
    return "present";
  } else if (checkInMinutes <= workStartMinutes + 30) {
    return "late";
  } else {
    return "late";
  }
}
```

### 3. Validation Rules

#### Employee Location Settings Validation

- `target_area_name`: Required, max 100 characters
- `target_coordinates.lat`: Required, between -90 and 90
- `target_coordinates.lng`: Required, between -180 and 180
- `radius_km`: Required, between 1 and 50
- `monthly_target`: Required, max 50 characters
- `employee`: Required, must exist in karyawan table

#### Attendance Records Validation

- `employee`: Required, must exist in karyawan table
- `attendance_date`: Required, valid date format
- `check_in_time`: Required, valid datetime format
- `location_data.check_in_location.lat`: Required, between -90 and 90
- `location_data.check_in_location.lng`: Required, between -180 and 180
- `selfie_photo`: Required, must be image file
- `attendance_status`: Required, must be valid enum value

## Custom Controllers

### 1. Attendance Controller (`src/api/attendance-records/controllers/attendance-records.js`)

```javascript
"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::attendance-records.attendance-records",
  ({ strapi }) => ({
    async checkIn(ctx) {
      try {
        const { employee_id, location_data, selfie_photo } =
          ctx.request.body.data;

        // Verify location
        const locationVerification = await strapi
          .service("api::attendance-records.location-verification")
          .verifyLocation(employee_id, location_data.check_in_location);

        if (!locationVerification.is_within_radius) {
          return ctx.badRequest("Location is outside allowed radius");
        }

        // Create attendance record
        const attendanceRecord = await strapi.entityService.create(
          "api::attendance-records.attendance-records",
          {
            data: {
              employee: employee_id,
              attendance_date: new Date().toISOString().split("T")[0],
              check_in_time: new Date().toISOString(),
              attendance_status: "present",
              location_data,
              selfie_photo,
              is_within_radius: true,
              distance_from_target: locationVerification.distance_from_target,
            },
          }
        );

        return { data: attendanceRecord };
      } catch (error) {
        return ctx.badRequest("Check-in failed", { error: error.message });
      }
    },

    async checkOut(ctx) {
      try {
        const { attendance_record_id, location_data } = ctx.request.body.data;

        // Update attendance record with check-out data
        const updatedRecord = await strapi.entityService.update(
          "api::attendance-records.attendance-records",
          attendance_record_id,
          {
            data: {
              check_out_time: new Date().toISOString(),
              location_data: {
                ...location_data,
                check_out_location: location_data.check_in_location,
              },
            },
          }
        );

        return { data: updatedRecord };
      } catch (error) {
        return ctx.badRequest("Check-out failed", { error: error.message });
      }
    },

    async getMonthlySummary(ctx) {
      try {
        const { employee_id, year, month } = ctx.query;

        const summary = await strapi
          .service("api::attendance-records.attendance-summary")
          .generateMonthlySummary(employee_id, year, month);

        return { data: summary };
      } catch (error) {
        return ctx.badRequest("Failed to generate summary", {
          error: error.message,
        });
      }
    },
  })
);
```

### 2. Location Verification Service (`src/api/attendance-records/services/location-verification.js`)

```javascript
"use strict";

module.exports = ({ strapi }) => ({
  async verifyLocation(employeeId, currentLocation) {
    // Get employee location settings
    const locationSettings = await strapi.entityService.findMany(
      "api::employee-location-settings.employee-location-settings",
      {
        filters: { employee: employeeId, is_active: true },
        populate: ["employee"],
      }
    );

    if (!locationSettings || locationSettings.length === 0) {
      throw new Error("Employee location settings not found");
    }

    const settings = locationSettings[0];
    const targetCoords = settings.target_coordinates;

    // Calculate distance
    const distance = this.calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      targetCoords.lat,
      targetCoords.lng
    );

    const isWithinRadius = distance <= settings.radius_km;

    // Log verification attempt
    await strapi.entityService.create(
      "api::location-verification-logs.location-verification-logs",
      {
        data: {
          employee: employeeId,
          verification_date: new Date().toISOString(),
          requested_location: currentLocation,
          target_location: targetCoords,
          calculated_distance: distance,
          allowed_radius: settings.radius_km,
          is_within_radius: isWithinRadius,
          verification_status: isWithinRadius ? "success" : "failed",
        },
      }
    );

    return {
      is_within_radius: isWithinRadius,
      distance_from_target: distance,
      allowed_radius: settings.radius_km,
      target_area: settings.target_area_name,
    };
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
});
```

## Routes Configuration

### 1. Attendance Records Routes (`src/api/attendance-records/routes/attendance-records.js`)

```javascript
"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/attendance-records",
      handler: "attendance-records.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/attendance-records/:id",
      handler: "attendance-records.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/attendance-records",
      handler: "attendance-records.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/attendance-records/check-in",
      handler: "attendance-records.checkIn",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/attendance-records/check-out",
      handler: "attendance-records.checkOut",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/attendance-records/monthly-summary",
      handler: "attendance-records.getMonthlySummary",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/attendance-records/:id",
      handler: "attendance-records.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/attendance-records/:id",
      handler: "attendance-records.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

## Permissions & Security

### 1. Role-Based Access Control

#### Admin Role Permissions

- Full access to all attendance records
- Can view and edit employee location settings
- Can approve/reject attendance records
- Can generate reports and exports
- Can manage all employees' attendance data

#### Marketing User Role Permissions

- Can only view own attendance records
- Can perform check-in and check-out
- Can view own location settings (read-only)
- Cannot access other employees' data
- Cannot modify location settings

### 2. API Security

```javascript
// Middleware untuk validasi lokasi
const locationValidation = async (ctx, next) => {
  const { location_data } = ctx.request.body.data;

  if (!location_data || !location_data.check_in_location) {
    return ctx.badRequest("Location data is required");
  }

  const { lat, lng, accuracy } = location_data.check_in_location;

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return ctx.badRequest("Invalid coordinates");
  }

  if (accuracy > 100) {
    return ctx.badRequest("Location accuracy too low");
  }

  await next();
};

// Middleware untuk validasi foto selfie
const selfieValidation = async (ctx, next) => {
  const { selfie_photo } = ctx.request.body.data;

  if (!selfie_photo) {
    return ctx.badRequest("Selfie photo is required");
  }

  // Validasi file type dan size
  const file = await strapi.plugins.upload.services.upload.findOne(
    selfie_photo
  );
  if (!file || !file.mime.startsWith("image/")) {
    return ctx.badRequest("Invalid file type");
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    return ctx.badRequest("File size too large");
  }

  await next();
};
```

## Database Indexes

### Recommended Indexes for Performance

```sql
-- Attendance Records Indexes
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_attendance_status ON attendance_records(attendance_status);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);

-- Employee Location Settings Indexes
CREATE INDEX idx_location_employee_active ON employee_location_settings(employee_id, is_active);

-- Location Verification Logs Indexes
CREATE INDEX idx_verification_employee_date ON location_verification_logs(employee_id, verification_date);
CREATE INDEX idx_verification_status ON location_verification_logs(verification_status);

-- Attendance Summary Indexes
CREATE INDEX idx_summary_employee_year_month ON attendance_summary(employee_id, year, month);
```

## Error Handling

### Common Error Responses

```javascript
// Location outside radius
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Location is outside allowed radius",
    "details": {
      "distance_from_target": 7.5,
      "allowed_radius": 5.0,
      "target_area": "Jakarta Selatan"
    }
  }
}

// Invalid coordinates
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid coordinates provided",
    "details": {
      "lat": "Must be between -90 and 90",
      "lng": "Must be between -180 and 180"
    }
  }
}

// Missing selfie photo
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Selfie photo is required for check-in",
    "details": {
      "selfie_photo": "This field is required"
    }
  }
}

// Duplicate check-in
{
  "error": {
    "status": 409,
    "name": "ConflictError",
    "message": "Check-in already exists for this date",
    "details": {
      "attendance_date": "2024-12-15",
      "employee_id": 1
    }
  }
}
```

## Testing

### Unit Tests Examples

```javascript
// Test location verification
describe("Location Verification", () => {
  test("should verify location within radius", async () => {
    const employeeId = 1;
    const currentLocation = {
      lat: -6.2615,
      lng: 106.8106,
      accuracy: 10.5,
    };

    const result = await locationVerificationService.verifyLocation(
      employeeId,
      currentLocation
    );

    expect(result.is_within_radius).toBe(true);
    expect(result.distance_from_target).toBeLessThanOrEqual(5.0);
  });

  test("should reject location outside radius", async () => {
    const employeeId = 1;
    const currentLocation = {
      lat: -6.2, // Outside radius
      lng: 106.8,
      accuracy: 10.5,
    };

    const result = await locationVerificationService.verifyLocation(
      employeeId,
      currentLocation
    );

    expect(result.is_within_radius).toBe(false);
    expect(result.distance_from_target).toBeGreaterThan(5.0);
  });
});

// Test attendance creation
describe("Attendance Records", () => {
  test("should create attendance record with valid data", async () => {
    const attendanceData = {
      employee: 1,
      attendance_date: "2024-12-15",
      check_in_time: "2024-12-15T08:30:00.000Z",
      location_data: {
        check_in_location: {
          lat: -6.2615,
          lng: 106.8106,
          accuracy: 10.5,
        },
      },
      selfie_photo: "file_id",
      is_within_radius: true,
      distance_from_target: 2.3,
    };

    const result = await attendanceController.create({
      request: { body: { data: attendanceData } },
    });

    expect(result.data.attributes.attendance_status).toBe("present");
    expect(result.data.attributes.is_within_radius).toBe(true);
  });
});
```

## Deployment Considerations

### 1. Environment Variables

```bash
# Strapi Configuration
STRAPI_URL=http://localhost:1340
STRAPI_API_TOKEN=your_api_token

# File Upload Configuration
UPLOAD_MAX_SIZE=5242880  # 5MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif

# Location Verification
DEFAULT_RADIUS_KM=5
MAX_RADIUS_KM=50
MIN_LOCATION_ACCURACY=100

# Attendance Settings
WORK_START_TIME=08:00
LATE_THRESHOLD_MINUTES=30
```

### 2. Performance Optimization

- Implement Redis caching for frequently accessed location settings
- Use database indexes for attendance queries
- Implement pagination for large datasets
- Use CDN for selfie photo storage
- Implement background jobs for monthly summary generation

### 3. Monitoring & Logging

- Log all location verification attempts
- Monitor attendance patterns for anomalies
- Track API response times
- Set up alerts for failed check-ins
- Monitor storage usage for photos

## Conclusion

Dokumentasi ini memberikan panduan lengkap untuk implementasi sistem absensi HRM berbasis lokasi menggunakan Strapi. Sistem ini mendukung:

1. **Location-based Check-in**: Verifikasi lokasi dengan radius area target
2. **Photo Verification**: Upload foto selfie untuk verifikasi identitas
3. **Role-based Access**: Pembatasan akses berdasarkan role (Admin/Marketing)
4. **Comprehensive Tracking**: Tracking lengkap kehadiran, keterlambatan, dan status
5. **Audit Trail**: Log lengkap untuk audit dan monitoring

Implementasi ini memastikan akurasi dan keamanan sistem absensi sambil memberikan fleksibilitas untuk tim marketing yang bekerja di lapangan.
