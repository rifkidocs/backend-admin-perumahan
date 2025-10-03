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
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
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

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
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
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
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
    draftAndPublish: false;
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
    overtime_hours: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    status_absensi: Schema.Attribute.Enumeration<
      ['hadir', 'terlambat', 'absen', 'izin']
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

export interface ApiBookingDocumentBookingDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'booking_documents';
  info: {
    description: 'Documents related to booking process';
    displayName: 'Booking Document';
    pluralName: 'booking-documents';
    singularName: 'booking-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    booking: Schema.Attribute.Relation<'manyToOne', 'api::booking.booking'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    document_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    document_type: Schema.Attribute.Enumeration<
      ['ktp', 'npwp', 'slip-gaji', 'kk', 'lainnya']
    > &
      Schema.Attribute.Required;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking-document.booking-document'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upload_date: Schema.Attribute.Date & Schema.Attribute.Required;
    verified: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    verified_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    verified_date: Schema.Attribute.Date;
  };
}

export interface ApiBookingBooking extends Struct.CollectionTypeSchema {
  collectionName: 'bookings';
  info: {
    description: 'Marketing bookings management system';
    displayName: 'Booking';
    pluralName: 'bookings';
    singularName: 'booking';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    booking_date: Schema.Attribute.Date & Schema.Attribute.Required;
    booking_fee: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    booking_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    booking_status: Schema.Attribute.Enumeration<
      ['aktif', 'menunggu-pembayaran', 'dibatalkan', 'selesai']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'menunggu-pembayaran'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customer: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking-document.booking-document'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking.booking'
    > &
      Schema.Attribute.Private;
    marketing_staff: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    payment_date: Schema.Attribute.Date;
    payment_method: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'check', 'kredit']
    >;
    payment_proof: Schema.Attribute.Media<'images' | 'files'>;
    payment_status: Schema.Attribute.Enumeration<
      ['pending', 'lunas', 'overdue']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    publishedAt: Schema.Attribute.DateTime;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCommunicationCommunication
  extends Struct.CollectionTypeSchema {
  collectionName: 'communications';
  info: {
    description: 'Communication history with leads';
    displayName: 'Communication';
    pluralName: 'communications';
    singularName: 'communication';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    lead: Schema.Attribute.Relation<
      'manyToOne',
      'api::lead-marketing.lead-marketing'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::communication.communication'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
        minLength: 10;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<
      ['telepon', 'whatsapp', 'email', 'kunjungan', 'lainnya']
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContractContract extends Struct.CollectionTypeSchema {
  collectionName: 'contracts';
  info: {
    description: 'Data kontrak karyawan';
    displayName: 'Contract';
    pluralName: 'contracts';
    singularName: 'contract';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contract_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    contract_type: Schema.Attribute.Enumeration<
      ['pkwt', 'pkwtt', 'magang', 'lainnya']
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    document_url: Schema.Attribute.String;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    end_date: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contract.contract'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    position: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    salary: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<['aktif', 'berakhir', 'dibatalkan']> &
      Schema.Attribute.Required;
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
    draftAndPublish: false;
  };
  attributes: {
    alasan: Schema.Attribute.Text;
    approved_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    approved_date: Schema.Attribute.Date;
    bukti_pendukung: Schema.Attribute.Media<
      'images' | 'videos' | 'audios' | 'files',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jenis_cuti: Schema.Attribute.Enumeration<
      ['tahunan', 'sakit', 'melahirkan', 'darurat', 'lainnya']
    >;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::cuti.cuti'> &
      Schema.Attribute.Private;
    penyetuju: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    status_persetujuan: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    >;
    tanggal_mulai: Schema.Attribute.Date;
    tanggal_selesai: Schema.Attribute.Date;
    total_days: Schema.Attribute.Integer;
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
    draftAndPublish: false;
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
    draftAndPublish: false;
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
    draftAndPublish: false;
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
    draftAndPublish: false;
  };
  attributes: {
    absensi: Schema.Attribute.Relation<'oneToMany', 'api::absensi.absensi'>;
    alamat: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
        minLength: 10;
      }>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    code: Schema.Attribute.String &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    contracts: Schema.Attribute.Relation<'oneToMany', 'api::contract.contract'>;
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
    jenis_kelamin: Schema.Attribute.Enumeration<['Laki-laki', 'Perempuan']> &
      Schema.Attribute.Required;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    kontak_darurat: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
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
    nama_lengkap: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    nik_karyawan: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
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
    performance_reviews: Schema.Attribute.Relation<
      'oneToMany',
      'api::performance-review.performance-review'
    >;
    permintaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::permintaan-material.permintaan-material'
    >;
    placements: Schema.Attribute.Relation<
      'oneToMany',
      'api::placement.placement'
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
    staff_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    status_kepegawaian: Schema.Attribute.Enumeration<
      ['Tetap', 'Kontrak', 'Freelance']
    > &
      Schema.Attribute.Required;
    status_pernikahan: Schema.Attribute.Enumeration<
      ['Belum Menikah', 'Menikah', 'Cerai']
    > &
      Schema.Attribute.Required;
    tanggal_akhir_kontrak: Schema.Attribute.Date;
    tanggal_lahir: Schema.Attribute.Date & Schema.Attribute.Required;
    tanggal_masuk: Schema.Attribute.Date & Schema.Attribute.Required;
    target_marketings: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    >;
    tempat_lahir: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    unit_sales: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    >;
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
    draftAndPublish: false;
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
    draftAndPublish: false;
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
    description: 'Customer management for housing booking system';
    displayName: 'Konsumen';
    pluralName: 'konsumens';
    singularName: 'konsumen';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    bank_kpr: Schema.Attribute.Relation<'manyToOne', 'api::bank.bank'>;
    birth_date: Schema.Attribute.Date;
    birth_place: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_konsumen: Schema.Attribute.Component<'komponen.dokumen', true>;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    emergency_contact: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    kontak: Schema.Attribute.Component<'komponen.kontak', false>;
    ktp_number: Schema.Attribute.String & Schema.Attribute.Required;
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
    monthly_income: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    nama_lengkap: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    nomor_ktp: Schema.Attribute.String & Schema.Attribute.Required;
    npwp_number: Schema.Attribute.String;
    occupation: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    pekerjaan: Schema.Attribute.String;
    penghasilan_per_bulan: Schema.Attribute.Decimal;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    riwayat_pembayaran: Schema.Attribute.Component<'komponen.transaksi', true>;
    status_kpr: Schema.Attribute.Enumeration<
      ['Belum Mengajukan', 'Dalam Proses', 'Disetujui', 'Ditolak']
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
    description: 'Marketing leads management system';
    displayName: 'Lead Marketing';
    pluralName: 'lead-marketings';
    singularName: 'lead-marketing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    budget: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    communications: Schema.Attribute.Relation<
      'oneToMany',
      'api::communication.communication'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    interest: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::lead-marketing.lead-marketing'
    > &
      Schema.Attribute.Private;
    marketing: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    reminders: Schema.Attribute.Relation<'oneToMany', 'api::reminder.reminder'>;
    source: Schema.Attribute.Enumeration<
      ['website', 'pameran', 'referensi', 'iklan', 'sosmed', 'lainnya']
    > &
      Schema.Attribute.Required;
    status_lead: Schema.Attribute.Enumeration<
      ['baru', 'berminat', 'prioritas']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'baru'>;
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

export interface ApiPerformanceReviewPerformanceReview
  extends Struct.CollectionTypeSchema {
  collectionName: 'performance_reviews';
  info: {
    description: 'Data penilaian kinerja karyawan';
    displayName: 'Performance Review';
    pluralName: 'performance-reviews';
    singularName: 'performance-review';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    goals_achieved: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    goals_total: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    improvements: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::performance-review.performance-review'
    > &
      Schema.Attribute.Private;
    overall_score: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    recommendations: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    review_date: Schema.Attribute.Date & Schema.Attribute.Required;
    review_period: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    reviewer: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    status: Schema.Attribute.Enumeration<['draft', 'completed', 'approved']> &
      Schema.Attribute.Required;
    strengths: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
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
    draftAndPublish: false;
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

export interface ApiPlacementPlacement extends Struct.CollectionTypeSchema {
  collectionName: 'placements';
  info: {
    description: 'Data penempatan karyawan di proyek';
    displayName: 'Placement';
    pluralName: 'placements';
    singularName: 'placement';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    end_date: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::placement.placement'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    project_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<['aktif', 'selesai', 'dipindahkan']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProgresHarianProgresHarian
  extends Struct.CollectionTypeSchema {
  collectionName: 'progres_harians';
  info: {
    description: 'Progress tracking for construction units';
    displayName: 'Progress Update';
    pluralName: 'progres-harians';
    singularName: 'progres-harian';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    completed_work: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
        minLength: 10;
      }>;
    created_by: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    labor_hours: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    > &
      Schema.Attribute.Private;
    material_masuk: Schema.Attribute.JSON;
    material_terpakai: Schema.Attribute.JSON;
    materials_used: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    pelapor: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    persentase_progres: Schema.Attribute.Decimal;
    photos_after: Schema.Attribute.Media<'images', true>;
    photos_before: Schema.Attribute.Media<'images', true>;
    progress_after: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    progress_before: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    update_date: Schema.Attribute.Date & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    verified_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    verified_date: Schema.Attribute.Date;
    weather_condition: Schema.Attribute.Enumeration<
      ['Cerah', 'Hujan Ringan', 'Hujan Deras', 'Berawan']
    >;
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
    description: 'Project management system for housing development';
    displayName: 'Proyek Perumahan';
    pluralName: 'proyek-perumahans';
    singularName: 'proyek-perumahan';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    actual_completion: Schema.Attribute.Date;
    budget: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    completed_units: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    contact_info: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    current_expense: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    deskripsi: Schema.Attribute.Text;
    developer: Schema.Attribute.Relation<
      'manyToOne',
      'api::developer.developer'
    >;
    dokumen_legal: Schema.Attribute.Component<'komponen.dokumen', true>;
    estimated_completion: Schema.Attribute.Date & Schema.Attribute.Required;
    foto_utama: Schema.Attribute.Media<'images'>;
    galeri_foto: Schema.Attribute.Media<'images', true>;
    investment_value: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
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
    location: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 5;
      }>;
    luas_lahan: Schema.Attribute.Decimal;
    manager_proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
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
    progress_percentage: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    project_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    project_manager: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    project_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    project_type: Schema.Attribute.Enumeration<
      ['perumahan', 'pembangunan', 'renovasi']
    > &
      Schema.Attribute.Required;
    promos: Schema.Attribute.Relation<'manyToMany', 'api::promo.promo'>;
    publishedAt: Schema.Attribute.DateTime;
    rabs: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'>;
    site_plan: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<
      ['planning', 'ongoing', 'completed', 'hold']
    > &
      Schema.Attribute.Required;
    status_proyek: Schema.Attribute.Component<'komponen.status-proyek', false>;
    tahap_pengembangan: Schema.Attribute.String;
    target_marketings: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    >;
    total_units: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
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

export interface ApiReminderReminder extends Struct.CollectionTypeSchema {
  collectionName: 'reminders';
  info: {
    description: 'Follow-up reminders for leads';
    displayName: 'Reminder';
    pluralName: 'reminders';
    singularName: 'reminder';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activity: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 5;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    lead: Schema.Attribute.Relation<
      'manyToOne',
      'api::lead-marketing.lead-marketing'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::reminder.reminder'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    status_reminder: Schema.Attribute.Enumeration<
      ['pending', 'completed', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSalarySalary extends Struct.CollectionTypeSchema {
  collectionName: 'salaries';
  info: {
    description: 'Data gaji karyawan';
    displayName: 'Salary';
    pluralName: 'salaries';
    singularName: 'salary';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    basic_salary: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bonus: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currency: Schema.Attribute.String & Schema.Attribute.DefaultTo<'IDR'>;
    deductions: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    effective_date: Schema.Attribute.Date & Schema.Attribute.Required;
    employee: Schema.Attribute.Relation<'oneToOne', 'api::karyawan.karyawan'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::salary.salary'
    > &
      Schema.Attribute.Private;
    meal_allowance: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    net_salary: Schema.Attribute.Decimal;
    overtime_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    payment_method: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'check']
    > &
      Schema.Attribute.Required;
    position_allowance: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    transport_allowance: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
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
    draftAndPublish: false;
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
    description: 'Management system for housing units with construction progress tracking';
    displayName: 'Unit Rumah';
    pluralName: 'unit-rumahs';
    singularName: 'unit-rumah';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bathrooms: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    bedrooms: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    block: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    building_area: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    construction_cost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    construction_end: Schema.Attribute.Date;
    construction_start: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_unit: Schema.Attribute.Component<'komponen.dokumen', true>;
    estimated_completion: Schema.Attribute.Date & Schema.Attribute.Required;
    floor_plans: Schema.Attribute.Media<'images' | 'files', true>;
    garage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    handover_date: Schema.Attribute.Date;
    handover_status: Schema.Attribute.Enumeration<
      ['pending', 'completed', 'rejected']
    >;
    images: Schema.Attribute.Media<'images', true>;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    kavling_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    labor_cost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    land_area: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-rumah.unit-rumah'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    location_map: Schema.Attribute.String;
    marketing_staff: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    material_cost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    permintaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::permintaan-material.permintaan-material'
    >;
    price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    progress: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    project_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
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
    specifications: Schema.Attribute.JSON;
    status: Schema.Attribute.Enumeration<
      ['belum-dibangun', 'progres', 'selesai', 'serah-terima']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'belum-dibangun'>;
    status_pembangunan: Schema.Attribute.Component<
      'komponen.progres-proyek',
      true
    >;
    unit_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
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
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::absensi.absensi': ApiAbsensiAbsensi;
      'api::bank.bank': ApiBankBank;
      'api::booking-document.booking-document': ApiBookingDocumentBookingDocument;
      'api::booking.booking': ApiBookingBooking;
      'api::communication.communication': ApiCommunicationCommunication;
      'api::contract.contract': ApiContractContract;
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
      'api::performance-review.performance-review': ApiPerformanceReviewPerformanceReview;
      'api::permintaan-material.permintaan-material': ApiPermintaanMaterialPermintaanMaterial;
      'api::placement.placement': ApiPlacementPlacement;
      'api::progres-harian.progres-harian': ApiProgresHarianProgresHarian;
      'api::promo.promo': ApiPromoPromo;
      'api::proyek-perumahan.proyek-perumahan': ApiProyekPerumahanProyekPerumahan;
      'api::purchasing.purchasing': ApiPurchasingPurchasing;
      'api::rab.rab': ApiRabRab;
      'api::realisasi-anggaran.realisasi-anggaran': ApiRealisasiAnggaranRealisasiAnggaran;
      'api::reminder.reminder': ApiReminderReminder;
      'api::salary.salary': ApiSalarySalary;
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
