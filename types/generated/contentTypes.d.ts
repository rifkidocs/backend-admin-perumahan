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
    description: 'Record absensi karyawan dengan verifikasi lokasi';
    displayName: 'Absensi';
    pluralName: 'absensis';
    singularName: 'absensi';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approval_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    approved_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    attendance_schedule: Schema.Attribute.Relation<
      'manyToOne',
      'api::attendance-schedule.attendance-schedule'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    distance_from_target: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    foto_absensi: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    foto_keluar_absensi: Schema.Attribute.Media<'images'>;
    is_within_radius: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    jadwal_security: Schema.Attribute.Relation<
      'manyToOne',
      'api::jadwal-security.jadwal-security'
    >;
    jam_keluar: Schema.Attribute.DateTime;
    jam_masuk: Schema.Attribute.DateTime & Schema.Attribute.Required;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    keterangan: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    keterangan_tugas: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    laporan_patroli: Schema.Attribute.Component<
      'attendance.patrol-report',
      true
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::absensi.absensi'
    > &
      Schema.Attribute.Private;
    lokasi_absensi: Schema.Attribute.JSON & Schema.Attribute.Required;
    overtime_hours: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    rejection_reason: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    shift: Schema.Attribute.Relation<'manyToOne', 'api::shift.shift'>;
    status_absensi: Schema.Attribute.Enumeration<
      ['hadir', 'terlambat', 'absen', 'izin', 'sakit', 'lembur']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'hadir'>;
    tanggal: Schema.Attribute.Date & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAchievementUpdateAchievementUpdate
  extends Struct.CollectionTypeSchema {
  collectionName: 'achievement_updates';
  info: {
    description: 'Track individual achievement updates for marketing targets';
    displayName: 'Achievement Update';
    pluralName: 'achievement-updates';
    singularName: 'achievement-update';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    commission_earned: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::achievement-update.achievement-update'
    > &
      Schema.Attribute.Private;
    marketing_staff: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    marketing_target: Schema.Attribute.Relation<
      'manyToOne',
      'api::target-marketing.target-marketing'
    >;
    nominal_achieved: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    unit_achieved: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unit_breakdown: Schema.Attribute.JSON & Schema.Attribute.Required;
    update_date: Schema.Attribute.Date & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    verified_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    verified_date: Schema.Attribute.Date;
  };
}

export interface ApiAttendanceScheduleAttendanceSchedule
  extends Struct.CollectionTypeSchema {
  collectionName: 'attendance_schedules';
  info: {
    description: 'Jadwal absensi untuk karyawan dengan pengaturan lokasi dan waktu';
    displayName: 'Jadwal Absensi';
    pluralName: 'attendance-schedules';
    singularName: 'attendance-schedule';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    attendance_records: Schema.Attribute.Relation<
      'oneToMany',
      'api::absensi.absensi'
    >;
    created_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    effective_date: Schema.Attribute.Date & Schema.Attribute.Required;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    expiry_date: Schema.Attribute.Date;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    jam_masuk: Schema.Attribute.Time & Schema.Attribute.Required;
    jam_pulang: Schema.Attribute.Time & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::attendance-schedule.attendance-schedule'
    > &
      Schema.Attribute.Private;
    locations: Schema.Attribute.Component<'komponen.lokasi-absensi', true> &
      Schema.Attribute.Required;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    radius_meters: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5000;
          min: 10;
        },
        number
      >;
    schedule_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    updated_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAuditLogAuditLog extends Struct.CollectionTypeSchema {
  collectionName: 'audit_logs';
  info: {
    description: 'System audit trail for tracking changes';
    displayName: 'Audit Log';
    pluralName: 'audit-logs';
    singularName: 'audit-log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    action: Schema.Attribute.Enumeration<
      ['create', 'update', 'delete', 'status_change', 'login', 'logout']
    > &
      Schema.Attribute.Required;
    changes: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entity: Schema.Attribute.String & Schema.Attribute.Required;
    entityId: Schema.Attribute.Integer;
    ipAddress: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 45;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::audit-log.audit-log'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    timestamp: Schema.Attribute.DateTime & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userAgent: Schema.Attribute.Text;
    userId: Schema.Attribute.Integer;
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
    adjusted_price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    booking_date: Schema.Attribute.Date;
    booking_fee: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    booking_fee_type: Schema.Attribute.Enumeration<['Subsidi', 'Komersial']> &
      Schema.Attribute.Required;
    booking_id: Schema.Attribute.String & Schema.Attribute.Unique;
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
    original_price: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
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
    piutang_konsumens: Schema.Attribute.Relation<
      'oneToMany',
      'api::piutang-konsumen.piutang-konsumen'
    >;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit-rumah.unit-rumah'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBoqDocumentBoqDocument extends Struct.CollectionTypeSchema {
  collectionName: 'boq_documents';
  info: {
    description: 'Manage BOQ and budget documents';
    displayName: 'BOQ Document';
    pluralName: 'boq-documents';
    singularName: 'boq-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approval_date: Schema.Attribute.Date;
    approved_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    archived_at: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    creation_date: Schema.Attribute.Date;
    currency: Schema.Attribute.Enumeration<['IDR', 'USD']> &
      Schema.Attribute.DefaultTo<'IDR'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    document_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    document_type: Schema.Attribute.Enumeration<
      ['RAB', 'BOQ Material', 'BOQ Infrastruktur']
    > &
      Schema.Attribute.Required;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::boq-document.boq-document'
    > &
      Schema.Attribute.Private;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    revision: Schema.Attribute.String & Schema.Attribute.DefaultTo<'01'>;
    status_boq: Schema.Attribute.Enumeration<
      ['draft', 'approved', 'active', 'archived']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    total_amount: Schema.Attribute.Decimal;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    version: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1.0'>;
  };
}

export interface ApiBrochureBrochure extends Struct.CollectionTypeSchema {
  collectionName: 'brochures';
  info: {
    description: 'Management system for housing brochures and digital catalogs';
    displayName: 'Brochure';
    pluralName: 'brochures';
    singularName: 'brochure';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    file: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    is_active: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::brochure.brochure'
    > &
      Schema.Attribute.Private;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 2;
      }>;
    unit_types: Schema.Attribute.JSON & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCommissionPaymentCommissionPayment
  extends Struct.CollectionTypeSchema {
  collectionName: 'commission_payments';
  info: {
    description: 'Track commission payments to marketing staff';
    displayName: 'Commission Payment';
    pluralName: 'commission-payments';
    singularName: 'commission-payment';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount_paid: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bank_account: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission-payment.commission-payment'
    > &
      Schema.Attribute.Private;
    marketing_target: Schema.Attribute.Relation<
      'manyToOne',
      'api::target-marketing.target-marketing'
    >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    payment_date: Schema.Attribute.Date & Schema.Attribute.Required;
    payment_method: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'check']
    > &
      Schema.Attribute.Required;
    payment_status: Schema.Attribute.Enumeration<
      ['pending', 'completed', 'failed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    processed_by: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    reference_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCommissionStructureCommissionStructure
  extends Struct.CollectionTypeSchema {
  collectionName: 'commission_structures';
  info: {
    description: 'Define commission structures for different unit types';
    displayName: 'Commission Structure';
    pluralName: 'commission-structures';
    singularName: 'commission-structure';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bonus_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bonus_threshold: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    cash_incentive: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    commission_amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    commission_rate: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    effective_date: Schema.Attribute.Date & Schema.Attribute.Required;
    expiry_date: Schema.Attribute.Date;
    is_active: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission-structure.commission-structure'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    publishedAt: Schema.Attribute.DateTime;
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

export interface ApiCommunicationTemplateCommunicationTemplate
  extends Struct.CollectionTypeSchema {
  collectionName: 'communication_templates';
  info: {
    description: 'Management system for email and WhatsApp communication templates';
    displayName: 'Communication Template';
    pluralName: 'communication-templates';
    singularName: 'communication-template';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['Email', 'WhatsApp']> &
      Schema.Attribute.Required;
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_active: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    lead_category: Schema.Attribute.Enumeration<
      ['Berminat', 'Prioritas', 'Closed']
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::communication-template.communication-template'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 2;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    usage_count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
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
    foto_selfie: Schema.Attribute.Media<'images'>;
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
    lokasi_koordinat: Schema.Attribute.JSON;
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
    description: 'Pengajuan cuti dan izin karyawan dengan workflow approval';
    displayName: 'Leave Request';
    pluralName: 'cutis';
    singularName: 'cuti';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approval_date: Schema.Attribute.DateTime;
    approved_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    created_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    duration_days: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    emergency_contact: Schema.Attribute.JSON;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    end_date: Schema.Attribute.Date & Schema.Attribute.Required;
    handover_notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    is_paid: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    leave_type: Schema.Attribute.Enumeration<
      ['tahunan', 'melahirkan', 'sakit']
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::cuti.cuti'> &
      Schema.Attribute.Private;
    medical_certificate: Schema.Attribute.Media<'images' | 'files'>;
    penyetuju: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    reason: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    rejection_reason: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    request_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    request_type: Schema.Attribute.Enumeration<
      ['cuti', 'izin_pribadi', 'izin_dinas', 'izin_sakit']
    > &
      Schema.Attribute.Required;
    salary_deduction: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    updated_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDeadlineUnitDeadlineUnit
  extends Struct.CollectionTypeSchema {
  collectionName: 'deadline_units';
  info: {
    description: 'Unit deadline tracking and management';
    displayName: 'Deadline Unit';
    pluralName: 'deadline-units';
    singularName: 'deadline-unit';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    actual_completion_date: Schema.Attribute.Date;
    actual_start_date: Schema.Attribute.Date;
    contractor: Schema.Attribute.Relation<'manyToOne', 'api::vendor.vendor'>;
    contractor_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deadline_date: Schema.Attribute.Date & Schema.Attribute.Required;
    delay_days: Schema.Attribute.Integer;
    delay_reason: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::deadline-unit.deadline-unit'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    progress_percentage: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    quality_score: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    target_start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit-rumah.unit-rumah'>;
    unit_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    unit_status: Schema.Attribute.Enumeration<
      ['not-started', 'in-progress', 'completed', 'delayed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'not-started'>;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
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

export interface ApiDistribusiMaterialDistribusiMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'distribusi_materials';
  info: {
    description: 'Tracking perpindahan material antar gudang';
    displayName: 'Distribusi Material';
    pluralName: 'distribusi-materials';
    singularName: 'distribusi-material';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bukti_foto: Schema.Attribute.Media<'images', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    gudang_tujuan: Schema.Attribute.Relation<
      'manyToOne',
      'api::gudang.gudang'
    > &
      Schema.Attribute.Required;
    items: Schema.Attribute.Component<'distribusi.item-distribusi', true>;
    keterangan: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::distribusi-material.distribusi-material'
    > &
      Schema.Attribute.Private;
    nomor_distribusi: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    penerima: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    pengirim: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    status_distribusi: Schema.Attribute.Enumeration<
      ['Pending', 'Dikirim', 'Diterima', 'Ditolak']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Pending'>;
    tanggal_diterima: Schema.Attribute.Date;
    tanggal_pengiriman: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFasilitasProyekFasilitasProyek
  extends Struct.CollectionTypeSchema {
  collectionName: 'fasilitas_proyeks';
  info: {
    description: 'Master data for project facilities (Fasum/Fasos) and infrastructure';
    displayName: 'Fasilitas Proyek';
    pluralName: 'fasilitas-proyeks';
    singularName: 'fasilitas-proyek';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    foto: Schema.Attribute.Media<'images', true>;
    kategori: Schema.Attribute.Enumeration<
      ['Fasum', 'Fasos', 'Infrastruktur']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Infrastruktur'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::fasilitas-proyek.fasilitas-proyek'
    > &
      Schema.Attribute.Private;
    nama: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    progress: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pembangunan: Schema.Attribute.Enumeration<
      ['perencanaan', 'pembangunan', 'selesai']
    > &
      Schema.Attribute.DefaultTo<'perencanaan'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGudangGudang extends Struct.CollectionTypeSchema {
  collectionName: 'gudangs';
  info: {
    description: 'Manajemen master data gudang (Gudang Induk dan Gudang Proyek)';
    displayName: 'Gudang';
    pluralName: 'gudangs';
    singularName: 'gudang';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    alamat_lengkap: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    foto_gudang: Schema.Attribute.Media<'images' | 'files', true>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    jenis_gudang: Schema.Attribute.Enumeration<
      ['Gudang Induk', 'Gudang Proyek']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Gudang Induk'>;
    keterangan: Schema.Attribute.Text;
    kode_gudang: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    kontak_person: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::gudang.gudang'
    > &
      Schema.Attribute.Private;
    lokasi: Schema.Attribute.Text & Schema.Attribute.Required;
    material_gudangs: Schema.Attribute.Relation<
      'oneToMany',
      'api::material-gudang.material-gudang'
    >;
    nama_gudang: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
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
    status_gudang: Schema.Attribute.Enumeration<
      ['Aktif', 'Non-Aktif', 'Maintenance']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aktif'>;
    stock_opnames: Schema.Attribute.Relation<
      'oneToMany',
      'api::stock-opname.stock-opname'
    >;
    telepon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHandoverDocumentHandoverDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'handover_documents';
  info: {
    description: 'Manage handover and delivery documents';
    displayName: 'Handover Document';
    pluralName: 'handover-documents';
    singularName: 'handover-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    buyer_name: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    completion_checklist: Schema.Attribute.JSON;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    document_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    document_type: Schema.Attribute.Enumeration<
      ['BAST', 'Check List', 'Dokumen Garansi']
    > &
      Schema.Attribute.Required;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    handover_date: Schema.Attribute.Date;
    konsumen: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::handover-document.handover-document'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    signature_file: Schema.Attribute.Media<'images' | 'files'>;
    signature_required: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    status_handover: Schema.Attribute.Enumeration<
      ['draft', 'signed', 'complete', 'active']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    unit: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warranty_end_date: Schema.Attribute.Date;
    warranty_period: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<12>;
    warranty_start_date: Schema.Attribute.Date;
  };
}

export interface ApiInsentifInsentif extends Struct.CollectionTypeSchema {
  collectionName: 'insentifs';
  info: {
    description: 'Manajemen Insentif Karyawan';
    displayName: 'Insentif';
    pluralName: 'insentifs';
    singularName: 'insentif';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bonus_kinerja: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    insentif_real: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    insentif_utj: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    jabatan: Schema.Attribute.String;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    keterangan: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::insentif.insentif'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    status_pembayaran: Schema.Attribute.Enumeration<
      ['draft', 'disetujui', 'ditolak']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    take_home_pay: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tanggal_pembayaran: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
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

export interface ApiJadwalKerjaJadwalKerja extends Struct.CollectionTypeSchema {
  collectionName: 'jadwal_kerjas';
  info: {
    description: 'Jadwal kerja harian untuk pekerja konstruksi';
    displayName: 'Jadwal Kerja';
    pluralName: 'jadwal-kerjas';
    singularName: 'jadwal-kerja';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    catatan: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jumlah_pekerja: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    kehadiran: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-kerja.jadwal-kerja'
    > &
      Schema.Attribute.Private;
    lokasi_kerja: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    pekerjas: Schema.Attribute.Relation<'manyToMany', 'api::pekerja.pekerja'>;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    shift: Schema.Attribute.Relation<'manyToOne', 'api::shift.shift'>;
    status_jadwal: Schema.Attribute.Enumeration<
      ['scheduled', 'in_progress', 'completed', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'scheduled'>;
    tanggal: Schema.Attribute.Date & Schema.Attribute.Required;
    target_pekerjaan: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiJadwalMarketingJadwalMarketing
  extends Struct.CollectionTypeSchema {
  collectionName: 'jadwal_marketings';
  info: {
    description: 'Jadwal kegiatan marketing seperti pameran, open house, kunjungan';
    displayName: 'Jadwal Marketing';
    pluralName: 'jadwal-marketings';
    singularName: 'jadwal-marketing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activity_type: Schema.Attribute.Enumeration<
      [
        'exhibition',
        'open_house',
        'site_visit',
        'canvassing',
        'customer_visit',
        'phone_call',
        'create_content',
        'broadcast',
      ]
    > &
      Schema.Attribute.Required;
    assigned_staff: Schema.Attribute.Relation<
      'manyToMany',
      'api::karyawan.karyawan'
    >;
    budget: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    created_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    end_date: Schema.Attribute.DateTime;
    end_time: Schema.Attribute.Time;
    expected_leads: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    lead: Schema.Attribute.Relation<
      'manyToOne',
      'api::lead-marketing.lead-marketing'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-marketing.jadwal-marketing'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    reminder_sent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    reports: Schema.Attribute.Relation<
      'oneToMany',
      'api::laporan-kegiatan.laporan-kegiatan'
    >;
    start_date: Schema.Attribute.DateTime & Schema.Attribute.Required;
    start_time: Schema.Attribute.Time;
    status_jadwal: Schema.Attribute.Enumeration<
      ['upcoming', 'ongoing', 'completed', 'cancelled']
    > &
      Schema.Attribute.DefaultTo<'upcoming'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updated_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiJadwalProyekJadwalProyek
  extends Struct.CollectionTypeSchema {
  collectionName: 'jadwal_proyeks';
  info: {
    description: 'Project timeline and task management';
    displayName: 'Jadwal Proyek';
    pluralName: 'jadwal-proyeks';
    singularName: 'jadwal-proyek';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    actual_end_date: Schema.Attribute.Date;
    actual_start_date: Schema.Attribute.Date;
    assigned_to: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    contractor: Schema.Attribute.Relation<'manyToOne', 'api::vendor.vendor'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dependencies: Schema.Attribute.JSON;
    deviation_days: Schema.Attribute.Integer;
    duration_days: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    end_date: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-proyek.jadwal-proyek'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    phase_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    phase_relation: Schema.Attribute.Relation<
      'manyToOne',
      'api::project-phase.project-phase'
    >;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    progress_percentage: Schema.Attribute.Decimal &
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
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    task_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 2;
      }>;
    task_status: Schema.Attribute.Enumeration<
      ['planned', 'in-progress', 'completed', 'delayed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'planned'>;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit-rumah.unit-rumah'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiJadwalSecurityJadwalSecurity
  extends Struct.CollectionTypeSchema {
  collectionName: 'jadwal_securities';
  info: {
    description: 'Jadwal kerja harian untuk security';
    displayName: 'Jadwal Security';
    pluralName: 'jadwal-securities';
    singularName: 'jadwal-security';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    absensis: Schema.Attribute.Relation<'oneToMany', 'api::absensi.absensi'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-security.jadwal-security'
    > &
      Schema.Attribute.Private;
    lokasi: Schema.Attribute.Relation<'manyToOne', 'api::lokasi.lokasi'>;
    publishedAt: Schema.Attribute.DateTime;
    shift: Schema.Attribute.Relation<'manyToOne', 'api::shift.shift'>;
    status_jadwal: Schema.Attribute.Enumeration<
      ['scheduled', 'attended', 'absent', 'leave', 'off']
    > &
      Schema.Attribute.DefaultTo<'scheduled'>;
    tanggal: Schema.Attribute.Date & Schema.Attribute.Required;
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
    achievement_updates: Schema.Attribute.Relation<
      'oneToMany',
      'api::achievement-update.achievement-update'
    >;
    alamat: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
        minLength: 10;
      }>;
    approved_payables: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    attendance_schedules: Schema.Attribute.Relation<
      'oneToMany',
      'api::attendance-schedule.attendance-schedule'
    >;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    can_be_scheduled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    code: Schema.Attribute.String &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    contracts: Schema.Attribute.Relation<'oneToMany', 'api::contract.contract'>;
    created_payables: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    current_location: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    current_project: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
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
    insentifs: Schema.Attribute.Relation<'oneToMany', 'api::insentif.insentif'>;
    is_security_personnel: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    jabatan: Schema.Attribute.Relation<'manyToOne', 'api::jabatan.jabatan'>;
    jadwal_securities: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-security.jadwal-security'
    >;
    jenis_kelamin: Schema.Attribute.Enumeration<['Laki-laki', 'Perempuan']> &
      Schema.Attribute.Required;
    kas_keluars_approved: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    kas_keluars_created: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    kas_masuks_verified: Schema.Attribute.Relation<
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
    leave_quotas: Schema.Attribute.Relation<
      'oneToMany',
      'api::leave-quota.leave-quota'
    >;
    leave_requests: Schema.Attribute.Relation<'oneToMany', 'api::cuti.cuti'>;
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
    payment_invoices_paid: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    payment_invoices_verified: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    penerimaan_materials_received: Schema.Attribute.Relation<
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
    placements: Schema.Attribute.Relation<
      'oneToMany',
      'api::placement.placement'
    >;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    project_assignments: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-worker.project-worker'
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
    purchase_requests_approved: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-request.purchase-request'
    >;
    rabs: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'>;
    rekening_bank: Schema.Attribute.String;
    salary: Schema.Attribute.Relation<'oneToOne', 'api::salary.salary'>;
    serah_terima_units: Schema.Attribute.Relation<
      'oneToMany',
      'api::serah-terima-unit.serah-terima-unit'
    >;
    shift_preference: Schema.Attribute.Relation<
      'manyToOne',
      'api::shift.shift'
    >;
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
    user: Schema.Attribute.Relation<'oneToOne', 'admin::user'>;
  };
}

export interface ApiKasKeluarKasKeluar extends Struct.CollectionTypeSchema {
  collectionName: 'kas_keluars';
  info: {
    description: 'Cash out management system for all expense transactions';
    displayName: 'Kas Keluar';
    pluralName: 'kas-keluars';
    singularName: 'kas-keluar';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 9999999999;
          min: 1000;
        },
        number
      >;
    approval_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    approvedAt: Schema.Attribute.DateTime;
    approvedBy: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    attachment: Schema.Attribute.Media<'images' | 'files'>;
    bankInfo: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    category: Schema.Attribute.Enumeration<
      ['material', 'gaji', 'insentif', 'operasional', 'legal', 'lainnya']
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    department: Schema.Attribute.Enumeration<
      ['keuangan', 'gudang', 'hrm', 'project', 'marketing']
    >;
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
        minLength: 10;
      }>;
    invoiceNumber: Schema.Attribute.String &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    paymentMethod: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'cek', 'giro', 'escrow']
    > &
      Schema.Attribute.Required;
    pos_keuangan: Schema.Attribute.Relation<
      'manyToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchasing: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchasing.purchasing'
    >;
    referenceDocument: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    salary_id: Schema.Attribute.Relation<'manyToOne', 'api::salary.salary'>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::supplier.supplier'>;
    tipe_terkait: Schema.Attribute.Enumeration<
      ['proyek', 'kantor', 'lainnya']
    > &
      Schema.Attribute.DefaultTo<'proyek'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    urgent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ApiKasMasukKasMasuk extends Struct.CollectionTypeSchema {
  collectionName: 'kas_masuks';
  info: {
    description: 'Cash in system for tracking customer payments and KPR disbursements';
    displayName: 'Kas Masuk';
    pluralName: 'kas-masuks';
    singularName: 'kas-masuk';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 9999999999;
          min: 1;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customer: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 3;
      }>;
    customerRelation: Schema.Attribute.Relation<
      'manyToOne',
      'api::konsumen.konsumen'
    >;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }> &
      Schema.Attribute.DefaultTo<''>;
    paymentMethod: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'cek', 'giro']
    > &
      Schema.Attribute.Required;
    paymentProof: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    penerima: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    pos_keuangan: Schema.Attribute.Relation<
      'manyToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    reference: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<''>;
    status_transaksi: Schema.Attribute.Enumeration<
      ['pending', 'confirmed', 'rejected']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    statusPayment: Schema.Attribute.Enumeration<
      ['pending', 'verified', 'rejected']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    statusPrice: Schema.Attribute.Enumeration<
      ['standard', 'discount', 'premium']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
    type: Schema.Attribute.Enumeration<
      ['booking', 'dp', 'pelunasan', 'kpr', 'lainnya']
    > &
      Schema.Attribute.Required;
    unitRelation: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    verifiedBy: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    verifiedDate: Schema.Attribute.DateTime;
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
    email: Schema.Attribute.Email;
    emergency_contact: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    handover_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::handover-document.handover-document'
    >;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
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
    piutang_konsumens: Schema.Attribute.Relation<
      'oneToMany',
      'api::piutang-konsumen.piutang-konsumen'
    >;
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

export interface ApiKpiDivisiKpiDivisi extends Struct.CollectionTypeSchema {
  collectionName: 'kpi_divisis';
  info: {
    description: 'Key Performance Indicators per divisi';
    displayName: 'KPI Divisi';
    pluralName: 'kpi-divisis';
    singularName: 'kpi-divisi';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bulan: Schema.Attribute.Integer & Schema.Attribute.Required;
    catatan: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    divisi: Schema.Attribute.Relation<
      'manyToOne',
      'api::departemen.departemen'
    >;
    kode_divisi: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kpi-divisi.kpi-divisi'
    > &
      Schema.Attribute.Private;
    nama_divisi: Schema.Attribute.String & Schema.Attribute.Required;
    pencapaian_bulanan: Schema.Attribute.String;
    pencapaian_tahunan: Schema.Attribute.String;
    persentase_pencapaian: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    status_target: Schema.Attribute.Enumeration<
      ['tercapai', 'melebihi', 'kurang']
    > &
      Schema.Attribute.DefaultTo<'kurang'>;
    tahun: Schema.Attribute.Integer & Schema.Attribute.Required;
    target_bulanan: Schema.Attribute.String & Schema.Attribute.Required;
    target_tahunan: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLaborEstimationLaborEstimation
  extends Struct.CollectionTypeSchema {
  collectionName: 'labor_estimations';
  info: {
    description: 'Estimasi tenaga kerja untuk item pekerjaan';
    displayName: 'Labor Estimation';
    pluralName: 'labor-estimations';
    singularName: 'labor-estimation';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    estimasi_biaya: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    estimasi_jam_kerja: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    helper: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    item_pekerjaan: Schema.Attribute.Relation<
      'manyToOne',
      'api::work-item.work-item'
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::labor-estimation.labor-estimation'
    > &
      Schema.Attribute.Private;
    mandor: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    tarif_helper: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tarif_mandor: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tarif_tukang: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tukang: Schema.Attribute.Integer &
      Schema.Attribute.Required &
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

export interface ApiLaporanKegiatanLaporanKegiatan
  extends Struct.CollectionTypeSchema {
  collectionName: 'laporan_kegiatans';
  info: {
    description: 'Laporan hasil kegiatan marketing';
    displayName: 'Laporan Kegiatan';
    pluralName: 'laporan-kegiatans';
    singularName: 'laporan-kegiatan';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activity_date: Schema.Attribute.Date & Schema.Attribute.Required;
    approval_date: Schema.Attribute.DateTime;
    approved_by: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    attachments: Schema.Attribute.Media<'images' | 'files' | 'videos', true>;
    booking_fee_collected: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bookings_made: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    challenges: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    highlights: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    leads_generated: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::laporan-kegiatan.laporan-kegiatan'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    recommendations: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    report_type: Schema.Attribute.Enumeration<
      [
        'exhibition_report',
        'open_house_report',
        'canvassing_report',
        'visit_report',
        'create_content_report',
        'broadcast_report',
      ]
    > &
      Schema.Attribute.Required;
    schedule: Schema.Attribute.Relation<
      'manyToOne',
      'api::jadwal-marketing.jadwal-marketing'
    >;
    status: Schema.Attribute.Enumeration<
      ['draft', 'submitted', 'approved', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    submitted_by: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    visitors_count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
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
    communications: Schema.Attribute.Relation<
      'oneToMany',
      'api::communication.communication'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    email: Schema.Attribute.Email;
    foto_selfie: Schema.Attribute.Media<'images'>;
    interest: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::lead-marketing.lead-marketing'
    > &
      Schema.Attribute.Private;
    lokasi_koordinat: Schema.Attribute.JSON;
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
    rencana_pembelian: Schema.Attribute.Enumeration<
      ['cash', 'cash_bertahap', 'kpr']
    >;
    source: Schema.Attribute.Enumeration<
      ['website', 'kunjungan', 'media_social', 'digital_marketing', 'lainnya']
    > &
      Schema.Attribute.Required;
    status_lead: Schema.Attribute.Enumeration<
      ['ragu_ragu', 'berminat', 'prioritas']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'ragu_ragu'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeavePolicyLeavePolicy extends Struct.CollectionTypeSchema {
  collectionName: 'leave_policies';
  info: {
    description: 'Kebijakan cuti dan izin perusahaan yang dapat dikonfigurasi';
    displayName: 'Leave Policy';
    pluralName: 'leave-policies';
    singularName: 'leave-policy';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    created_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    default_quota: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    effective_date: Schema.Attribute.Date & Schema.Attribute.Required;
    employment_duration: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    expiry_date: Schema.Attribute.Date;
    gender_restriction: Schema.Attribute.Enumeration<
      ['male', 'female', 'all']
    > &
      Schema.Attribute.DefaultTo<'all'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    is_paid: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    leave_type: Schema.Attribute.Enumeration<
      ['tahunan', 'melahirkan', 'sakit']
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::leave-policy.leave-policy'
    > &
      Schema.Attribute.Private;
    max_consecutive: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    min_advance_days: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    policy_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    requires_approval: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    requires_medical: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    salary_deduction: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    updated_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeaveQuotaLeaveQuota extends Struct.CollectionTypeSchema {
  collectionName: 'leave_quotas';
  info: {
    description: 'Pengaturan kuota cuti untuk setiap karyawan berdasarkan jenis cuti';
    displayName: 'Leave Quota';
    pluralName: 'leave-quotas';
    singularName: 'leave-quota';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    annual_quota: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    created_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    leave_type: Schema.Attribute.Enumeration<
      ['tahunan', 'melahirkan', 'sakit']
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::leave-quota.leave-quota'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    remaining_quota: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    updated_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    used_quota: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    year: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2030;
          min: 2020;
        },
        number
      >;
  };
}

export interface ApiLokasiLokasi extends Struct.CollectionTypeSchema {
  collectionName: 'lokasis';
  info: {
    description: 'Master lokasi untuk absensi dan jadwal security';
    displayName: 'Lokasi Absensi';
    pluralName: 'lokasis';
    singularName: 'lokasi';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    alamat: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    latitude: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 90;
          min: -90;
        },
        number
      >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::lokasi.lokasi'
    > &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 180;
          min: -180;
        },
        number
      >;
    nama_lokasi: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    radius_meters: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 10;
        },
        number
      > &
      Schema.Attribute.DefaultTo<50>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMarketingVideoMarketingVideo
  extends Struct.CollectionTypeSchema {
  collectionName: 'marketing_videos';
  info: {
    description: 'Management system for marketing videos and 360\u00B0 tours';
    displayName: 'Marketing Video';
    pluralName: 'marketing-videos';
    singularName: 'marketing-video';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    is_active: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::marketing-video.marketing-video'
    > &
      Schema.Attribute.Private;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 2;
      }>;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video_file: Schema.Attribute.Media<'videos'>;
    video_type: Schema.Attribute.Enumeration<
      ['Tour Standar', 'Tour 360\u00B0', 'Promosi', 'Testimoni']
    > &
      Schema.Attribute.Required;
  };
}

export interface ApiMaterialGudangMaterialGudang
  extends Struct.CollectionTypeSchema {
  collectionName: 'material_gudangs';
  info: {
    description: 'Stok material per gudang';
    displayName: 'Material Gudang (Stok)';
    pluralName: 'material-gudangs';
    singularName: 'material-gudang';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    gudang: Schema.Attribute.Relation<'manyToOne', 'api::gudang.gudang'>;
    last_updated_by: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::material-gudang.material-gudang'
    > &
      Schema.Attribute.Private;
    material: Schema.Attribute.Relation<'manyToOne', 'api::material.material'>;
    publishedAt: Schema.Attribute.DateTime;
    stok: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    stok_minimal: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMaterialMaterial extends Struct.CollectionTypeSchema {
  collectionName: 'materials';
  info: {
    description: 'Manajemen inventaris material konstruksi';
    displayName: 'Material';
    pluralName: 'materials';
    singularName: 'material';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text;
    evaluations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier-evaluation.supplier-evaluation'
    >;
    foto_material: Schema.Attribute.Media<'images' | 'files', true>;
    harga_satuan: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    kode_material: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::material.material'
    > &
      Schema.Attribute.Private;
    material_gudangs: Schema.Attribute.Relation<
      'oneToMany',
      'api::material-gudang.material-gudang'
    >;
    nama_material: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    publishedAt: Schema.Attribute.DateTime;
    satuan: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    status_material: Schema.Attribute.Enumeration<
      ['Tersedia', 'Segera Habis', 'Habis']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Tersedia'>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::vendor.vendor'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPaymentInvoicePaymentInvoice
  extends Struct.CollectionTypeSchema {
  collectionName: 'payment_invoices';
  info: {
    description: 'Accounts payable management system for supplier invoices and payment tracking';
    displayName: 'Tagihan & Hutang';
    pluralName: 'payment-invoices';
    singularName: 'payment-invoice';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 999999999;
          min: 0.01;
        },
        number
      >;
    approvedBy: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    approvedDate: Schema.Attribute.DateTime;
    attachments: Schema.Attribute.Media<'images' | 'files', true>;
    category: Schema.Attribute.Enumeration<
      ['material', 'jasa', 'operasional', 'legal', 'lainnya']
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currency: Schema.Attribute.Enumeration<['IDR', 'USD', 'EUR']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'IDR'>;
    department: Schema.Attribute.Enumeration<
      ['gudang', 'proyek', 'hrm', 'marketing', 'operasional', 'umum']
    >;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
        minLength: 10;
      }>;
    discountAmount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    dueDate: Schema.Attribute.Date & Schema.Attribute.Required;
    fullyPaidDate: Schema.Attribute.DateTime;
    goodsReceipt: Schema.Attribute.Relation<
      'manyToOne',
      'api::penerimaan-material.penerimaan-material'
    >;
    invoiceDate: Schema.Attribute.Date & Schema.Attribute.Required;
    invoiceDocument: Schema.Attribute.Media<'images' | 'files'>;
    invoiceNumber: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    lastPaymentDate: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    overdueNotified: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    paid_amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    paidBy: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    paymentMethod: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'check', 'giro', 'others']
    >;
    paymentReference: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    paymentTerms: Schema.Attribute.Enumeration<
      ['cash', 'dp', 'termin', 'net30', 'net60']
    > &
      Schema.Attribute.Required;
    penaltyAmount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    priority: Schema.Attribute.Enumeration<
      ['low', 'normal', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchaseOrder: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchasing.purchasing'
    >;
    referenceNumber: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    remaining_amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    riwayat_pembayarans: Schema.Attribute.Relation<
      'oneToMany',
      'api::riwayat-pembayaran.riwayat-pembayaran'
    >;
    status_pembayaran: Schema.Attribute.Enumeration<
      ['pending', 'partial', 'paid', 'overdue', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    statusInvoice: Schema.Attribute.Enumeration<
      ['received', 'verified', 'rejected', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'received'>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::supplier.supplier'>;
    taxAmount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    taxIncluded: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    verifiedBy: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    verifiedDate: Schema.Attribute.DateTime;
  };
}

export interface ApiPekerjaPekerja extends Struct.CollectionTypeSchema {
  collectionName: 'pekerjas';
  info: {
    description: 'Tenaga kerja lapangan untuk proyek konstruksi';
    displayName: 'Pekerja';
    pluralName: 'pekerjas';
    singularName: 'pekerja';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    alamat: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen: Schema.Attribute.Component<'komponen.dokumen', true>;
    foto: Schema.Attribute.Media<'images'>;
    jadwal_kerjas: Schema.Attribute.Relation<
      'manyToMany',
      'api::jadwal-kerja.jadwal-kerja'
    >;
    keahlian: Schema.Attribute.JSON;
    kontrak: Schema.Attribute.Media<'files'>;
    ktp: Schema.Attribute.Media<'images' | 'files'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pekerja.pekerja'
    > &
      Schema.Attribute.Private;
    mandor_progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    nama_lengkap: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    nik: Schema.Attribute.String & Schema.Attribute.Unique;
    nomor_hp: Schema.Attribute.String;
    penugasans: Schema.Attribute.Relation<
      'manyToMany',
      'api::penugasan.penugasan'
    >;
    posisi: Schema.Attribute.Enumeration<
      [
        'Mandor',
        'Tukang',
        'Kernet',
        'Operator Alat',
        'Security',
        'Cleaning Service',
      ]
    > &
      Schema.Attribute.Required;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pekerja: Schema.Attribute.Enumeration<
      ['Aktif', 'Nonaktif', 'Cuti']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aktif'>;
    tanggal_berakhir: Schema.Attribute.Date;
    tanggal_mulai: Schema.Attribute.Date & Schema.Attribute.Required;
    tukang_progres_harians: Schema.Attribute.Relation<
      'manyToMany',
      'api::progres-harian.progres-harian'
    >;
    upah_harian: Schema.Attribute.Decimal &
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

export interface ApiPenerimaanMaterialPenerimaanMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'penerimaan_materials';
  info: {
    description: 'Material receiving system for warehouse management';
    displayName: 'Penerimaan Material';
    pluralName: 'penerimaan-materials';
    singularName: 'penerimaan-material';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deliveryPerson: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    deliveryPersonPhone: Schema.Attribute.String;
    evaluations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier-evaluation.supplier-evaluation'
    >;
    gudang: Schema.Attribute.Relation<'manyToOne', 'api::gudang.gudang'>;
    keterangan: Schema.Attribute.Text;
    list_materials: Schema.Attribute.Component<
      'penerimaan.material-item',
      true
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    > &
      Schema.Attribute.Private;
    nota: Schema.Attribute.Media<'images'>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    penerima: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    poNumber: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchaseOrder: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchase-order.purchase-order'
    >;
    purchasing: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchasing.purchasing'
    >;
    qualityCheckDate: Schema.Attribute.DateTime;
    qualityChecked: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    qualityChecker: Schema.Attribute.String;
    receivedBy: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    receivingDate: Schema.Attribute.Date & Schema.Attribute.Required;
    receivingTime: Schema.Attribute.String & Schema.Attribute.Required;
    statusReceiving: Schema.Attribute.Enumeration<
      ['pending', 'in-progress', 'completed', 'rejected']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::supplier.supplier'>;
    total_pembelian: Schema.Attribute.Decimal &
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

export interface ApiPengeluaranMaterialPengeluaranMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'pengeluaran_materials';
  info: {
    description: 'Sistem Pengeluaran dan Distribusi Material dari gudang ke proyek dengan tracking lengkap';
    displayName: 'Pengeluaran & Distribusi Material';
    pluralName: 'pengeluaran-materials';
    singularName: 'pengeluaran-material';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    actualArrival: Schema.Attribute.DateTime;
    approvalStatus: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    approver: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    deliveryCost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    deliveryNotes: Schema.Attribute.Text;
    departureTime: Schema.Attribute.DateTime;
    distributionNumber: Schema.Attribute.String & Schema.Attribute.Unique;
    documents: Schema.Attribute.Media<'images' | 'files', true>;
    driver: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    escort: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    estimatedArrival: Schema.Attribute.DateTime;
    fasilitas_proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::fasilitas-proyek.fasilitas-proyek'
    >;
    list_materials: Schema.Attribute.Component<
      'pengeluaran.item-pengeluaran',
      true
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    > &
      Schema.Attribute.Private;
    mrNumber: Schema.Attribute.String & Schema.Attribute.Unique;
    needCrane: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    needHelper: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    notes: Schema.Attribute.Text;
    penyetuju: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    priorityLevel: Schema.Attribute.Enumeration<
      ['low', 'normal', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    progres_harian: Schema.Attribute.Relation<
      'oneToOne',
      'api::progres-harian.progres-harian'
    >;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    > &
      Schema.Attribute.Required;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    receiverName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    receiverPosition: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    requester: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    specialInstructions: Schema.Attribute.Text;
    status_issuance: Schema.Attribute.Enumeration<
      [
        'pending',
        'in-transit',
        'delivered',
        'Pending',
        'Sedang Diproses',
        'Selesai',
      ]
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    supervisor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    time: Schema.Attribute.Time & Schema.Attribute.Required;
    trackingNotes: Schema.Attribute.Text;
    transportType: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vehicle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    vehicleCapacity: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    vehicleNumber: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    warehouseSupervisor: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
  };
}

export interface ApiPenugasanPenugasan extends Struct.CollectionTypeSchema {
  collectionName: 'penugasans';
  info: {
    description: 'Penugasan pekerjaan untuk pekerja konstruksi';
    displayName: 'Penugasan';
    pluralName: 'penugasans';
    singularName: 'penugasan';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    actual_output: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    catatan: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    estimasi_durasi: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    jumlah_pekerja: Schema.Attribute.Integer &
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
      'api::penugasan.penugasan'
    > &
      Schema.Attribute.Private;
    lokasi: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    materials_required: Schema.Attribute.JSON;
    nama_tugas: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    pekerjas: Schema.Attribute.Relation<'manyToMany', 'api::pekerja.pekerja'>;
    penanggung_jawab: Schema.Attribute.Relation<
      'manyToOne',
      'api::pekerja.pekerja'
    >;
    prioritas: Schema.Attribute.Enumeration<
      ['Rendah', 'Sedang', 'Tinggi', 'Urgent']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Sedang'>;
    progress_persentase: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_tugas: Schema.Attribute.Enumeration<
      ['Belum Mulai', 'On Progress', 'Selesai', 'Dibatalkan']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Belum Mulai'>;
    tanggal_mulai: Schema.Attribute.Date & Schema.Attribute.Required;
    tanggal_selesai: Schema.Attribute.Date & Schema.Attribute.Required;
    target_output: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPerformanceReviewPerformanceReview
  extends Struct.CollectionTypeSchema {
  collectionName: 'performance_reviews';
  info: {
    description: 'Data evaluasi kinerja karyawan';
    displayName: 'Penilaian Kinerja';
    pluralName: 'performance-reviews';
    singularName: 'performance-review';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bulan_evaluasi: Schema.Attribute.Integer & Schema.Attribute.Required;
    catatan_review: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    divisi: Schema.Attribute.Relation<
      'manyToOne',
      'api::departemen.departemen'
    >;
    employee: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    jabatan: Schema.Attribute.Relation<'manyToOne', 'api::jabatan.jabatan'>;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::performance-review.performance-review'
    > &
      Schema.Attribute.Private;
    nama_karyawan: Schema.Attribute.String & Schema.Attribute.Required;
    nik_karyawan: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    pencapaian_target: Schema.Attribute.String;
    persentase_pencapaian: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    rating_kinerja: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    reviewer: Schema.Attribute.String & Schema.Attribute.Required;
    status_evaluasi: Schema.Attribute.Enumeration<
      ['draft', 'submitted', 'reviewed', 'approved']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    tahun_evaluasi: Schema.Attribute.Integer & Schema.Attribute.Required;
    tanggal_evaluasi: Schema.Attribute.Date & Schema.Attribute.Required;
    tanggal_review: Schema.Attribute.DateTime;
    target_divisi: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPermitDocumentPermitDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'permit_documents';
  info: {
    description: 'Manage permit and legal documents';
    displayName: 'Permit Document';
    pluralName: 'permit-documents';
    singularName: 'permit-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    compliance_status: Schema.Attribute.Enumeration<
      ['compliant', 'non_compliant', 'pending_review']
    > &
      Schema.Attribute.DefaultTo<'pending_review'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    document_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    document_type: Schema.Attribute.Enumeration<
      ['IMB', 'PBG', 'Izin Lingkungan', 'Izin Lainnya']
    > &
      Schema.Attribute.Required;
    expiry_date: Schema.Attribute.Date;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    is_legal_requirement: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    issue_date: Schema.Attribute.Date;
    issuing_authority: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::permit-document.permit-document'
    > &
      Schema.Attribute.Private;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'critical']
    > &
      Schema.Attribute.DefaultTo<'high'>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    renewal_date: Schema.Attribute.Date;
    renewal_status: Schema.Attribute.Enumeration<
      ['not_required', 'pending', 'in_progress', 'completed']
    > &
      Schema.Attribute.DefaultTo<'not_required'>;
    status_permit: Schema.Attribute.Enumeration<
      ['active', 'expired', 'pending', 'draft']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPertukaranJadwalPertukaranJadwal
  extends Struct.CollectionTypeSchema {
  collectionName: 'pertukaran_jadwals';
  info: {
    description: 'Pengajuan tukar jadwal shift security';
    displayName: 'Pertukaran Jadwal';
    pluralName: 'pertukaran-jadwals';
    singularName: 'pertukaran-jadwal';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approval_date: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pertukaran-jadwal.pertukaran-jadwal'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    reason: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    requester: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    requesting_schedule: Schema.Attribute.Relation<
      'oneToOne',
      'api::jadwal-security.jadwal-security'
    >;
    response_note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    status_pertukaran: Schema.Attribute.Enumeration<
      [
        'pending',
        'approved_by_target',
        'approved_by_admin',
        'rejected',
        'cancelled',
      ]
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    target_schedule: Schema.Attribute.Relation<
      'oneToOne',
      'api::jadwal-security.jadwal-security'
    >;
    target_user: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPiutangKonsumenPiutangKonsumen
  extends Struct.CollectionTypeSchema {
  collectionName: 'piutang_konsumens';
  info: {
    description: 'Consumer receivables management for property sales';
    displayName: 'Piutang Konsumen';
    pluralName: 'piutang-konsumens';
    singularName: 'piutang-konsumen';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    booking: Schema.Attribute.Relation<'manyToOne', 'api::booking.booking'>;
    booking_fee: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: '0';
        },
        string
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customer: Schema.Attribute.Relation<'manyToOne', 'api::konsumen.konsumen'>;
    down_payment: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: '0';
        },
        string
      >;
    due_date: Schema.Attribute.Date;
    kpr_status: Schema.Attribute.Enumeration<
      ['proses', 'disetujui', 'gagal', 'tidak']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'tidak'>;
    last_payment: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::piutang-konsumen.piutang-konsumen'
    > &
      Schema.Attribute.Private;
    next_payment: Schema.Attribute.Date;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    payment_schedule: Schema.Attribute.Enumeration<
      ['cash', 'dp', 'termin', 'kpr']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'dp'>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    remaining_amount: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: '0';
        },
        string
      >;
    riwayat_pembayarans: Schema.Attribute.Relation<
      'oneToMany',
      'api::riwayat-pembayaran.riwayat-pembayaran'
    >;
    status_piutang: Schema.Attribute.Enumeration<
      ['active', 'overdue', 'completed', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'active'>;
    total_price: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit-rumah.unit-rumah'>;
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
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status_penempatan: Schema.Attribute.Enumeration<
      ['aktif', 'selesai', 'dipindahkan']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'aktif'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPosKeuanganPosKeuangan extends Struct.CollectionTypeSchema {
  collectionName: 'pos_keuangans';
  info: {
    description: 'Manajemen pos keuangan (Kas, Bank, Cek/Giro)';
    displayName: 'Pos Keuangan';
    pluralName: 'pos-keuangans';
    singularName: 'pos-keuangan';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    jenis_rekening: Schema.Attribute.Enumeration<
      ['tunai', 'tabungan', 'giro', 'cek', 'deposito', 'elektronik']
    > &
      Schema.Attribute.DefaultTo<'tabungan'>;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pos-keuangan.pos-keuangan'
    > &
      Schema.Attribute.Private;
    nama_pemilik: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    nama_pos: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    nomor_rekening: Schema.Attribute.String &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    saldo: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    saldo_minimum: Schema.Attribute.Decimal;
    status_aktif: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPotonganTunjanganPotonganTunjangan
  extends Struct.SingleTypeSchema {
  collectionName: 'potongan_tunjangans';
  info: {
    displayName: 'Potongan Tunjangan';
    pluralName: 'potongan-tunjangans';
    singularName: 'potongan-tunjangan';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::potongan-tunjangan.potongan-tunjangan'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    tunjangan_bpjs_kesehatan: Schema.Attribute.Decimal;
    tunjangan_bpjs_ketenagakerjaan: Schema.Attribute.Decimal;
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
    displayName: 'Progress Harian';
    pluralName: 'progres-harians';
    singularName: 'progres-harian';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aktivitas: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    catatan: Schema.Attribute.Text;
    catatan_kehadiran: Schema.Attribute.Text;
    completed_work: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
        minLength: 10;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dampak_konstruksi: Schema.Attribute.Enumeration<
      ['tidak_ada', 'minor', 'sedang', 'signifikan']
    > &
      Schema.Attribute.DefaultTo<'tidak_ada'>;
    deskripsi: Schema.Attribute.Text;
    detail_foto: Schema.Attribute.JSON;
    durasi_tunda: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    fasilitas_proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::fasilitas-proyek.fasilitas-proyek'
    >;
    foto_dokumentasi: Schema.Attribute.Media<'images', true>;
    kernet: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    keterangan_cuaca: Schema.Attribute.Text;
    kondisi_cuaca: Schema.Attribute.Enumeration<
      [
        'cerah',
        'cerah_berawan',
        'berawan',
        'hujan_ringan',
        'hujan_sedang',
        'hujan_lebat',
        'angin_kencang',
      ]
    >;
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
    mandor: Schema.Attribute.Relation<'manyToOne', 'api::pekerja.pekerja'>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    pelapor: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    persentase_kehadiran: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    persentase_progres: Schema.Attribute.Decimal;
    photos_after: Schema.Attribute.Media<'images', true>;
    photos_before: Schema.Attribute.Media<'images', true>;
    progress_after: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    progress_before: Schema.Attribute.Integer &
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
    status_dokumen: Schema.Attribute.Enumeration<['draft', 'published']> &
      Schema.Attribute.DefaultTo<'draft'>;
    status_harian: Schema.Attribute.Enumeration<
      ['sesuai_jadwal', 'terlambat', 'maju_jadwal']
    > &
      Schema.Attribute.DefaultTo<'sesuai_jadwal'>;
    total_pekerja: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tukang: Schema.Attribute.Relation<'manyToMany', 'api::pekerja.pekerja'>;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    update_date: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    verified_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    verified_date: Schema.Attribute.Date;
  };
}

export interface ApiProjectDocumentProjectDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'project_documents';
  info: {
    description: 'Manage project documents and files';
    displayName: 'Project Document';
    pluralName: 'project-documents';
    singularName: 'project-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    access_level: Schema.Attribute.Enumeration<
      ['public', 'internal', 'confidential', 'restricted']
    > &
      Schema.Attribute.DefaultTo<'internal'>;
    approval_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected', 'needs_revision']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    approved_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    document_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    document_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    document_type: Schema.Attribute.Enumeration<
      [
        'imb',
        'sjp',
        'kontrak',
        'laporan',
        'gambar_arsitektur',
        'gambar_struktur',
        'rab',
        'legal',
        'lainnya',
      ]
    > &
      Schema.Attribute.Required;
    expiry_date: Schema.Attribute.Date;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    is_legal_requirement: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    issue_date: Schema.Attribute.Date;
    issued_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    issued_to: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-document.project-document'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'critical']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    renewal_date: Schema.Attribute.Date;
    status: Schema.Attribute.Enumeration<
      ['active', 'expired', 'renewal-needed', 'draft', 'review']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    tags: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    version: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1.0'>;
  };
}

export interface ApiProjectMaterialProjectMaterial
  extends Struct.CollectionTypeSchema {
  collectionName: 'project_materials';
  info: {
    description: 'Manage project materials and inventory';
    displayName: 'Project Material';
    pluralName: 'project-materials';
    singularName: 'project-material';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    batch_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    category: Schema.Attribute.Enumeration<
      [
        'structural',
        'finishing',
        'mep',
        'electrical',
        'plumbing',
        'landscaping',
        'other',
      ]
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    delivery_date: Schema.Attribute.Date;
    expiry_date: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-material.project-material'
    > &
      Schema.Attribute.Private;
    material_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    material_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    quality_status: Schema.Attribute.Enumeration<
      ['good', 'damaged', 'rejected', 'tested', 'pending']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    quantity_planned: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    quantity_received: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    quantity_remaining: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    quantity_used: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    serial_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    specification: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    storage_location: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    supplier: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    total_cost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    unit_price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vendor: Schema.Attribute.Relation<'manyToOne', 'api::vendor.vendor'>;
  };
}

export interface ApiProjectPhaseProjectPhase
  extends Struct.CollectionTypeSchema {
  collectionName: 'project_phases';
  info: {
    description: 'Manage project phases and milestones';
    displayName: 'Project Phase';
    pluralName: 'project-phases';
    singularName: 'project-phase';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    actual_cost: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    actual_end_date: Schema.Attribute.Date;
    budget_allocation: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-phase.project-phase'
    > &
      Schema.Attribute.Private;
    milestones: Schema.Attribute.JSON;
    phase_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    phase_status: Schema.Attribute.Enumeration<
      ['planning', 'ongoing', 'completed', 'delayed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'planning'>;
    progress_percentage: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    target_end_date: Schema.Attribute.Date & Schema.Attribute.Required;
    tasks: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-proyek.jadwal-proyek'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProjectWorkerProjectWorker
  extends Struct.CollectionTypeSchema {
  collectionName: 'project_workers';
  info: {
    description: 'Manage project workers and labor assignment';
    displayName: 'Project Worker';
    pluralName: 'project-workers';
    singularName: 'project-worker';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    daily_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    employee_id: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    end_date: Schema.Attribute.Date;
    hourly_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    id_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    karyawan: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-worker.project-worker'
    > &
      Schema.Attribute.Private;
    monthly_rate: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    phone: Schema.Attribute.String;
    position: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    skills: Schema.Attribute.JSON;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status_pekerja: Schema.Attribute.Enumeration<
      ['aktif', 'nonaktif', 'cuti', 'terminated']
    > &
      Schema.Attribute.DefaultTo<'aktif'>;
    team_leader: Schema.Attribute.String;
    total_hours_worked: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    worker_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    worker_type: Schema.Attribute.Enumeration<
      ['karyawan', 'outsourced', 'harian']
    > &
      Schema.Attribute.Required;
  };
}

export interface ApiPromoPromo extends Struct.CollectionTypeSchema {
  collectionName: 'promos';
  info: {
    description: 'Promotion management system for housing projects';
    displayName: 'Promotion';
    pluralName: 'promos';
    singularName: 'promo';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
        minLength: 3;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    end_date: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::promo.promo'> &
      Schema.Attribute.Private;
    max_discount: Schema.Attribute.BigInteger &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    min_purchase: Schema.Attribute.BigInteger &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status_promotion: Schema.Attribute.Enumeration<
      ['Aktif', 'Tidak Aktif', 'Expired']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aktif'>;
    terms_conditions: Schema.Attribute.RichText;
    type: Schema.Attribute.Enumeration<
      ['Diskon Langsung', 'Cashback', 'Free Item']
    > &
      Schema.Attribute.Required;
    unit_types: Schema.Attribute.JSON & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    usage_limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    used_count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    value: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    value_type: Schema.Attribute.Enumeration<
      ['Fixed', 'Percentage', 'Item Value']
    > &
      Schema.Attribute.Required;
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
    draftAndPublish: false;
  };
  attributes: {
    actual_completion: Schema.Attribute.Date;
    address: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    boq_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::boq-document.boq-document'
    >;
    brochures: Schema.Attribute.Relation<'oneToMany', 'api::brochure.brochure'>;
    budget: Schema.Attribute.Text & Schema.Attribute.Required;
    building_license: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    completed_units: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    contact_info: Schema.Attribute.JSON;
    contractors: Schema.Attribute.Relation<'manyToMany', 'api::vendor.vendor'>;
    coordinate_lat: Schema.Attribute.Float &
      Schema.Attribute.SetMinMax<
        {
          max: 90;
          min: -90;
        },
        number
      >;
    coordinate_lng: Schema.Attribute.Float &
      Schema.Attribute.SetMinMax<
        {
          max: 180;
          min: -180;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    current_expense: Schema.Attribute.Text;
    developer: Schema.Attribute.Relation<
      'manyToOne',
      'api::developer.developer'
    >;
    documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-document.project-document'
    >;
    dokumen_legal: Schema.Attribute.Component<'komponen.dokumen', true>;
    environment_permits: Schema.Attribute.JSON;
    estimated_completion: Schema.Attribute.Date & Schema.Attribute.Required;
    fasilitas_proyeks: Schema.Attribute.Relation<
      'oneToMany',
      'api::fasilitas-proyek.fasilitas-proyek'
    >;
    foto_utama: Schema.Attribute.Media<'images'>;
    galeri_foto: Schema.Attribute.Media<'images', true>;
    gudangs: Schema.Attribute.Relation<'oneToMany', 'api::gudang.gudang'>;
    handover_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::handover-document.handover-document'
    >;
    interested_leads: Schema.Attribute.Relation<
      'oneToMany',
      'api::lead-marketing.lead-marketing'
    >;
    investment_value: Schema.Attribute.Text;
    jadwal_kerjas: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-kerja.jadwal-kerja'
    >;
    jenis_proyek: Schema.Attribute.Enumeration<
      ['Subsidi', 'Komersial', 'Mixed-Use']
    >;
    karyawans: Schema.Attribute.Relation<'oneToMany', 'api::karyawan.karyawan'>;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    kas_masuks: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-masuk.kas-masuk'
    >;
    labor_estimations: Schema.Attribute.Relation<
      'oneToMany',
      'api::labor-estimation.labor-estimation'
    >;
    land_area: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::proyek-perumahan.proyek-perumahan'
    > &
      Schema.Attribute.Private;
    manager_proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    marketing_videos: Schema.Attribute.Relation<
      'oneToMany',
      'api::marketing-video.marketing-video'
    >;
    materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-material.project-material'
    >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    pekerjas: Schema.Attribute.Relation<'oneToMany', 'api::pekerja.pekerja'>;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    penugasans: Schema.Attribute.Relation<
      'oneToMany',
      'api::penugasan.penugasan'
    >;
    permit_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::permit-document.permit-document'
    >;
    phases: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-phase.project-phase'
    >;
    piutang_konsumens: Schema.Attribute.Relation<
      'oneToMany',
      'api::piutang-konsumen.piutang-konsumen'
    >;
    placements: Schema.Attribute.Relation<
      'oneToMany',
      'api::placement.placement'
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
    project_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    project_id: Schema.Attribute.String & Schema.Attribute.Unique;
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
    promotions: Schema.Attribute.Relation<'oneToMany', 'api::promo.promo'>;
    publishedAt: Schema.Attribute.DateTime;
    purchase_requests: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-request.purchase-request'
    >;
    rabs: Schema.Attribute.Relation<'oneToMany', 'api::rab.rab'>;
    site_plan: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    site_plan_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::site-plan-document.site-plan-document'
    >;
    start_date: Schema.Attribute.Date & Schema.Attribute.Required;
    status_proyek: Schema.Attribute.Enumeration<
      ['perencanaan', 'pembangunan', 'terjual habis']
    > &
      Schema.Attribute.Required;
    subkontraktors: Schema.Attribute.Relation<
      'oneToMany',
      'api::subkontraktor.subkontraktor'
    >;
    target_marketings: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    >;
    technical_drawings: Schema.Attribute.Relation<
      'oneToMany',
      'api::technical-drawing.technical-drawing'
    >;
    total_units: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unit_material_requirements: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-material-requirement.unit-material-requirement'
    >;
    unit_pricings: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-pricing.unit-pricing'
    >;
    unit_types: Schema.Attribute.JSON;
    units: Schema.Attribute.Relation<'oneToMany', 'api::unit-rumah.unit-rumah'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    work_items: Schema.Attribute.Relation<
      'oneToMany',
      'api::work-item.work-item'
    >;
    workers: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-worker.project-worker'
    >;
    zoning_type: Schema.Attribute.Enumeration<
      ['residensial', 'komersial', 'campuran']
    >;
  };
}

export interface ApiPurchaseOrderPurchaseOrder
  extends Struct.CollectionTypeSchema {
  collectionName: 'purchase_orders';
  info: {
    description: 'Purchase orders for materials and services with workflow management';
    displayName: 'Purchase Order';
    pluralName: 'purchase-orders';
    singularName: 'purchase-order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    evaluations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier-evaluation.supplier-evaluation'
    >;
    items: Schema.Attribute.Component<'shared.material-item', true> &
      Schema.Attribute.Required;
    kode: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order.purchase-order'
    > &
      Schema.Attribute.Private;
    nomor_po: Schema.Attribute.String & Schema.Attribute.Unique;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    payment_terms: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchase_request: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchase-request.purchase-request'
    >;
    status: Schema.Attribute.Enumeration<
      [
        'draft',
        'sent',
        'approved',
        'rejected',
        'completed',
        'cancelled',
        'delivered',
      ]
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    status_delivery: Schema.Attribute.Enumeration<
      [
        'pending',
        'processing',
        'shipped',
        'partial_delivered',
        'delivered',
        'returned',
      ]
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    status_payment: Schema.Attribute.Enumeration<
      ['pending', 'partial', 'paid', 'overdue', 'cancelled']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    status_po: Schema.Attribute.Enumeration<
      ['draft', 'dikirim', 'diterima_sebagian', 'diterima', 'dibatalkan']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'draft'>;
    status_price: Schema.Attribute.Enumeration<
      ['standard', 'negotiated', 'promo', 'special', 'emergency']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
    status_quality: Schema.Attribute.Enumeration<
      ['pending', 'passed', 'failed', 'conditional', 'rework']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::supplier.supplier'>;
    tanggal: Schema.Attribute.Date & Schema.Attribute.Required;
    tanggal_estimasi_delivery: Schema.Attribute.Date;
    total_amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
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

export interface ApiPurchaseRequestPurchaseRequest
  extends Struct.CollectionTypeSchema {
  collectionName: 'purchase_requests';
  info: {
    description: 'Purchase Request system for external supplier procurement';
    displayName: 'Purchase Request';
    pluralName: 'purchase-requests';
    singularName: 'purchase-request';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approved_by: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    approved_date: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    estimated_price: Schema.Attribute.Decimal;
    items: Schema.Attribute.Component<'shared.material-item', true> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-request.purchase-request'
    > &
      Schema.Attribute.Private;
    needed_date: Schema.Attribute.Date & Schema.Attribute.Required;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    po_reference: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    pr_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    priority: Schema.Attribute.Enumeration<
      ['low', 'normal', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchase_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order.purchase-order'
    >;
    request_date: Schema.Attribute.Date & Schema.Attribute.Required;
    request_type: Schema.Attribute.Enumeration<['Proyek', 'Gudang']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Proyek'>;
    requester: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    status_purchase: Schema.Attribute.Enumeration<
      ['submitted', 'approved', 'processed', 'completed', 'rejected']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'submitted'>;
    supplier_id: Schema.Attribute.Relation<
      'manyToOne',
      'api::supplier.supplier'
    >;
    total_amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
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

export interface ApiPurchasingPurchasing extends Struct.CollectionTypeSchema {
  collectionName: 'purchasings';
  info: {
    description: 'Manajemen Purchase Order dan delivery material';
    displayName: 'Purchasing';
    pluralName: 'purchasings';
    singularName: 'purchasing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approved_by: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    catatan: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchasing.purchasing'
    > &
      Schema.Attribute.Private;
    materials: Schema.Attribute.Component<'shared.material-item', true> &
      Schema.Attribute.Required;
    nomor_po: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_po: Schema.Attribute.Enumeration<
      ['Diproses', 'Dikirim', 'Diterima', 'Terlambat', 'Dibatalkan']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Diproses'>;
    supplier: Schema.Attribute.String & Schema.Attribute.Required;
    tanggal_actual_delivery: Schema.Attribute.Date;
    tanggal_estimasi_delivery: Schema.Attribute.Date &
      Schema.Attribute.Required;
    tanggal_order: Schema.Attribute.Date & Schema.Attribute.Required;
    total_harga: Schema.Attribute.Decimal &
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

export interface ApiRatingKinerjaRatingKinerja
  extends Struct.CollectionTypeSchema {
  collectionName: 'rating_kinerjas';
  info: {
    description: 'Distribusi rating kinerja karyawan';
    displayName: 'Rating Kinerja';
    pluralName: 'rating-kinerjas';
    singularName: 'rating-kinerja';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bulan: Schema.Attribute.Integer & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    jumlah_karyawan: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    label_rating: Schema.Attribute.Enumeration<
      ['Poor', 'Needs Improvement', 'Satisfactory', 'Good', 'Excellent']
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::rating-kinerja.rating-kinerja'
    > &
      Schema.Attribute.Private;
    persentase: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    tahun: Schema.Attribute.Integer & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warna_badge: Schema.Attribute.String;
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

export interface ApiReminderKeterlambatanReminderKeterlambatan
  extends Struct.CollectionTypeSchema {
  collectionName: 'reminder_keterlambatans';
  info: {
    description: 'Delay reminders and notifications for project timeline issues';
    displayName: 'Reminder Keterlambatan';
    pluralName: 'reminder-keterlambatans';
    singularName: 'reminder-keterlambatan';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_to: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deadline_date: Schema.Attribute.Date & Schema.Attribute.Required;
    escalation_level: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    impact_description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
        minLength: 10;
      }>;
    issue_description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
        minLength: 10;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::reminder-keterlambatan.reminder-keterlambatan'
    > &
      Schema.Attribute.Private;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'critical']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
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
    reminder_status: Schema.Attribute.Enumeration<
      ['active', 'in-progress', 'resolved', 'closed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'active'>;
    resolution_notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    resolved_date: Schema.Attribute.Date;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit-rumah.unit-rumah'>;
    unit_id: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiReminderReminder extends Struct.CollectionTypeSchema {
  collectionName: 'reminders';
  info: {
    description: 'Follow-up reminders for leads and marketing activities';
    displayName: 'Reminder Follow-up';
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
    assigned_to: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    completed_at: Schema.Attribute.DateTime;
    completion_notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
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
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    priority: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    publishedAt: Schema.Attribute.DateTime;
    reminder_date: Schema.Attribute.DateTime & Schema.Attribute.Required;
    reminder_type: Schema.Attribute.Enumeration<
      ['phone_call', 'email', 'visit', 'whatsapp', 'sms']
    > &
      Schema.Attribute.Required;
    status_reminder: Schema.Attribute.Enumeration<
      ['pending', 'completed', 'cancelled', 'overdue']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRiwayatPembayaranRiwayatPembayaran
  extends Struct.CollectionTypeSchema {
  collectionName: 'riwayat_pembayarans';
  info: {
    description: 'Sistem pencatatan riwayat pembayaran terpadu (Hutang, Piutang, Subkon)';
    displayName: 'Riwayat Pembayaran';
    pluralName: 'riwayat-pembayarans';
    singularName: 'riwayat-pembayaran';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bukti_pembayaran: Schema.Attribute.Media<'images' | 'files'>;
    catatan_internal: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deskripsi: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    dibuat_oleh: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    jumlah_pembayaran: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    kategori_pembayaran: Schema.Attribute.Enumeration<
      ['piutang_konsumen', 'tagihan_supplier', 'subkontraktor', 'lainnya']
    > &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::riwayat-pembayaran.riwayat-pembayaran'
    > &
      Schema.Attribute.Private;
    metode_pembayaran: Schema.Attribute.Enumeration<
      ['Transfer Bank', 'Tunai', 'Cek', 'Giro', 'Escrow', 'Lainnya']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Transfer Bank'>;
    nomor_referensi: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    payment_invoice: Schema.Attribute.Relation<
      'manyToOne',
      'api::payment-invoice.payment-invoice'
    >;
    piutang_konsumen: Schema.Attribute.Relation<
      'manyToOne',
      'api::piutang-konsumen.piutang-konsumen'
    >;
    pos_keuangan: Schema.Attribute.Relation<
      'manyToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pembayaran: Schema.Attribute.Enumeration<
      ['Pending', 'Berhasil', 'Gagal']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Berhasil'>;
    subkontraktor: Schema.Attribute.Relation<
      'manyToOne',
      'api::subkontraktor.subkontraktor'
    >;
    tanggal_pembayaran: Schema.Attribute.Date & Schema.Attribute.Required;
    tipe_transaksi: Schema.Attribute.Enumeration<['masuk', 'keluar']> &
      Schema.Attribute.Required;
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
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deductions: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    effective_date: Schema.Attribute.Date & Schema.Attribute.Required;
    harian: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    karyawan: Schema.Attribute.Relation<'oneToOne', 'api::karyawan.karyawan'>;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::salary.salary'
    > &
      Schema.Attribute.Private;
    net_salary: Schema.Attribute.Decimal;
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
    tunjangan_bpjs_kesehatan: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tunjangan_bpjs_ketenagakerjaan: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    tunjangan_kinerja: Schema.Attribute.Decimal &
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

export interface ApiShiftShift extends Struct.CollectionTypeSchema {
  collectionName: 'shifts';
  info: {
    description: 'Master shift untuk manajemen jadwal kerja karyawan';
    displayName: 'Shift';
    pluralName: 'shifts';
    singularName: 'shift';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    employees: Schema.Attribute.Relation<'oneToMany', 'api::karyawan.karyawan'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    jadwal_kerjas: Schema.Attribute.Relation<
      'oneToMany',
      'api::jadwal-kerja.jadwal-kerja'
    >;
    jam_mulai: Schema.Attribute.String & Schema.Attribute.Required;
    jam_selesai: Schema.Attribute.String & Schema.Attribute.Required;
    keterangan: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    kode_shift: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::shift.shift'> &
      Schema.Attribute.Private;
    nama_shift: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSitePlanDocumentSitePlanDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'site_plan_documents';
  info: {
    description: 'Manage site plan documents and layouts';
    displayName: 'Site Plan Document';
    pluralName: 'site-plan-documents';
    singularName: 'site-plan-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approval_date: Schema.Attribute.Date;
    approved_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    archived_at: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    document_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    drawing_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    file_format: Schema.Attribute.Enumeration<['PDF', 'DWG', 'JPG', 'PNG']> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::site-plan-document.site-plan-document'
    > &
      Schema.Attribute.Private;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    revision: Schema.Attribute.String;
    scale: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    status_site_plan: Schema.Attribute.Enumeration<
      ['draft', 'active', 'archived']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upload_date: Schema.Attribute.DateTime;
    version: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1.0'>;
  };
}

export interface ApiSocialMediaContentSocialMediaContent
  extends Struct.CollectionTypeSchema {
  collectionName: 'social_media_contents';
  info: {
    description: 'Management system for social media marketing content';
    displayName: 'Social Media Content';
    pluralName: 'social-media-contents';
    singularName: 'social-media-content';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    caption: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    content_images: Schema.Attribute.Media<'images', true>;
    content_video: Schema.Attribute.Media<'videos'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hashtags: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    is_published: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::social-media-content.social-media-content'
    > &
      Schema.Attribute.Private;
    platform: Schema.Attribute.Enumeration<
      ['Instagram', 'Facebook', 'TikTok', 'LinkedIn']
    > &
      Schema.Attribute.Required;
    post_type: Schema.Attribute.Enumeration<
      ['Image', 'Video', 'Carousel', 'Reels', 'Story']
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    scheduled_date: Schema.Attribute.DateTime;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
        minLength: 2;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStockOpnameStockOpname extends Struct.CollectionTypeSchema {
  collectionName: 'stock_opnames';
  info: {
    description: 'Pemeriksaan stock fisik material vs sistem';
    displayName: 'Stock Opname';
    pluralName: 'stock-opnames';
    singularName: 'stock-opname';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    document_attachment: Schema.Attribute.Media<'images' | 'files', true>;
    gudang: Schema.Attribute.Relation<'manyToOne', 'api::gudang.gudang'>;
    items: Schema.Attribute.Component<'stock-opname.item-opname', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::stock-opname.stock-opname'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text;
    opname_date: Schema.Attribute.Date & Schema.Attribute.Required;
    opname_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    opname_time: Schema.Attribute.Time & Schema.Attribute.Required;
    pic: Schema.Attribute.Relation<'oneToOne', 'api::karyawan.karyawan'>;
    publishedAt: Schema.Attribute.DateTime;
    reviewer: Schema.Attribute.Relation<'oneToOne', 'api::karyawan.karyawan'>;
    status_opname: Schema.Attribute.Enumeration<
      ['Draft', 'In Progress', 'Completed', 'Reviewed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Draft'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSubkontraktorSubkontraktor
  extends Struct.CollectionTypeSchema {
  collectionName: 'subkontraktors';
  info: {
    description: 'Manajemen subkontraktor untuk proyek konstruksi';
    displayName: 'Subkontraktor';
    pluralName: 'subkontraktors';
    singularName: 'subkontraktor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    alamat: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_pendukung: Schema.Attribute.Media<'images' | 'files', true>;
    jenis_pekerjaan: Schema.Attribute.Enumeration<
      [
        'Pekerjaan Struktur',
        'Pekerjaan Atap',
        'Instalasi Listrik',
        'Instalasi Plumbing',
        'Pekerjaan Finishing',
        'Pekerjaan Landscape',
        'Pekerjaan Mekanikal',
        'Pekerjaan Keamanan',
        'Pembersihan',
        'Lainnya',
      ]
    > &
      Schema.Attribute.Required;
    kontak: Schema.Attribute.Component<'komponen.kontak-subkontraktor', false> &
      Schema.Attribute.Required;
    kontrak_dokumen: Schema.Attribute.Media<'files'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::subkontraktor.subkontraktor'
    > &
      Schema.Attribute.Private;
    nama_perusahaan: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    nilai_kontrak: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    pembayaran: Schema.Attribute.Component<'komponen.pembayaran', false>;
    progress_pekerjaan: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    riwayat_pembayarans: Schema.Attribute.Relation<
      'oneToMany',
      'api::riwayat-pembayaran.riwayat-pembayaran'
    >;
    status_kontrak: Schema.Attribute.Enumeration<
      ['Aktif', 'Selesai', 'Dibatalkan']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aktif'>;
    surat_penawaran: Schema.Attribute.Media<'files'>;
    tanggal_mulai: Schema.Attribute.Date & Schema.Attribute.Required;
    tanggal_selesai_aktual: Schema.Attribute.Date;
    tanggal_selesai_estimasi: Schema.Attribute.Date & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSupplierEvaluationSupplierEvaluation
  extends Struct.CollectionTypeSchema {
  collectionName: 'supplier_evaluations';
  info: {
    description: 'Supplier performance evaluation system for purchasing management';
    displayName: 'Supplier Evaluation';
    pluralName: 'supplier-evaluations';
    singularName: 'supplier-evaluation';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    catatan: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    evaluatedBy: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    evaluation_period: Schema.Attribute.Enumeration<
      ['Weekly', 'Monthly', 'Quarterly', 'Annually', 'Project-Based']
    > &
      Schema.Attribute.DefaultTo<'Monthly'>;
    evaluator: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    goods_receipt_reference: Schema.Attribute.Relation<
      'manyToOne',
      'api::penerimaan-material.penerimaan-material'
    >;
    harga: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    improvement_notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    ketepatan_waktu: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    kode: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    kualitas: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier-evaluation.supplier-evaluation'
    > &
      Schema.Attribute.Private;
    material: Schema.Attribute.Relation<'manyToOne', 'api::material.material'>;
    next_evaluation_date: Schema.Attribute.Date;
    notes: Schema.Attribute.Text;
    pelayanan: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    performance_harga: Schema.Attribute.JSON &
      Schema.Attribute.DefaultTo<{
        cost_effectiveness: 0;
        discount_offers: 0;
        payment_terms: 0;
        price_competitiveness: 0;
      }>;
    performance_kualitas: Schema.Attribute.JSON &
      Schema.Attribute.DefaultTo<{
        consistency: 0;
        defect_rate: 0;
        product_quality: 0;
        specification_compliance: 0;
      }>;
    performance_pelayanan: Schema.Attribute.JSON &
      Schema.Attribute.DefaultTo<{
        communication: 0;
        documentation: 0;
        flexibility: 0;
        problem_resolution: 0;
      }>;
    performance_waktu: Schema.Attribute.JSON &
      Schema.Attribute.DefaultTo<{
        delivery_on_time: 0;
        lead_time: 0;
        order_processing: 0;
        response_time: 0;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    purchase_order_reference: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchase-order.purchase-order'
    >;
    recommendation: Schema.Attribute.Enumeration<
      ['Continue', 'Monitor', 'Improve', 'Terminate']
    > &
      Schema.Attribute.DefaultTo<'Continue'>;
    status_harga: Schema.Attribute.Enumeration<
      ['Excellent', 'Good', 'Fair', 'Poor']
    > &
      Schema.Attribute.DefaultTo<'Good'>;
    status_kualitas: Schema.Attribute.Enumeration<
      ['Excellent', 'Good', 'Fair', 'Poor']
    > &
      Schema.Attribute.DefaultTo<'Good'>;
    status_pengiriman: Schema.Attribute.Enumeration<
      ['Excellent', 'Good', 'Fair', 'Poor']
    > &
      Schema.Attribute.DefaultTo<'Good'>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::supplier.supplier'>;
    tanggal: Schema.Attribute.Date & Schema.Attribute.Required;
    total_skor: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSupplierSupplier extends Struct.CollectionTypeSchema {
  collectionName: 'suppliers';
  info: {
    description: 'Supplier management for construction materials and services';
    displayName: 'Supplier';
    pluralName: 'suppliers';
    singularName: 'supplier';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Text;
    catatan: Schema.Attribute.Text;
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    contact: Schema.Attribute.Component<'komponen.kontak', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    documents: Schema.Attribute.Component<'komponen.dokumen', true>;
    evaluations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier-evaluation.supplier-evaluation'
    >;
    kas_keluars: Schema.Attribute.Relation<
      'oneToMany',
      'api::kas-keluar.kas-keluar'
    >;
    lastOrderDate: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier.supplier'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    payment_invoices: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-invoice.payment-invoice'
    >;
    penerimaan_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::penerimaan-material.penerimaan-material'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchase_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order.purchase-order'
    >;
    purchase_requests: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-request.purchase-request'
    >;
    rating: Schema.Attribute.Decimal;
    status_supplier: Schema.Attribute.Enumeration<
      ['active', 'inactive', 'blacklist']
    > &
      Schema.Attribute.DefaultTo<'active'>;
    totalPurchases: Schema.Attribute.Decimal;
    type: Schema.Attribute.Enumeration<['Perusahaan', 'Individu']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTargetMarketingTargetMarketing
  extends Struct.CollectionTypeSchema {
  collectionName: 'target_marketings';
  info: {
    description: 'Marketing targets and commission management system';
    displayName: 'Marketing Target';
    pluralName: 'target-marketings';
    singularName: 'target-marketing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    achievement_updates: Schema.Attribute.Relation<
      'oneToMany',
      'api::achievement-update.achievement-update'
    >;
    bukti_pembayaran: Schema.Attribute.Media<'images' | 'files'>;
    commission_payments: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission-payment.commission-payment'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    komisi_per_unit: Schema.Attribute.JSON & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::target-marketing.target-marketing'
    > &
      Schema.Attribute.Private;
    marketing: Schema.Attribute.Relation<'manyToOne', 'api::karyawan.karyawan'>;
    metode_pembayaran: Schema.Attribute.Enumeration<
      ['transfer', 'cash', 'check']
    >;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    pencapaian_nominal: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    pencapaian_unit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    periode: Schema.Attribute.String & Schema.Attribute.Required;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pembayaran_komisi: Schema.Attribute.Enumeration<
      ['belum-dibayar', 'sebagian', 'lunas']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'belum-dibayar'>;
    tanggal_pembayaran: Schema.Attribute.Date;
    target_id: Schema.Attribute.String & Schema.Attribute.Unique;
    target_nominal: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    target_unit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    total_komisi: Schema.Attribute.BigInteger &
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

export interface ApiTechnicalDrawingTechnicalDrawing
  extends Struct.CollectionTypeSchema {
  collectionName: 'technical_drawings';
  info: {
    description: 'Manage technical drawings and engineering documents';
    displayName: 'Technical Drawing';
    pluralName: 'technical-drawings';
    singularName: 'technical-drawing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    approval_date: Schema.Attribute.Date;
    approved_by: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    archived_at: Schema.Attribute.DateTime;
    category: Schema.Attribute.Enumeration<['Arsitektur', 'Struktur', 'MEP']> &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    drawing_number: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    file_format: Schema.Attribute.Enumeration<['DWG', 'PDF', 'JPG']> &
      Schema.Attribute.Required;
    file_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::technical-drawing.technical-drawing'
    > &
      Schema.Attribute.Private;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    revision: Schema.Attribute.String;
    status_drawing: Schema.Attribute.Enumeration<
      ['draft', 'active', 'archived']
    > &
      Schema.Attribute.DefaultTo<'draft'>;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upload_date: Schema.Attribute.DateTime;
    version: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1.0'>;
  };
}

export interface ApiTransferDanaTransferDana
  extends Struct.CollectionTypeSchema {
  collectionName: 'transfer_danas';
  info: {
    description: 'Perpindahan dana antar pos keuangan';
    displayName: 'Transfer Dana';
    pluralName: 'transfer-danas';
    singularName: 'transfer-dana';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    keterangan: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transfer-dana.transfer-dana'
    > &
      Schema.Attribute.Private;
    nominal: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    pos_asal: Schema.Attribute.Relation<
      'manyToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    pos_tujuan: Schema.Attribute.Relation<
      'manyToOne',
      'api::pos-keuangan.pos-keuangan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_transfer: Schema.Attribute.Enumeration<
      ['pending', 'completed', 'cancelled']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pending'>;
    tanggal: Schema.Attribute.Date & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnitMaterialRequirementUnitMaterialRequirement
  extends Struct.CollectionTypeSchema {
  collectionName: 'unit_material_requirements';
  info: {
    description: 'Kebutuhan material per unit rumah berdasarkan tipe unit';
    displayName: 'Unit Material Requirement';
    pluralName: 'unit-material-requirements';
    singularName: 'unit-material-requirement';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    kebutuhan_per_unit: Schema.Attribute.Integer &
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
      'api::unit-material-requirement.unit-material-requirement'
    > &
      Schema.Attribute.Private;
    material: Schema.Attribute.Relation<'manyToOne', 'api::material.material'> &
      Schema.Attribute.Required;
    proyek_perumahan: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_ketersediaan: Schema.Attribute.Enumeration<
      ['Tersedia', 'Segera Habis', 'Tidak Tersedia']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Tersedia'>;
    tipe_unit: Schema.Attribute.String;
    total_kebutuhan: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    total_unit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnitPricingUnitPricing extends Struct.CollectionTypeSchema {
  collectionName: 'unit_pricings';
  info: {
    description: 'Unit pricing management for housing projects';
    displayName: 'Unit Pricing';
    pluralName: 'unit-pricings';
    singularName: 'unit-pricing';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    availability_status: Schema.Attribute.Enumeration<
      ['Available', 'Sold', 'Reserved']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Available'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    effective_date: Schema.Attribute.Date & Schema.Attribute.Required;
    expiry_date: Schema.Attribute.Date;
    is_active: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-pricing.unit-pricing'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    payment_options: Schema.Attribute.Enumeration<
      ['KPR', 'Cash', 'Installment', 'KPR + Cash']
    > &
      Schema.Attribute.Required;
    price_base: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    price_with_extras: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    price_with_ppn: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    project: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    unit_rumah: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-rumah.unit-rumah'
    >;
    unit_specification: Schema.Attribute.JSON;
    unit_type: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
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
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bedrooms: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    block: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    bookings: Schema.Attribute.Relation<'oneToMany', 'api::booking.booking'>;
    boq_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::boq-document.boq-document'
    >;
    building_area: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    construction_cost: Schema.Attribute.BigInteger;
    construction_end: Schema.Attribute.Date;
    construction_start: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dokumen_unit: Schema.Attribute.Component<'komponen.dokumen', true>;
    estimated_completion: Schema.Attribute.Date;
    floor_plans: Schema.Attribute.Media<'images' | 'files', true>;
    garage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    handover_date: Schema.Attribute.Date;
    handover_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::handover-document.handover-document'
    >;
    handover_status: Schema.Attribute.Enumeration<
      ['pending', 'completed', 'rejected']
    >;
    images: Schema.Attribute.Media<'images', true>;
    kavling_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
    kelebihan_tanah: Schema.Attribute.Decimal;
    labor_cost: Schema.Attribute.BigInteger;
    land_area: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
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
    marketing_staff: Schema.Attribute.Relation<
      'manyToOne',
      'api::karyawan.karyawan'
    >;
    material_cost: Schema.Attribute.BigInteger;
    notes: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    pengeluaran_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::pengeluaran-material.pengeluaran-material'
    >;
    piutang_konsumens: Schema.Attribute.Relation<
      'oneToMany',
      'api::piutang-konsumen.piutang-konsumen'
    >;
    price: Schema.Attribute.BigInteger;
    progres_harians: Schema.Attribute.Relation<
      'oneToMany',
      'api::progres-harian.progres-harian'
    >;
    progress: Schema.Attribute.Integer &
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
    status_pembangunan: Schema.Attribute.Component<
      'komponen.progres-proyek',
      true
    >;
    status_pembangunan_fisik: Schema.Attribute.Enumeration<
      ['belum_mulai', 'progres', 'selesai', 'retensi']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'belum_mulai'>;
    status_transaksi: Schema.Attribute.Enumeration<
      ['tersedia', 'booking', 'terjual', 'serah_terima']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'tersedia'>;
    unit_id: Schema.Attribute.String & Schema.Attribute.Unique;
    unit_pricings: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-pricing.unit-pricing'
    >;
    unit_type: Schema.Attribute.String;
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
    draftAndPublish: false;
  };
  attributes: {
    bank: Schema.Attribute.String;
    contractor_projects: Schema.Attribute.Relation<
      'manyToMany',
      'api::proyek-perumahan.proyek-perumahan'
    >;
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
    materials: Schema.Attribute.Relation<'oneToMany', 'api::material.material'>;
    nama_perusahaan: Schema.Attribute.String & Schema.Attribute.Required;
    nomor_rekening: Schema.Attribute.String;
    npwp: Schema.Attribute.String;
    portofolio: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_kontrak: Schema.Attribute.Enumeration<
      ['Aktif', 'Tidak Aktif', 'Blacklist']
    >;
    supplied_materials: Schema.Attribute.Relation<
      'oneToMany',
      'api::project-material.project-material'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiWorkItemWorkItem extends Struct.CollectionTypeSchema {
  collectionName: 'work_items';
  info: {
    description: 'Manajemen item pekerjaan dalam proyek';
    displayName: 'Work Item';
    pluralName: 'work-items';
    singularName: 'work-item';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bobot: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deadline: Schema.Attribute.Date & Schema.Attribute.Required;
    deskripsi: Schema.Attribute.Text;
    labor_estimations: Schema.Attribute.Relation<
      'oneToMany',
      'api::labor-estimation.labor-estimation'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::work-item.work-item'
    > &
      Schema.Attribute.Private;
    material_required: Schema.Attribute.Component<'shared.material-item', true>;
    nama_pekerjaan: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
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
    proyek: Schema.Attribute.Relation<
      'manyToOne',
      'api::proyek-perumahan.proyek-perumahan'
    >;
    publishedAt: Schema.Attribute.DateTime;
    status_pekerjaan: Schema.Attribute.Enumeration<
      ['On Track', 'Delayed', 'Selesai']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'On Track'>;
    tenaga_kerja: Schema.Attribute.Component<'shared.labor-requirement', true>;
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
      'api::achievement-update.achievement-update': ApiAchievementUpdateAchievementUpdate;
      'api::attendance-schedule.attendance-schedule': ApiAttendanceScheduleAttendanceSchedule;
      'api::audit-log.audit-log': ApiAuditLogAuditLog;
      'api::bank.bank': ApiBankBank;
      'api::booking-document.booking-document': ApiBookingDocumentBookingDocument;
      'api::booking.booking': ApiBookingBooking;
      'api::boq-document.boq-document': ApiBoqDocumentBoqDocument;
      'api::brochure.brochure': ApiBrochureBrochure;
      'api::commission-payment.commission-payment': ApiCommissionPaymentCommissionPayment;
      'api::commission-structure.commission-structure': ApiCommissionStructureCommissionStructure;
      'api::communication-template.communication-template': ApiCommunicationTemplateCommunicationTemplate;
      'api::communication.communication': ApiCommunicationCommunication;
      'api::contract.contract': ApiContractContract;
      'api::cuti.cuti': ApiCutiCuti;
      'api::deadline-unit.deadline-unit': ApiDeadlineUnitDeadlineUnit;
      'api::departemen.departemen': ApiDepartemenDepartemen;
      'api::developer.developer': ApiDeveloperDeveloper;
      'api::distribusi-material.distribusi-material': ApiDistribusiMaterialDistribusiMaterial;
      'api::fasilitas-proyek.fasilitas-proyek': ApiFasilitasProyekFasilitasProyek;
      'api::gudang.gudang': ApiGudangGudang;
      'api::handover-document.handover-document': ApiHandoverDocumentHandoverDocument;
      'api::insentif.insentif': ApiInsentifInsentif;
      'api::jabatan.jabatan': ApiJabatanJabatan;
      'api::jadwal-kerja.jadwal-kerja': ApiJadwalKerjaJadwalKerja;
      'api::jadwal-marketing.jadwal-marketing': ApiJadwalMarketingJadwalMarketing;
      'api::jadwal-proyek.jadwal-proyek': ApiJadwalProyekJadwalProyek;
      'api::jadwal-security.jadwal-security': ApiJadwalSecurityJadwalSecurity;
      'api::karyawan.karyawan': ApiKaryawanKaryawan;
      'api::kas-keluar.kas-keluar': ApiKasKeluarKasKeluar;
      'api::kas-masuk.kas-masuk': ApiKasMasukKasMasuk;
      'api::konsumen.konsumen': ApiKonsumenKonsumen;
      'api::kpi-divisi.kpi-divisi': ApiKpiDivisiKpiDivisi;
      'api::labor-estimation.labor-estimation': ApiLaborEstimationLaborEstimation;
      'api::laporan-kegiatan.laporan-kegiatan': ApiLaporanKegiatanLaporanKegiatan;
      'api::lead-marketing.lead-marketing': ApiLeadMarketingLeadMarketing;
      'api::leave-policy.leave-policy': ApiLeavePolicyLeavePolicy;
      'api::leave-quota.leave-quota': ApiLeaveQuotaLeaveQuota;
      'api::lokasi.lokasi': ApiLokasiLokasi;
      'api::marketing-video.marketing-video': ApiMarketingVideoMarketingVideo;
      'api::material-gudang.material-gudang': ApiMaterialGudangMaterialGudang;
      'api::material.material': ApiMaterialMaterial;
      'api::payment-invoice.payment-invoice': ApiPaymentInvoicePaymentInvoice;
      'api::pekerja.pekerja': ApiPekerjaPekerja;
      'api::penerimaan-material.penerimaan-material': ApiPenerimaanMaterialPenerimaanMaterial;
      'api::pengeluaran-material.pengeluaran-material': ApiPengeluaranMaterialPengeluaranMaterial;
      'api::penugasan.penugasan': ApiPenugasanPenugasan;
      'api::performance-review.performance-review': ApiPerformanceReviewPerformanceReview;
      'api::permit-document.permit-document': ApiPermitDocumentPermitDocument;
      'api::pertukaran-jadwal.pertukaran-jadwal': ApiPertukaranJadwalPertukaranJadwal;
      'api::piutang-konsumen.piutang-konsumen': ApiPiutangKonsumenPiutangKonsumen;
      'api::placement.placement': ApiPlacementPlacement;
      'api::pos-keuangan.pos-keuangan': ApiPosKeuanganPosKeuangan;
      'api::potongan-tunjangan.potongan-tunjangan': ApiPotonganTunjanganPotonganTunjangan;
      'api::progres-harian.progres-harian': ApiProgresHarianProgresHarian;
      'api::project-document.project-document': ApiProjectDocumentProjectDocument;
      'api::project-material.project-material': ApiProjectMaterialProjectMaterial;
      'api::project-phase.project-phase': ApiProjectPhaseProjectPhase;
      'api::project-worker.project-worker': ApiProjectWorkerProjectWorker;
      'api::promo.promo': ApiPromoPromo;
      'api::proyek-perumahan.proyek-perumahan': ApiProyekPerumahanProyekPerumahan;
      'api::purchase-order.purchase-order': ApiPurchaseOrderPurchaseOrder;
      'api::purchase-request.purchase-request': ApiPurchaseRequestPurchaseRequest;
      'api::purchasing.purchasing': ApiPurchasingPurchasing;
      'api::rab.rab': ApiRabRab;
      'api::rating-kinerja.rating-kinerja': ApiRatingKinerjaRatingKinerja;
      'api::realisasi-anggaran.realisasi-anggaran': ApiRealisasiAnggaranRealisasiAnggaran;
      'api::reminder-keterlambatan.reminder-keterlambatan': ApiReminderKeterlambatanReminderKeterlambatan;
      'api::reminder.reminder': ApiReminderReminder;
      'api::riwayat-pembayaran.riwayat-pembayaran': ApiRiwayatPembayaranRiwayatPembayaran;
      'api::salary.salary': ApiSalarySalary;
      'api::serah-terima-unit.serah-terima-unit': ApiSerahTerimaUnitSerahTerimaUnit;
      'api::shift.shift': ApiShiftShift;
      'api::site-plan-document.site-plan-document': ApiSitePlanDocumentSitePlanDocument;
      'api::social-media-content.social-media-content': ApiSocialMediaContentSocialMediaContent;
      'api::stock-opname.stock-opname': ApiStockOpnameStockOpname;
      'api::subkontraktor.subkontraktor': ApiSubkontraktorSubkontraktor;
      'api::supplier-evaluation.supplier-evaluation': ApiSupplierEvaluationSupplierEvaluation;
      'api::supplier.supplier': ApiSupplierSupplier;
      'api::target-marketing.target-marketing': ApiTargetMarketingTargetMarketing;
      'api::technical-drawing.technical-drawing': ApiTechnicalDrawingTechnicalDrawing;
      'api::transfer-dana.transfer-dana': ApiTransferDanaTransferDana;
      'api::unit-material-requirement.unit-material-requirement': ApiUnitMaterialRequirementUnitMaterialRequirement;
      'api::unit-pricing.unit-pricing': ApiUnitPricingUnitPricing;
      'api::unit-rumah.unit-rumah': ApiUnitRumahUnitRumah;
      'api::vendor.vendor': ApiVendorVendor;
      'api::work-item.work-item': ApiWorkItemWorkItem;
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
