# Dokumentasi Implementasi Backend Marketing Schedules

## Overview

Dokumentasi ini menjelaskan implementasi backend untuk sistem Jadwal & Kegiatan Marketing menggunakan Strapi CMS. Implementasi ini menggunakan lifecycle hooks untuk validasi data, notifikasi, dan business logic automation tanpa membuat custom API endpoints.

## Content Types yang Dibuat/Dimodifikasi

### 1. Jadwal Marketing (jadwal-marketing) - BARU

**Lokasi**: `src/api/jadwal-marketing/`

**Schema**: `content-types/jadwal-marketing/schema.json`

**Fitur**:

- Manajemen jadwal kegiatan marketing (pameran, open house, kunjungan, dll)
- Relasi dengan karyawan (assigned_staff), proyek, dan lead
- Status tracking (upcoming, ongoing, completed, cancelled)
- Priority levels (low, medium, high, urgent)
- Budget tracking dan expected leads

**Lifecycle Hooks**: `content-types/jadwal-marketing/lifecycles.js`

- Validasi tanggal dan waktu
- Auto-generate title berdasarkan activity type
- Notifikasi email ke staff yang ditugaskan
- Update status otomatis berdasarkan tanggal
- Activity logging

### 2. Laporan Kegiatan (laporan-kegiatan) - BARU

**Lokasi**: `src/api/laporan-kegiatan/`

**Schema**: `content-types/laporan-kegiatan/schema.json`

**Fitur**:

- Laporan hasil kegiatan marketing
- Tracking leads generated, bookings made, booking fee collected
- Attachment support untuk foto/dokumen
- Approval workflow (draft → submitted → approved/rejected)
- Relasi dengan jadwal marketing

**Lifecycle Hooks**: `content-types/laporan-kegiatan/lifecycles.js`

- Validasi tanggal laporan (maksimal 7 hari setelah kegiatan)
- Auto-assign submitted_by berdasarkan user yang login
- Notifikasi ke supervisor saat laporan baru
- Notifikasi approval ke submitter
- Activity logging

### 3. Reminder Follow-up (reminder) - DIMODIFIKASI

**Lokasi**: `src/api/reminder/`

**Schema**: `content-types/reminder/schema.json` (dimodifikasi)

**Fitur Tambahan**:

- Reminder type (phone_call, email, visit, whatsapp, sms)
- Priority levels
- Assigned staff tracking
- Completion tracking dengan notes
- Overdue status otomatis

**Lifecycle Hooks**: `content-types/reminder/lifecycles.js` (baru)

- Validasi tanggal reminder (harus di masa depan)
- Auto-assign staff berdasarkan user yang login
- Notifikasi email ke staff yang ditugaskan
- Auto-update status menjadi overdue
- Notifikasi completion ke supervisor

## Relasi Database

### Jadwal Marketing

```javascript
// Relasi Many-to-Many dengan Karyawan
assigned_staff: manyToMany → api::karyawan.karyawan

// Relasi Many-to-One dengan Proyek
project: manyToOne → api::proyek-perumahan.proyek-perumahan

// Relasi Many-to-One dengan Lead
lead: manyToOne → api::lead-marketing.lead-marketing

// Relasi One-to-Many dengan Laporan
reports: oneToMany → api::laporan-kegiatan.laporan-kegiatan
```

### Laporan Kegiatan

```javascript
// Relasi Many-to-One dengan Jadwal
schedule: manyToOne → api::jadwal-marketing.jadwal-marketing

// Relasi Many-to-One dengan Karyawan (submitter)
submitted_by: manyToOne → api::karyawan.karyawan

// Relasi Many-to-One dengan Karyawan (approver)
approved_by: manyToOne → api::karyawan.karyawan
```

### Reminder Follow-up

```javascript
// Relasi Many-to-One dengan Lead
lead: manyToOne → api::lead-marketing.lead-marketing

// Relasi Many-to-One dengan Karyawan (assigned)
assigned_to: manyToOne → api::karyawan.karyawan
```

## Lifecycle Hooks Detail

### Jadwal Marketing Lifecycle

#### beforeCreate

- Validasi tanggal mulai < tanggal selesai
- Validasi waktu mulai < waktu selesai
- Set created_by otomatis
- Generate title otomatis jika kosong

#### beforeUpdate

- Validasi tanggal
- Set updated_by otomatis
- Update status berdasarkan tanggal (upcoming/ongoing/completed)

#### afterCreate

- Kirim notifikasi email ke assigned_staff
- Log aktivitas ke activity-log

#### afterUpdate

- Kirim notifikasi jika ada perubahan penting
- Log aktivitas

#### beforeDelete

- Cek apakah ada laporan terkait (prevent deletion)

#### afterDelete

- Log aktivitas

### Laporan Kegiatan Lifecycle

#### beforeCreate

- Validasi tanggal laporan (maksimal 7 hari setelah kegiatan)
- Auto-assign submitted_by
- Validasi data numerik (tidak boleh negatif)

#### beforeUpdate

- Auto-set approved_by dan approval_date saat status = approved
- Validasi data numerik

#### afterCreate

- Kirim notifikasi ke supervisor marketing
- Log aktivitas

#### afterUpdate

- Kirim notifikasi approval ke submitter
- Log aktivitas

### Reminder Follow-up Lifecycle

#### beforeCreate

- Validasi tanggal reminder (harus di masa depan)
- Auto-assign assigned_to
- Generate title dari activity

#### beforeUpdate

- Auto-set completed_at saat status = completed
- Auto-update status menjadi overdue

#### afterCreate

- Kirim notifikasi email ke assigned staff
- Log aktivitas

#### afterUpdate

- Kirim notifikasi completion ke supervisor
- Log aktivitas

## Validasi Data

### Jadwal Marketing

- Title: required, max 200 karakter
- Activity Type: required, enum values
- Location: required, max 500 karakter
- Start Date: required, datetime
- End Date: optional, harus > start_date
- Start/End Time: optional, start_time < end_time
- Expected Leads: min 0
- Budget: min 0

### Laporan Kegiatan

- Title: required, max 200 karakter
- Report Type: required, enum values
- Activity Date: required, date
- Location: required, max 500 karakter
- Leads Generated: min 0
- Bookings Made: min 0
- Booking Fee Collected: min 0
- Visitors Count: min 0

### Reminder Follow-up

- Title: required, max 200 karakter
- Reminder Type: required, enum values
- Reminder Date: required, datetime, harus di masa depan
- Activity: required, min 5, max 200 karakter

## Notifikasi Email

### Jadwal Marketing

- **Created**: Notifikasi ke assigned_staff tentang jadwal baru
- **Updated**: Notifikasi ke assigned_staff tentang perubahan penting

### Laporan Kegiatan

- **Created**: Notifikasi ke supervisor marketing tentang laporan baru
- **Approved**: Notifikasi ke submitter tentang approval

### Reminder Follow-up

- **Created**: Notifikasi ke assigned staff tentang reminder baru
- **Completed**: Notifikasi ke supervisor tentang completion

## Error Handling

Semua lifecycle hooks menggunakan try-catch untuk:

- Email notifications (log error jika gagal)
- Activity logging (log error jika gagal)
- Database operations (throw error untuk validasi)

## Database Indexes (Recommended)

```sql
-- Jadwal Marketing
CREATE INDEX idx_jadwal_marketing_start_date ON jadwal_marketings(start_date);
CREATE INDEX idx_jadwal_marketing_status ON jadwal_marketings(status);
CREATE INDEX idx_jadwal_marketing_activity_type ON jadwal_marketings(activity_type);

-- Laporan Kegiatan
CREATE INDEX idx_laporan_kegiatan_activity_date ON laporan_kegiatans(activity_date);
CREATE INDEX idx_laporan_kegiatan_status ON laporan_kegiatans(status);

-- Reminder Follow-up
CREATE INDEX idx_reminder_reminder_date ON reminders(reminder_date);
CREATE INDEX idx_reminder_status ON reminders(status_reminder);
```

## API Endpoints (Auto-generated)

Strapi akan otomatis generate endpoints berikut:

### Jadwal Marketing

- `GET /api/jadwal-marketings` - List semua jadwal
- `GET /api/jadwal-marketings/:id` - Detail jadwal
- `POST /api/jadwal-marketings` - Buat jadwal baru
- `PUT /api/jadwal-marketings/:id` - Update jadwal
- `DELETE /api/jadwal-marketings/:id` - Hapus jadwal

### Laporan Kegiatan

- `GET /api/laporan-kegiatans` - List semua laporan
- `GET /api/laporan-kegiatans/:id` - Detail laporan
- `POST /api/laporan-kegiatans` - Buat laporan baru
- `PUT /api/laporan-kegiatans/:id` - Update laporan
- `DELETE /api/laporan-kegiatans/:id` - Hapus laporan

### Reminder Follow-up

- `GET /api/reminders` - List semua reminder
- `GET /api/reminders/:id` - Detail reminder
- `POST /api/reminders` - Buat reminder baru
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Hapus reminder

## Permissions

### Role-based Access Control

- **Admin**: Full access semua endpoints
- **Supervisor Marketing**: Read, Create, Update (tidak bisa delete)
- **Staff Marketing**: Read, Create (own), Update (own)
- **Manager**: Read, Create, Update, Delete

### Field-level Permissions

- `created_by` dan `updated_by`: Auto-set berdasarkan user yang login
- `submitted_by`: Auto-set berdasarkan user yang login
- `approved_by`: Auto-set saat status berubah ke approved

## Testing

### Unit Tests (Recommended)

```javascript
// Test lifecycle hooks
describe("Jadwal Marketing Lifecycle", () => {
  test("should validate date range", async () => {
    // Test invalid date range
  });

  test("should send notification on create", async () => {
    // Test email notification
  });
});
```

## Deployment Notes

### Environment Variables

```bash
# Email configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_key

# Database
DATABASE_URL=your_database_url
```

### Production Considerations

1. **Email Service**: Pastikan email service terkonfigurasi dengan benar
2. **Database Indexes**: Buat semua recommended indexes
3. **Error Monitoring**: Setup monitoring untuk lifecycle hooks
4. **Backup**: Regular backup untuk data penting
5. **Rate Limiting**: Implementasi rate limiting untuk API

## Troubleshooting

### Common Issues

1. **Email tidak terkirim**: Cek konfigurasi email service
2. **Validation errors**: Cek lifecycle hooks dan data format
3. **Performance issues**: Cek database indexes
4. **Permission errors**: Cek role permissions

### Debug Commands

```bash
# Cek log Strapi
npm run strapi logs

# Test email service
npm run strapi email:test

# Cek database connection
npm run strapi db:check
```

## Migration Notes

### Existing Data

- Tabel `reminder` yang sudah ada akan tetap kompatibel
- Field baru akan memiliki default values
- Relasi baru akan kosong sampai di-assign

### Data Migration (jika diperlukan)

```sql
-- Update existing reminders dengan field baru
UPDATE reminders SET
  title = activity,
  reminder_type = 'phone_call',
  priority = 'medium'
WHERE title IS NULL;
```

---

**Catatan**: Implementasi ini menggunakan lifecycle hooks untuk business logic tanpa membuat custom API endpoints, sesuai dengan permintaan untuk menghindari custom API dan fokus pada lifecycle hooks saja.
