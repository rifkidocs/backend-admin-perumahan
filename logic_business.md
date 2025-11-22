# Dokumentasi Logika Bisnis Sistem Pergudangan

**Versi**: 1.0

**Penulis**: Muhammad Rifki Ardiansah (dibantu ChatGPT)

**Ringkasan singkat**
Dokumentasi ini menjabarkan logika bisnis untuk sistem pergudangan yang mencakup entitas: Gudang, Material, MaterialGudang (stok per gudang), Penerimaan Material, Pengeluaran Material, Distribusi, Progress Harian, dan Stock Opname. Tujuan: memastikan alur stok jelas, akurat, dan mudah dilacak untuk kebutuhan proyek konstruksi.

---

## 1. Entitas (Content Types / Tabel)

### 1.1. Gudang (`gudang`)

- **Field**:

  - `id` (uuid/integer)
  - `nama` (string)
  - `tipe` (enum: `Induk`, `Proyek`, `Lainnya`)
  - `lokasi` (string)
  - `kontak` (string/opsional)

### 1.2. Material (`material`)

- **Field**:

  - `id` (uuid/integer)
  - `kode` (string, unik)
  - `nama` (string)
  - `satuan` (string, mis: zak, kg, m3)
  - `kategori` (string)
  - `deskripsi` (text, opsional)

> Catatan: _Material adalah master data — TIDAK menyimpan stok._

### 1.3. MaterialGudang / Stok Per Gudang (`material-gudang`)

- **Field**:

  - `id`
  - `material` (relation → `material`)
  - `gudang` (relation → `gudang`)
  - `stok` (decimal/integer)
  - `stok_minimal` (decimal/integer, opsional)
  - `last_updated_by` (string / user reference, opsional)

- **Constraint**: kombinasi `material + gudang` harus unik

### 1.4. Penerimaan Material (`penerimaan-material`)

- **Field**:

  - `id`
  - `tanggal` (datetime)
  - `gudang_tujuan` (relation → `gudang`)
  - `supplier` (string / relation ke vendor)
  - `items` (komposisi/relasi ke child table `penerimaan-item`)
  - `catatan`
  - `status` (enum: `draft`, `confirmed`, `cancelled`)

**Penerimaan Item** (`penerimaan-item`):

- `material` (relation → `material`)
- `jumlah` (decimal)
- `harga_satuan` (opsional)
- `subtotal`

**Behavior**:

- Saat `confirmed`, sistem menambah stok pada `material-gudang` (gudang tujuan). Jika record `material-gudang` belum ada → buat record baru.
- Simpan log history penerimaan.

### 1.5. Pengeluaran Material (`pengeluaran-material`)

- **Field**:

  - `id`
  - `tanggal`
  - `gudang_sumber` (relation → `gudang`)
  - `tujuan` (string; bisa `Proyek`, `Pemakaian Internal`, `Hilang/Rusak`, dsb)
  - `items` (child `pengeluaran-item`)
  - `status` (enum: `draft`, `confirmed`, `cancelled`)

**Pengeluaran Item** (`pengeluaran-item`):

- `material`
- `jumlah`
- `referensi_progress` (opsional, relasi ke progress harian)

**Behavior**:

- Jika `confirmed`, kurangi stok di `material-gudang (gudang_sumber)`.

> Catatan: Pengeluaran dapat dibuat manual atau otomatis dari `Progress Harian`.

### 1.6. Distribusi (`distribusi`)

- **Field**:

  - `id`
  - `tanggal`
  - `gudang_sumber`
  - `gudang_tujuan`
  - `items` (child `distribusi-item`)
  - `status` (enum: `draft`, `in_transit`, `received`, `cancelled`)
  - `nomor_document`

**Distribusi Item** (`distribusi-item`):

- `material`
- `jumlah`

**Behavior**:

- Saat `in_transit` atau `confirmed`, sistem: kurangi stok di gudang sumber, dan saat `received` → tambah stok di gudang tujuan.
- Simpan riwayat transfer (audit trail).

### 1.7. Progress Harian (`progress-harian`)

- **Field**:

  - `id`
  - `tanggal`
  - `proyek` (string / relation ke project)
  - `mandor` (user reference)
  - `aktivitas` (text)
  - `items_pemakaian` (child `progress-item`)
  - `status` (enum: `draft`, `approved`)

**Progress Item** (`progress-item`):

- `material`
- `jumlah_pakai`
- `gudang_asal` (relation → gudang)

**Behavior**:

- Saat `approved`, sistem membuat record `pengeluaran-material` otomatis (atau langsung mengurangi `material-gudang`) sesuai `items_pemakaian`.
- Jika `gudang_asal` stok tidak cukup → tolak/alert atau buat permintaan distribusi.

### 1.8. Stock Opname (`stock-opname`)

- **Field**:

  - `id`
  - `tanggal`
  - `gudang`
  - `items` (child `opname-item`)
  - `status` (enum: `draft`, `finalized`)
  - `catatan`

**Opname Item**:

- `material`
- `stok_sistem` (diambil dari `material-gudang` saat mulai opname)
- `stok_real` (input oleh petugas)
- `selisih` (stok_real - stok_sistem)

**Behavior**:

- Saat `finalized`, sistem memperbarui `material-gudang` dan membuat jurnal koreksi / history stock opname.

---

## 2. Relasi dan Rules Kunci

- `material-gudang` (unik per `material` + `gudang`)
- Semua operasi stok (tambah/kurang) **hanya** mengupdate `material-gudang`.
- Semua perubahan stok wajib tercatat di tabel history (penerimaan, pengeluaran, distribusi, opname) untuk audit.
- `progress-harian` adalah sumber kebenaran untuk pemakaian material proyek — bila disetujui harus memicu pengurangan stok.

---

## 3. Alur Proses (Use Cases)

### 3.1. Penerimaan Barang (dari supplier)

1. Buat `penerimaan-material` (draft)
2. Verifikasi barang oleh gudang
3. `Confirm` → setiap `penerimaan-item` menambah `material-gudang` sesuai gudang tujuan
4. Simpan faktur / dokumen

### 3.2. Distribusi Antar Gudang

1. Buat `distribusi` (draft)
2. Konfirmasi pengiriman → status `in_transit` → kurangi stok di gudang sumber
3. Terima di tujuan → status `received` → tambah stok di gudang tujuan
4. Catat nota pengiriman dan bukti terima

### 3.3. Progress Harian → Pemakaian Material

1. Mandor mengisi `progress-harian` + `items_pemakaian`
2. Supervisor approve
3. Saat `approved`: buat `pengeluaran-material` otomatis atau langsung kurangi `material-gudang`
4. Jika stok tidak cukup → buat notifikasi atau buat permintaan distribusi dari gudang induk

### 3.4. Pengeluaran Manual

- Untuk kasus kehilangan, penggunaan ad-hoc, sample, dsb.
- Harus ada approval jika melebihi threshold.

### 3.5. Stock Opname

1. Mulai opname → sistem tangkap `stok_sistem` (snapshot)
2. Petugas input `stok_real`
3. `Finalized` → update `material-gudang` dan catat `selisih`

---

## 4. Endpoint API (contoh RESTful)

> Catatan: sesuaikan dengan konvensi Strapi (collection-types, single-types)

### Material

- `GET /materials` — list
- `POST /materials` — buat material
- `GET /materials/:id`

### MaterialGudang

- `GET /material-gudang?gudang=ID` — list stok per gudang
- `GET /material-gudang?material=ID` — stok material di semua gudang
- `POST /material-gudang` — buat record stok (biasanya otomatis di penerimaan)
- `PUT /material-gudang/:id` — update stok (hati-hati: gunakan hanya oleh sistem)

### Penerimaan

- `POST /penerimaan-material` — buat penerimaan (draft)
- `PUT /penerimaan-material/:id/confirm` — konfirmasi (menambah stok)

### Pengeluaran

- `POST /pengeluaran-material` — buat pengeluaran (manual)
- `PUT /pengeluaran-material/:id/confirm` — konfirmasi (mengurangi stok)

### Distribusi

- `POST /distribusi` — buat distribusi
- `PUT /distribusi/:id/ship` — kirim (kurangi stok sumber)
- `PUT /distribusi/:id/receive` — terima (tambahkan stok tujuan)

### Progress Harian

- `POST /progress-harian` — buat progress (draft)
- `PUT /progress-harian/:id/approve` — approve (menghasilkan pengeluaran otomatis)

### Stock Opname

- `POST /stock-opname` — buat opname (draft)
- `PUT /stock-opname/:id/finalize` — finalize (koreksi stok)

---

## 5. Validasi & Business Rules

- Tidak boleh mengurangi stok di `material-gudang` menjadi negatif (kecuali policy khusus: allow negative stock dengan approval).
- Semua perubahan stok harus mempunyai `reference` ke dokumen (penerimaan/pengeluaran/distribusi/progress/opname).
- Pengeluaran otomatis dari `progress-harian` harus menyimpan referensi `progress_id`.
- Batas `stok_minimal` dapat memicu notifikasi restock.

---

## 6. Audit & History

- Simpan semua event stok di tabel history (mis: `stock_history`):

  - `id`, `tanggal`, `material`, `gudang`, `qty_change` (+/-), `tipe_event` (penerimaan/pengeluaran/distribusi/opname), `ref_id`, `user`

- Gunakan audit trail untuk laporan bulanan dan investigasi selisih.

---

## 7. Laporan/Rekap yang Direkomendasikan

- Stok per material per gudang
- Total stok material (sum di semua gudang)
- Mutasi stok per periode (in/out)
- Laporan distribusi antar gudang
- Laporan pemakaian material per proyek (dari progress-harian)
- Laporan stock opname & koreksi

---

## 8. Skenario Khusus & Rekomendasi

1. **Stok negatif**: bila sistem memerlukan fleksibilitas (mis: pekerjaan urgent), buat flag `allow_negative` per gudang dengan approval dan log khusus.
2. **Batch / Lot / Expiry**: untuk bahan yang perlu traceability (mis: chemical), tambahkan entitas `batch`/`lot` terkait `penerimaan-item` dan `material-gudang`.
3. **Reservasi stok**: bila progress memesan stok tapi belum digunakan, buat tabel `reservasi` untuk mengurangi stok yang bisa dipakai orang lain.
4. **Notifikasi & reorder**: scheduler yang cek `stok_minimal` dan kirim notifikasi/email ke pembeli.

---

## 9. Contoh Payload Singkat

**Contoh Penerimaan (POST /penerimaan-material)**

```json
{
  "tanggal": "2025-11-21T08:00:00Z",
  "gudang_tujuan": 2,
  "supplier": "PT. Supplier",
  "items": [
    { "material": 10, "jumlah": 100, "harga_satuan": 50000 },
    { "material": 11, "jumlah": 50 }
  ]
}
```

**Contoh Progress Harian (POST /progress-harian)**

```json
{
  "tanggal": "2025-11-21",
  "proyek": "Proyek A",
  "mandor": 5,
  "items_pemakaian": [
    { "material": 10, "jumlah_pakai": 20, "gudang_asal": 3 },
    { "material": 11, "jumlah_pakai": 10, "gudang_asal": 3 }
  ]
}
```

---

## 10. Checklist Implementasi di Strapi

- [ ] Buat collection-types: `gudang`, `material`, `material-gudang`, `penerimaan-material`, `penerimaan-item`, `pengeluaran-material`, `pengeluaran-item`, `distribusi`, `distribusi-item`, `progress-harian`, `progress-item`, `stock-opname`, `opname-item`, `stock_history`.
- [ ] Tambah unique constraint `material + gudang` pada `material-gudang`.
- [ ] Tambah lifecycle hooks di Strapi untuk `confirm` actions (penerimaan, pengeluaran, distribusi.receive, progress approve, opname finalize).
- [ ] Tambah role & permission untuk approval workflow.
- [ ] Buat API endpoints custom untuk `confirm`, `ship`, `receive`, `approve`, `finalize`.
