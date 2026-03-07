# API Documentation - Incentive System (Insentif)

## Overview

Dokumentasi API untuk manajemen insentif di sistem perumahan. Sistem ini mendukung pemberian insentif kepada Karyawan, Team (kumpulan karyawan), atau input manual.

## Content Types

### 1. Insentif (Content Type: `insentif`)

#### Fields

| Field Name | Type | Required | Description | Validation |
| :--- | :--- | :--- | :--- | :--- |
| `tipe_penerima` | Enumeration | Yes | Jenis penerima insentif | Options: `Karyawan`, `Team`, `Manual` |
| `karyawan` | Relation | No | Relation ke `karyawan` | Required if `tipe_penerima` = `Karyawan` |
| `team` | Relation | No | Relation ke `team` | Required if `tipe_penerima` = `Team` |
| `nama` | String | No | Nama penerima manual | Required if `tipe_penerima` = `Manual` |
| `jabatan` | String | No | Jabatan penerima (Single) | |
| `insentif_real` | Decimal | No | Nilai insentif real | Default: 0 |
| `insentif_utj` | Decimal | No | Nilai insentif UTJ | Default: 0 |
| `bonus_kinerja` | Decimal | No | Bonus kinerja | Default: 0 |
| `take_home_pay` | Decimal | No | Total yang diterima | Default: 0 |
| `effective_date` | Date | Yes | Tanggal efektif | |
| `keterangan` | Text | No | Catatan tambahan | |

---

### 2. Team (Content Type: `team`)

#### Fields

| Field Name | Type | Required | Description | Validation |
| :--- | :--- | :--- | :--- | :--- |
| `nama_tim` | String | Yes | Nama tim | Unique |
| `deskripsi` | Text | No | Deskripsi tim | |
| `karyawans` | Relation | No | Anggota tim (Relation ke `karyawan`) | Many-to-Many |

---

## API Endpoints

### Team Endpoints

#### GET `/api/teams`
Mendapatkan daftar tim.
Populate `karyawans` untuk melihat anggota.

#### POST `/api/teams`
Membuat tim baru.
```json
{
  "data": {
    "nama_tim": "Tim Marketing A",
    "deskripsi": "Tim marketing untuk proyek A",
    "karyawans": [1, 2, 3]
  }
}
```

---

### Insentif Endpoints

#### GET `/api/insentifs`
Mendapatkan daftar insentif.
Populate: `karyawan`, `team`.

#### POST `/api/insentifs` (Karyawan)
```json
{
  "data": {
    "tipe_penerima": "Karyawan",
    "karyawan": 1,
    "insentif_real": 500000,
    "effective_date": "2026-03-01"
  }
}
```

#### POST `/api/insentifs` (Team)
```json
{
  "data": {
    "tipe_penerima": "Team",
    "team": 1,
    "insentif_real": 2000000,
    "effective_date": "2026-03-01"
  }
}
```

#### POST `/api/insentifs` (Manual)
```json
{
  "data": {
    "tipe_penerima": "Manual",
    "nama": "Budi",
    "jabatan": "Tukang Kayu",
    "insentif_real": 300000,
    "effective_date": "2026-03-01",
    "keterangan": "Borongan lemari"
  }
}
```
