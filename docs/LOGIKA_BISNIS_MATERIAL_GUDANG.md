# Dokumentasi Logika Bisnis - Sistem Manajemen Material & Gudang

## Overview

Sistem ini mengelola inventaris material konstruksi dengan tracking lengkap untuk penerimaan, pengeluaran, distribusi antar gudang, dan stock opname.

## Entitas Utama

### 1. Gudang

- **Jenis**: Gudang Induk, Gudang Proyek
- **Fungsi**: Lokasi penyimpanan material
- **Relasi**: Memiliki banyak Material, Penerimaan, Pengeluaran, Distribusi, Stock Opname

### 2. Material

- **Kode Material**: Tidak unik (dapat sama di berbagai gudang)
- **Stok**: Jumlah material di gudang tertentu
- **Lokasi Gudang**: Relasi ke Gudang
- **Catatan Penting**: Satu kode material dapat memiliki beberapa record untuk gudang yang berbeda

### 3. Penerimaan Material

- **Fungsi**: Mencatat material masuk dari supplier
- **Status**: pending, in-progress, completed, rejected
- **Trigger Stock**: Saat status = 'completed'

### 4. Pengeluaran Material

- **Fungsi**: Mencatat material keluar untuk proyek/unit
- **Status Approval**: pending, approved, rejected
- **Status Issuance**: pending, in-transit, delivered
- **Trigger Stock**: Saat approvalStatus = 'approved' atau status_issuance = 'delivered'

### 5. Distribusi Material

- **Fungsi**: Transfer material antar gudang
- **Status**: Pending, Dikirim, Diterima, Ditolak
- **Trigger Stock**: Saat status = 'Diterima'

### 6. Stock Opname

- **Fungsi**: Validasi stok fisik vs sistem
- **Status**: Draft, In Progress, Completed, Reviewed
- **Trigger Stock**: Saat status = 'Completed' atau 'Reviewed'

## Logika Sinkronisasi Stok

### A. Penerimaan Material (Inbound)

**Trigger**: `statusReceiving = 'completed'`

**Proses**:

1. Ambil data material yang diterima
2. Tambahkan `quantity` ke `stok` material
3. Update record Material

**Contoh**:

```
Material: Semen (Gudang Induk)
Stok Awal: 100 sak
Penerimaan: 50 sak (status: completed)
Stok Akhir: 150 sak
```

### B. Pengeluaran Material (Outbound)

**Trigger**: `approvalStatus = 'approved'` ATAU `status_issuance = 'delivered'`

**Proses**:

1. Ambil data material yang dikeluarkan
2. Kurangi `quantity` dari `stok` material
3. Cegah stok negatif (minimum 0)
4. Update record Material

**Contoh**:

```
Material: Bata Merah (Gudang Proyek A)
Stok Awal: 1000 buah
Pengeluaran: 200 buah (status: delivered)
Stok Akhir: 800 buah
```

### C. Distribusi Material (Transfer)

**Trigger**: `status = 'Diterima'`

**Proses**:

1. **Validasi** (beforeCreate):

   - Cek stok di gudang asal mencukupi
   - Jika tidak, lempar error

2. **Transfer** (afterUpdate saat status = 'Diterima'):
   - **Gudang Asal**: Kurangi stok material
   - **Gudang Tujuan**:
     - Cari material dengan `kode_material` yang sama di gudang tujuan
     - **Jika ditemukan**: Tambahkan stok
     - **Jika tidak ditemukan**: Buat record Material baru dengan stok awal = jumlah distribusi

**Contoh 1 - Material Sudah Ada di Tujuan**:

```
Distribusi: Semen 50kg dari Gudang Induk ke Gudang Proyek A
Jumlah: 100 sak

Gudang Induk - Semen 50kg:
  Stok Awal: 500 sak
  Stok Akhir: 400 sak

Gudang Proyek A - Semen 50kg (sudah ada):
  Stok Awal: 50 sak
  Stok Akhir: 150 sak
```

**Contoh 2 - Material Belum Ada di Tujuan**:

```
Distribusi: Cat Tembok Putih dari Gudang Induk ke Gudang Proyek B
Jumlah: 20 kaleng

Gudang Induk - Cat Tembok Putih:
  Stok Awal: 100 kaleng
  Stok Akhir: 80 kaleng

Gudang Proyek B - Cat Tembok Putih (baru dibuat):
  Stok Awal: 0 kaleng
  Stok Akhir: 20 kaleng (record baru otomatis dibuat)
```

### D. Stock Opname (Adjustment)

**Trigger**: `status_opname = 'Completed'` ATAU `status_opname = 'Reviewed'`

**Proses**:

1. Ambil semua `stock_opname_items` dari stock opname
2. Untuk setiap item:
   - Ambil `physical_stock` (hasil perhitungan fisik)
   - Update `stok` material = `physical_stock`
   - Catat selisih untuk audit

**Contoh**:

```
Stock Opname di Gudang Proyek A:

Item 1: Pasir
  System Stock: 10 m³
  Physical Stock: 9.5 m³
  Difference: -0.5 m³
  → Stok diupdate menjadi 9.5 m³

Item 2: Keramik 40x40
  System Stock: 500 dus
  Physical Stock: 520 dus
  Difference: +20 dus
  → Stok diupdate menjadi 520 dus
```

## Use Case & Solusi

### UC1: Kode Material yang Sama di Berbagai Gudang

**Masalah**: Semen 01 ada di Gudang Induk dan Gudang Proyek

**Solusi**:

- Buat 2 record Material terpisah dengan `kode_material` yang sama
- Bedakan dengan `lokasi_gudang`
- Constraint `unique` pada `kode_material` telah dihapus

**Implementasi**:

```
Record 1:
  kode_material: "SEM-001"
  nama_material: "Semen Portland 50kg"
  lokasi_gudang: Gudang Induk (ID: 1)
  stok: 500

Record 2:
  kode_material: "SEM-001"
  nama_material: "Semen Portland 50kg"
  lokasi_gudang: Gudang Proyek A (ID: 5)
  stok: 100
```

### UC2: Penerimaan Material Baru dari Supplier

**Masalah**: Bagaimana cara membuat material baru saat penerimaan?

**Solusi**:

- **Manual**: Admin membuat Material terlebih dahulu di Master Material
- **Otomatis** (opsional, belum diimplementasi): Lifecycle bisa auto-create material jika belum ada

**Rekomendasi**: Gunakan cara manual untuk kontrol lebih baik

### UC3: Stok Habis, Cara Restock

**Masalah**: Jika stok = 0, apakah bisa diisi lagi?

**Solusi**:

- **YA**, record Material tetap ada
- Lakukan Penerimaan Material baru atau Distribusi dari gudang lain
- Stok akan otomatis bertambah
- **TIDAK** perlu membuat kode material baru

**Contoh**:

```
Material: Paku 5cm (Gudang Proyek B)
Stok: 0 kg

Aksi: Distribusi dari Gudang Induk sebanyak 10 kg
Hasil: Stok menjadi 10 kg (record yang sama diupdate)
```

### UC4: Tracking History Transaksi

**Solusi**:

- Setiap transaksi (Penerimaan, Pengeluaran, Distribusi, Stock Opname) tersimpan sebagai record terpisah
- Relasi ke Material dan Gudang memungkinkan query history
- Bisa dibuat report berdasarkan:
  - Tanggal
  - Gudang
  - Material
  - Jenis transaksi

## Keamanan & Validasi

### Validasi Stok

1. **Pengeluaran**: Sistem akan warning jika stok tidak cukup (tapi tetap diproses dengan stok minimum 0)
2. **Distribusi**: Sistem akan **reject** jika stok gudang asal tidak mencukupi
3. **Stock Opname**: Tidak ada validasi, karena ini adalah sumber kebenaran dari perhitungan fisik

### Pencegahan Stok Negatif

- Pengeluaran Material: `Math.max(0, newStock)`
- Distribusi Material: Validasi di `beforeCreate`

## Diagram Alur

### Alur Distribusi Material

```
1. User membuat Distribusi (status: Pending)
   ↓
2. Sistem validasi stok di gudang asal
   ↓ (jika cukup)
3. Status diubah ke "Dikirim"
   ↓
4. Status diubah ke "Diterima"
   ↓
5. Lifecycle triggered:
   - Kurangi stok di gudang asal
   - Cari material di gudang tujuan
     ├─ Jika ada: Tambah stok
     └─ Jika tidak ada: Buat material baru
```

### Alur Stock Opname

```
1. User membuat Stock Opname (status: Draft)
   ↓
2. User menambahkan items dengan physical count
   ↓
3. Status diubah ke "Completed"
   ↓
4. Lifecycle triggered:
   - Untuk setiap item:
     Update stok material = physical_stock
```

## Catatan Penting

1. **Lifecycle Hooks**: Semua sinkronisasi stok terjadi otomatis via Strapi lifecycles
2. **Idempotency**: Hati-hati dengan update berulang - lifecycle bisa trigger multiple kali jika tidak dicek dengan benar
3. **Rollback**: Sistem ini tidak otomatis rollback jika ada kesalahan. Gunakan Stock Opname untuk koreksi
4. **Audit Trail**: Semua transaksi tersimpan, bisa digunakan untuk audit

## Pengembangan Selanjutnya

1. **Notifikasi**: Alert saat stok mencapai minimum_stock
2. **Approval Workflow**: Multi-level approval untuk distribusi
3. **Barcode/QR**: Scanning untuk stock opname
4. **Dashboard**: Visualisasi stok real-time per gudang
5. **Report**: Laporan mutasi stok, aging analysis, dll
