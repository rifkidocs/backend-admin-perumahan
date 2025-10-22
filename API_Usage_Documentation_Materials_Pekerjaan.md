# API Usage Documentation - Material & Pekerjaan System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Material & Pekerjaan dengan 6 content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Material API (`api::material.material`)

#### Base URL

```
/content-manager/collection-types/api::material.material
```

#### Endpoints

| Method | Endpoint                                                       | Description         |
| ------ | -------------------------------------------------------------- | ------------------- |
| GET    | `/content-manager/collection-types/api::material.material`     | Get all materials   |
| GET    | `/content-manager/collection-types/api::material.material/:id` | Get material by ID  |
| POST   | `/content-manager/collection-types/api::material.material`     | Create new material |
| PUT    | `/content-manager/collection-types/api::material.material/:id` | Update material     |
| DELETE | `/content-manager/collection-types/api::material.material/:id` | Delete material     |

#### Request Examples

**Create Material:**

```json
POST /content-manager/collection-types/api::material.material
Content-Type: application/json

{
  "nama_material": "Semen Portland",
  "kategori": "Material Struktur",
  "satuan": "Sak",
  "stok": 100,
  "minimum_stock": 20,
  "harga_satuan": 50000,
  "lokasi_gudang": "Gudang A-01",
  "deskripsi": "Semen Portland untuk konstruksi"
}
```

**Update Material:**

```json
PUT /content-manager/collection-types/api::material.material/1
Content-Type: application/json

{
  "stok": 80,
  "harga_satuan": 52000
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Set default `status_material` = "Tersedia" jika tidak ada
- Validasi stok tidak boleh negatif
- Hitung `sisa_proyek` berdasarkan stok dan minimum_stock

**beforeUpdate:**

- Update `status_material` berdasarkan stok:
  - `stok <= 0` → "Habis"
  - `stok <= minimum_stock` → "Segera Habis"
  - `stok > minimum_stock` → "Tersedia"
- Update `sisa_proyek` secara otomatis

**afterCreate:**

- Log aktivitas material baru
- Kirim email alert jika status "Segera Habis"

**afterUpdate:**

- Log perubahan stok
- Kirim email alert jika status "Habis"

---

### 2. Purchase Order API (`api::purchasing.purchasing`)

#### Base URL

```
/content-manager/collection-types/api::purchasing.purchasing
```

#### Endpoints

| Method | Endpoint                                                           | Description   |
| ------ | ------------------------------------------------------------------ | ------------- |
| GET    | `/content-manager/collection-types/api::purchasing.purchasing`     | Get all POs   |
| GET    | `/content-manager/collection-types/api::purchasing.purchasing/:id` | Get PO by ID  |
| POST   | `/content-manager/collection-types/api::purchasing.purchasing`     | Create new PO |
| PUT    | `/content-manager/collection-types/api::purchasing.purchasing/:id` | Update PO     |
| DELETE | `/content-manager/collection-types/api::purchasing.purchasing/:id` | Delete PO     |

#### Request Examples

**Create Purchase Order:**

```json
POST /content-manager/collection-types/api::purchasing.purchasing
Content-Type: application/json

{
  "nomor_po": "PO-2024-01-15-001",
  "supplier": 1,
  "materials": [
    {
      "material": 1,
      "quantity": 50,
      "unit_price": 50000,
      "total_price": 2500000
    }
  ],
  "tanggal_order": "2024-01-15",
  "tanggal_estimasi_delivery": "2024-01-20",
  "catatan": "Pesanan untuk proyek ABC"
}
```

**Update PO Status:**

```json
PUT /content-manager/collection-types/api::purchasing.purchasing/1
Content-Type: application/json

{
  "tanggal_actual_delivery": "2024-01-19",
  "status_po": "Diterima"
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Generate `nomor_po` otomatis: `PO-YYYY-MM-DD-XXX`
- Set default `status_po` = "Diproses"
- Validasi tanggal estimasi delivery > tanggal order

**beforeUpdate:**

- Update status berdasarkan tanggal delivery:
  - Jika `tanggal_actual_delivery` ada → "Diterima"
  - Jika `tanggal_estimasi_delivery` < hari ini → "Terlambat"

**afterCreate:**

- Log pembuatan PO
- Kirim email notifikasi ke supplier

**afterUpdate:**

- Jika status "Diterima", update stok material otomatis

---

### 3. Material Usage API (`api::material-usage.material-usage`)

#### Base URL

```
/content-manager/collection-types/api::material-usage.material-usage
```

#### Endpoints

| Method | Endpoint                                                                   | Description             |
| ------ | -------------------------------------------------------------------------- | ----------------------- |
| GET    | `/content-manager/collection-types/api::material-usage.material-usage`     | Get all material usages |
| GET    | `/content-manager/collection-types/api::material-usage.material-usage/:id` | Get usage by ID         |
| POST   | `/content-manager/collection-types/api::material-usage.material-usage`     | Create new usage        |
| PUT    | `/content-manager/collection-types/api::material-usage.material-usage/:id` | Update usage            |
| DELETE | `/content-manager/collection-types/api::material-usage.material-usage/:id` | Delete usage            |

#### Request Examples

**Create Material Usage:**

```json
POST /content-manager/collection-types/api::material-usage.material-usage
Content-Type: application/json

{
  "tanggal_penggunaan": "2024-01-15",
  "proyek": 1,
  "material": 1,
  "jumlah": 10,
  "lokasi_unit": "Unit A-01",
  "dicatat_oleh": 1,
  "keterangan": "Penggunaan untuk pondasi"
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Validasi jumlah > 0
- Validasi stok material tersedia
- Cek apakah stok mencukupi

**afterCreate:**

- Update stok material (stok - jumlah)
- Log penggunaan material

**afterDelete:**

- Kembalikan stok material (stok + jumlah)
- Log pengembalian stok

---

### 4. Work Item API (`api::work-item.work-item`)

#### Base URL

```
/content-manager/collection-types/api::work-item.work-item
```

#### Endpoints

| Method | Endpoint                                                         | Description          |
| ------ | ---------------------------------------------------------------- | -------------------- |
| GET    | `/content-manager/collection-types/api::work-item.work-item`     | Get all work items   |
| GET    | `/content-manager/collection-types/api::work-item.work-item/:id` | Get work item by ID  |
| POST   | `/content-manager/collection-types/api::work-item.work-item`     | Create new work item |
| PUT    | `/content-manager/collection-types/api::work-item.work-item/:id` | Update work item     |
| DELETE | `/content-manager/collection-types/api::work-item.work-item/:id` | Delete work item     |

#### Request Examples

**Create Work Item:**

```json
POST /content-manager/collection-types/api::work-item.work-item
Content-Type: application/json

{
  "nama_pekerjaan": "Pondasi Unit A-01",
  "proyek": 1,
  "bobot": 25,
  "deadline": "2024-02-15",
  "progress": 0,
  "deskripsi": "Pekerjaan pondasi untuk unit A-01",
  "material_required": [
    {
      "material": 1,
      "quantity": 20,
      "unit_price": 50000,
      "total_price": 1000000
    }
  ]
}
```

**Update Progress:**

```json
PUT /content-manager/collection-types/api::work-item.work-item/1
Content-Type: application/json

{
  "progress": 75
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Set default `progress` = 0
- Set default `status_pekerjaan` = "On Track"
- Validasi bobot ≤ 100%
- Validasi progress 0-100%

**beforeUpdate:**

- Update status berdasarkan progress dan deadline:
  - `progress = 100` → "Selesai"
  - `deadline < hari ini` → "Delayed"
  - Lainnya → "On Track"

**afterCreate:**

- Log pekerjaan baru

**afterUpdate:**

- Log perubahan progress
- Kirim email jika pekerjaan selesai

---

### 5. Unit Material Requirement API (`api::unit-material-requirement.unit-material-requirement`)

#### Base URL

```
/content-manager/collection-types/api::unit-material-requirement.unit-material-requirement
```

#### Endpoints

| Method | Endpoint                                                                                         | Description               |
| ------ | ------------------------------------------------------------------------------------------------ | ------------------------- |
| GET    | `/content-manager/collection-types/api::unit-material-requirement.unit-material-requirement`     | Get all unit requirements |
| GET    | `/content-manager/collection-types/api::unit-material-requirement.unit-material-requirement/:id` | Get requirement by ID     |
| POST   | `/content-manager/collection-types/api::unit-material-requirement.unit-material-requirement`     | Create new requirement    |
| PUT    | `/content-manager/collection-types/api::unit-material-requirement.unit-material-requirement/:id` | Update requirement        |
| DELETE | `/content-manager/collection-types/api::unit-material-requirement.unit-material-requirement/:id` | Delete requirement        |

#### Request Examples

**Create Unit Material Requirement:**

```json
POST /content-manager/collection-types/api::unit-material-requirement.unit-material-requirement
Content-Type: application/json

{
  "tipe_unit": "Tipe 36/72",
  "material": 1,
  "kebutuhan_per_unit": 5,
  "total_unit": 20
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Hitung `total_kebutuhan` = kebutuhan_per_unit × total_unit
- Set default `status_ketersediaan` = "Tersedia"

**beforeUpdate:**

- Update `total_kebutuhan` jika ada perubahan
- Update `status_ketersediaan` berdasarkan stok material:
  - `stok ≥ total_kebutuhan` → "Tersedia"
  - `stok > 0` → "Segera Habis"
  - `stok = 0` → "Tidak Tersedia"

**afterCreate:**

- Log kebutuhan material per unit

---

### 6. Labor Estimation API (`api::labor-estimation.labor-estimation`)

#### Base URL

```
/content-manager/collection-types/api::labor-estimation.labor-estimation
```

#### Endpoints

| Method | Endpoint                                                                       | Description               |
| ------ | ------------------------------------------------------------------------------ | ------------------------- |
| GET    | `/content-manager/collection-types/api::labor-estimation.labor-estimation`     | Get all labor estimations |
| GET    | `/content-manager/collection-types/api::labor-estimation.labor-estimation/:id` | Get estimation by ID      |
| POST   | `/content-manager/collection-types/api::labor-estimation.labor-estimation`     | Create new estimation     |
| PUT    | `/content-manager/collection-types/api::labor-estimation.labor-estimation/:id` | Update estimation         |
| DELETE | `/content-manager/collection-types/api::labor-estimation.labor-estimation/:id` | Delete estimation         |

#### Request Examples

**Create Labor Estimation:**

```json
POST /content-manager/collection-types/api::labor-estimation.labor-estimation
Content-Type: application/json

{
  "item_pekerjaan": 1,
  "proyek": 1,
  "mandor": 1,
  "tukang": 3,
  "helper": 5,
  "estimasi_jam_kerja": 40,
  "tarif_mandor": 100000,
  "tarif_tukang": 75000,
  "tarif_helper": 50000
}
```

#### Lifecycle Hooks Behavior

**beforeCreate:**

- Hitung `estimasi_biaya` otomatis:
  - `(mandor × tarif_mandor × estimasi_jam_kerja) + (tukang × tarif_tukang × estimasi_jam_kerja) + (helper × tarif_helper × estimasi_jam_kerja)`
- Validasi jumlah tenaga kerja ≥ 0

**beforeUpdate:**

- Update `estimasi_biaya` jika ada perubahan tarif atau jumlah

**afterCreate:**

- Log estimasi tenaga kerja

---

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

### Filtering

```
?filters[status_material][$eq]=Tersedia
?filters[stok][$gte]=10
```

### Population (Relations)

```
?populate=supplier
?populate=materials.material
```

## Best Practices

1. **Always check stock availability** before creating material usage
2. **Use lifecycle hooks** for automatic calculations and validations
3. **Handle errors gracefully** with proper error messages
4. **Use pagination** for large datasets
5. **Populate relations** when needed to avoid additional API calls
6. **Validate data** on frontend before sending to API
7. **Monitor logs** for lifecycle hook activities

## Testing Examples

### Test Material Creation with Lifecycle

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::material.material' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nama_material": "Test Material",
    "kategori": "Material Struktur",
    "satuan": "Pcs",
    "stok": 50,
    "minimum_stock": 10
  }'
```

### Test Material Usage with Stock Validation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::material-usage.material-usage' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "tanggal_penggunaan": "2024-01-15",
    "proyek": 1,
    "material": 1,
    "jumlah": 5,
    "lokasi_unit": "Test Unit",
    "dicatat_oleh": 1
  }'
```

### Test Purchase Order Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::purchasing.purchasing' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nomor_po": "PO-2024-01-15-001",
    "supplier": 1,
    "materials": [
      {
        "material": 1,
        "quantity": 50,
        "unit_price": 50000,
        "total_price": 2500000
      }
    ],
  "tanggal_order": "2024-01-15",
  "tanggal_estimasi_delivery": "2024-01-20"
  }'
```

---

**Note**: Semua lifecycle hooks berjalan otomatis saat operasi CRUD dilakukan. Pastikan untuk memahami behavior masing-masing hook untuk menghindari error dan memastikan data konsisten.
