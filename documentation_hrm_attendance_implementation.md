# HRM Attendance System - Backend Implementation

## Overview

Implementasi backend Strapi untuk sistem absensi HRM yang mendukung check-in berbasis lokasi dengan radius area target, pengambilan foto selfie untuk verifikasi, dan manajemen area target untuk tim marketing.

## Content Types yang Diimplementasikan

### 1. Employee Location Settings (`employee-location-settings`)

**Path**: `src/api/employee-location-settings/`

**Deskripsi**: Pengaturan lokasi dan radius area target untuk setiap karyawan marketing.

**Fields**:

- `employee` (relation): Relasi ke karyawan
- `target_area_name` (string): Nama area target
- `target_coordinates` (json): Koordinat target (lat, lng)
- `radius_km` (decimal): Radius dalam kilometer (1-50)
- `monthly_target` (string): Target bulanan
- `is_active` (boolean): Status aktif
- `created_by` (relation): Dibuat oleh user

### 2. Attendance Records (`attendance-records`) - Modified from existing `absensi`

**Path**: `src/api/absensi/`

**Deskripsi**: Record absensi harian dengan lokasi dan foto verifikasi. Dimodifikasi dari content type `absensi` yang sudah ada.

**Fields**:

- `employee` (relation): Relasi ke karyawan
- `attendance_date` (date): Tanggal absensi
- `check_in_time` (datetime): Waktu check-in
- `check_out_time` (datetime): Waktu check-out
- `attendance_status` (enum): Status absensi (present, late, absent, sick, leave, overtime)
- `location_data` (json): Data lokasi check-in dan check-out
- `selfie_photo` (media): Foto selfie untuk verifikasi
- `is_within_radius` (boolean): Apakah dalam radius yang diizinkan
- `distance_from_target` (decimal): Jarak dari target
- `notes` (text): Catatan
- `approved_by` (relation): Disetujui oleh user
- `approval_status` (enum): Status persetujuan (pending, approved, rejected)
- `rejection_reason` (text): Alasan penolakan
- `overtime_hours` (decimal): Jam lembur

**Lifecycle Features**:

- Validasi lokasi dan koordinat
- Perhitungan jarak menggunakan Haversine formula
- Penentuan status absensi berdasarkan waktu check-in
- Logging verifikasi lokasi
- Perhitungan jam lembur otomatis
- Generasi ringkasan bulanan

### 3. Attendance Summary (`attendance-summary`)

**Path**: `src/api/attendance-summary/`

**Deskripsi**: Ringkasan bulanan absensi untuk setiap karyawan.

**Fields**:

- `employee` (relation): Relasi ke karyawan
- `year` (integer): Tahun
- `month` (integer): Bulan
- `total_working_days` (integer): Total hari kerja
- `total_present` (integer): Total hadir
- `total_late` (integer): Total terlambat
- `total_absent` (integer): Total absen
- `total_sick` (integer): Total sakit
- `total_leave` (integer): Total izin
- `total_overtime` (integer): Total lembur
- `attendance_percentage` (decimal): Persentase kehadiran
- `is_finalized` (boolean): Status finalisasi

**Lifecycle Features**:

- Perhitungan otomatis ringkasan bulanan
- Update otomatis saat ada perubahan data absensi

### 4. Location Verification Logs (`location-verification-logs`)

**Path**: `src/api/location-verification-logs/`

**Deskripsi**: Log verifikasi lokasi untuk audit dan monitoring.

**Fields**:

- `employee` (relation): Relasi ke karyawan
- `verification_date` (datetime): Tanggal verifikasi
- `requested_location` (json): Lokasi yang diminta
- `target_location` (json): Lokasi target
- `calculated_distance` (decimal): Jarak yang dihitung
- `allowed_radius` (decimal): Radius yang diizinkan
- `is_within_radius` (boolean): Apakah dalam radius
- `verification_status` (enum): Status verifikasi (success, failed, manual_override)
- `device_info` (json): Informasi device
- `ip_address` (string): Alamat IP

## Modifikasi yang Dilakukan

### 1. Schema Absensi yang Dimodifikasi

**Sebelum**:

```json
{
  "collectionName": "absensis",
  "singularName": "absensi",
  "attributes": {
    "tanggal": "date",
    "jam_masuk": "time",
    "jam_keluar": "time",
    "status_absensi": "enumeration",
    "lokasi_gps": "string",
    "karyawan": "relation"
  }
}
```

**Sesudah**:

```json
{
  "collectionName": "attendance_records",
  "singularName": "absensi",
  "pluralName": "attendance-records",
  "attributes": {
    "employee": "relation",
    "attendance_date": "date",
    "check_in_time": "datetime",
    "check_out_time": "datetime",
    "attendance_status": "enumeration",
    "location_data": "json",
    "selfie_photo": "media",
    "is_within_radius": "boolean",
    "distance_from_target": "decimal",
    "approval_status": "enumeration"
  }
}
```

### 2. Relasi Karyawan yang Diupdate

**Sebelum**:

```json
"absensi": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::absensi.absensi",
  "mappedBy": "karyawan"
}
```

**Sesudah**:

```json
"absensi": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::absensi.absensi",
  "mappedBy": "employee"
}
```

## Fitur Lifecycle yang Diimplementasikan

### 1. Attendance Records Lifecycle (`src/api/absensi/content-types/absensi/lifecycles.js`)

**beforeCreate**:

- Validasi data lokasi dan koordinat
- Perhitungan jarak menggunakan Haversine formula
- Penentuan status absensi berdasarkan waktu check-in
- Logging verifikasi lokasi
- Set approval status jika lokasi di luar radius

**beforeUpdate**:

- Perhitungan jam lembur otomatis
- Update lokasi check-out dengan verifikasi

**afterCreate**:

- Trigger generasi ringkasan bulanan jika hari terakhir bulan

### 2. Attendance Summary Lifecycle (`src/api/attendance-summary/content-types/attendance-summary/lifecycles.js`)

**beforeCreate**:

- Perhitungan otomatis ringkasan bulanan jika data tidak disediakan

**beforeUpdate**:

- Recalculate summary jika ada perubahan data absensi

## API Endpoints

### Employee Location Settings

- `GET /api/employee-location-settings-lists` - Daftar pengaturan lokasi
- `GET /api/employee-location-settings-lists/:id` - Detail pengaturan lokasi
- `POST /api/employee-location-settings-lists` - Buat pengaturan lokasi baru
- `PUT /api/employee-location-settings-lists/:id` - Update pengaturan lokasi
- `DELETE /api/employee-location-settings-lists/:id` - Hapus pengaturan lokasi

### Attendance Records

- `GET /api/absensis` - Daftar record absensi
- `GET /api/absensis/:id` - Detail record absensi
- `POST /api/absensis` - Buat record absensi baru
- `PUT /api/absensis/:id` - Update record absensi
- `DELETE /api/absensis/:id` - Hapus record absensi

### Attendance Summary

- `GET /api/attendance-summaries` - Daftar ringkasan absensi
- `GET /api/attendance-summaries/:id` - Detail ringkasan absensi
- `POST /api/attendance-summaries` - Buat ringkasan absensi baru
- `PUT /api/attendance-summaries/:id` - Update ringkasan absensi
- `DELETE /api/attendance-summaries/:id` - Hapus ringkasan absensi

### Location Verification Logs

- `GET /api/location-verification-logs-lists` - Daftar log verifikasi
- `GET /api/location-verification-logs-lists/:id` - Detail log verifikasi
- `POST /api/location-verification-logs-lists` - Buat log verifikasi baru
- `PUT /api/location-verification-logs-lists/:id` - Update log verifikasi
- `DELETE /api/location-verification-logs-lists/:id` - Hapus log verifikasi

## Business Logic yang Diimplementasikan

### 1. Location Verification

- Perhitungan jarak menggunakan Haversine formula
- Validasi koordinat (lat: -90 to 90, lng: -180 to 180)
- Validasi akurasi lokasi (max 100m)
- Penentuan status dalam radius atau tidak

### 2. Attendance Status Logic

- `present`: Check-in sebelum atau tepat waktu kerja
- `late`: Check-in setelah waktu kerja (dalam 30 menit)
- `late`: Check-in lebih dari 30 menit terlambat
- `overtime`: Check-out setelah jam kerja normal

### 3. Automatic Calculations

- Perhitungan jam lembur otomatis
- Generasi ringkasan bulanan otomatis
- Update persentase kehadiran otomatis

## Validasi yang Diimplementasikan

### Employee Location Settings

- `target_area_name`: Required, max 100 karakter
- `target_coordinates.lat`: Required, antara -90 dan 90
- `target_coordinates.lng`: Required, antara -180 dan 180
- `radius_km`: Required, antara 1 dan 50
- `monthly_target`: Required, max 50 karakter
- `employee`: Required, harus ada di tabel karyawan

### Attendance Records

- `employee`: Required, harus ada di tabel karyawan
- `attendance_date`: Required, format tanggal valid
- `check_in_time`: Required, format datetime valid
- `location_data.check_in_location.lat`: Required, antara -90 dan 90
- `location_data.check_in_location.lng`: Required, antara -180 dan 180
- `selfie_photo`: Required, harus file gambar
- `attendance_status`: Required, harus nilai enum yang valid

## Error Handling

### Common Error Responses

- **Location outside radius**: Status 400 dengan detail jarak dan radius
- **Invalid coordinates**: Status 400 dengan detail validasi koordinat
- **Missing selfie photo**: Status 400 dengan pesan foto selfie diperlukan
- **Duplicate check-in**: Status 409 dengan detail tanggal dan karyawan
- **Employee location settings not found**: Status 404 dengan pesan pengaturan tidak ditemukan

## Database Considerations

### Recommended Indexes

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

## Testing Recommendations

### Unit Tests

- Test location verification dengan berbagai koordinat
- Test perhitungan jarak Haversine
- Test penentuan status absensi berdasarkan waktu
- Test perhitungan jam lembur
- Test generasi ringkasan bulanan

### Integration Tests

- Test flow check-in lengkap dengan validasi lokasi
- Test flow check-out dengan perhitungan lembur
- Test approval workflow untuk lokasi di luar radius
- Test generasi ringkasan bulanan otomatis

## Deployment Notes

### Environment Variables

```bash
# Location Verification
DEFAULT_RADIUS_KM=5
MAX_RADIUS_KM=50
MIN_LOCATION_ACCURACY=100

# Attendance Settings
WORK_START_TIME=08:00
LATE_THRESHOLD_MINUTES=30

# File Upload
UPLOAD_MAX_SIZE=5242880  # 5MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
```

### Performance Optimization

- Implement Redis caching untuk location settings
- Use database indexes untuk query attendance
- Implement pagination untuk large datasets
- Use CDN untuk selfie photo storage
- Implement background jobs untuk monthly summary generation

## Migration Strategy

### Existing Data

- Data absensi lama akan tetap ada dengan struktur baru
- Relasi karyawan sudah diupdate untuk kompatibilitas
- Tidak ada data yang hilang dalam proses migrasi

### New Features

- Location verification akan aktif untuk record baru
- Monthly summary akan di-generate otomatis
- Approval workflow akan aktif untuk lokasi di luar radius

## Conclusion

Implementasi ini berhasil mengupgrade sistem absensi yang sudah ada menjadi sistem HRM attendance yang komprehensif dengan:

1. **Location-based Check-in**: Verifikasi lokasi dengan radius area target
2. **Photo Verification**: Upload foto selfie untuk verifikasi identitas
3. **Automatic Calculations**: Perhitungan otomatis status, lembur, dan ringkasan
4. **Audit Trail**: Log lengkap untuk audit dan monitoring
5. **Approval Workflow**: Workflow persetujuan untuk kasus khusus

Sistem ini memastikan akurasi dan keamanan sistem absensi sambil memberikan fleksibilitas untuk tim marketing yang bekerja di lapangan.
