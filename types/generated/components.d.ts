import type { Schema, Struct } from '@strapi/strapi';

export interface AttendancePatrolReport extends Struct.ComponentSchema {
  collectionName: 'components_attendance_patrol_reports';
  info: {
    description: 'Laporan patroli security';
    displayName: 'Patrol Report';
  };
  attributes: {
    foto: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    keterangan: Schema.Attribute.Text;
    lokasi: Schema.Attribute.JSON & Schema.Attribute.Required;
    status_keamanan: Schema.Attribute.Enumeration<
      ['Aman', 'Mencurigakan', 'Kejadian']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aman'>;
    waktu_laporan: Schema.Attribute.DateTime & Schema.Attribute.Required;
  };
}

export interface DistribusiItemDistribusi extends Struct.ComponentSchema {
  collectionName: 'components_distribusi_item_distribusis';
  info: {
    description: 'Item detail untuk distribusi material';
    displayName: 'Item Distribusi';
    icon: 'box';
  };
  attributes: {
    jumlah: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    keterangan: Schema.Attribute.Text;
    material_gudang: Schema.Attribute.Relation<
      'oneToOne',
      'api::material-gudang.material-gudang'
    >;
  };
}

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

export interface KomponenInvoicePaymentRecord extends Struct.ComponentSchema {
  collectionName: 'components_komponen_invoice_payment_records';
  info: {
    description: 'Record of a single payment for an invoice';
    displayName: 'Invoice Payment Record';
    icon: 'hand-holding-usd';
  };
  attributes: {
    amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bankAccount: Schema.Attribute.String;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    method: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'check', 'giro', 'others']
    > &
      Schema.Attribute.DefaultTo<'transfer'>;
    notes: Schema.Attribute.Text;
    paidBy: Schema.Attribute.Relation<'oneToOne', 'api::karyawan.karyawan'>;
    pos_keuangan: Schema.Attribute.Relation<
      'oneToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    processedAt: Schema.Attribute.DateTime;
    receiptDocument: Schema.Attribute.Media<'images' | 'files'>;
    reference: Schema.Attribute.String;
  };
}

export interface KomponenKontak extends Struct.ComponentSchema {
  collectionName: 'components_komponen_kontaks';
  info: {
    displayName: 'Kontak';
  };
  attributes: {
    email: Schema.Attribute.Email;
    name: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    position: Schema.Attribute.String;
  };
}

export interface KomponenKontakSubkontraktor extends Struct.ComponentSchema {
  collectionName: 'components_komponen_kontak_subkontraktors';
  info: {
    description: 'Komponen kontak khusus untuk subkontraktor dengan PIC';
    displayName: 'Kontak Subkontraktor';
  };
  attributes: {
    email: Schema.Attribute.Email;
    pic_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    telepon: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KomponenLokasiAbsensi extends Struct.ComponentSchema {
  collectionName: 'components_komponen_lokasi_absensis';
  info: {
    description: 'Titik lokasi untuk absensi';
    displayName: 'Lokasi Absensi';
  };
  attributes: {
    alamat: Schema.Attribute.Text;
    latitude: Schema.Attribute.Float & Schema.Attribute.Required;
    longitude: Schema.Attribute.Float & Schema.Attribute.Required;
    nama_lokasi: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface KomponenPaymentHistory extends Struct.ComponentSchema {
  collectionName: 'components_payment_histories';
  info: {
    description: 'Payment history records for consumer receivables';
    displayName: 'Payment History';
    pluralName: 'payment-histories';
    singularName: 'payment-history';
  };
  attributes: {
    amount: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: '1000';
        },
        string
      >;
    bankReference: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    paymentMethod: Schema.Attribute.Enumeration<
      ['cash', 'transfer', 'check', 'giro', 'kpr-disbursement']
    >;
    pos_keuangan: Schema.Attribute.Relation<
      'oneToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    status: Schema.Attribute.Enumeration<['paid', 'pending', 'failed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'paid'>;
    transferProof: Schema.Attribute.Media<'images' | 'files'>;
    type: Schema.Attribute.Enumeration<
      ['booking-fee', 'dp', 'termin', 'kpr', 'pelunasan']
    > &
      Schema.Attribute.Required;
  };
}

export interface KomponenPembayaran extends Struct.ComponentSchema {
  collectionName: 'components_komponen_pembayarans';
  info: {
    description: 'Komponen untuk data pembayaran subkontraktor';
    displayName: 'Pembayaran';
  };
  attributes: {
    jadwal_pembayaran: Schema.Attribute.JSON;
    outstanding: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    total_dibayar: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
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

export interface PenerimaanMaterialItem extends Struct.ComponentSchema {
  collectionName: 'components_penerimaan_material_items';
  info: {
    description: 'Item material dalam penerimaan';
    displayName: 'Material Item';
  };
  attributes: {
    condition: Schema.Attribute.Enumeration<['Baik', 'Rusak', 'Kurang']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Baik'>;
    harga_satuan: Schema.Attribute.BigInteger;
    material: Schema.Attribute.Relation<'oneToOne', 'api::material.material'>;
    nama_material_baru: Schema.Attribute.String;
    quantity: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0.01;
        },
        number
      >;
    total_harga: Schema.Attribute.BigInteger;
    unit: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PengeluaranItemPengeluaran extends Struct.ComponentSchema {
  collectionName: 'components_pengeluaran_item_pengeluarans';
  info: {
    description: 'Item pengeluaran material (stok atau beli langsung)';
    displayName: 'Item Pengeluaran';
    icon: 'box';
  };
  attributes: {
    condition: Schema.Attribute.Enumeration<['Baik', 'Rusak', 'Kurang']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Baik'>;
    harga_satuan: Schema.Attribute.BigInteger;
    keterangan: Schema.Attribute.Text;
    material: Schema.Attribute.Relation<'oneToOne', 'api::material.material'>;
    material_gudang: Schema.Attribute.Relation<
      'oneToOne',
      'api::material-gudang.material-gudang'
    >;
    nota: Schema.Attribute.Media<'images' | 'files', true>;
    quantity: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    sumber: Schema.Attribute.Enumeration<['stok', 'langsung_beli']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'stok'>;
    total_harga: Schema.Attribute.BigInteger;
    unit: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLaborRequirement extends Struct.ComponentSchema {
  collectionName: 'components_shared_labor_requirements';
  info: {
    description: 'Component untuk kebutuhan tenaga kerja';
    displayName: 'Labor Requirement';
  };
  attributes: {
    estimated_hours: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    hourly_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    role: Schema.Attribute.Enumeration<['mandor', 'tukang', 'helper']> &
      Schema.Attribute.Required;
  };
}

export interface SharedMaterial extends Struct.ComponentSchema {
  collectionName: 'components_shared_materials';
  info: {
    description: 'Component for materials supplied by vendors';
    displayName: 'Material';
  };
  attributes: {
    category: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    specifications: Schema.Attribute.Text;
    unit: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMaterialItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_material_items';
  info: {
    description: 'Component untuk item material dalam PO, PR, atau penggunaan';
    displayName: 'Material Item';
  };
  attributes: {
    material: Schema.Attribute.Relation<'manyToOne', 'api::material.material'> &
      Schema.Attribute.Required;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    quantity: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    total_price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unit_price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface StockOpnameItemOpname extends Struct.ComponentSchema {
  collectionName: 'components_stock_opname_item_opnames';
  info: {
    description: 'Detail item stock opname';
    displayName: 'Item Opname';
  };
  attributes: {
    difference: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    material_gudang: Schema.Attribute.Relation<
      'oneToOne',
      'api::material-gudang.material-gudang'
    >;
    notes: Schema.Attribute.Text;
    physical_stock: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    reason: Schema.Attribute.Enumeration<
      [
        'Rusak/Tidak Layak Pakai',
        'Hilang/Pencurian',
        'Kesalahan Input Sistem',
        'Expired Date',
        'Transfer Antar Lokasi',
        'Retur Supplier',
        'Sample/Display',
        'Lainnya',
      ]
    >;
    system_stock: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'attendance.patrol-report': AttendancePatrolReport;
      'distribusi.item-distribusi': DistribusiItemDistribusi;
      'komponen.alamat': KomponenAlamat;
      'komponen.dokumen': KomponenDokumen;
      'komponen.harga': KomponenHarga;
      'komponen.invoice-payment-record': KomponenInvoicePaymentRecord;
      'komponen.kontak': KomponenKontak;
      'komponen.kontak-subkontraktor': KomponenKontakSubkontraktor;
      'komponen.lokasi-absensi': KomponenLokasiAbsensi;
      'komponen.payment-history': KomponenPaymentHistory;
      'komponen.pembayaran': KomponenPembayaran;
      'komponen.penggajian': KomponenPenggajian;
      'komponen.progres-proyek': KomponenProgresProyek;
      'komponen.status-proyek': KomponenStatusProyek;
      'komponen.transaksi': KomponenTransaksi;
      'penerimaan.material-item': PenerimaanMaterialItem;
      'pengeluaran.item-pengeluaran': PengeluaranItemPengeluaran;
      'shared.labor-requirement': SharedLaborRequirement;
      'shared.material': SharedMaterial;
      'shared.material-item': SharedMaterialItem;
      'stock-opname.item-opname': StockOpnameItemOpname;
    }
  }
}
