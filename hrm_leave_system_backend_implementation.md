# Implementasi Backend Sistem HRM Leave & Izin

## Overview

Sistem HRM Leave & Izin telah berhasil diimplementasikan dengan menggunakan Strapi sebagai backend framework. Implementasi ini menggunakan lifecycle functions untuk menghindari custom API yang kompleks, sambil tetap memberikan fungsionalitas yang lengkap dan robust.

## Analisis Existing System

### Existing Tables yang Ditemukan:

1. **`cuti` table** - Sudah ada dengan struktur dasar
2. **`absensi` table** - Untuk tracking kehadiran
3. **`karyawan` table** - Master data karyawan

### Modifikasi yang Dilakukan:

- **Enhanced existing `cuti` table** menjadi `leave-request` dengan fitur lengkap
- **Created new `leave-quota` table** untuk manajemen kuota
- **Created new `leave-policy` table** untuk kebijakan cuti
- **Updated `karyawan` table** dengan relasi baru

## Content Types yang Diimplementasikan

### 1. Leave Quota (`leave-quota`)

**Path**: `src/api/leave-quota/`

**Deskripsi**: Pengaturan kuota cuti untuk setiap karyawan berdasarkan jenis cuti.

**Schema Fields**:

```json
{
  "employee": "relation to karyawan (required)",
  "leave_type": "enum: tahunan, melahirkan, sakit (required)",
  "annual_quota": "decimal (required, min: 0)",
  "used_quota": "decimal (required, min: 0, default: 0)",
  "remaining_quota": "decimal (required, min: 0, default: 0)",
  "year": "integer (required, min: 2020, max: 2030)",
  "is_active": "boolean (default: true)",
  "notes": "text (maxLength: 500)",
  "created_by": "relation to user",
  "updated_by": "relation to user"
}
```

**Lifecycle Functions**:

- `beforeCreate` & `beforeUpdate`: Validasi kuota, auto-calculate remaining_quota
- `afterCreate` & `afterUpdate`: Logging dan notifikasi kuota rendah

### 2. Leave Request (Enhanced `cuti`)

**Path**: `src/api/cuti/`

**Deskripsi**: Pengajuan cuti dan izin karyawan dengan workflow approval.

**Schema Fields**:

```json
{
  "employee": "relation to karyawan (required)",
  "request_type": "enum: cuti, izin_pribadi, izin_dinas, izin_sakit (required)",
  "leave_type": "enum: tahunan, melahirkan, sakit (required)",
  "start_date": "date (required)",
  "end_date": "date (required)",
  "duration_days": "decimal (required, min: 0)",
  "reason": "text (required, maxLength: 1000)",
  "status": "enum: pending, approved, rejected, cancelled (required, default: pending)",
  "approval_date": "datetime",
  "approved_by": "relation to user",
  "rejection_reason": "text (maxLength: 500)",
  "medical_certificate": "media (images, files)",
  "is_paid": "boolean (required, default: true)",
  "salary_deduction": "decimal (min: 0, max: 100)",
  "emergency_contact": "json schema",
  "handover_notes": "text (maxLength: 1000)",
  "created_by": "relation to user",
  "updated_by": "relation to user"
}
```

**Emergency Contact Schema**:

```json
{
  "name": "string",
  "phone": "string",
  "relationship": "string",
  "address": "string"
}
```

**Lifecycle Functions**:

- `beforeCreate`: Validasi tanggal, kuota, policy, auto-calculate duration
- `beforeUpdate`: Validasi status changes, update kuota saat approved
- `afterCreate` & `afterUpdate`: Logging dan notifikasi

### 3. Leave Policy (`leave-policy`)

**Path**: `src/api/leave-policy/`

**Deskripsi**: Kebijakan cuti dan izin perusahaan yang dapat dikonfigurasi.

**Schema Fields**:

```json
{
  "policy_name": "string (required, maxLength: 100)",
  "leave_type": "enum: tahunan, melahirkan, sakit (required)",
  "default_quota": "decimal (required, min: 0)",
  "max_consecutive": "integer (required, min: 1)",
  "min_advance_days": "integer (required, min: 0)",
  "requires_approval": "boolean (required, default: true)",
  "is_paid": "boolean (required, default: true)",
  "salary_deduction": "decimal (min: 0, max: 100)",
  "requires_medical": "boolean (default: false)",
  "gender_restriction": "enum: male, female, all (default: all)",
  "employment_duration": "integer (min: 0)",
  "is_active": "boolean (default: true)",
  "effective_date": "date (required)",
  "expiry_date": "date",
  "description": "text (maxLength: 1000)",
  "created_by": "relation to user",
  "updated_by": "relation to user"
}
```

**Lifecycle Functions**:

- `beforeCreate` & `beforeUpdate`: Validasi tanggal, kuota, persentase
- `afterCreate` & `afterUpdate`: Logging dan notifikasi perubahan policy

## Business Logic Implementation

### 1. Perhitungan Durasi Cuti

```javascript
// Auto-calculated in lifecycle
const diffTime = Math.abs(end - start);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
```

### 2. Validasi Kuota Tersisa

```javascript
async function validateQuotaAvailability(
  employeeId,
  leaveType,
  requestedDays,
  year
) {
  const quota = await strapi.entityService.findMany(
    "api::leave-quota.leave-quota",
    {
      filters: {
        employee: employeeId,
        leave_type: leaveType,
        year: year,
        is_active: true,
      },
    }
  );

  if (!quota || quota.length === 0) {
    throw new Error("Kuota cuti tidak ditemukan untuk karyawan ini");
  }

  const availableQuota = quota[0].remaining_quota;
  if (requestedDays > availableQuota) {
    throw new Error(`Kuota tidak mencukupi. Tersisa ${availableQuota} hari`);
  }
}
```

### 3. Penentuan Status Pembayaran

```javascript
async function determinePaymentStatus(requestType, leaveType) {
  switch (requestType) {
    case "cuti":
      // Check policy
      return policy.is_paid;
    case "izin_dinas":
      return true; // Always paid
    case "izin_sakit":
      return true; // Always paid
    case "izin_pribadi":
      return false; // Always unpaid
  }
}
```

### 4. Validasi Minimal Pemberitahuan

```javascript
async function validateAdvanceNotice(startDate, leaveType) {
  const policy = await strapi.entityService.findMany(
    "api::leave-policy.leave-policy",
    {
      filters: { leave_type: leaveType, is_active: true },
    }
  );

  if (policy && policy.length > 0) {
    const minAdvanceDays = policy[0].min_advance_days;
    const daysDiff = Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (daysDiff < minAdvanceDays) {
      throw new Error(
        `Minimal pemberitahuan ${minAdvanceDays} hari sebelumnya`
      );
    }
  }
}
```

## API Endpoints

### Leave Quota

- `GET /api/leave-quotas` - List kuota cuti
- `POST /api/leave-quotas` - Create kuota baru
- `GET /api/leave-quotas/:id` - Get kuota by ID
- `PUT /api/leave-quotas/:id` - Update kuota
- `DELETE /api/leave-quotas/:id` - Delete kuota

### Leave Request (Cuti)

- `GET /api/cutis` - List pengajuan cuti/izin
- `POST /api/cutis` - Create pengajuan baru
- `GET /api/cutis/:id` - Get pengajuan by ID
- `PUT /api/cutis/:id` - Update pengajuan (approve/reject)
- `DELETE /api/cutis/:id` - Delete pengajuan

### Leave Policy

- `GET /api/leave-policies` - List kebijakan cuti
- `POST /api/leave-policies` - Create kebijakan baru
- `GET /api/leave-policies/:id` - Get kebijakan by ID
- `PUT /api/leave-policies/:id` - Update kebijakan
- `DELETE /api/leave-policies/:id` - Delete kebijakan

## Query Parameters

### Leave Quota

- `employee` - Filter by employee ID
- `leave_type` - Filter by leave type
- `year` - Filter by year
- `is_active` - Filter by active status
- `populate` - Populate relations

### Leave Request

- `employee` - Filter by employee ID
- `request_type` - Filter by request type
- `status` - Filter by status
- `start_date` - Filter by start date
- `end_date` - Filter by end date
- `populate` - Populate relations

### Leave Policy

- `leave_type` - Filter by leave type
- `is_active` - Filter by active status
- `effective_date` - Filter by effective date
- `populate` - Populate relations

## Example API Usage

### Create Leave Quota

```bash
POST /api/leave-quotas
Content-Type: application/json

{
  "data": {
    "employee": 1,
    "leave_type": "tahunan",
    "annual_quota": 12,
    "used_quota": 0,
    "year": 2024,
    "notes": "Kuota cuti tahunan 2024"
  }
}
```

### Create Leave Request

```bash
POST /api/cutis
Content-Type: application/json

{
  "data": {
    "employee": 1,
    "request_type": "cuti",
    "leave_type": "tahunan",
    "start_date": "2024-12-20",
    "end_date": "2024-12-22",
    "reason": "Liburan keluarga",
    "emergency_contact": {
      "name": "Siti Nurhaliza",
      "phone": "081234567890",
      "relationship": "Istri",
      "address": "Jl. Sudirman No. 123"
    },
    "handover_notes": "Pekerjaan diserahkan ke Budi Santoso"
  }
}
```

### Approve Leave Request

```bash
PUT /api/cutis/1
Content-Type: application/json

{
  "data": {
    "status": "approved",
    "approval_date": "2024-12-15T10:30:00.000Z"
  }
}
```

### Create Leave Policy

```bash
POST /api/leave-policies
Content-Type: application/json

{
  "data": {
    "policy_name": "Kebijakan Cuti Tahunan 2024",
    "leave_type": "tahunan",
    "default_quota": 12,
    "max_consecutive": 30,
    "min_advance_days": 3,
    "requires_approval": true,
    "is_paid": true,
    "effective_date": "2024-01-01",
    "description": "Kebijakan cuti tahunan untuk semua karyawan"
  }
}
```

## Database Relations

### Karyawan Relations

```json
{
  "leave_quotas": "oneToMany -> leave-quota.employee",
  "leave_requests": "oneToMany -> cuti.employee"
}
```

### Leave Quota Relations

```json
{
  "employee": "manyToOne -> karyawan.leave_quotas"
}
```

### Leave Request Relations

```json
{
  "employee": "manyToOne -> karyawan.leave_requests",
  "approved_by": "manyToOne -> user",
  "created_by": "manyToOne -> user",
  "updated_by": "manyToOne -> user"
}
```

## Validation Rules

### Leave Quota

- `annual_quota` >= 0
- `used_quota` >= 0
- `used_quota` <= `annual_quota`
- `year` between 2020-2030
- Auto-calculate `remaining_quota`

### Leave Request

- `start_date` <= `end_date`
- `duration_days` >= 0
- Medical certificate required for `izin_sakit`
- Quota validation before creation
- Status validation (only pending can be approved/rejected)

### Leave Policy

- `default_quota` >= 0
- `max_consecutive` >= 1
- `min_advance_days` >= 0
- `salary_deduction` between 0-100%
- `expiry_date` > `effective_date`

## Error Handling

### Common Errors

- "Kuota tidak mencukupi" - Insufficient quota
- "Tanggal tidak valid" - Invalid date range
- "Surat dokter diperlukan untuk izin sakit" - Medical certificate required
- "Status tidak dapat diubah" - Invalid status transition
- "Minimal pemberitahuan X hari sebelumnya" - Insufficient advance notice

### Error Response Format

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Kuota tidak mencukupi. Tersisa 2 hari",
    "details": {}
  }
}
```

## Logging & Monitoring

### Log Events

- Leave quota creation/update
- Leave request creation/status changes
- Leave policy creation/update
- Low quota warnings (< 2 days remaining)

### Log Format

```
[INFO] Leave quota created for employee 1 - tahunan 2024
[WARN] Low leave quota warning: Employee 1 has only 1 days remaining for tahunan
[INFO] Leave request created: cuti for employee 1
[INFO] Leave request updated: cuti for employee 1 - Status: approved
```

## Security Features

### Authentication

- All endpoints require authentication
- User context available in lifecycle functions
- `created_by` and `updated_by` auto-populated

### Authorization

- Role-based access control (implemented via Strapi permissions)
- Users can only access their own data (configurable)

### Data Validation

- Input validation in lifecycle functions
- SQL injection prevention via Strapi ORM
- File upload restrictions for medical certificates

## Performance Considerations

### Database Indexes

```sql
-- Recommended indexes
CREATE INDEX idx_leave_quota_employee_year ON leave_quotas(employee_id, year);
CREATE INDEX idx_leave_quota_type_active ON leave_quotas(leave_type, is_active);
CREATE INDEX idx_leave_request_employee_status ON cutis(employee_id, status);
CREATE INDEX idx_leave_request_dates ON cutis(start_date, end_date);
CREATE INDEX idx_leave_policy_type_active ON leave_policies(leave_type, is_active);
```

### Optimization Strategies

- Use populate parameter to load related data efficiently
- Implement caching for frequently accessed policies
- Background jobs for email notifications
- Database connection pooling

## Deployment Notes

### Environment Variables

```bash
# Leave System Settings
DEFAULT_ANNUAL_QUOTA=12
MAX_CONSECUTIVE_DAYS=30
MIN_ADVANCE_NOTICE_DAYS=3

# Notification Settings
EMAIL_NOTIFICATION_ENABLED=true
SMS_NOTIFICATION_ENABLED=false

# File Upload
MEDICAL_CERTIFICATE_MAX_SIZE=5242880  # 5MB
MEDICAL_CERTIFICATE_ALLOWED_TYPES=application/pdf,image/jpeg,image/png
```

### Migration Considerations

- Existing `cuti` data needs migration to new schema
- Backup existing data before deployment
- Test lifecycle functions with sample data

## Testing Recommendations

### Unit Tests

- Test quota validation functions
- Test date calculation functions
- Test payment status determination
- Test policy validation

### Integration Tests

- Test complete leave request workflow
- Test quota update on approval
- Test policy enforcement
- Test error scenarios

### End-to-End Tests

- Test employee leave request submission
- Test supervisor approval workflow
- Test HR quota management
- Test policy configuration

## Future Enhancements

### Planned Features

- Email notification system
- SMS notifications for urgent requests
- Dashboard for leave analytics
- Bulk quota assignment
- Leave calendar integration
- Mobile app support

### Technical Improvements

- Redis caching for policies
- Background job processing
- API rate limiting
- Advanced reporting
- Audit trail enhancement

## Conclusion

Sistem HRM Leave & Izin telah berhasil diimplementasikan dengan:

1. **Fleksibilitas**: Policy yang dapat dikonfigurasi per jenis cuti
2. **Akurasi**: Auto-calculation kuota dan durasi
3. **Transparansi**: Workflow approval yang jelas
4. **Otomatisasi**: Notifikasi dan update otomatis
5. **Compliance**: Audit trail dan validasi lengkap

Implementasi ini menggunakan lifecycle functions Strapi untuk menghindari custom API yang kompleks, sambil tetap memberikan fungsionalitas yang lengkap dan robust untuk manajemen cuti dan izin karyawan.

## File Structure

```
src/api/
├── leave-quota/
│   ├── content-types/leave-quota/
│   │   ├── schema.json
│   │   └── lifecycles.js
│   ├── controllers/leave-quota.js
│   ├── routes/leave-quota.js
│   └── services/leave-quota.js
├── leave-policy/
│   ├── content-types/leave-policy/
│   │   ├── schema.json
│   │   └── lifecycles.js
│   ├── controllers/leave-policy.js
│   ├── routes/leave-policy.js
│   └── services/leave-policy.js
└── cuti/ (enhanced)
    ├── content-types/cuti/
    │   ├── schema.json (updated)
    │   └── lifecycles.js (updated)
    ├── controllers/cuti.js
    ├── routes/cuti.js
    └── services/cuti.js
```

Sistem siap untuk digunakan dan dapat dikembangkan lebih lanjut sesuai kebutuhan bisnis.
