# API Usage Documentation - Gudang Master (Material)

## Overview

Dokumentasi ini menjelaskan penggunaan API untuk sistem Gudang Master (Data Material) yang digunakan pada halaman `http://localhost:3000/gudang/master`. Fokusnya adalah pengelolaan data material dan relasi supplier (vendor) melalui Strapi Admin Panel. Semua endpoint menggunakan format `/content-manager/collection-types/`.

## Content Types API Endpoints

### 1. Material API (`api::material.material`)

#### Base URL

```
/content-manager/collection-types/api::material.material
```

#### Endpoints

| Method | Endpoint                                              | Description              |
| ------ | ----------------------------------------------------- | ------------------------ |
| GET    | `/content-manager/collection-types/api::material.material`          | Get all materials        |
| GET    | `/content-manager/collection-types/api::material.material/:id`      | Get material by ID       |
| POST   | `/content-manager/collection-types/api::material.material`          | Create new material      |
| PUT    | `/content-manager/collection-types/api::material.material/:id`      | Update material          |
| DELETE | `/content-manager/collection-types/api::material.material/:id`      | Delete material          |

#### Field Referensi (sesuai schema)

- `kode_material` → Kode material unik (opsional, string, max: 50)
- `nama_material` → Nama material (wajib, string, max: 255)
- `kategori` → Kategori (enum: `Struktur`, `Finishing`, `MEP`, `Alat Bantu`)
- `satuan` → Satuan (enum: `sak`, `pcs`, `kg`, `meter`, `batang`, `kaleng`)
- `harga_satuan` → Harga satuan dalam IDR (decimal, min: 0)
- `supplier` → Relasi ke Vendor (`api::vendor.vendor`)
- `stok` → Jumlah stok tersedia (integer, wajib, min: 0)
- `sisa_proyek` → Sisa stok untuk proyek (integer, wajib, min: 0, max: 100)
- `status_material` → Status material (enum: `Tersedia`, `Segera Habis`, `Habis`, default: `Tersedia`)
- `minimum_stock` → Stok minimum (integer, min: 0)
- `lokasi_gudang` → Lokasi penyimpanan (string, max: 255)
- `is_active` → Status aktif (boolean, default: true)
- `deskripsi` → Catatan tambahan
- `foto_material` → Foto material (media, multiple, opsional)

#### Request Examples

**Create Material:**

```json
POST /content-manager/collection-types/api::material.material
Content-Type: application/json

{
  "kode_material": "SMN-001",
  "nama_material": "Semen Portland",
  "kategori": "Struktur",
  "satuan": "sak",
  "harga_satuan": 85000,
  "supplier": 12,
  "stok": 150,
  "sisa_proyek": 80,
  "status_material": "Tersedia",
  "minimum_stock": 20,
  "lokasi_gudang": "Gudang A - Rak 1",
  "is_active": true,
  "deskripsi": "Material untuk pondasi"
}
```

**Update Material (Harga/Stok):**

```json
PUT /content-manager/collection-types/api::material.material/1
Content-Type: application/json

{
  "harga_satuan": 90000,
  "stok": 140,
  "minimum_stock": 25,
  "deskripsi": "Penyesuaian harga supplier"
}
```

---

### 2. Vendor API (`api::vendor.vendor`)

#### Base URL

```
/content-manager/collection-types/api::vendor.vendor
```

#### Endpoints

| Method | Endpoint                                           | Description          |
| ------ | -------------------------------------------------- | -------------------- |
| GET    | `/content-manager/collection-types/api::vendor.vendor`     | Get all vendors      |
| GET    | `/content-manager/collection-types/api::vendor.vendor/:id` | Get vendor by ID     |
| POST   | `/content-manager/collection-types/api::vendor.vendor`     | Create new vendor    |
| PUT    | `/content-manager/collection-types/api::vendor.vendor/:id` | Update vendor        |
| DELETE | `/content-manager/collection-types/api::vendor.vendor/:id` | Delete vendor        |

#### Field Referensi (sesuai schema)

- `nama_perusahaan` → Nama perusahaan vendor (wajib)
- `jenis_layanan` → Jenis layanan (enum: `Sipil`, `Arsitektur`, `Instalasi Listrik`, `Instalasi Air`, `Material`, `Lainnya`)
- `kontak.email` → Email (opsional)
- `kontak.telepon` → Telepon (wajib, format: 08xxxxxxxxx)
- `npwp` → Nomor NPWP (opsional)
- `nomor_rekening` → Nomor rekening (opsional)
- `bank` → Nama bank (opsional)
- `status_kontrak` → Status (enum: `Aktif`, `Tidak Aktif`, `Blacklist`)
- `dokumen_vendor` → Dokumen vendor (komponen, multiple)
- `portofolio` → Media (opsional, upload via endpoint `/upload`)

#### Request Examples

**Create Vendor:**

```json
POST /content-manager/collection-types/api::vendor.vendor
Content-Type: application/json

{
  "nama_perusahaan": "PT Semen Indonesia",
  "jenis_layanan": "Material",
  "kontak": {
    "email": "sales@semen.co.id",
    "telepon": "081234567890"
  },
  "npwp": "12.345.678.9-012.000",
  "nomor_rekening": "1234567890",
  "bank": "BCA",
  "status_kontrak": "Aktif"
}
```

**Update Vendor Status:**

```json
PUT /content-manager/collection-types/api::vendor.vendor/12
Content-Type: application/json

{
  "status_kontrak": "Tidak Aktif"
}
```

**Upload File Portofolio (opsional):**

```bash
curl -X POST \
  'http://localhost:1340/upload' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@/path/to/portfolio.pdf'

# Gunakan ID file yang dihasilkan untuk mengisi field portofolio:
# {
#   "portofolio": [<uploadedFileId>]
# }
```

---

## Relations

- Material → `supplier` (Many-to-One) → `api::vendor.vendor`

## Authentication & Permissions

### Required Headers

```json
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}
```

### Permission Levels

**Public (Read Only):**

- `find` - Get all records
- `findOne` - Get single record

**Authenticated (Full Access):**

- `create` - Create new record
- `update` - Update existing record
- `delete` - Delete record

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Stok tidak boleh negatif"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Material not found"
  }
}
```

**Unauthorized Error (401):**

```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Unauthorized"
  }
}
```

## Query Parameters

### Pagination

```
?pagination[page]=1&pagination[pageSize]=10
```

### Sorting

```
?sort=createdAt:desc
```

### Filtering (contoh umum)

```
?filters[kategori][$eq]=Struktur
?filters[satuan][$eq]=sak
?filters[supplier][id][$eq]=12
?filters[is_active][$eq]=true
```

### Population (Relations)

```
?populate=supplier
```

## Usage Examples

### Status Stok Material

```javascript
// Penentuan status stok berdasarkan ambang minimum
function getMaterialStatus(stock, minStock) {
  if (stock <= 0) return 'Habis';
  if (stock <= minStock) return 'Segera Habis';
  return 'Tersedia';
}
```

### Estimasi Kebutuhan Material per Proyek

```javascript
// Total kebutuhan = kebutuhan per unit * jumlah unit
const calculateTotalRequirement = (kebutuhanPerUnit, totalUnit) => {
  return kebutuhanPerUnit * totalUnit;
};

const kebutuhanSemenPerUnit = 10; // sak
const totalUnit = 36; // rumah
const totalKebutuhan = calculateTotalRequirement(kebutuhanSemenPerUnit, totalUnit);
```

### Validasi Stok

```javascript
// Validasi stok tidak negatif dan di atas ambang minimum
const validateStock = (stock, minimumStock) => {
  if (stock < 0) return false;
  if (stock < minimumStock) return false;
  return true;
};
```

## Best Practices

1. Validasi `stock` dan `price` sebelum create/update
2. Gunakan enum konsisten untuk `category` dan `unit`
3. Simpan supplier sebagai relasi (`vendor`) agar data rapi
4. Gunakan pagination untuk dataset besar
5. Populate relasi `supplier` saat diperlukan
6. Validasi data di frontend sebelum kirim ke API
7. Monitor stok minimum untuk peringatan restock

## Testing Examples

### Test Material Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::material.material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "kode_material": "SMN-001",
    "nama_material": "Semen Portland",
    "kategori": "Struktur",
    "satuan": "sak",
    "harga_satuan": 85000,
    "supplier": 12,
    "stok": 150,
    "sisa_proyek": 100,
    "status_material": "Tersedia",
    "minimum_stock": 20,
    "lokasi_gudang": "Gudang A - Rak 1",
    "is_active": true
  }'
```

### Test Update Stok Material

```bash
curl -X PUT \
  'http://localhost:1340/content-manager/collection-types/api::material.material/1' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "stok": 140,
    "minimum_stock": 25
  }'
```

### Test Vendor Creation

```bash
curl -X POST \
  'http://localhost:1340/content-manager/collection-types/api::vendor.vendor' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nama_perusahaan": "PT Semen Indonesia",
    "jenis_layanan": "Material",
    "kontak": { "email": "sales@semen.co.id", "telepon": "081234567890" },
    "npwp": "12.345.678.9-012.000",
    "nomor_rekening": "1234567890",
    "bank": "BCA",
    "status_kontrak": "Aktif"
  }'
```

---

**Note**: Semua content types menggunakan `draftAndPublish = false`, sehingga data langsung tersimpan tanpa perlu publish. Pastikan untuk memahami relasi antar content types (terutama `supplier`) untuk menjaga konsistensi data dan menghindari error.