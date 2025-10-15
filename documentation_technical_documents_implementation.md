# Dokumentasi Implementasi Backend - Gambar & Dokumen Teknis

## Overview

Implementasi backend untuk sistem manajemen dokumen teknis proyek pembangunan perumahan menggunakan Strapi CMS. Sistem ini mencakup 5 content types utama untuk mengelola berbagai jenis dokumen teknis.

## Content Types yang Diimplementasikan

### 1. Site Plan Document (`site-plan-document`)

**Lokasi**: `src/api/site-plan-document/`

**Schema Fields**:

- `document_name` (String, Required): Nama dokumen site plan
- `file` (Media, Required): File dokumen (PDF, DWG, JPG, PNG)
- `file_format` (Enumeration): PDF, DWG, JPG, PNG
- `file_size` (Decimal): Ukuran file dalam MB
- `version` (String): Versi dokumen (default: "1.0")
- `upload_date` (DateTime): Tanggal upload
- `description` (Text): Deskripsi dokumen
- `status` (Enumeration): draft, active, archived
- `scale` (String): Skala gambar
- `drawing_number` (String): Nomor gambar (auto-generated)
- `revision` (String): Revisi dokumen
- `approved_by` (String): Disetujui oleh
- `approval_date` (Date): Tanggal persetujuan
- `archived_at` (DateTime): Tanggal arsip
- `project` (Relation): Relasi ke proyek perumahan

**Lifecycle Features**:

- Auto-generate drawing number dengan format `SP-XXX`
- Auto-generate version jika tidak disediakan
- Validasi format file
- Validasi status transitions
- Notifikasi ke project manager
- Auto-archive saat status berubah

### 2. Technical Drawing (`technical-drawing`)

**Lokasi**: `src/api/technical-drawing/`

**Schema Fields**:

- `file_name` (String, Required): Nama file gambar kerja
- `category` (Enumeration): Arsitektur, Struktur, MEP
- `file` (Media, Required): File gambar (DWG, PDF, JPG)
- `file_format` (Enumeration): DWG, PDF, JPG
- `file_size` (Decimal): Ukuran file dalam MB
- `version` (String): Versi gambar (default: "1.0")
- `upload_date` (DateTime): Tanggal upload
- `unit_type` (String): Tipe unit terkait
- `status` (Enumeration): draft, active, archived
- `description` (Text): Deskripsi gambar
- `drawing_number` (String): Nomor gambar (auto-generated)
- `revision` (String): Revisi gambar
- `approved_by` (String): Disetujui oleh
- `approval_date` (Date): Tanggal persetujuan
- `archived_at` (DateTime): Tanggal arsip
- `project` (Relation): Relasi ke proyek perumahan

**Lifecycle Features**:

- Auto-generate drawing number berdasarkan kategori (GA-XXX, GS-XXX, GM-XXX)
- Validasi kategori gambar
- Notifikasi ke engineering team
- Auto-archive versi sebelumnya saat update
- Update project progress saat gambar disetujui

### 3. Permit Document (`permit-document`)

**Lokasi**: `src/api/permit-document/`

**Schema Fields**:

- `document_type` (Enumeration): IMB, PBG, Izin Lingkungan, Izin Lainnya
- `document_number` (String, Required): Nomor dokumen (auto-generated)
- `file` (Media, Required): File dokumen
- `issue_date` (Date): Tanggal terbit
- `expiry_date` (Date): Tanggal berlaku
- `status` (Enumeration): active, expired, pending, draft
- `issuing_authority` (String): Instansi penerbit
- `description` (Text): Deskripsi dokumen
- `renewal_date` (Date): Tanggal perpanjangan
- `renewal_status` (Enumeration): not_required, pending, in_progress, completed
- `priority` (Enumeration): low, medium, high, critical
- `is_legal_requirement` (Boolean): Apakah dokumen legal requirement
- `compliance_status` (Enumeration): compliant, non_compliant, pending_review
- `project` (Relation): Relasi ke proyek perumahan

**Lifecycle Features**:

- Validasi format nomor dokumen sesuai standar
- Auto-generate nomor dokumen berdasarkan tipe
- Auto-set priority berdasarkan tipe dokumen
- Notifikasi ke legal team
- Auto-schedule expiry reminder (30 hari sebelum berakhir)
- Auto-set status expired jika melewati tanggal berlaku
- Validasi status transitions

### 4. BOQ Document (`boq-document`)

**Lokasi**: `src/api/boq-document/`

**Schema Fields**:

- `document_name` (String, Required): Nama dokumen BOQ/RAB
- `document_type` (Enumeration): RAB, BOQ Material, BOQ Infrastruktur
- `file` (Media, Required): File dokumen
- `unit_type` (String): Tipe unit terkait
- `total_amount` (Decimal): Total nilai dalam Rupiah
- `revision` (String): Revisi dokumen (default: "01")
- `creation_date` (Date): Tanggal pembuatan
- `status` (Enumeration): draft, approved, active, archived
- `description` (Text): Deskripsi dokumen
- `currency` (Enumeration): IDR, USD
- `approved_by` (String): Disetujui oleh
- `approval_date` (Date): Tanggal persetujuan
- `archived_at` (DateTime): Tanggal arsip
- `version` (String): Versi dokumen (default: "1.0")
- `project` (Relation): Relasi ke proyek perumahan
- `unit_rumah` (Relation): Relasi ke unit rumah

**Lifecycle Features**:

- Auto-generate revision jika tidak disediakan
- Validasi tipe dokumen BOQ
- Format total amount dari string ke decimal
- Notifikasi ke finance team
- Auto-create RAB entry untuk dokumen RAB
- Update budget allocation saat amount berubah
- Validasi status transitions
- Auto-archive revisi sebelumnya

### 5. Handover Document (`handover-document`)

**Lokasi**: `src/api/handover-document/`

**Schema Fields**:

- `document_name` (String, Required): Nama dokumen serah terima
- `document_type` (Enumeration): BAST, Check List, Dokumen Garansi
- `unit` (String): Unit/blok terkait
- `buyer_name` (String): Nama pembeli
- `file` (Media, Required): File dokumen
- `handover_date` (Date): Tanggal serah terima
- `status` (Enumeration): draft, signed, complete, active
- `signature_required` (Boolean): Apakah perlu tanda tangan
- `signature_file` (Media): File tanda tangan
- `description` (Text): Deskripsi dokumen
- `warranty_period` (Integer): Periode garansi dalam bulan (default: 12)
- `warranty_start_date` (Date): Tanggal mulai garansi
- `warranty_end_date` (Date): Tanggal berakhir garansi
- `completion_checklist` (JSON): Checklist penyelesaian
- `notes` (Text): Catatan
- `project` (Relation): Relasi ke proyek perumahan
- `unit_rumah` (Relation): Relasi ke unit rumah
- `konsumen` (Relation): Relasi ke konsumen

**Lifecycle Features**:

- Validasi tipe dokumen serah terima
- Auto-set signature required untuk BAST
- Validasi tanggal serah terima tidak boleh masa depan
- Auto-set warranty dates untuk dokumen garansi
- Notifikasi ke sales team
- Auto-create task untuk penyelesaian dokumen
- Update unit status saat dokumen complete
- Validasi signature requirement
- Complete related tasks saat dokumen selesai

## API Endpoints

Semua content types menggunakan endpoint Strapi standar:

### Site Plan Documents

- `GET /api/site-plan-documents` - List site plan documents
- `POST /api/site-plan-documents` - Create site plan document
- `GET /api/site-plan-documents/:id` - Get specific site plan document
- `PUT /api/site-plan-documents/:id` - Update site plan document
- `DELETE /api/site-plan-documents/:id` - Delete site plan document

### Technical Drawings

- `GET /api/technical-drawings` - List technical drawings
- `POST /api/technical-drawings` - Create technical drawing
- `GET /api/technical-drawings/:id` - Get specific technical drawing
- `PUT /api/technical-drawings/:id` - Update technical drawing
- `DELETE /api/technical-drawings/:id` - Delete technical drawing

### Permit Documents

- `GET /api/permit-documents` - List permit documents
- `POST /api/permit-documents` - Create permit document
- `GET /api/permit-documents/:id` - Get specific permit document
- `PUT /api/permit-documents/:id` - Update permit document
- `DELETE /api/permit-documents/:id` - Delete permit document

### BOQ Documents

- `GET /api/boq-documents` - List BOQ documents
- `POST /api/boq-documents` - Create BOQ document
- `GET /api/boq-documents/:id` - Get specific BOQ document
- `PUT /api/boq-documents/:id` - Update BOQ document
- `DELETE /api/boq-documents/:id` - Delete BOQ document

### Handover Documents

- `GET /api/handover-documents` - List handover documents
- `POST /api/handover-documents` - Create handover document
- `GET /api/handover-documents/:id` - Get specific handover document
- `PUT /api/handover-documents/:id` - Update handover document
- `DELETE /api/handover-documents/:id` - Delete handover document

## Integrasi dengan Sistem Existing

### 1. Project Management

- Semua dokumen terkait dengan `proyek-perumahan`
- Update project timeline saat dokumen disetujui
- Update project last modified date

### 2. Budget Management

- BOQ documents terintegrasi dengan `rab` content type
- Auto-create RAB entry untuk dokumen RAB
- Update budget allocation saat amount berubah

### 3. Unit Management

- Handover documents terintegrasi dengan `unit-rumah`
- Update unit status saat handover complete
- Terintegrasi dengan `konsumen` untuk buyer information

### 4. Notification System

- Menggunakan `notification` service untuk notifikasi
- Notifikasi berdasarkan priority dan type
- Graceful handling jika notification service tidak tersedia

### 5. Task Management

- Terintegrasi dengan `laporan-kegiatan` untuk task management
- Auto-create tasks untuk dokumen yang perlu diselesaikan
- Complete tasks saat dokumen selesai

### 6. Reminder System

- Terintegrasi dengan `reminder` service untuk expiry reminders
- Auto-schedule reminders untuk dokumen perizinan
- Clean up reminders saat dokumen dihapus

## Validasi dan Keamanan

### 1. File Validation

- Validasi format file sesuai dengan content type
- Validasi ukuran file (menggunakan konfigurasi upload)
- Clean up files saat dokumen dihapus

### 2. Status Transitions

- Validasi status transitions untuk setiap content type
- Mencegah perubahan status yang tidak valid
- Auto-set status berdasarkan kondisi tertentu

### 3. Data Integrity

- Auto-generate nomor dokumen untuk konsistensi
- Validasi tanggal dan periode
- Mencegah penghapusan dokumen aktif

### 4. Error Handling

- Graceful handling untuk service yang tidak tersedia
- Comprehensive error messages dalam Bahasa Indonesia
- Logging untuk debugging dan monitoring

## Konfigurasi File Upload

File upload menggunakan konfigurasi Strapi standar dengan limit 100MB:

```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      sizeLimit: 100 * 1024 * 1024, // 100MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      provider: "local",
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024,
      },
    },
  },
};
```

## Permissions

Menggunakan sistem permission Strapi standar:

### Public Access

- `find` - Read access to published documents
- `findOne` - Read access to specific published documents

### Authenticated Users

- `find` - Read access to all documents
- `findOne` - Read access to specific documents
- `create` - Create documents (dengan validasi)
- `update` - Update documents (dengan status validation)
- `delete` - Delete documents (dengan status validation)

### Admin Access

- Full CRUD access to all documents
- Bypass status validation
- Access to archived documents

## Monitoring dan Logging

### 1. Activity Logging

- Log semua operasi CRUD
- Log status changes dan version updates
- Log error dan warning messages

### 2. Performance Monitoring

- Monitor file upload operations
- Track document processing time
- Monitor integration service calls

### 3. Compliance Tracking

- Track document expiry dates
- Monitor renewal requirements
- Track approval workflows

## Testing dan Deployment

### 1. Unit Testing

- Test lifecycle hooks
- Test validation logic
- Test integration points

### 2. Integration Testing

- Test API endpoints
- Test file upload functionality
- Test notification system

### 3. Deployment

- Database migrations untuk schema changes
- File system permissions untuk uploads
- Environment configuration untuk services

## Maintenance dan Support

### 1. Data Migration

- Migration script untuk existing documents
- Backup strategy untuk dokumen penting
- Archive strategy untuk dokumen lama

### 2. Performance Optimization

- Index optimization untuk queries
- File storage optimization
- Caching strategy untuk frequently accessed documents

### 3. Monitoring

- Health checks untuk services
- Performance metrics
- Error rate monitoring

## Kesimpulan

Implementasi backend untuk sistem manajemen dokumen teknis telah selesai dengan fitur-fitur berikut:

1. **5 Content Types** lengkap dengan schema dan lifecycle hooks
2. **Integrasi** dengan sistem existing (project, budget, unit, notification)
3. **Validasi** komprehensif untuk data integrity
4. **Error handling** yang robust dengan graceful degradation
5. **Logging** dan monitoring untuk maintenance
6. **API endpoints** standar Strapi tanpa custom API
7. **Permission system** yang fleksibel
8. **File management** yang aman dan efisien

Sistem ini siap untuk production dengan konfigurasi yang sesuai dengan kebutuhan proyek pembangunan perumahan.
