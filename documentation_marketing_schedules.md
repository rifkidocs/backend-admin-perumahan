# Dokumentasi Jadwal & Kegiatan Marketing - Strapi

## Overview

Dokumentasi ini menjelaskan implementasi sistem Jadwal & Kegiatan Marketing menggunakan Strapi CMS dengan fokus pada lifecycle hooks untuk validasi data, notifikasi, dan business logic.

## Content Types

### 1. Marketing Schedule (jadwal-marketing)

#### Schema Definition

```javascript
// src/api/jadwal-marketing/content-types/jadwal-marketing/schema.json
{
  "kind": "collectionType",
  "collectionName": "jadwal_marketings",
  "info": {
    "singularName": "jadwal-marketing",
    "pluralName": "jadwal-marketings",
    "displayName": "Jadwal Marketing",
    "description": "Jadwal kegiatan marketing seperti pameran, open house, kunjungan"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "activity_type": {
      "type": "enumeration",
      "enum": ["exhibition", "open_house", "site_visit", "canvassing", "customer_visit", "phone_call", "create_content", "broadcast"],
      "required": true
    },
    "description": {
      "type": "text",
      "maxLength": 1000
    },
    "location": {
      "type": "string",
      "required": true,
      "maxLength": 500
    },
    "start_date": {
      "type": "datetime",
      "required": true
    },
    "end_date": {
      "type": "datetime"
    },
    "start_time": {
      "type": "time"
    },
    "end_time": {
      "type": "time"
    },
    "status": {
      "type": "enumeration",
      "enum": ["upcoming", "ongoing", "completed", "cancelled"],
      "default": "upcoming"
    },
    "priority": {
      "type": "enumeration",
      "enum": ["low", "medium", "high", "urgent"],
      "default": "medium"
    },
    "assigned_staff": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::karyawan.karyawan",
      "mappedBy": "marketing_schedules"
    },
    "project": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "marketing_schedules"
    },
    "lead": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::lead-marketing.lead-marketing",
      "inversedBy": "schedules"
    },
    "expected_leads": {
      "type": "integer",
      "min": 0
    },
    "budget": {
      "type": "decimal",
      "min": 0
    },
    "notes": {
      "type": "text",
      "maxLength": 2000
    },
    "reminder_sent": {
      "type": "boolean",
      "default": false
    },
    "created_by": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "updated_by": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
```

### 2. Activity Report (laporan-kegiatan)

#### Schema Definition

```javascript
// src/api/laporan-kegiatan/content-types/laporan-kegiatan/schema.json
{
  "kind": "collectionType",
  "collectionName": "laporan_kegiatans",
  "info": {
    "singularName": "laporan-kegiatan",
    "pluralName": "laporan-kegiatans",
    "displayName": "Laporan Kegiatan",
    "description": "Laporan hasil kegiatan marketing"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "report_type": {
      "type": "enumeration",
      "enum": ["exhibition_report", "open_house_report", "canvassing_report", "visit_report", "create_content_report", "broadcast_report"],
      "required": true
    },
    "schedule": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::jadwal-marketing.jadwal-marketing",
      "inversedBy": "reports"
    },
    "activity_date": {
      "type": "date",
      "required": true
    },
    "location": {
      "type": "string",
      "required": true,
      "maxLength": 500
    },
    "leads_generated": {
      "type": "integer",
      "min": 0
    },
    "bookings_made": {
      "type": "integer",
      "min": 0
    },
    "booking_fee_collected": {
      "type": "decimal",
      "min": 0
    },
    "visitors_count": {
      "type": "integer",
      "min": 0
    },
    "highlights": {
      "type": "text",
      "maxLength": 1000
    },
    "challenges": {
      "type": "text",
      "maxLength": 1000
    },
    "recommendations": {
      "type": "text",
      "maxLength": 1000
    },
    "attachments": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images", "files", "videos"]
    },
    "status": {
      "type": "enumeration",
      "enum": ["draft", "submitted", "approved", "rejected"],
      "default": "draft"
    },
    "submitted_by": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan"
    },
    "approved_by": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan"
    },
    "approval_date": {
      "type": "datetime"
    },
    "notes": {
      "type": "text",
      "maxLength": 2000
    }
  }
}
```

### 3. Follow-up Reminder (reminder-followup)

#### Schema Definition

```javascript
// src/api/reminder-followup/content-types/reminder-followup/schema.json
{
  "kind": "collectionType",
  "collectionName": "reminder_followups",
  "info": {
    "singularName": "reminder-followup",
    "pluralName": "reminder-followups",
    "displayName": "Reminder Follow-up",
    "description": "Reminder untuk follow-up lead"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "reminder_type": {
      "type": "enumeration",
      "enum": ["phone_call", "email", "visit", "whatsapp", "sms"],
      "required": true
    },
    "lead": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::lead-marketing.lead-marketing",
      "inversedBy": "followup_reminders"
    },
    "assigned_to": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan"
    },
    "reminder_date": {
      "type": "datetime",
      "required": true
    },
    "priority": {
      "type": "enumeration",
      "enum": ["low", "medium", "high", "urgent"],
      "default": "medium"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "completed", "cancelled", "overdue"],
      "default": "pending"
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "completed_at": {
      "type": "datetime"
    },
    "completion_notes": {
      "type": "text",
      "maxLength": 1000
    }
  }
}
```

## Lifecycle Hooks

### 1. Jadwal Marketing Lifecycle Hooks

#### Before Create Hook

```javascript
// src/api/jadwal-marketing/content-types/jadwal-marketing/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (startDate >= endDate) {
        throw new Error("Tanggal mulai harus lebih awal dari tanggal selesai");
      }
    }

    // Validasi waktu
    if (data.start_time && data.end_time) {
      if (data.start_time >= data.end_time) {
        throw new Error("Waktu mulai harus lebih awal dari waktu selesai");
      }
    }

    // Set created_by jika tidak ada
    if (!data.created_by && event.state.user) {
      data.created_by = event.state.user.id;
    }

    // Generate unique title jika tidak ada
    if (!data.title) {
      const activityTypeMap = {
        exhibition: "Pameran",
        open_house: "Open House",
        site_visit: "Kunjungan Site",
        canvassing: "Canvassing",
        customer_visit: "Kunjungan Customer",
        phone_call: "Telepon",
      };

      const date = new Date(data.start_date).toLocaleDateString("id-ID");
      data.title = `${
        activityTypeMap[data.activity_type] || "Kegiatan"
      } - ${date}`;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Validasi tanggal
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (startDate >= endDate) {
        throw new Error("Tanggal mulai harus lebih awal dari tanggal selesai");
      }
    }

    // Set updated_by
    if (event.state.user) {
      data.updated_by = event.state.user.id;
    }

    // Update status berdasarkan tanggal
    if (data.start_date) {
      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = data.end_date ? new Date(data.end_date) : startDate;

      if (now < startDate) {
        data.status = "upcoming";
      } else if (now >= startDate && now <= endDate) {
        data.status = "ongoing";
      } else if (now > endDate) {
        data.status = "completed";
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Kirim notifikasi ke staff yang ditugaskan
    if (result.assigned_staff && result.assigned_staff.length > 0) {
      await strapi.plugins["email"].services.email.send({
        to: result.assigned_staff.map((staff) => staff.email).join(","),
        subject: `Jadwal Marketing Baru: ${result.title}`,
        text: `
          Anda telah ditugaskan untuk kegiatan marketing:
          
          Judul: ${result.title}
          Jenis: ${result.activity_type}
          Lokasi: ${result.location}
          Tanggal: ${new Date(result.start_date).toLocaleDateString("id-ID")}
          Waktu: ${result.start_time || "TBD"} - ${result.end_time || "TBD"}
          
          Silakan persiapkan diri untuk kegiatan ini.
        `,
      });
    }

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "schedule_created",
        entity_type: "jadwal-marketing",
        entity_id: result.id,
        description: `Jadwal marketing "${result.title}" telah dibuat`,
        user: event.state.user?.id,
      },
    });
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Kirim notifikasi jika ada perubahan penting
    const changedFields = Object.keys(params.data);
    const importantFields = [
      "start_date",
      "end_date",
      "location",
      "assigned_staff",
    ];

    if (importantFields.some((field) => changedFields.includes(field))) {
      if (result.assigned_staff && result.assigned_staff.length > 0) {
        await strapi.plugins["email"].services.email.send({
          to: result.assigned_staff.map((staff) => staff.email).join(","),
          subject: `Update Jadwal Marketing: ${result.title}`,
          text: `
            Jadwal marketing telah diupdate:
            
            Judul: ${result.title}
            Perubahan: ${changedFields.join(", ")}
            
            Silakan cek detail terbaru di sistem.
          `,
        });
      }
    }

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "schedule_updated",
        entity_type: "jadwal-marketing",
        entity_id: result.id,
        description: `Jadwal marketing "${result.title}" telah diupdate`,
        user: event.state.user?.id,
      },
    });
  },

  async beforeDelete(event) {
    const { where } = event.params;

    // Cek apakah ada laporan yang terkait
    const reports = await strapi.entityService.findMany(
      "api::laporan-kegiatan.laporan-kegiatan",
      {
        filters: { schedule: where.id },
      }
    );

    if (reports && reports.length > 0) {
      throw new Error(
        "Tidak dapat menghapus jadwal yang sudah memiliki laporan kegiatan"
      );
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "schedule_deleted",
        entity_type: "jadwal-marketing",
        entity_id: result.id,
        description: `Jadwal marketing "${result.title}" telah dihapus`,
        user: event.state.user?.id,
      },
    });
  },
};
```

### 2. Laporan Kegiatan Lifecycle Hooks

#### Before Create Hook

```javascript
// src/api/laporan-kegiatan/content-types/laporan-kegiatan/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal laporan tidak boleh lebih dari 7 hari dari tanggal kegiatan
    if (data.activity_date) {
      const activityDate = new Date(data.activity_date);
      const today = new Date();
      const diffDays = Math.ceil(
        (today - activityDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 7) {
        throw new Error(
          "Laporan kegiatan harus dibuat maksimal 7 hari setelah tanggal kegiatan"
        );
      }
    }

    // Set submitted_by jika tidak ada
    if (!data.submitted_by && event.state.user) {
      // Cari karyawan berdasarkan user
      const karyawan = await strapi.entityService.findMany(
        "api::karyawan.karyawan",
        {
          filters: { user: event.state.user.id },
        }
      );

      if (karyawan && karyawan.length > 0) {
        data.submitted_by = karyawan[0].id;
      }
    }

    // Validasi data numerik
    if (data.leads_generated && data.leads_generated < 0) {
      throw new Error("Jumlah lead yang dihasilkan tidak boleh negatif");
    }

    if (data.bookings_made && data.bookings_made < 0) {
      throw new Error("Jumlah booking tidak boleh negatif");
    }

    if (data.booking_fee_collected && data.booking_fee_collected < 0) {
      throw new Error("Booking fee yang dikumpulkan tidak boleh negatif");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Jika status berubah menjadi approved, set approval data
    if (data.status === "approved" && !data.approved_by) {
      if (event.state.user) {
        const karyawan = await strapi.entityService.findMany(
          "api::karyawan.karyawan",
          {
            filters: { user: event.state.user.id },
          }
        );

        if (karyawan && karyawan.length > 0) {
          data.approved_by = karyawan[0].id;
          data.approval_date = new Date();
        }
      }
    }

    // Validasi data numerik
    if (data.leads_generated && data.leads_generated < 0) {
      throw new Error("Jumlah lead yang dihasilkan tidak boleh negatif");
    }

    if (data.bookings_made && data.bookings_made < 0) {
      throw new Error("Jumlah booking tidak boleh negatif");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Kirim notifikasi ke supervisor
    const supervisors = await strapi.entityService.findMany(
      "api::karyawan.karyawan",
      {
        filters: {
          jabatan: {
            nama_jabatan: {
              $in: ["Supervisor Marketing", "Manager Marketing"],
            },
          },
        },
      }
    );

    if (supervisors && supervisors.length > 0) {
      await strapi.plugins["email"].services.email.send({
        to: supervisors.map((supervisor) => supervisor.email).join(","),
        subject: `Laporan Kegiatan Baru: ${result.title}`,
        text: `
          Laporan kegiatan baru telah disubmit:
          
          Judul: ${result.title}
          Jenis: ${result.report_type}
          Tanggal Kegiatan: ${new Date(result.activity_date).toLocaleDateString(
            "id-ID"
          )}
          Lokasi: ${result.location}
          Lead Generated: ${result.leads_generated || 0}
          Booking Made: ${result.bookings_made || 0}
          
          Silakan review laporan ini.
        `,
      });
    }

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "report_created",
        entity_type: "laporan-kegiatan",
        entity_id: result.id,
        description: `Laporan kegiatan "${result.title}" telah dibuat`,
        user: event.state.user?.id,
      },
    });
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Jika status berubah menjadi approved, kirim notifikasi
    if (params.data.status === "approved") {
      if (result.submitted_by) {
        const submitter = await strapi.entityService.findOne(
          "api::karyawan.karyawan",
          result.submitted_by
        );

        if (submitter && submitter.email) {
          await strapi.plugins["email"].services.email.send({
            to: submitter.email,
            subject: `Laporan Kegiatan Disetujui: ${result.title}`,
            text: `
              Laporan kegiatan Anda telah disetujui:
              
              Judul: ${result.title}
              Tanggal Approval: ${new Date(
                result.approval_date
              ).toLocaleDateString("id-ID")}
              
              Terima kasih atas laporan yang telah dibuat.
            `,
          });
        }
      }
    }

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "report_updated",
        entity_type: "laporan-kegiatan",
        entity_id: result.id,
        description: `Laporan kegiatan "${result.title}" telah diupdate`,
        user: event.state.user?.id,
      },
    });
  },
};
```

### 3. Reminder Follow-up Lifecycle Hooks

#### Before Create Hook

```javascript
// src/api/reminder-followup/content-types/reminder-followup/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal reminder tidak boleh di masa lalu
    if (data.reminder_date) {
      const reminderDate = new Date(data.reminder_date);
      const now = new Date();

      if (reminderDate <= now) {
        throw new Error("Tanggal reminder harus di masa depan");
      }
    }

    // Set assigned_to jika tidak ada
    if (!data.assigned_to && event.state.user) {
      const karyawan = await strapi.entityService.findMany(
        "api::karyawan.karyawan",
        {
          filters: { user: event.state.user.id },
        }
      );

      if (karyawan && karyawan.length > 0) {
        data.assigned_to = karyawan[0].id;
      }
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Jika status berubah menjadi completed, set completion data
    if (data.status === "completed" && !data.completed_at) {
      data.completed_at = new Date();
    }

    // Jika status berubah menjadi overdue
    if (data.reminder_date) {
      const reminderDate = new Date(data.reminder_date);
      const now = new Date();

      if (reminderDate < now && data.status === "pending") {
        data.status = "overdue";
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Kirim notifikasi ke staff yang ditugaskan
    if (result.assigned_to) {
      const staff = await strapi.entityService.findOne(
        "api::karyawan.karyawan",
        result.assigned_to
      );

      if (staff && staff.email) {
        await strapi.plugins["email"].services.email.send({
          to: staff.email,
          subject: `Reminder Follow-up: ${result.title}`,
          text: `
            Anda memiliki reminder follow-up:
            
            Judul: ${result.title}
            Jenis: ${result.reminder_type}
            Tanggal: ${new Date(result.reminder_date).toLocaleDateString(
              "id-ID"
            )}
            Prioritas: ${result.priority}
            
            Silakan lakukan follow-up sesuai jadwal.
          `,
        });
      }
    }

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "reminder_created",
        entity_type: "reminder-followup",
        entity_id: result.id,
        description: `Reminder follow-up "${result.title}" telah dibuat`,
        user: event.state.user?.id,
      },
    });
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Jika status berubah menjadi completed, kirim notifikasi
    if (params.data.status === "completed") {
      // Kirim notifikasi ke supervisor
      const supervisors = await strapi.entityService.findMany(
        "api::karyawan.karyawan",
        {
          filters: {
            jabatan: {
              nama_jabatan: {
                $in: ["Supervisor Marketing", "Manager Marketing"],
              },
            },
          },
        }
      );

      if (supervisors && supervisors.length > 0) {
        await strapi.plugins["email"].services.email.send({
          to: supervisors.map((supervisor) => supervisor.email).join(","),
          subject: `Follow-up Selesai: ${result.title}`,
          text: `
            Follow-up telah diselesaikan:
            
            Judul: ${result.title}
            Jenis: ${result.reminder_type}
            Tanggal Selesai: ${new Date(result.completed_at).toLocaleDateString(
              "id-ID"
            )}
            
            Silakan cek hasil follow-up di sistem.
          `,
        });
      }
    }

    // Log aktivitas
    await strapi.entityService.create("api::activity-log.activity-log", {
      data: {
        action: "reminder_updated",
        entity_type: "reminder-followup",
        entity_id: result.id,
        description: `Reminder follow-up "${result.title}" telah diupdate`,
        user: event.state.user?.id,
      },
    });
  },
};
```

## Scheduled Tasks (Cron Jobs)

### 1. Daily Reminder Check

```javascript
// src/index.js
module.exports = {
  register(/*{ strapi }*/) {},
  bootstrap({ strapi }) {
    // Jalankan setiap hari jam 08:00
    strapi.cron.add({
      name: "daily-reminder-check",
      pattern: "0 8 * * *", // Setiap hari jam 08:00
      handler: async () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Cari reminder yang akan jatuh tempo besok
        const upcomingReminders = await strapi.entityService.findMany(
          "api::reminder-followup.reminder-followup",
          {
            filters: {
              reminder_date: {
                $gte: today.toISOString(),
                $lt: tomorrow.toISOString(),
              },
              status: "pending",
            },
            populate: ["assigned_to", "lead"],
          }
        );

        // Kirim notifikasi untuk reminder yang akan jatuh tempo
        for (const reminder of upcomingReminders) {
          if (reminder.assigned_to && reminder.assigned_to.email) {
            await strapi.plugins["email"].services.email.send({
              to: reminder.assigned_to.email,
              subject: `Reminder Follow-up Besok: ${reminder.title}`,
              text: `
                Anda memiliki reminder follow-up besok:
                
                Judul: ${reminder.title}
                Jenis: ${reminder.reminder_type}
                Tanggal: ${new Date(reminder.reminder_date).toLocaleDateString(
                  "id-ID"
                )}
                Lead: ${reminder.lead ? reminder.lead.name : "N/A"}
                
                Silakan persiapkan follow-up Anda.
              `,
            });
          }
        }

        // Cari reminder yang sudah overdue
        const overdueReminders = await strapi.entityService.findMany(
          "api::reminder-followup.reminder-followup",
          {
            filters: {
              reminder_date: {
                $lt: today.toISOString(),
              },
              status: "pending",
            },
            populate: ["assigned_to"],
          }
        );

        // Update status menjadi overdue
        for (const reminder of overdueReminders) {
          await strapi.entityService.update(
            "api::reminder-followup.reminder-followup",
            reminder.id,
            {
              data: { status: "overdue" },
            }
          );
        }
      },
    });
  },
};
```

### 2. Weekly Schedule Summary

```javascript
// src/index.js
module.exports = {
  register(/*{ strapi }*/) {},
  bootstrap({ strapi }) {
    // Jalankan setiap Senin jam 09:00
    strapi.cron.add({
      name: "weekly-schedule-summary",
      pattern: "0 9 * * 1", // Setiap Senin jam 09:00
      handler: async () => {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Senin
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Minggu

        // Cari jadwal untuk minggu ini
        const weeklySchedules = await strapi.entityService.findMany(
          "api::jadwal-marketing.jadwal-marketing",
          {
            filters: {
              start_date: {
                $gte: weekStart.toISOString(),
                $lte: weekEnd.toISOString(),
              },
            },
            populate: ["assigned_staff", "project"],
          }
        );

        // Kirim summary ke supervisor
        const supervisors = await strapi.entityService.findMany(
          "api::karyawan.karyawan",
          {
            filters: {
              jabatan: {
                nama_jabatan: {
                  $in: ["Supervisor Marketing", "Manager Marketing"],
                },
              },
            },
          }
        );

        if (supervisors && supervisors.length > 0) {
          const summary = weeklySchedules.map((schedule) => ({
            title: schedule.title,
            type: schedule.activity_type,
            date: new Date(schedule.start_date).toLocaleDateString("id-ID"),
            location: schedule.location,
            staff: schedule.assigned_staff
              .map((staff) => staff.nama_lengkap)
              .join(", "),
          }));

          await strapi.plugins["email"].services.email.send({
            to: supervisors.map((supervisor) => supervisor.email).join(","),
            subject: `Weekly Marketing Schedule Summary - ${weekStart.toLocaleDateString(
              "id-ID"
            )}`,
            text: `
              Ringkasan Jadwal Marketing Minggu Ini:
              
              ${summary
                .map(
                  (item) => `
                - ${item.title} (${item.type})
                  Tanggal: ${item.date}
                  Lokasi: ${item.location}
                  Staff: ${item.staff}
              `
                )
                .join("\n")}
              
              Total Kegiatan: ${weeklySchedules.length}
            `,
          });
        }
      },
    });
  },
};
```

## API Endpoints

### Jadwal Marketing API

```javascript
// src/api/jadwal-marketing/routes/jadwal-marketing.js
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/jadwal-marketings",
      handler: "jadwal-marketing.find",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/jadwal-marketings/:id",
      handler: "jadwal-marketing.findOne",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
    {
      method: "POST",
      path: "/jadwal-marketings",
      handler: "jadwal-marketing.create",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
    {
      method: "PUT",
      path: "/jadwal-marketings/:id",
      handler: "jadwal-marketing.update",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
    {
      method: "DELETE",
      path: "/jadwal-marketings/:id",
      handler: "jadwal-marketing.delete",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/jadwal-marketings/calendar/:year/:month",
      handler: "jadwal-marketing.getCalendar",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
    {
      method: "GET",
      path: "/jadwal-marketings/today",
      handler: "jadwal-marketing.getTodaySchedule",
      config: {
        policies: ["plugin::users-permissions.isAuthenticated"],
      },
    },
  ],
};
```

### Custom Controller Methods

```javascript
// src/api/jadwal-marketing/controllers/jadwal-marketing.js
module.exports = createCoreController(
  "api::jadwal-marketing.jadwal-marketing",
  ({ strapi }) => ({
    async getCalendar(ctx) {
      const { year, month } = ctx.params;

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const schedules = await strapi.entityService.findMany(
        "api::jadwal-marketing.jadwal-marketing",
        {
          filters: {
            start_date: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
          },
          populate: ["assigned_staff", "project"],
        }
      );

      return { data: schedules };
    },

    async getTodaySchedule(ctx) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const schedules = await strapi.entityService.findMany(
        "api::jadwal-marketing.jadwal-marketing",
        {
          filters: {
            start_date: {
              $gte: today.toISOString(),
              $lt: tomorrow.toISOString(),
            },
          },
          populate: ["assigned_staff", "project"],
        }
      );

      return { data: schedules };
    },
  })
);
```

## Permissions

### Role-based Permissions

```javascript
// config/plugins.js
module.exports = {
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
    },
  },
};

// Role permissions untuk Marketing Schedules
// Admin: Full access
// Supervisor Marketing: Read, Create, Update
// Staff Marketing: Read, Create (own), Update (own)
// Manager: Read, Create, Update, Delete
```

## Validation Rules

### Custom Validation

```javascript
// src/api/jadwal-marketing/content-types/jadwal-marketing/lifecycles.js
const validateScheduleData = (data) => {
  const errors = [];

  // Validasi tanggal
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (startDate >= endDate) {
      errors.push("Tanggal mulai harus lebih awal dari tanggal selesai");
    }
  }

  // Validasi waktu
  if (data.start_time && data.end_time) {
    if (data.start_time >= data.end_time) {
      errors.push("Waktu mulai harus lebih awal dari waktu selesai");
    }
  }

  // Validasi lokasi
  if (!data.location || data.location.trim().length === 0) {
    errors.push("Lokasi harus diisi");
  }

  // Validasi staff assignment
  if (!data.assigned_staff || data.assigned_staff.length === 0) {
    errors.push("Minimal satu staff harus ditugaskan");
  }

  return errors;
};
```

## Notifications

### Email Templates

```javascript
// src/api/jadwal-marketing/services/notification.js
module.exports = ({ strapi }) => ({
  async sendScheduleNotification(schedule, type) {
    const templates = {
      created: {
        subject: `Jadwal Marketing Baru: ${schedule.title}`,
        template: "schedule-created",
      },
      updated: {
        subject: `Update Jadwal Marketing: ${schedule.title}`,
        template: "schedule-updated",
      },
      reminder: {
        subject: `Reminder Jadwal Marketing: ${schedule.title}`,
        template: "schedule-reminder",
      },
    };

    const template = templates[type];
    if (!template) return;

    // Kirim ke staff yang ditugaskan
    if (schedule.assigned_staff && schedule.assigned_staff.length > 0) {
      await strapi.plugins["email"].services.email.send({
        to: schedule.assigned_staff.map((staff) => staff.email).join(","),
        subject: template.subject,
        template: template.template,
        data: {
          schedule: schedule,
          type: type,
        },
      });
    }
  },
});
```

## Database Indexes

### Recommended Indexes

```sql
-- Index untuk pencarian berdasarkan tanggal
CREATE INDEX idx_jadwal_marketing_start_date ON jadwal_marketings(start_date);
CREATE INDEX idx_jadwal_marketing_end_date ON jadwal_marketings(end_date);

-- Index untuk pencarian berdasarkan status
CREATE INDEX idx_jadwal_marketing_status ON jadwal_marketings(status);

-- Index untuk pencarian berdasarkan jenis kegiatan
CREATE INDEX idx_jadwal_marketing_activity_type ON jadwal_marketings(activity_type);

-- Index untuk pencarian berdasarkan staff
CREATE INDEX idx_jadwal_marketing_assigned_staff ON jadwal_marketings(assigned_staff);

-- Index untuk pencarian berdasarkan proyek
CREATE INDEX idx_jadwal_marketing_project ON jadwal_marketings(project);

-- Index untuk laporan kegiatan
CREATE INDEX idx_laporan_kegiatan_activity_date ON laporan_kegiatans(activity_date);
CREATE INDEX idx_laporan_kegiatan_status ON laporan_kegiatans(status);

-- Index untuk reminder follow-up
CREATE INDEX idx_reminder_followup_reminder_date ON reminder_followups(reminder_date);
CREATE INDEX idx_reminder_followup_status ON reminder_followups(status);
```

## Testing

### Unit Tests untuk Lifecycle Hooks

```javascript
// tests/jadwal-marketing.test.js
describe("Jadwal Marketing Lifecycle Hooks", () => {
  test("should validate date range on create", async () => {
    const invalidData = {
      title: "Test Schedule",
      activity_type: "exhibition",
      location: "Test Location",
      start_date: "2024-01-02T00:00:00.000Z",
      end_date: "2024-01-01T00:00:00.000Z",
    };

    await expect(
      strapi.entityService.create("api::jadwal-marketing.jadwal-marketing", {
        data: invalidData,
      })
    ).rejects.toThrow("Tanggal mulai harus lebih awal dari tanggal selesai");
  });

  test("should send notification on create", async () => {
    const mockEmail = jest.fn();
    strapi.plugins["email"].services.email.send = mockEmail;

    const validData = {
      title: "Test Schedule",
      activity_type: "exhibition",
      location: "Test Location",
      start_date: "2024-01-01T00:00:00.000Z",
      end_date: "2024-01-02T00:00:00.000Z",
      assigned_staff: [1, 2],
    };

    await strapi.entityService.create(
      "api::jadwal-marketing.jadwal-marketing",
      {
        data: validData,
      }
    );

    expect(mockEmail).toHaveBeenCalled();
  });
});
```

## Deployment Notes

### Environment Variables

```bash
# .env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
```

### Production Considerations

1. **Database Optimization**: Pastikan semua index sudah dibuat
2. **Email Service**: Gunakan service email yang reliable (SendGrid, AWS SES)
3. **Cron Jobs**: Pastikan cron jobs berjalan dengan benar di production
4. **Monitoring**: Setup monitoring untuk lifecycle hooks dan cron jobs
5. **Backup**: Regular backup untuk data penting
6. **Rate Limiting**: Implementasi rate limiting untuk API endpoints

## Troubleshooting

### Common Issues

1. **Email tidak terkirim**: Cek konfigurasi email service
2. **Cron jobs tidak berjalan**: Cek log dan konfigurasi cron
3. **Validation errors**: Cek lifecycle hooks dan data format
4. **Performance issues**: Cek database indexes dan query optimization

### Debug Commands

```bash
# Cek status cron jobs
strapi cron:list

# Test email service
strapi email:test

# Cek database indexes
strapi db:index:list
```

---

Dokumentasi ini memberikan panduan lengkap untuk implementasi sistem Jadwal & Kegiatan Marketing menggunakan Strapi dengan fokus pada lifecycle hooks untuk validasi, notifikasi, dan business logic automation.
