import type { Schema, Struct } from '@strapi/strapi';

export interface KomponenAlamat extends Struct.ComponentSchema {
  collectionName: 'components_komponen_alamats';
  info: {
    displayName: 'Alamat';
  };
  attributes: {
    jalan: Schema.Attribute.String;
    kode_pos: Schema.Attribute.String;
    kota: Schema.Attribute.String;
    negara: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Indonesia'>;
    provinsi: Schema.Attribute.String;
  };
}

export interface KomponenDokumen extends Struct.ComponentSchema {
  collectionName: 'components_komponen_dokumen';
  info: {
    displayName: 'Dokumen';
  };
  attributes: {
    nama_dokumen: Schema.Attribute.String;
    nomor_dokumen: Schema.Attribute.String;
    status_dokumen: Schema.Attribute.Enumeration<
      ['Aktif', 'Dalam Proses', 'Kadaluarsa']
    >;
    tanggal_kadaluarsa: Schema.Attribute.String;
    tanggal_terbit: Schema.Attribute.String;
  };
}

export interface KomponenHarga extends Struct.ComponentSchema {
  collectionName: 'components_komponen_hargas';
  info: {
    displayName: 'Harga';
  };
  attributes: {
    diskon: Schema.Attribute.Decimal;
    harga_dasar: Schema.Attribute.Decimal;
    harga_setelah_diskon: Schema.Attribute.Decimal;
    harga_total: Schema.Attribute.Decimal;
    ppn: Schema.Attribute.Decimal;
  };
}

export interface KomponenKontak extends Struct.ComponentSchema {
  collectionName: 'components_komponen_kontaks';
  info: {
    displayName: 'Kontak';
  };
  attributes: {
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    telepon: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KomponenPenggajian extends Struct.ComponentSchema {
  collectionName: 'components_komponen_penggajians';
  info: {
    displayName: 'Penggajian';
  };
  attributes: {
    bonus: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    gaji_pokok: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    kasbon: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    komisi: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    potongan_bpjs: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    potongan_pph21: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    total_gaji: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tunjangan_jabatan: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tunjangan_makan: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tunjangan_transport: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface KomponenProgresProyek extends Struct.ComponentSchema {
  collectionName: 'components_komponen_progres_proyeks';
  info: {
    displayName: 'Progres Proyek';
  };
  attributes: {
    persentase: Schema.Attribute.Decimal;
    status_progres_proyek: Schema.Attribute.Enumeration<
      ['Belum Dimulai', 'Proses', 'Selesai', 'Tertunda']
    >;
    tahap: Schema.Attribute.String;
    tanggal_mulai: Schema.Attribute.Date;
    tanggal_selesai: Schema.Attribute.Date;
  };
}

export interface KomponenStatusProyek extends Struct.ComponentSchema {
  collectionName: 'components_komponen_status_proyeks';
  info: {
    displayName: 'Status Proyek';
  };
  attributes: {
    keterangan: Schema.Attribute.Text;
    persentase_penyelesaian: Schema.Attribute.Decimal;
    status_proyek: Schema.Attribute.Enumeration<
      ['Perencanaan', 'Pembangunan', 'Selesai', 'Terjual Habis']
    >;
    tanggal_update: Schema.Attribute.Date;
  };
}

export interface KomponenTransaksi extends Struct.ComponentSchema {
  collectionName: 'components_komponen_transaksis';
  info: {
    displayName: 'Transaksi';
  };
  attributes: {
    bukti_pembayaran: Schema.Attribute.Media<'files' | 'images'>;
    keterangan: Schema.Attribute.String;
    metode_pembayaran: Schema.Attribute.Enumeration<
      ['Transfer', 'Tunai', 'Cek', 'Debit', 'Kredit']
    >;
    nominal: Schema.Attribute.Decimal;
    status_transaksi: Schema.Attribute.Enumeration<
      ['Pending', 'Sukses', 'Gagal']
    >;
    tanggal: Schema.Attribute.DateTime;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'komponen.alamat': KomponenAlamat;
      'komponen.dokumen': KomponenDokumen;
      'komponen.harga': KomponenHarga;
      'komponen.kontak': KomponenKontak;
      'komponen.penggajian': KomponenPenggajian;
      'komponen.progres-proyek': KomponenProgresProyek;
      'komponen.status-proyek': KomponenStatusProyek;
      'komponen.transaksi': KomponenTransaksi;
    }
  }
}
