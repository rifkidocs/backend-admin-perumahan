# Dokumentasi Implementasi Sistem Absensi HRM

## Overview

Sistem absensi HRM yang diimplementasikan mendukung:

- **Jadwal Absensi**: Admin dapat membuat jadwal absensi untuk karyawan dengan pengaturan lokasi dan waktu
- **Verifikasi Lokasi**: Sistem otomatis memverifikasi lokasi absensi berdasarkan radius yang ditentukan
- **Foto Selfie**: Wajib upload foto selfie untuk verifikasi identitas
- **Status Otomatis**: Penentuan status absensi (hadir/terlambat) berdasarkan waktu check-in
- **Approval System**: Sistem persetujuan untuk absensi di luar radius

## Content Types yang Diimplementasikan

### 1. Attendance Schedule (`attendance-schedule`)

**Path**: `src/api/attendance-schedule/`

**Deskripsi**: Jadwal absensi yang dibuat oleh admin untuk karyawan tertentu.

**Fields**:

| Field                 | Type     | Required | Description                       |
| --------------------- | -------- | -------- | --------------------------------- |
| `employee`            | relation | ✅       | Relasi ke karyawan                |
| `schedule_name`       | string   | ✅       | Nama jadwal (max 100 char)        |
| `work_start_time`     | time     | ✅       | Jam masuk kerja                   |
| `work_end_time`       | time     | ✅       | Jam keluar kerja                  |
| `attendance_location` | json     | ✅       | Koordinat dan alamat lokasi absen |
| `radius_meters`       | integer  | ✅       | Radius dalam meter (10-5000)      |
| `is_active`           | boolean  | -        | Status aktif jadwal               |
| `effective_date`      | date     | ✅       | Tanggal mulai berlaku             |
| `expiry_date`         | date     | -        | Tanggal berakhir                  |
| `notes`               | text     | -        | Catatan tambahan                  |
| `created_by`          | relation | -        | Dibuat oleh user                  |
| `updated_by`          | relation | -        | Diupdate oleh user                |

**Schema JSON untuk `attendance_location`**:

```json
{
  "lat": "number",
  "lng": "number",
  "address": "string",
  "place_name": "string"
}
```

### 2. Absensi (Modified)

**Path**: `src/api/absensi/`

**Deskripsi**: Record absensi karyawan dengan verifikasi lokasi dan foto selfie.

**Fields**:

| Field                  | Type     | Required | Description                                           |
| ---------------------- | -------- | -------- | ----------------------------------------------------- |
| `tanggal`              | date     | ✅       | Tanggal absensi                                       |
| `jam_masuk`            | datetime | ✅       | Waktu check-in                                        |
| `jam_keluar`           | datetime | -        | Waktu check-out                                       |
| `status_absensi`       | enum     | ✅       | Status (hadir, terlambat, absen, izin, sakit, lembur) |
| `overtime_hours`       | decimal  | -        | Jam lembur (auto calculated)                          |
| `keterangan`           | text     | -        | Catatan                                               |
| `foto_absensi`         | media    | ✅       | Foto selfie (single image)                            |
| `lokasi_absensi`       | json     | ✅       | Data lokasi check-in dan check-out                    |
| `is_within_radius`     | boolean  | ✅       | Apakah dalam radius yang diizinkan                    |
| `distance_from_target` | decimal  | ✅       | Jarak dari lokasi target (meter)                      |
| `attendance_schedule`  | relation | -        | Relasi ke jadwal absensi                              |
| `approval_status`      | enum     | -        | Status persetujuan (pending, approved, rejected)      |
| `approved_by`          | relation | -        | Disetujui oleh user                                   |
| `rejection_reason`     | text     | -        | Alasan penolakan                                      |
| `karyawan`             | relation | ✅       | Relasi ke karyawan                                    |

**Schema JSON untuk `lokasi_absensi`**:

```json
{
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
```

## Lifecycle Functions

### 1. Attendance Schedule Lifecycle

**File**: `src/api/attendance-schedule/content-types/attendance-schedule/lifecycles.js`

**Fitur**:

- Validasi koordinat (lat: -90 to 90, lng: -180 to 180)
- Validasi tanggal efektif vs tanggal berakhir
- Validasi waktu kerja (jam masuk < jam keluar)
- Auto-set `created_by` dan `updated_by`
- Logging aktivitas

### 2. Absensi Lifecycle

**File**: `src/api/absensi/content-types/absensi/lifecycles.js`

**Fitur**:

#### `beforeCreate`:

- Validasi data lokasi check-in
- Cari jadwal absensi aktif untuk karyawan
- Hitung jarak menggunakan Haversine formula
- Tentukan status absensi berdasarkan waktu
- Set approval status berdasarkan radius
- Log verifikasi lokasi

#### `beforeUpdate`:

- Hitung jam lembur otomatis saat check-out
- Validasi koordinat check-out
- Update status ke "lembur" jika ada overtime

#### `afterCreate` & `afterUpdate`:

- Logging aktivitas absensi
- Notifikasi jika lokasi di luar radius

## Business Logic

### 1. Perhitungan Jarak (Haversine Formula)

```javascript
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
  return R * c * 1000; // Convert to meters
}
```

### 2. Penentuan Status Absensi

```javascript
function determineAttendanceStatus(checkInTime, workStartTime) {
  const checkInDate = new Date(checkInTime);
  const workStartDate = new Date(
    checkInTime.split("T")[0] + "T" + workStartTime
  );

  const timeDiff = checkInDate.getTime() - workStartDate.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));

  if (minutesDiff <= 0) {
    return "hadir";
  } else if (minutesDiff <= 30) {
    return "terlambat";
  } else {
    return "terlambat";
  }
}
```

### 3. Perhitungan Jam Lembur

```javascript
function calculateOvertimeHours(checkOutTime, workEndTime) {
  if (!checkOutTime || !workEndTime) return 0;

  const checkOutDate = new Date(checkOutTime);
  const workEndDate = new Date(checkOutTime.split("T")[0] + "T" + workEndTime);

  const timeDiff = checkOutDate.getTime() - workEndDate.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return Math.max(0, hoursDiff);
}
```

## API Endpoints

### Attendance Schedule

#### GET `/api/attendance-schedules`

- **Deskripsi**: Daftar jadwal absensi
- **Query Parameters**:
  - `employee`: Filter berdasarkan ID karyawan
  - `is_active`: Filter berdasarkan status aktif
  - `effective_date`: Filter berdasarkan tanggal efektif
  - `populate`: Populate relasi

#### POST `/api/attendance-schedules`

- **Deskripsi**: Buat jadwal absensi baru
- **Request Body**:

```json
{
  "data": {
    "employee": 1,
    "schedule_name": "Jadwal Marketing Jakarta",
    "work_start_time": "08:00:00",
    "work_end_time": "17:00:00",
    "attendance_location": {
      "lat": -6.2615,
      "lng": 106.8106,
      "address": "Jl. Sudirman No. 123, Jakarta Selatan",
      "place_name": "Kantor Pusat"
    },
    "radius_meters": 100,
    "effective_date": "2024-12-01",
    "expiry_date": "2024-12-31",
    "notes": "Jadwal untuk tim marketing"
  }
}
```

#### PUT `/api/attendance-schedules/:id`

- **Deskripsi**: Update jadwal absensi

#### DELETE `/api/attendance-schedules/:id`

- **Deskripsi**: Hapus jadwal absensi

### Absensi

#### GET `/api/absensis`

- **Deskripsi**: Daftar record absensi
- **Query Parameters**:
  - `karyawan`: Filter berdasarkan ID karyawan
  - `tanggal`: Filter berdasarkan tanggal
  - `status_absensi`: Filter berdasarkan status
  - `is_within_radius`: Filter berdasarkan radius
  - `approval_status`: Filter berdasarkan status persetujuan
  - `populate`: Populate relasi

#### POST `/api/absensis`

- **Deskripsi**: Buat record absensi baru (check-in)
- **Request Body**:

```json
{
  "data": {
    "karyawan": 1,
    "tanggal": "2024-12-15",
    "jam_masuk": "2024-12-15T08:30:00.000Z",
    "lokasi_absensi": {
      "check_in_location": {
        "lat": -6.2615,
        "lng": 106.8106,
        "address": "Jl. Sudirman, Jakarta Selatan",
        "accuracy": 10.5
      }
    },
    "foto_absensi": "file_upload_id",
    "keterangan": "Check-in pagi hari"
  }
}
```

#### PUT `/api/absensis/:id`

- **Deskripsi**: Update record absensi (check-out)
- **Request Body**:

```json
{
  "data": {
    "jam_keluar": "2024-12-15T17:30:00.000Z",
    "lokasi_absensi": {
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
    "keterangan": "Check-out dengan lembur"
  }
}
```

## Flow Sistem

### 1. Admin Membuat Jadwal Absensi

1. Admin login ke sistem
2. Navigasi ke menu "Jadwal Absensi"
3. Klik "Tambah Jadwal"
4. Isi form:
   - Pilih karyawan
   - Jam masuk dan keluar
   - Koordinat lokasi absen
   - Radius dalam meter
   - Nama tempat
5. Submit form
6. Sistem validasi dan simpan jadwal

### 2. Karyawan Melakukan Absensi

1. Karyawan buka aplikasi mobile/web
2. Klik "Check-in"
3. Sistem minta izin lokasi GPS
4. Ambil foto selfie
5. Submit data absensi
6. Sistem otomatis:
   - Cari jadwal absensi aktif
   - Hitung jarak dari lokasi target
   - Tentukan status (hadir/terlambat)
   - Set approval status
7. Simpan record absensi

### 3. Check-out dan Lembur

1. Karyawan klik "Check-out"
2. Sistem minta lokasi GPS lagi
3. Submit data check-out
4. Sistem otomatis:
   - Hitung jam lembur
   - Update status ke "lembur" jika ada overtime
   - Simpan lokasi check-out

## Validasi dan Error Handling

### 1. Validasi Koordinat

- Latitude: -90 sampai 90
- Longitude: -180 sampai 180
- Error: "Koordinat tidak valid"

### 2. Validasi Radius

- Minimum: 10 meter
- Maximum: 5000 meter
- Error: "Radius harus antara 10-5000 meter"

### 3. Validasi Jadwal Aktif

- Harus ada jadwal aktif untuk karyawan
- Tanggal efektif <= hari ini
- Tanggal berakhir >= hari ini atau null
- Error: "Tidak ada jadwal absensi aktif untuk karyawan ini"

### 4. Validasi Foto Selfie

- Wajib upload foto
- Format: image only
- Error: "Foto selfie diperlukan"

## Best Practices yang Diterapkan

### 1. Security

- Validasi koordinat untuk mencegah data tidak valid
- Logging semua aktivitas untuk audit trail
- Role-based access control

### 2. Performance

- Menggunakan lifecycle functions instead of custom APIs
- Efficient database queries dengan populate
- Caching untuk jadwal absensi aktif

### 3. User Experience

- Auto-calculation untuk jam lembur
- Status otomatis berdasarkan waktu
- Clear error messages
- Photo verification untuk security

### 4. Data Integrity

- Required fields validation
- Foreign key constraints
- Automatic timestamp updates
- Approval workflow untuk edge cases

## Monitoring dan Logging

### 1. Log Aktivitas

- Pembuatan jadwal absensi
- Update jadwal absensi
- Check-in karyawan
- Check-out karyawan
- Verifikasi lokasi

### 2. Alert System

- Absensi di luar radius
- Karyawan terlambat
- Foto selfie tidak valid
- Koordinat tidak valid

### 3. Audit Trail

- Siapa yang membuat jadwal
- Kapan jadwal dibuat/diupdate
- Siapa yang approve/reject absensi
- History perubahan status

## Deployment Notes

### 1. Environment Variables

```bash
# GPS Settings
DEFAULT_RADIUS_METERS=100
MAX_RADIUS_METERS=5000
MIN_LOCATION_ACCURACY=100

# Time Settings
WORK_START_TIME=08:00
WORK_END_TIME=17:00
LATE_THRESHOLD_MINUTES=30

# File Upload
UPLOAD_MAX_SIZE=5242880  # 5MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
```

### 2. Database Indexes

```sql
-- Attendance Schedule Indexes
CREATE INDEX idx_attendance_schedule_employee_active ON attendance_schedules(employee_id, is_active);
CREATE INDEX idx_attendance_schedule_dates ON attendance_schedules(effective_date, expiry_date);

-- Absensi Indexes
CREATE INDEX idx_absensi_karyawan_tanggal ON absensis(karyawan_id, tanggal);
CREATE INDEX idx_absensi_status ON absensis(status_absensi);
CREATE INDEX idx_absensi_approval ON absensis(approval_status);
```

### 3. Performance Optimization

- Implement Redis caching untuk jadwal aktif
- Use CDN untuk foto selfie storage
- Background jobs untuk report generation
- Database connection pooling

## Testing

### 1. Unit Tests

- Test perhitungan jarak Haversine
- Test penentuan status absensi
- Test perhitungan jam lembur
- Test validasi koordinat

### 2. Integration Tests

- Test flow check-in dengan lokasi valid
- Test flow check-in dengan lokasi invalid
- Test approval workflow
- Test photo upload

### 3. End-to-End Tests

- Test complete admin workflow
- Test complete employee workflow
- Test error scenarios
- Test performance dengan data besar

## Status Implementasi ✅

### **Berhasil Diimplementasikan:**

1. ✅ **Content Type `attendance-schedule`** - Jadwal absensi dengan pengaturan lokasi dan waktu
2. ✅ **Content Type `absensi` (Modified)** - Record absensi dengan verifikasi lokasi dan foto selfie
3. ✅ **Relasi Database** - Karyawan ↔ Jadwal Absensi ↔ Record Absensi
4. ✅ **Lifecycle Functions** - Validasi koordinat, waktu, dan radius
5. ✅ **API Endpoints** - Standard CRUD operations untuk semua content types

### **Testing Berhasil:**

- ✅ **POST** `/api/attendance-schedules` - Membuat jadwal absensi baru
- ✅ **Validasi Data** - Koordinat, waktu kerja, radius, tanggal efektif
- ✅ **Response Format** - Data tersimpan dengan benar dan relasi ter-populate

## Conclusion

Sistem absensi HRM yang diimplementasikan memberikan:

1. **Fleksibilitas**: Admin dapat membuat jadwal berbeda untuk setiap karyawan
2. **Akurasi**: Verifikasi lokasi dengan radius yang dapat disesuaikan
3. **Keamanan**: Foto selfie dan approval workflow
4. **Otomatisasi**: Status dan perhitungan otomatis
5. **Audit Trail**: Logging lengkap untuk monitoring

Implementasi ini menggunakan lifecycle functions Strapi untuk menghindari custom API yang kompleks, sambil tetap memberikan fungsionalitas yang lengkap dan robust.

### **Next Steps:**

1. Test API untuk absensi (check-in/check-out)
2. Implementasi frontend untuk admin dan karyawan
3. Testing end-to-end workflow
4. Deployment dan monitoring
