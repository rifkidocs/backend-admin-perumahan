# Gudang API

Master data Gudang untuk sistem manajemen material proyek perumahan.

## Overview

Sistem ini mengelola dua jenis gudang:
- **Gudang Induk**: Gudang pusat untuk distribusi material
- **Gudang Proyek**: Gudang lokasi proyek spesifik

## Schema

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `kode_gudang` | String | Yes | Kode unik gudang (auto-generated: GD-XXXX) |
| `nama_gudang` | String | Yes | Nama gudang |
| `jenis_gudang` | Enum | Yes | Jenis gudang (Gudang Induk / Gudang Proyek) |
| `lokasi` | Text | Yes | Lokasi gudang |
| `alamat_lengkap` | Text | No | Alamat lengkap |
| `kapasitas` | Decimal | No | Kapasitas gudang |
| `satuan_kapasitas` | Enum | No | Satuan kapasitas (m³/m²/ton/unit) |
| `kontak_person` | String | No | Kontak person |
| `telepon` | String | No | Nomor telepon |
| `status_gudang` | Enum | Yes | Status gudang (Aktif/Non-Aktif/Maintenance) |
| `keterangan` | Text | No | Keterangan tambahan |
| `is_active` | Boolean | No | Status aktif (default: true) |

### Relations

| Relation | Target | Type | Description |
|----------|--------|------|-------------|
| `proyek_perumahan` | proyek-perumahan | manyToOne | Proyek terkait (untuk gudang proyek) |
| `penerimaan_materials` | penerimaan-material | oneToMany | Daftar penerimaan material |
| `pengeluaran_materials` | pengeluaran-material | oneToMany | Daftar pengeluaran material |
| `stock_opnames` | stock-opname | oneToMany | Daftar stock opname |
| `foto_gudang` | media | multiple | Foto-foto gudang |

## API Endpoints

### Standard CRUD

- `GET /api/gudangs` - Get all gudangs
- `GET /api/gudangs/:id` - Get single gudang
- `POST /api/gudangs` - Create gudang
- `PUT /api/gudangs/:id` - Update gudang
- `DELETE /api/gudangs/:id` - Delete gudang

### Custom Endpoints

- `GET /api/gudangs/jenis/:jenis` - Get gudangs by jenis
- `GET /api/gudangs/active` - Get active gudangs
- `GET /api/gudangs/proyek/:proyekId` - Get gudangs by proyek
- `GET /api/gudangs/stats` - Get gudang statistics

## Usage Examples

### Create Gudang

```javascript
const gudangData = {
  "data": {
    "nama_gudang": "Gudang Proyek Citra Raya",
    "jenis_gudang": "Gudang Proyek",
    "lokasi": "Citra Raya, Tangerang",
    "alamat_lengkap": "Jl. Citra Raya Blok A12, Tangerang, Banten",
    "kapasitas": 500,
    "satuan_kapasitas": "m²",
    "kontak_person": "Supriadi",
    "telepon": "0812-3456-7890",
    "keterangan": "Gudang untuk proyek Citra Raya",
    "proyek_perumahan": 1
  }
};

// POST /api/gudangs
const response = await fetch('/api/gudangs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(gudangData)
});
```

### Get Gudangs by Jenis

```javascript
// GET /api/gudangs/jenis/Gudang%20Induk
const response = await fetch('/api/gudangs/jenis/Gudang%20Induk', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
```

### Get Gudang Statistics

```javascript
// GET /api/gudangs/stats
const response = await fetch('/api/gudangs/stats', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

// Response:
{
  "data": {
    "total_gudang": 10,
    "gudang_induk": 3,
    "gudang_proyek": 7,
    "gudang_aktif": 8
  }
}
```

## Business Logic

### Auto-generated Kode Gudang

Sistem akan otomatis generate kode gudang dengan format:
- `GD-0001`, `GD-0002`, dst.

### Validation Rules

- Kode gudang harus unik
- Nama gudang required (max 255 karakter)
- Lokasi required
- Status gudang default: "Aktif"
- is_active default: true

### Related Operations

Gudang terhubung dengan:
1. **Penerimaan Material**: Setiap penerimaan material harus memilih gudang tujuan
2. **Pengeluaran Material**: Setiap pengeluaran material harus memilih gudang asal
3. **Stock Opname**: Stock opname dilakukan per gudang
4. **Proyek**: Gudang proyek terhubung dengan satu proyek

## Database Migration

Setelah membuat schema, jalankan:

```bash
npm run develop
```

Strapi akan otomatis membuat tabel database berdasarkan schema.

## Seeding Data

Untuk membuat sample data gudang:

```bash
npm run seed:gudang
```

Akan dibuat:
- 3 Gudang Induk (contoh)
- Gudang Proyek (jika ada proyek aktif)

## Permissions

Pastikan role yang appropriate memiliki permissions:
- `find` - Melihat daftar gudang
- `findOne` - Melihat detail gudang
- `create` - Membuat gudang baru
- `update` - Update gudang
- `delete` - Hapus gudang

## Notes

- Gudang tidak dapat dihapus jika memiliki relasi dengan transaksi material
- Status gudang akan mempengaruhi availability di dropdown selection
- Gudang Induk biasanya untuk distribusi material ke Gudang Proyek
- Gudang Proyek selalu terhubung dengan satu proyek spesifik