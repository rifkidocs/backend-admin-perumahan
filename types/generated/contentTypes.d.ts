import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAbsensiAbsensi extends Struct.CollectionTypeSchema {
  collectionName: 'absensis';
  info: {
    displayName: 'Absensi';
    pluralName: 'absensis';
    singularName: 'absensi';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    foto_absensi: Schema.Attribute.Media<'images', true>;
    jam_keluar: Schema.Attribute.Time;
    jam_masuk: Schema.Attribute.Time;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    keterangan: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::absensi.absensi'
    > &
      Schema.Attribute.Private;
    lokasi_gps: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    status_absensi: Schema.Attribute.Enumeration<
      ['Hadir', 'Izin', 'Sakit', 'Cuti', 'Alpa']
    >;
    tanggal: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBankBank extends Struct.CollectionTypeSchema {
  collectionName: 'banks';
  info: {
    displayName: 'bank';
    pluralName: 'banks';
    singularName: 'bank';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alamat: Schema.Attribute.Component<'komponen.alamat', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_persyaratan: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    jenis_kpr: Schema.Attribute.String;
    konsumen: Schema.Attribute.Relation<'oneToMany', 'api::konsumen.konsumen'>;
    kontak_person: Schema.Attribute.Component<'komponen.kontak', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::bank.bank'> &
      Schema.Attribute.Private;
    nama_bank: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    suku_bunga: Schema.Attribute.Decimal;
    tenor_maksimum: Schema.Attribute.Integer;
    tenor_minimum: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBookingBooking extends Struct.CollectionTypeSchema {
  collectionName: 'bookings';
  info: {
    description: '';
    displayName: 'Booking';
    pluralName: 'bookings';
    singularName: 'booking';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_booking: Schema.Attribute.Component<'komponen.dokumen', true>;
    konsumen: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking.booking'
    > &
      Schema.Attribute.Private;
    marketing: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    nominal_booking: Schema.Attribute.Decimal;
    nomor_booking: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    status_booking: Schema.Attribute.Enumeration<
      ['Aktif', 'Lanjut DP', 'Batal']
    >;
    tanggal_booking: Schema.Attribute.Date;
    tanggal_kadaluarsa: Schema.Attribute.Date;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCutiCuti extends Struct.CollectionTypeSchema {
  collectionName: 'cutis';
  info: {
    description: '';
    displayName: 'Cuti';
    pluralName: 'cutis';
    singularName: 'cuti';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alasan: Schema.Attribute.Text;
    bukti_pendukung: Schema.Attribute.Media<
      'images' | 'videos' | 'audios' | 'files',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jenis_cuti: Schema.Attribute.Enumeration<
      ['Tahunan', 'Sakit', 'Bersalin', 'Penting', 'Lainnya']
    >;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::cuti.cuti'> &
      Schema.Attribute.Private;
    penyetuju: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    status_persetujuan: Schema.Attribute.Enumeration<
      ['Diajukan', 'Disetujui', 'Ditolak']
    >;
    tanggal_mulai: Schema.Attribute.Date;
    tanggal_selesai: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDepartemenDepartemen extends Struct.CollectionTypeSchema {
  collectionName: 'departemens';
  info: {
    description: '';
    displayName: 'Departemen';
    pluralName: 'departemens';
    singularName: 'departemen';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text;
    jabatan: Schema.Attribute.Relation<'oneToMany', 'api::jabatan.jabatan'>;
    karyawan: Schema.Attribute.Relation<'oneToMany', 'api::karyawan.karyawan'>;
    kepala_departemen: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    kode_departemen: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::departemen.departemen'
    > &
      Schema.Attribute.Private;
    nama_departemen: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDeveloperDeveloper extends Struct.CollectionTypeSchema {
  collectionName: 'developers';
  info: {
    displayName: 'Developer';
    pluralName: 'developers';
    singularName: 'developer';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alamat: Schema.Attribute.Component<'komponen.alamat', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text;
    direktur_utama: Schema.Attribute.String;
    dokumen_legal: Schema.Attribute.Component<'komponen.dokumen', true>;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::developer.developer'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    nama_perusahaan: Schema.Attribute.String & Schema.Attribute.Required;
    npwp: Schema.Attribute.String;
    proyek_perumahans: Schema.Attribute.Relation<
      'oneToMany',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    tahun_berdiri: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    website: Schema.Attribute.String;
  };
}

export interface ApiJabatanJabatan extends Struct.CollectionTypeSchema {
  collectionName: 'jabatans';
  info: {
    description: '';
    displayName: 'Jabatan';
    pluralName: 'jabatans';
    singularName: 'jabatan';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    departemen: Schema.Attribute.Relation<
      'manyToOne',
      'api::departemen.departemen'
    >;
    deskripsi_jabatan: Schema.Attribute.Text;
    gaji_maksimum: Schema.Attribute.Decimal;
    gaji_minimum: Schema.Attribute.Decimal;
    karyawans: Schema.Attribute.Relation<'oneToMany', 'api::karyawan.karyawan'>;
    kode_jabatan: Schema.Attribute.String;
    level_jabatan: Schema.Attribute.Enumeration<
      ['Staff', 'Supervisor', 'Manager', 'Direktur']
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::jabatan.jabatan'
    > &
      Schema.Attribute.Private;
    nama_jabatan: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKaryawanKaryawan extends Struct.CollectionTypeSchema {
  collectionName: 'karyawans';
  info: {
    description: '';
    displayName: 'Karyawan';
    pluralName: 'karyawans';
    singularName: 'karyawan';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    absensi: Schema.Attribute.Relation<'oneToMany', 'api::absensi.absensi'>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cuti: Schema.Attribute.Relation<'oneToMany', 'api::cuti.cuti'>;
    departemen: Schema.Attribute.Relation<
      'oneToMany',
      'api::departemen.departemen'
    >;
    departemens: Schema.Attribute.Relation<
      'manyToOne',
      'api::departemen.departemen'
    >;
    dokumen_karyawan: Schema.Attribute.Component<'komponen.dokumen', true>;
    foto_karyawan: Schema.Attribute.Media<'images'>;
    jabatan: Schema.Attribute.Relation<'manyToOne', 'api::jabatan.jabatan'>;
    jenis_kelamin: Schema.Attribute.Enumeration<['Laki-laki', 'Perempuan']>;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    konsumen: Schema.Attribute.Relation<'oneToMany', 'api::konsumen.konsumen'>;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    lead_marketings: Schema.Attribute.Relation<
      'oneToMany',
      'api::lead-marketing.lead-marketing'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::karyawan.karyawan'
    > &
      Schema.Attribute.Private;
    nama_bank: Schema.Attribute.String;
    nama_lengkap: Schema.Attribute.String & Schema.Attribute.Required;
    nik_karyawan: Schema.Attribute.String & Schema.Attribute.Required;
    npwp: Schema.Attribute.String;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    penggajian: Schema.Attribute.Component<'komponen.penggajian', false>;
    penjualan: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    >;
    permintaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::permintaan-material.permintaan-material'
    >;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    proyek_ditangani: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    proyek_perumahans: Schema.Attribute.Relation<
      'oneToMany',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    rabs: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'>;
    rekening_bank: Schema.Attribute.String;
    serah_terima_units: Schema.Attribute.Relation<
      'oneToMany',
      'api::serah-terima-unit.serah-terima-unit'
    >;
    status_kepegawaian: Schema.Attribute.Enumeration<
      ['Tetap', 'Kontrak', 'Freelance']
    >;
    status_pernikahan: Schema.Attribute.Enumeration<
      ['Belum Menikah', 'Menikah', 'Cerai']
    >;
    tanggal_akhir_kontrak: Schema.Attribute.Date;
    tanggal_lahir: Schema.Attribute.Date;
    tanggal_masuk: Schema.Attribute.Date;
    target_marketings: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    >;
    tempat_lahir: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKasKeluarKasKeluar extends Struct.CollectionTypeSchema {
  collectionName: 'kas_keluars';
  info: {
    description: '';
    displayName: 'Kas Keluar';
    pluralName: 'kas-keluars';
    singularName: 'kas-keluar';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bukti_pembayaran: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jenis_transaksi: Schema.Attribute.Enumeration<
      ['Pembayaran Supplier', 'Gaji', 'Operasional', 'Biaya Legal', 'Lainnya']
    >;
    keterangan: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    > &
      Schema.Attribute.Private;
    metode_pembayaran: Schema.Attribute.Enumeration<
      ['Transfer', 'Tunai', 'Cek']
    >;
    nominal: Schema.Attribute.Decimal;
    nomor_transaksi: Schema.Attribute.String;
    penerima: Schema.Attribute.String;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchasing: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchasing.purchasing'
    >;
    tanggal_transaksi: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vendor: Schema.Attribute.Relation<'manyToOne', 'api::vendor.vendor'>;
  };
}

export interface ApiKasMasukKasMasuk extends Struct.CollectionTypeSchema {
  collectionName: 'kas_masuks';
  info: {
    description: '';
    displayName: 'Kas Masuk';
    pluralName: 'kas-masuks';
    singularName: 'kas-masuk';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bukti_pembayaran: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jenis_transaksi: Schema.Attribute.Enumeration<
      ['Booking', 'DP', 'Pelunasan', 'Pencairan KPR', 'Lainnya']
    >;
    keterangan: Schema.Attribute.String;
    konsuman: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    > &
      Schema.Attribute.Private;
    metode_pembayaran: Schema.Attribute.Enumeration<
      ['Transfer', 'Tunai', 'Cek']
    >;
    nominal: Schema.Attribute.Decimal;
    nomor_transaksi: Schema.Attribute.String;
    penerima: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    tanggal_transaksi: Schema.Attribute.Date;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKonsumenKonsumen extends Struct.CollectionTypeSchema {
  collectionName: 'konsumens';
  info: {
    description: '';
    displayName: 'Konsumen';
    pluralName: 'konsumens';
    singularName: 'konsumen';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bank_kpr: Schema.Attribute.Relation<'manyToOne', 'api::bank.bank'>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_konsumen: Schema.Attribute.Component<'komponen.dokumen', true>;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::konsumen.konsumen'
    > &
      Schema.Attribute.Private;
    marketing: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    metode_pembayaran: Schema.Attribute.Enumeration<
      ['KPR', 'Tunai Keras', 'Tunai Bertahap']
    >;
    nama_lengkap: Schema.Attribute.String & Schema.Attribute.Required;
    nomor_ktp: Schema.Attribute.String & Schema.Attribute.Required;
    pekerjaan: Schema.Attribute.String;
    penghasilan_per_bulan: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    riwayat_pembayaran: Schema.Attribute.Component<'komponen.transaksi', true>;
    serah_terima_units: Schema.Attribute.Relation<
      'oneToMany',
      'api::serah-terima-unit.serah-terima-unit'
    >;
    status_kpr: Schema.Attribute.Enumeration<
      ['Belum Mengajukan', 'Dalam Proses', 'Disetujui', 'Ditolak']
    >;
    unit_dibeli: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    >;
    unit_rumahs: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeadMarketingLeadMarketing
  extends Struct.CollectionTypeSchema {
  collectionName: 'lead_marketings';
  info: {
    description: '';
    displayName: 'Lead Marketing';
    pluralName: 'lead-marketings';
    singularName: 'lead-marketing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    budget: Schema.Attribute.Decimal;
    catatan: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jadwal_kunjungan: Schema.Attribute.Date;
    kategori_lead: Schema.Attribute.Enumeration<
      ['Belum Berminat', 'Berminat', 'Prioritas']
    >;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::lead-marketing.lead-marketing'
    > &
      Schema.Attribute.Private;
    marketing: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    minat_tipe_rumah: Schema.Attribute.String;
    nama_lengkap: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    riwayat_komunikasi: Schema.Attribute.JSON;
    status_lead: Schema.Attribute.Enumeration<
      ['Baru', 'Dalam Proses', 'Closed', 'Gagal']
    >;
    sumber_lead: Schema.Attribute.Enumeration<
      ['Pameran', 'Website', 'Referensi', 'Iklan', 'Sosial Media', 'Lainnya']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMaterialMaterial extends Struct.CollectionTypeSchema {
  collectionName: 'materials';
  info: {
    description: '';
    displayName: 'Material';
    pluralName: 'materials';
    singularName: 'material';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    foto_material: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    harga_satuan: Schema.Attribute.Decimal;
    kategori_material: Schema.Attribute.Enumeration<
      ['Struktur', 'Finishing', 'MEP', 'Alat Bantu']
    >;
    kode_material: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::material.material'
    > &
      Schema.Attribute.Private;
    lokasi_gudang: Schema.Attribute.String;
    nama_material: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    satuan: Schema.Attribute.String;
    spesifikasi: Schema.Attribute.Text;
    stok_tersedia: Schema.Attribute.Integer;
    supplier: Schema.Attribute.Relation<'manyToMany', 'api::vendor.vendor'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPenerimaanMaterialPenerimaanMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'penerimaan_materials';
  info: {
    description: '';
    displayName: 'Penerimaan Material';
    pluralName: 'penerimaan-materials';
    singularName: 'penerimaan-material';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bukti_penerimaan: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    item_penerimaan: Schema.Attribute.JSON;
    keterangan: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    > &
      Schema.Attribute.Private;
    nomor_penerimaan: Schema.Attribute.String & Schema.Attribute.Required;
    penerima: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    purchasing: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchasing.purchasing'
    >;
    status_penerimaan_material: Schema.Attribute.Enumeration<
      ['Lengkap', 'Kurang', 'Return']
    >;
    tanggal_penerimaan: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPengeluaranMaterialPengeluaranMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'pengeluaran_materials';
  info: {
    description: '';
    displayName: 'Pengeluaran Material';
    pluralName: 'pengeluaran-materials';
    singularName: 'pengeluaran-material';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    item_pengeluaran: Schema.Attribute.JSON;
    keterangan: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    > &
      Schema.Attribute.Private;
    nomor_pengeluaran: Schema.Attribute.String;
    pemohon: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    penyetuju: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pengeluaran_material: Schema.Attribute.Enumeration<
      ['Draft', 'Disetujui', 'Selesai']
    >;
    tanggal_pengeluaran: Schema.Attribute.Date;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPermintaanMaterialPermintaanMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'permintaan_materials';
  info: {
    description: '';
    displayName: ' Permintaan Material';
    pluralName: 'permintaan-materials';
    singularName: 'permintaan-material';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    item_material: Schema.Attribute.JSON;
    keterangan: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::permintaan-material.permintaan-material'
    > &
      Schema.Attribute.Private;
    nomor_permintaan: Schema.Attribute.String & Schema.Attribute.Required;
    pemohon: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    penyetuju: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchasings: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchasing.purchasing'
    >;
    status_permintaan: Schema.Attribute.Enumeration<
      ['Diajukan', 'Disetujui', 'Ditolak', 'Selesai']
    >;
    tanggal_kebutuhan: Schema.Attribute.Date;
    tanggal_permintaan: Schema.Attribute.Date;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProgresHarianProgresHarian
  extends Struct.CollectionTypeSchema {
  collectionName: 'progres_harians';
  info: {
    description: '';
    displayName: 'Progres Harian';
    pluralName: 'progres-harians';
    singularName: 'progres-harian';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aktivitas: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cuaca: Schema.Attribute.Enumeration<
      ['Cerah', 'Hujan Ringan', 'Hujan Deras', 'Berawan']
    >;
    foto_progres: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    jumlah_pekerja: Schema.Attribute.Integer;
    kendala: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    > &
      Schema.Attribute.Private;
    material_masuk: Schema.Attribute.JSON;
    material_terpakai: Schema.Attribute.JSON;
    pelapor: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    persentase_progres: Schema.Attribute.Decimal;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    tanggal: Schema.Attribute.Date;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPromoPromo extends Struct.CollectionTypeSchema {
  collectionName: 'promos';
  info: {
    description: '';
    displayName: 'Promo';
    pluralName: 'promos';
    singularName: 'promo';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text;
    gambar_promo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    jenis_promo: Schema.Attribute.Enumeration<
      ['Diskon', 'Cashback', 'Hadiah Langsung', 'Free Item']
    >;
    kode_promo: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::promo.promo'> &
      Schema.Attribute.Private;
    nama_promo: Schema.Attribute.String;
    nilai_promo: Schema.Attribute.Decimal;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToMany',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_promo: Schema.Attribute.Enumeration<['Aktif', 'Tidak Aktif']>;
    syarat_ketentuan: Schema.Attribute.Text;
    tanggal_mulai: Schema.Attribute.Date;
    tanggal_selesai: Schema.Attribute.Date;
    tipe_unit: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProyekPerumahanProyekPerumahan
  extends Struct.CollectionTypeSchema {
  collectionName: 'proyek_perumahans';
  info: {
    description: '';
    displayName: 'Proyek Perumahan';
    pluralName: 'proyek-perumahans';
    singularName: 'proyek-perumahan';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alamat: Schema.Attribute.Component<'komponen.alamat', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text;
    developer: Schema.Attribute.Relation<
      'manyToOne',
      'api::developer.developer'
    >;
    dokumen_legal: Schema.Attribute.Component<'komponen.dokumen', true>;
    foto_utama: Schema.Attribute.Media<'images'>;
    galeri_foto: Schema.Attribute.Media<'images', true>;
    jenis_proyek: Schema.Attribute.Enumeration<
      ['Subsidi', 'Komersial', 'Mixed-Use']
    >;
    karyawans: Schema.Attribute.Relation<'oneToMany', 'api::karyawan.karyawan'>;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    koordinat_gps: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::proyek-perumahan.proyek-perumahan'
    > &
      Schema.Attribute.Private;
    luas_lahan: Schema.Attribute.Decimal;
    manager_proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    nama_proyek: Schema.Attribute.String & Schema.Attribute.Required;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    permintaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::permintaan-material.permintaan-material'
    >;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    promos: Schema.Attribute.Relation<'manyToMany', 'api::promo.promo'>;
    publishedAt: Schema.Attribute.DateTime;
    rabs: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'>;
    site_plan: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    status_proyek: Schema.Attribute.Component<'komponen.status-proyek', false>;
    tahap_pengembangan: Schema.Attribute.String;
    tanggal_mulai: Schema.Attribute.Date;
    tanggal_selesai_aktual: Schema.Attribute.Date;
    tanggal_selesai_estimasi: Schema.Attribute.Date;
    target_marketings: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    >;
    unit_rumahs: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vendors: Schema.Attribute.Relation<'manyToMany', 'api::vendor.vendor'>;
  };
}

export interface ApiPurchasingPurchasing extends Struct.CollectionTypeSchema {
  collectionName: 'purchasings';
  info: {
    description: '';
    displayName: 'Purchasing';
    pluralName: 'purchasings';
    singularName: 'purchasing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cara_pembayaran: Schema.Attribute.Enumeration<
      ['Cash', 'Transfer', 'Tempo']
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_po: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    item_po: Schema.Attribute.JSON;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    keterangan: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchasing.purchasing'
    > &
      Schema.Attribute.Private;
    nomor_po: Schema.Attribute.String;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    permintaan_material: Schema.Attribute.Relation<
      'manyToOne',
      'api::permintaan-material.permintaan-material'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_purchasing: Schema.Attribute.Enumeration<
      ['Draft', 'Terkirim', 'Diterima Sebagian', 'Selesai', 'Dibatalkan']
    >;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::vendor.vendor'>;
    tanggal_pembayaran: Schema.Attribute.Date;
    tanggal_pengiriman: Schema.Attribute.Date;
    tanggal_po: Schema.Attribute.Date;
    total_harga: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRabRab extends Struct.CollectionTypeSchema {
  collectionName: 'rabs';
  info: {
    description: '';
    displayName: 'RAB';
    pluralName: 'rabs';
    singularName: 'rab';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_rab: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    item_rab: Schema.Attribute.JSON;
    kode_rab: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'> &
      Schema.Attribute.Private;
    pembuat: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    realisasi_anggarans: Schema.Attribute.Relation<
      'oneToMany',
      'api::realisasi-anggaran.realisasi-anggaran'
    >;
    status_rab: Schema.Attribute.Enumeration<['Draft', 'Disetujui', 'Revisi']>;
    tanggal_dibuat: Schema.Attribute.Date;
    total_anggaran: Schema.Attribute.Decimal;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRealisasiAnggaranRealisasiAnggaran
  extends Struct.CollectionTypeSchema {
  collectionName: 'realisasi_anggarans';
  info: {
    description: '';
    displayName: 'Realisasi Anggaran';
    pluralName: 'realisasi-anggarans';
    singularName: 'realisasi-anggaran';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_pendukung: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    item_realisasi: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::realisasi-anggaran.realisasi-anggaran'
    > &
      Schema.Attribute.Private;
    periode: Schema.Attribute.Date;
    persentase_terhadap_rab: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    rab: Schema.Attribute.Relation<'manyToOne', 'api::rab.rab'>;
    status_realisasi_anggaran: Schema.Attribute.Enumeration<
      ['Proses', 'Selesai']
    >;
    total_realisasi: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSerahTerimaUnitSerahTerimaUnit
  extends Struct.CollectionTypeSchema {
  collectionName: 'serah_terima_units';
  info: {
    description: '';
    displayName: 'Serah Terima Unit';
    pluralName: 'serah-terima-units';
    singularName: 'serah-terima-unit';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    catatan_temuan: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_serah_terima: Schema.Attribute.Component<'komponen.dokumen', true>;
    foto_serah_terima: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    konsumen: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::serah-terima-unit.serah-terima-unit'
    > &
      Schema.Attribute.Private;
    nomor_serah_terima: Schema.Attribute.String;
    pihak_developer: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_serah_terima_unit: Schema.Attribute.Enumeration<
      ['Proses', 'Selesai', 'Batal']
    >;
    tanggal_serah_terima: Schema.Attribute.Date;
    tindak_lanjut: Schema.Attribute.String;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTargetMarketingTargetMarketing
  extends Struct.CollectionTypeSchema {
  collectionName: 'target_marketings';
  info: {
    description: '';
    displayName: 'Target Marketing';
    pluralName: 'target-marketings';
    singularName: 'target-marketing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    komisi_per_unit: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    > &
      Schema.Attribute.Private;
    marketing: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    pencapaian_nominal: Schema.Attribute.Decimal;
    pencapaian_unit: Schema.Attribute.Integer;
    periode: Schema.Attribute.Date;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pembayaran_komisi: Schema.Attribute.Enumeration<
      ['Belum Dibayar', 'Sebagian', 'Lunas']
    >;
    target_nominal: Schema.Attribute.Decimal;
    target_unit: Schema.Attribute.Integer;
    total_komisi: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnitRumahUnitRumah extends Struct.CollectionTypeSchema {
  collectionName: 'unit_rumahs';
  info: {
    description: '';
    displayName: 'Unit Rumah';
    pluralName: 'unit-rumahs';
    singularName: 'unit-rumah';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    blok: Schema.Attribute.String;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_unit: Schema.Attribute.Component<'komponen.dokumen', true>;
    estimasi_biaya_pembangunan: Schema.Attribute.Decimal;
    foto_progress: Schema.Attribute.Media<'images', true>;
    gambar_3d: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    gambar_denah: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    harga: Schema.Attribute.Component<'komponen.harga', false>;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    kavling: Schema.Attribute.String;
    konsuman: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    konsumen: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    > &
      Schema.Attribute.Private;
    luas_bangunan: Schema.Attribute.Decimal;
    luas_tanah: Schema.Attribute.Decimal;
    nomor_unit: Schema.Attribute.String & Schema.Attribute.Required;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    permintaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::permintaan-material.permintaan-material'
    >;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    rabs: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'>;
    serah_terima_units: Schema.Attribute.Relation<
      'oneToMany',
      'api::serah-terima-unit.serah-terima-unit'
    >;
    status_pembangunan: Schema.Attribute.Component<
      'komponen.progres-proyek',
      true
    >;
    status_unit: Schema.Attribute.Enumeration<
      ['Tersedia', 'Dipesan', 'Terjual', 'Dalam Pembangunan']
    >;
    tipe_unit: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVendorVendor extends Struct.CollectionTypeSchema {
  collectionName: 'vendors';
  info: {
    description: '';
    displayName: 'Vendor';
    pluralName: 'vendors';
    singularName: 'vendor';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bank: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_vendor: Schema.Attribute.Component<'komponen.dokumen', true>;
    jenis_layanan: Schema.Attribute.Enumeration<
      [
        'Sipil',
        'Arsitektur',
        'Instalasi Listrik',
        'Instalasi Air',
        'Material',
        'Lainnya',
      ]
    >;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::vendor.vendor'
    > &
      Schema.Attribute.Private;
    material: Schema.Attribute.Relation<'manyToMany', 'api::material.material'>;
    nama_perusahaan: Schema.Attribute.String & Schema.Attribute.Required;
    nomor_rekening: Schema.Attribute.String;
    npwp: Schema.Attribute.String;
    portofolio: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    proyek_terlibat: Schema.Attribute.Relation<
      'manyToMany',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchasings: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchasing.purchasing'
    >;
    status_kontrak: Schema.Attribute.Enumeration<
      ['Aktif', 'Tidak Aktif', 'Blacklist']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::absensi.absensi': ApiAbsensiAbsensi;
      'api::bank.bank': ApiBankBank;
      'api::booking.booking': ApiBookingBooking;
      'api::cuti.cuti': ApiCutiCuti;
      'api::departemen.departemen': ApiDepartemenDepartemen;
      'api::developer.developer': ApiDeveloperDeveloper;
      'api::jabatan.jabatan': ApiJabatanJabatan;
      'api::karyawan.karyawan': ApiKaryawanKaryawan;
      'api::kas-keluar.kas-keluar': ApiKasKeluarKasKeluar;
      'api::kas-masuk.kas-masuk': ApiKasMasukKasMasuk;
      'api::konsumen.konsumen': ApiKonsumenKonsumen;
      'api::lead-marketing.lead-marketing': ApiLeadMarketingLeadMarketing;
      'api::material.material': ApiMaterialMaterial;
      'api::penerimaan-material.penerimaan-material': ApiPenerimaanMaterialPenerimaanMaterial;
      'api::pengeluaran-material.pengeluaran-material': ApiPengeluaranMaterialPengeluaranMaterial;
      'api::permintaan-material.permintaan-material': ApiPermintaanMaterialPermintaanMaterial;
      'api::progres-harian.progres-harian': ApiProgresHarianProgresHarian;
      'api::promo.promo': ApiPromoPromo;
      'api::proyek-perumahan.proyek-perumahan': ApiProyekPerumahanProyekPerumahan;
      'api::purchasing.purchasing': ApiPurchasingPurchasing;
      'api::rab.rab': ApiRabRab;
      'api::realisasi-anggaran.realisasi-anggaran': ApiRealisasiAnggaranRealisasiAnggaran;
      'api::serah-terima-unit.serah-terima-unit': ApiSerahTerimaUnitSerahTerimaUnit;
      'api::target-marketing.target-marketing': ApiTargetMarketingTargetMarketing;
      'api::unit-rumah.unit-rumah': ApiUnitRumahUnitRumah;
      'api::vendor.vendor': ApiVendorVendor;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
