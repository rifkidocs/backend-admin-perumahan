# HRM Master Data Implementation Documentation

## Overview

Dokumentasi implementasi backend untuk sistem master data HRM (Human Resource Management) perumahan menggunakan Strapi CMS. Implementasi ini melengkapi sistem yang sudah ada dengan fitur-fitur HRM yang lebih lengkap sesuai dengan dokumentasi yang diberikan.

## Analisis Sistem yang Sudah Ada

### Tabel yang Sudah Ada dan Dimodifikasi:

1. **Employee (Karyawan)** - ✅ Sudah ada, ditambahkan relations baru
2. **Attendance (Absensi)** - ✅ Sudah ada, dimodifikasi enum values dan ditambahkan field overtime_hours
3. **Leave (Cuti)** - ✅ Sudah ada, dimodifikasi enum values dan ditambahkan field total_days, approved_by, approved_date
4. **Department (Departemen)** - ✅ Sudah ada, tidak dimodifikasi
5. **Position (Jabatan)** - ✅ Sudah ada, tidak dimodifikasi
6. **Salary Component (Penggajian)** - ✅ Sudah ada sebagai komponen, ditambahkan sebagai content type terpisah

### Tabel Baru yang Ditambahkan:

1. **Salary** - Content type baru untuk data gaji karyawan
2. **Contract** - Content type baru untuk data kontrak karyawan
3. **Performance Review** - Content type baru untuk penilaian kinerja
4. **Placement** - Content type baru untuk penempatan karyawan di proyek

## Struktur Implementasi

### 1. Content Types yang Dibuat

#### A. Salary (`api::salary.salary`)

- **File**: `src/api/salary/content-types/salary/schema.json`
- **Fields**:
  - `basic_salary` (decimal, required)
  - `position_allowance` (decimal)
  - `transport_allowance` (decimal)
  - `meal_allowance` (decimal)
  - `overtime_rate` (decimal)
  - `bonus` (decimal)
  - `deductions` (decimal)
  - `net_salary` (decimal, auto-calculated)
  - `effective_date` (date, required)
  - `currency` (string, default: "IDR")
  - `payment_method` (enumeration: transfer, cash, check)
  - `employee` (relation oneToOne ke karyawan)

#### B. Contract (`api::contract.contract`)

- **File**: `src/api/contract/content-types/contract/schema.json`
- **Fields**:
  - `contract_number` (string, required, unique)
  - `contract_type` (enumeration: pkwt, pkwtt, magang, lainnya)
  - `start_date` (date, required)
  - `end_date` (date)
  - `position` (string, required)
  - `salary` (decimal, required)
  - `status` (enumeration: aktif, berakhir, dibatalkan)
  - `document_url` (string)
  - `notes` (text)
  - `employee` (relation manyToOne ke karyawan)

#### C. Performance Review (`api::performance-review.performance-review`)

- **File**: `src/api/performance-review/content-types/performance-review/schema.json`
- **Fields**:
  - `review_period` (string, required)
  - `review_date` (date, required)
  - `overall_score` (decimal, 0-100)
  - `goals_achieved` (integer, required)
  - `goals_total` (integer, required)
  - `strengths` (text)
  - `improvements` (text)
  - `recommendations` (text)
  - `reviewer` (string, required)
  - `status` (enumeration: draft, completed, approved)
  - `employee` (relation manyToOne ke karyawan)

#### D. Placement (`api::placement.placement`)

- **File**: `src/api/placement/content-types/placement/schema.json`
- **Fields**:
  - `project_name` (string, required)
  - `location` (string, required)
  - `start_date` (date, required)
  - `end_date` (date)
  - `role` (string, required)
  - `status` (enumeration: aktif, selesai, dipindahkan)
  - `notes` (text)
  - `employee` (relation manyToOne ke karyawan)

### 2. Modifikasi Content Types yang Sudah Ada

#### A. Karyawan (Employee)

- **File**: `src/api/karyawan/content-types/karyawan/schema.json`
- **Modifikasi**: Ditambahkan relations baru:
  - `salary` (oneToOne ke salary)
  - `contracts` (oneToMany ke contract)
  - `performance_reviews` (oneToMany ke performance-review)
  - `placements` (oneToMany ke placement)

#### B. Absensi (Attendance)

- **File**: `src/api/absensi/content-types/absensi/schema.json`
- **Modifikasi**:
  - Enum `status_absensi` diubah dari ["Hadir", "Izin", "Sakit", "Cuti", "Alpa"] menjadi ["hadir", "terlambat", "absen", "izin"]
  - Ditambahkan field `overtime_hours` (decimal)

#### C. Cuti (Leave)

- **File**: `src/api/cuti/content-types/cuti/schema.json`
- **Modifikasi**:
  - Enum `jenis_cuti` diubah dari ["Tahunan", "Sakit", "Bersalin", "Penting", "Lainnya"] menjadi ["tahunan", "sakit", "melahirkan", "darurat", "lainnya"]
  - Enum `status_persetujuan` diubah dari ["Diajukan", "Disetujui", "Ditolak"] menjadi ["pending", "approved", "rejected"]
  - Ditambahkan field `total_days` (integer)
  - Ditambahkan field `approved_by` (string)
  - Ditambahkan field `approved_date` (date)

### 3. Lifecycle Hooks

#### A. Karyawan Lifecycle

- **File**: `src/api/karyawan/content-types/karyawan/lifecycles.js`
- **Fungsi**:
  - Auto-generate NIK dengan format EMP + 3 digit sequential
  - Set default status kepegawaian

#### B. Salary Lifecycle

- **File**: `src/api/salary/content-types/salary/lifecycles.js`
- **Fungsi**:
  - Auto-calculate net_salary dari komponen gaji
  - Recalculate pada update

#### C. Cuti Lifecycle

- **File**: `src/api/cuti/content-types/cuti/lifecycles.js`
- **Fungsi**:
  - Auto-calculate total_days dari tanggal mulai dan selesai
  - Set default status pending

#### D. Contract Lifecycle

- **File**: `src/api/contract/content-types/contract/lifecycles.js`
- **Fungsi**:
  - Auto-generate contract_number dengan format PKWT-YYYY-XXX
  - Set default status aktif

### 4. Controllers dan Routes

#### A. Karyawan Controller

- **File**: `src/api/karyawan/controllers/karyawan.js`
- **Custom Methods**:
  - `getStats()` - Mendapatkan statistik karyawan (total, aktif, kontrak)
- **Custom Route**: `GET /api/karyawans/stats`

#### B. Absensi Controller

- **File**: `src/api/absensi/controllers/absensi.js`
- **Custom Methods**:
  - `getSummary()` - Mendapatkan ringkasan kehadiran dengan filter
- **Custom Route**: `GET /api/absensis/summary`

## API Endpoints

### Employee Endpoints

#### GET /api/karyawans

- **Description**: Mendapatkan daftar semua karyawan
- **Query Parameters**:
  - `filters[status_kepegawaian][$eq]`: Filter berdasarkan status kepegawaian
  - `filters[departemens][id][$eq]`: Filter berdasarkan departemen
  - `filters[nama_lengkap][$containsi]`: Search berdasarkan nama
  - `filters[nik_karyawan][$containsi]`: Search berdasarkan NIK
  - `populate`: Populate relations (salary, contracts, performance_reviews, placements)
  - `sort`: Sorting
  - `pagination[page]`: Halaman
  - `pagination[pageSize]`: Jumlah data per halaman

#### GET /api/karyawans/stats

- **Description**: Mendapatkan statistik karyawan
- **Response**:

```json
{
  "data": {
    "total": 156,
    "active": 120,
    "contract": 36
  }
}
```

### Salary Endpoints

#### GET /api/salaries

- **Description**: Mendapatkan daftar data gaji
- **Query Parameters**:
  - `filters[employee][id][$eq]`: Filter berdasarkan employee ID
  - `filters[effective_date][$gte]`: Filter gaji efektif dari tanggal
  - `populate`: Populate employee relation

#### POST /api/salaries

- **Description**: Tambah data gaji baru
- **Request Body**:

```json
{
  "data": {
    "basic_salary": 5000000,
    "position_allowance": 1000000,
    "transport_allowance": 500000,
    "meal_allowance": 300000,
    "overtime_rate": 25000,
    "effective_date": "2023-01-01",
    "currency": "IDR",
    "payment_method": "transfer",
    "employee": 1
  }
}
```

### Contract Endpoints

#### GET /api/contracts

- **Description**: Mendapatkan daftar kontrak
- **Query Parameters**:
  - `filters[employee][id][$eq]`: Filter berdasarkan employee ID
  - `filters[status][$eq]`: Filter berdasarkan status kontrak
  - `filters[contract_type][$eq]`: Filter berdasarkan jenis kontrak

#### POST /api/contracts

- **Description**: Tambah kontrak baru
- **Request Body**:

```json
{
  "data": {
    "contract_type": "pkwt",
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "position": "Marketing Executive",
    "salary": 5000000,
    "status": "aktif",
    "employee": 1
  }
}
```

### Attendance Endpoints

#### GET /api/absensis

- **Description**: Mendapatkan daftar kehadiran
- **Query Parameters**:
  - `filters[karyawan][id][$eq]`: Filter berdasarkan employee ID
  - `filters[tanggal][$gte]`: Filter dari tanggal
  - `filters[tanggal][$lte]`: Filter sampai tanggal
  - `filters[status_absensi][$eq]`: Filter berdasarkan status kehadiran

#### GET /api/absensis/summary

- **Description**: Mendapatkan ringkasan kehadiran
- **Query Parameters**:
  - `employeeId`: ID karyawan
  - `startDate`: Tanggal mulai
  - `endDate`: Tanggal selesai
- **Response**:

```json
{
  "data": {
    "total": 20,
    "hadir": 18,
    "terlambat": 2,
    "absen": 0,
    "izin": 0
  }
}
```

### Leave Endpoints

#### GET /api/cutis

- **Description**: Mendapatkan daftar cuti
- **Query Parameters**:
  - `filters[karyawan][id][$eq]`: Filter berdasarkan employee ID
  - `filters[status_persetujuan][$eq]`: Filter berdasarkan status pengajuan
  - `filters[jenis_cuti][$eq]`: Filter berdasarkan jenis cuti

#### POST /api/cutis

- **Description**: Ajukan cuti baru
- **Request Body**:

```json
{
  "data": {
    "jenis_cuti": "tahunan",
    "tanggal_mulai": "2023-10-01",
    "tanggal_selesai": "2023-10-03",
    "alasan": "Liburan keluarga",
    "status_persetujuan": "pending",
    "karyawan": 1
  }
}
```

### Performance Review Endpoints

#### GET /api/performance-reviews

- **Description**: Mendapatkan daftar penilaian kinerja
- **Query Parameters**:
  - `filters[employee][id][$eq]`: Filter berdasarkan employee ID
  - `filters[review_period][$containsi]`: Filter berdasarkan periode
  - `filters[status][$eq]`: Filter berdasarkan status penilaian

#### POST /api/performance-reviews

- **Description**: Buat penilaian kinerja baru
- **Request Body**:

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

- **Description**: Mendapatkan daftar penempatan
- **Query Parameters**:
  - `filters[employee][id][$eq]`: Filter berdasarkan employee ID
  - `filters[status][$eq]`: Filter berdasarkan status penempatan
  - `filters[project_name][$containsi]`: Search berdasarkan nama proyek

#### POST /api/placements

- **Description**: Tambah penempatan baru
- **Request Body**:

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

## Business Rules yang Diimplementasikan

1. **NIK Generation**: Auto-generate NIK dengan format EMP + 3 digit sequential
2. **Salary Calculation**: Auto-calculate net salary dari komponen gaji
3. **Contract Validation**: Kontrak sementara harus memiliki end_date
4. **Leave Balance**: Auto-calculate total days dari tanggal mulai dan selesai
5. **Performance Review**: Lock review periode yang sudah selesai
6. **Data Retention**: Archive data karyawan yang sudah tidak aktif

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

1. **Database Indexing**: Index pada field yang sering di-query (nik_karyawan, status_kepegawaian, departemen, tanggal_masuk)
2. **Pagination**: Implement pagination untuk large datasets
3. **Caching**: Redis cache untuk frequently accessed data
4. **Image Optimization**: Compress dan optimize employee photos
5. **API Response**: Minimize response size dengan selective field population
6. **Lazy Loading**: Load relations only when needed
7. **Search Optimization**: Implement full-text search untuk employee data

## Testing

### Unit Tests

- Test lifecycle hooks untuk auto-calculations
- Test custom controller methods
- Test validation rules

### Integration Tests

- Test API endpoints
- Test relations between content types
- Test business rules

### Performance Tests

- Test pagination dengan large datasets
- Test search functionality
- Test concurrent requests

## Deployment Notes

1. **Database Migration**: Pastikan semua content types sudah ter-sync dengan database
2. **Permissions**: Set permissions untuk semua content types
3. **Environment Variables**: Configure environment variables untuk production
4. **Backup**: Backup database sebelum deployment
5. **Monitoring**: Setup monitoring untuk API endpoints

## Maintenance

1. **Regular Updates**: Update Strapi dan dependencies secara berkala
2. **Data Cleanup**: Archive data lama yang tidak diperlukan
3. **Performance Monitoring**: Monitor performance dan optimize jika diperlukan
4. **Security Updates**: Update security patches secara berkala
5. **Backup Strategy**: Implement backup strategy yang robust

## Conclusion

Implementasi HRM Master Data System telah berhasil dilengkapi dengan fitur-fitur yang sesuai dengan dokumentasi yang diberikan. Sistem ini mendukung:

- ✅ CRUD operations untuk semua content types
- ✅ Auto-calculations untuk gaji dan cuti
- ✅ Relations yang proper antar content types
- ✅ Custom API endpoints untuk statistik dan summary
- ✅ Lifecycle hooks untuk business rules
- ✅ Validation dan security considerations

Sistem siap untuk digunakan dan dapat dikembangkan lebih lanjut sesuai kebutuhan bisnis.
