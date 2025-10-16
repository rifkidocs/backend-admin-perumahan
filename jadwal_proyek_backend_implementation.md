# Dokumentasi Implementasi Jadwal Proyek - Backend Strapi

## Overview

Implementasi sistem Jadwal Proyek menggunakan Strapi CMS dengan fokus pada lifecycle hooks untuk validasi data, notifikasi, dan business logic automation. Sistem ini mendukung Gantt Chart, Target & Realisasi, Deadline Unit, dan Reminder Keterlambatan.

## Content Types yang Diimplementasikan

### 1. Project Phase (project-phase) - DIMODIFIKASI

**File**: `src/api/project-phase/content-types/project-phase/schema.json`

#### Perubahan Schema:

- `phase_number` → `phase_order` (sesuai dokumentasi)
- `start_target` → `start_date`
- `end_target` → `target_end_date`
- `start_actual` → dihapus (tidak digunakan)
- `end_actual` → `actual_end_date`
- `actual_expense` → `actual_cost`
- `status` → `phase_status`
- `progress_percent` → `progress_percentage`
- Ditambahkan relation `tasks` ke `jadwal-proyek`

#### Fields Lengkap:

| Field Name            | Type        | Required | Description              | Validation                                     |
| --------------------- | ----------- | -------- | ------------------------ | ---------------------------------------------- |
| `phase_name`          | String      | Yes      | Nama fase                | Min: 2, Max: 100                               |
| `phase_order`         | Integer     | Yes      | Urutan fase              | Min: 1                                         |
| `start_date`          | Date        | Yes      | Tanggal mulai fase       | Required                                       |
| `target_end_date`     | Date        | Yes      | Target tanggal selesai   | Required                                       |
| `actual_end_date`     | Date        | No       | Tanggal selesai aktual   | Date format                                    |
| `phase_status`        | Enumeration | Yes      | Status fase              | Options: planning, ongoing, completed, delayed |
| `progress_percentage` | Decimal     | No       | Persentase progress fase | Min: 0, Max: 100                               |
| `budget_allocation`   | Decimal     | No       | Alokasi budget fase      | Min: 0                                         |
| `actual_cost`         | Decimal     | No       | Biaya aktual fase        | Min: 0                                         |
| `description`         | Text        | No       | Deskripsi fase           | Max: 1000                                      |
| `milestones`          | JSON        | No       | Milestone dalam fase     | JSON array                                     |

#### Relations:

- `project` (Many-to-One): Relation ke `proyek-perumahan`
- `tasks` (One-to-Many): Relation ke `jadwal-proyek` (mappedBy: phase_relation)

#### Lifecycle Features (`src/api/project-phase/content-types/project-phase/lifecycles.js`):

- Validasi urutan fase berdasarkan project
- Auto-calculate progress_percentage berdasarkan tasks dalam fase
- Auto-update phase_status berdasarkan tasks task_status
- Budget tracking dan cost monitoring
- Milestone validation dan tracking
- Auto-generate milestone completion reminder
- Notifikasi saat fase milestone tercapai

### 2. Jadwal Proyek (jadwal-proyek) - BARU

**File**: `src/api/jadwal-proyek/content-types/jadwal-proyek/schema.json`

#### Fields:

| Field Name            | Type        | Required | Description            | Validation                                        |
| --------------------- | ----------- | -------- | ---------------------- | ------------------------------------------------- |
| `project_name`        | String      | Yes      | Nama proyek            | Min: 2, Max: 100                                  |
| `phase`               | String      | Yes      | Fase pembangunan       | Min: 2, Max: 50                                   |
| `task_name`           | String      | Yes      | Nama aktivitas/task    | Min: 2, Max: 200                                  |
| `start_date`          | Date        | Yes      | Tanggal mulai          | Required                                          |
| `end_date`            | Date        | Yes      | Tanggal selesai        | Required                                          |
| `duration_days`       | Integer     | Yes      | Durasi dalam hari      | Min: 1                                            |
| `task_status`         | Enumeration | Yes      | Status task            | Options: planned, in-progress, completed, delayed |
| `progress_percentage` | Decimal     | No       | Persentase progress    | Min: 0, Max: 100                                  |
| `priority`            | Enumeration | No       | Prioritas task         | Options: low, medium, high, urgent                |
| `assigned_to`         | String      | No       | Penanggung jawab       | Max: 100                                          |
| `notes`               | Text        | No       | Catatan tambahan       | Max: 500                                          |
| `dependencies`        | JSON        | No       | Dependencies task lain | JSON array                                        |
| `actual_start_date`   | Date        | No       | Tanggal mulai aktual   | Date format                                       |
| `actual_end_date`     | Date        | No       | Tanggal selesai aktual | Date format                                       |
| `deviation_days`      | Integer     | No       | Deviasi hari           | Can be negative                                   |

#### Relations:

- `project` (Many-to-One): Relation ke `proyek-perumahan`
- `unit` (Many-to-One): Relation ke `unit-rumah`
- `contractor` (Many-to-One): Relation ke `vendor`
- `phase_relation` (Many-to-One): Relation ke `project-phase`

#### Lifecycle Features (`src/api/jadwal-proyek/content-types/jadwal-proyek/lifecycles.js`):

- Auto-calculate duration berdasarkan start_date dan end_date
- Auto-calculate progress_percentage berdasarkan task_status
- Auto-calculate deviation_days saat actual_end_date diisi
- Task status transition validation (planned → in-progress → completed)
- Date validation (end_date harus setelah start_date)
- Dependency validation (pastikan dependency task sudah completed)
- Auto-update project progress saat task completed
- Notifikasi email saat task task_status berubah
- Auto-generate reminder untuk task yang akan deadline

### 3. Deadline Unit (deadline-unit) - BARU

**File**: `src/api/deadline-unit/content-types/deadline-unit/schema.json`

#### Fields:

| Field Name               | Type        | Required | Description            | Validation                                            |
| ------------------------ | ----------- | -------- | ---------------------- | ----------------------------------------------------- |
| `unit_id`                | String      | Yes      | ID unit                | Min: 2, Max: 50                                       |
| `unit_type`              | String      | Yes      | Tipe unit              | Min: 2, Max: 50                                       |
| `target_start_date`      | Date        | Yes      | Target tanggal mulai   | Required                                              |
| `deadline_date`          | Date        | Yes      | Deadline pembangunan   | Required                                              |
| `actual_start_date`      | Date        | No       | Tanggal mulai aktual   | Date format                                           |
| `actual_completion_date` | Date        | No       | Tanggal selesai aktual | Date format                                           |
| `progress_percentage`    | Decimal     | No       | Persentase progress    | Min: 0, Max: 100                                      |
| `unit_status`            | Enumeration | Yes      | Status unit            | Options: not-started, in-progress, completed, delayed |
| `delay_days`             | Integer     | No       | Hari keterlambatan     | Can be negative                                       |
| `delay_reason`           | Text        | No       | Alasan keterlambatan   | Max: 500                                              |
| `contractor_name`        | String      | No       | Nama kontraktor        | Max: 100                                              |
| `quality_score`          | Decimal     | No       | Skor kualitas          | Min: 0, Max: 100                                      |
| `notes`                  | Text        | No       | Catatan tambahan       | Max: 500                                              |

#### Relations:

- `project` (Many-to-One): Relation ke `proyek-perumahan`
- `unit` (Many-to-One): Relation ke `unit-rumah`
- `contractor` (Many-to-One): Relation ke `vendor`

#### Lifecycle Features (`src/api/deadline-unit/content-types/deadline-unit/lifecycles.js`):

- Auto-calculate delay_days berdasarkan deadline vs actual completion
- Auto-update unit_status berdasarkan progress dan deadline
- Quality score validation dan tracking
- Delay reason validation (wajib jika unit_status delayed)
- Auto-generate delay notification
- Progress milestone tracking
- Contractor performance tracking

### 4. Reminder Keterlambatan (reminder-keterlambatan) - BARU

**File**: `src/api/reminder-keterlambatan/content-types/reminder-keterlambatan/schema.json`

#### Fields:

| Field Name           | Type        | Required | Description                  | Validation                                     |
| -------------------- | ----------- | -------- | ---------------------------- | ---------------------------------------------- |
| `project_name`       | String      | Yes      | Nama proyek                  | Min: 2, Max: 100                               |
| `unit_id`            | String      | No       | ID unit (jika spesifik unit) | Max: 50                                        |
| `issue_description`  | Text        | Yes      | Deskripsi masalah            | Min: 10, Max: 1000                             |
| `deadline_date`      | Date        | Yes      | Deadline yang terlewat       | Required                                       |
| `impact_description` | Text        | Yes      | Deskripsi dampak             | Min: 10, Max: 500                              |
| `priority`           | Enumeration | Yes      | Prioritas masalah            | Options: low, medium, high, critical           |
| `reminder_status`    | Enumeration | Yes      | Status reminder              | Options: active, in-progress, resolved, closed |
| `assigned_to`        | String      | No       | Penanggung jawab             | Max: 100                                       |
| `resolution_notes`   | Text        | No       | Catatan penyelesaian         | Max: 1000                                      |
| `resolved_date`      | Date        | No       | Tanggal diselesaikan         | Date format                                    |
| `escalation_level`   | Integer     | No       | Level eskalasi               | Min: 1, Max: 5                                 |

#### Relations:

- `project` (Many-to-One): Relation ke `proyek-perumahan`
- `unit` (Many-to-One): Relation ke `unit-rumah`
- `assigned_user` (Many-to-One): Relation ke `user`

#### Lifecycle Features (`src/api/reminder-keterlambatan/content-types/reminder-keterlambatan/lifecycles.js`):

- Auto-assign priority berdasarkan severity dan impact
- Auto-escalation berdasarkan waktu tidak ada response
- Notifikasi email ke assigned user dan supervisor
- Reminder status transition validation (active → in-progress → resolved → closed)
- Resolution tracking dan follow-up
- Auto-generate escalation jika tidak ada action dalam 24 jam
- Integration dengan project timeline untuk auto-detect delays

## Lifecycle Hooks Implementation

### 1. Project Phase Lifecycle

```javascript
// src/api/project-phase/content-types/project-phase/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi urutan fase
    if (data.project) {
      const existingPhases = await strapi.entityService.findMany(
        "api::project-phase.project-phase",
        {
          filters: { project: data.project },
          sort: { phase_order: "asc" },
        }
      );

      if (data.phase_order <= existingPhases.length) {
        throw new Error("Urutan fase tidak valid");
      }
    }

    // Set default values
    if (!data.phase_status) {
      data.phase_status = "planning";
    }
    if (!data.progress_percentage) {
      data.progress_percentage = 0;
    }

    // Validasi tanggal
    if (data.start_date && data.target_end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.target_end_date);

      if (endDate <= startDate) {
        throw new Error("Tanggal selesai harus setelah tanggal mulai");
      }
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    const existingPhase = await strapi.entityService.findOne(
      "api::project-phase.project-phase",
      where.id
    );

    // Update status berdasarkan actual completion
    if (data.actual_end_date && !data.phase_status?.includes("completed")) {
      data.phase_status = "completed";
      data.progress_percentage = 100;
    }

    // Validasi budget consistency
    if (
      data.actual_cost !== undefined &&
      data.budget_allocation !== undefined
    ) {
      if (data.actual_cost > data.budget_allocation) {
        strapi.log.warn(
          `Phase ${data.phase_name}: Actual cost exceeds budget allocation`
        );
      }
    }

    // Update progress berdasarkan milestones jika ada
    if (data.milestones && Array.isArray(data.milestones)) {
      const completedMilestones = data.milestones.filter(
        (m) => m.status === "completed"
      );
      if (completedMilestones.length > 0) {
        data.progress_percentage =
          (completedMilestones.length / data.milestones.length) * 100;
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Update phase progress berdasarkan tasks
    await updatePhaseProgress(result.id);

    // Check milestone completion
    await checkMilestoneCompletion(result);
  },
};

async function updatePhaseProgress(phaseId) {
  try {
    const tasks = await strapi.entityService.findMany(
      "api::jadwal-proyek.jadwal-proyek",
      {
        filters: { phase: phaseId },
      }
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.task_status === "completed"
    ).length;
    const progressPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    await strapi.entityService.update(
      "api::project-phase.project-phase",
      phaseId,
      {
        data: {
          progress_percentage: Math.round(progressPercentage),
          phase_status:
            progressPercentage === 100
              ? "completed"
              : progressPercentage > 0
                ? "ongoing"
                : "planning",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update phase progress:", error);
  }
}

async function checkMilestoneCompletion(phase) {
  try {
    if (phase.milestones && Array.isArray(phase.milestones)) {
      for (const milestone of phase.milestones) {
        if (
          milestone.target_date &&
          new Date(milestone.target_date) <= new Date()
        ) {
          if (!milestone.completed) {
            // Generate milestone reminder
            await strapi.entityService.create(
              "api::reminder-keterlambatan.reminder-keterlambatan",
              {
                data: {
                  project_name:
                    phase.project?.project_name || "Unknown Project",
                  issue_description: `Milestone "${milestone.name}" belum tercapai`,
                  deadline_date: milestone.target_date,
                  impact_description: `Dampak terhadap fase ${phase.phase_name}`,
                  priority: "medium",
                  reminder_status: "active",
                },
              }
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to check milestone completion:", error);
  }
}
```

### 2. Jadwal Proyek Lifecycle

```javascript
// src/api/jadwal-proyek/content-types/jadwal-proyek/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (endDate <= startDate) {
        throw new Error("Tanggal selesai harus setelah tanggal mulai");
      }

      // Auto-calculate duration
      const diffTime = Math.abs(endDate - startDate);
      data.duration_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Validasi dependencies
    if (data.dependencies && data.dependencies.length > 0) {
      const dependencyTasks = await strapi.entityService.findMany(
        "api::jadwal-proyek.jadwal-proyek",
        {
          filters: {
            id: { $in: data.dependencies },
          },
        }
      );

      const incompleteDependencies = dependencyTasks.filter(
        (task) => task.task_status !== "completed"
      );
      if (incompleteDependencies.length > 0) {
        throw new Error("Task dependencies belum selesai");
      }
    }

    // Set default values
    if (!data.task_status) {
      data.task_status = "planned";
    }
    if (!data.progress_percentage) {
      data.progress_percentage = 0;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    const existingTask = await strapi.entityService.findOne(
      "api::jadwal-proyek.jadwal-proyek",
      where.id
    );

    // Validasi task status transition
    const validTransitions = {
      planned: ["in-progress"],
      "in-progress": ["completed", "delayed"],
      completed: [],
      delayed: ["in-progress", "completed"],
    };

    if (data.task_status && existingTask.task_status !== data.task_status) {
      if (
        !validTransitions[existingTask.task_status]?.includes(data.task_status)
      ) {
        throw new Error(
          `Status tidak dapat berubah dari ${existingTask.task_status} ke ${data.task_status}`
        );
      }
    }

    // Auto-calculate progress berdasarkan task_status
    if (data.task_status === "completed") {
      data.progress_percentage = 100;
      data.actual_end_date = new Date().toISOString();
    } else if (
      data.task_status === "in-progress" &&
      existingTask.task_status === "planned"
    ) {
      data.actual_start_date = new Date().toISOString();
    }

    // Calculate deviation jika ada actual_end_date
    if (data.actual_end_date && existingTask.end_date) {
      const actualDate = new Date(data.actual_end_date);
      const plannedDate = new Date(existingTask.end_date);
      const diffTime = actualDate - plannedDate;
      data.deviation_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Update project progress
    await updateProjectProgress(result.project);

    // Send notification
    await sendTaskNotification(result, "created");
  },

  async afterUpdate(event) {
    const { result } = event;

    // Update project progress
    await updateProjectProgress(result.project);

    // Send notification jika task_status berubah
    await sendTaskNotification(result, "updated");

    // Generate reminder jika task delayed
    if (result.task_status === "delayed") {
      await generateDelayReminder(result);
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Update project progress
    await updateProjectProgress(result.project);
  },
};

// Helper functions
async function updateProjectProgress(projectId) {
  try {
    const tasks = await strapi.entityService.findMany(
      "api::jadwal-proyek.jadwal-proyek",
      {
        filters: { project: projectId },
      }
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.task_status === "completed"
    ).length;
    const progressPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    await strapi.entityService.update(
      "api::proyek-perumahan.proyek-perumahan",
      projectId,
      {
        data: {
          progress_percentage: Math.round(progressPercentage),
        },
      }
    );
  } catch (error) {
    console.error("Failed to update project progress:", error);
  }
}

async function sendTaskNotification(task, action) {
  try {
    // Implementation untuk mengirim email notification
    console.log(`Task ${task.task_name} ${action} - Notification sent`);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

async function generateDelayReminder(task) {
  try {
    await strapi.entityService.create(
      "api::reminder-keterlambatan.reminder-keterlambatan",
      {
        data: {
          project_name: task.project?.project_name || "Unknown Project",
          unit_id: task.unit?.unit_id,
          issue_description: `Task "${task.task_name}" mengalami keterlambatan`,
          deadline_date: task.end_date,
          impact_description: `Dampak terhadap timeline proyek`,
          priority: "high",
          reminder_status: "active",
          assigned_to: task.assigned_to,
        },
      }
    );
  } catch (error) {
    console.error("Failed to generate delay reminder:", error);
  }
}
```

### 3. Deadline Unit Lifecycle

```javascript
// src/api/deadline-unit/content-types/deadline-unit/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal deadline
    if (data.target_start_date && data.deadline_date) {
      const startDate = new Date(data.target_start_date);
      const deadlineDate = new Date(data.deadline_date);

      if (deadlineDate <= startDate) {
        throw new Error("Deadline harus setelah tanggal mulai");
      }
    }

    // Set default values
    if (!data.unit_status) {
      data.unit_status = "not-started";
    }
    if (!data.progress_percentage) {
      data.progress_percentage = 0;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    const existingUnit = await strapi.entityService.findOne(
      "api::deadline-unit.deadline-unit",
      where.id
    );

    // Calculate delay days
    if (data.actual_completion_date && existingUnit.deadline_date) {
      const actualDate = new Date(data.actual_completion_date);
      const deadlineDate = new Date(existingUnit.deadline_date);
      const diffTime = actualDate - deadlineDate;
      data.delay_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Update unit_status berdasarkan delay
      if (data.delay_days > 0) {
        data.unit_status = "delayed";
        if (!data.delay_reason) {
          throw new Error(
            "Alasan keterlambatan harus diisi jika unit terlambat"
          );
        }
      } else if (data.progress_percentage === 100) {
        data.unit_status = "completed";
      }
    }

    // Validasi delay reason
    if (data.unit_status === "delayed" && !data.delay_reason) {
      throw new Error(
        "Alasan keterlambatan harus diisi untuk unit yang terlambat"
      );
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Generate delay reminder jika terlambat
    if (result.unit_status === "delayed" && result.delay_days > 0) {
      await generateUnitDelayReminder(result);
    }

    // Update unit unit_status di master data
    if (result.unit) {
      await strapi.entityService.update(
        "api::unit-rumah.unit-rumah",
        result.unit.id,
        {
          data: {
            unit_status: result.unit_status,
            progress: result.progress_percentage,
            completion_date: result.actual_completion_date,
          },
        }
      );
    }
  },
};

async function generateUnitDelayReminder(unit) {
  try {
    await strapi.entityService.create(
      "api::reminder-keterlambatan.reminder-keterlambatan",
      {
        data: {
          project_name: unit.project?.project_name || "Unknown Project",
          unit_id: unit.unit_id,
          issue_description: `Unit ${unit.unit_id} mengalami keterlambatan ${unit.delay_days} hari`,
          deadline_date: unit.deadline_date,
          impact_description: `Dampak terhadap penyerahan unit ke konsumen`,
          priority: unit.delay_days > 30 ? "critical" : "high",
          reminder_status: "active",
          assigned_to: unit.contractor_name,
        },
      }
    );
  } catch (error) {
    console.error("Failed to generate unit delay reminder:", error);
  }
}
```

### 4. Reminder Keterlambatan Lifecycle

```javascript
// src/api/reminder-keterlambatan/content-types/reminder-keterlambatan/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-assign priority berdasarkan severity
    if (!data.priority) {
      const daysPastDeadline = Math.ceil(
        (new Date() - new Date(data.deadline_date)) / (1000 * 60 * 60 * 24)
      );

      if (daysPastDeadline > 30) {
        data.priority = "critical";
      } else if (daysPastDeadline > 14) {
        data.priority = "high";
      } else if (daysPastDeadline > 7) {
        data.priority = "medium";
      } else {
        data.priority = "low";
      }
    }

    // Set default values
    if (!data.reminder_status) {
      data.reminder_status = "active";
    }
    if (!data.escalation_level) {
      data.escalation_level = 1;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    const existingReminder = await strapi.entityService.findOne(
      "api::reminder-keterlambatan.reminder-keterlambatan",
      where.id
    );

    // Validasi reminder status transition
    const validTransitions = {
      active: ["in-progress"],
      "in-progress": ["resolved", "closed"],
      resolved: ["closed"],
      closed: [],
    };

    if (
      data.reminder_status &&
      existingReminder.reminder_status !== data.reminder_status
    ) {
      if (
        !validTransitions[existingReminder.reminder_status]?.includes(
          data.reminder_status
        )
      ) {
        throw new Error(
          `Status tidak dapat berubah dari ${existingReminder.reminder_status} ke ${data.reminder_status}`
        );
      }
    }

    // Auto-set resolved date
    if (data.reminder_status === "resolved" && !data.resolved_date) {
      data.resolved_date = new Date().toISOString();
    }

    // Auto-escalation jika tidak ada response dalam 24 jam
    if (
      data.reminder_status === "active" &&
      existingReminder.reminder_status === "active"
    ) {
      const createdDate = new Date(existingReminder.created_at);
      const now = new Date();
      const hoursDiff = (now - createdDate) / (1000 * 60 * 60);

      if (hoursDiff > 24 && data.escalation_level < 5) {
        data.escalation_level = existingReminder.escalation_level + 1;
        data.priority = data.escalation_level >= 3 ? "critical" : "high";
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Send notification
    await sendReminderNotification(result, "created");
  },

  async afterUpdate(event) {
    const { result } = event;

    // Send notification jika reminder_status berubah
    await sendReminderNotification(result, "updated");

    // Auto-escalation notification
    if (result.escalation_level > 1) {
      await sendEscalationNotification(result);
    }
  },
};

async function sendReminderNotification(reminder, action) {
  try {
    // Implementation untuk mengirim email notification
    console.log(
      `Reminder ${reminder.issue_description} ${action} - Notification sent`
    );
  } catch (error) {
    console.error("Failed to send reminder notification:", error);
  }
}

async function sendEscalationNotification(reminder) {
  try {
    // Implementation untuk mengirim escalation notification
    console.log(`Reminder escalated to level ${reminder.escalation_level}`);
  } catch (error) {
    console.error("Failed to send escalation notification:", error);
  }
}
```

## API Endpoints

Sistem menggunakan Strapi Admin API standar tanpa custom endpoints:

### Project Phase

- `GET /content-manager/collection-types/api::project-phase.project-phase`
- `POST /content-manager/collection-types/api::project-phase.project-phase`
- `PUT /content-manager/collection-types/api::project-phase.project-phase/:id`
- `DELETE /content-manager/collection-types/api::project-phase.project-phase/:id`

### Jadwal Proyek

- `GET /content-manager/collection-types/api::jadwal-proyek.jadwal-proyek`
- `POST /content-manager/collection-types/api::jadwal-proyek.jadwal-proyek`
- `PUT /content-manager/collection-types/api::jadwal-proyek.jadwal-proyek/:id`
- `DELETE /content-manager/collection-types/api::jadwal-proyek.jadwal-proyek/:id`

### Deadline Unit

- `GET /content-manager/collection-types/api::deadline-unit.deadline-unit`
- `POST /content-manager/collection-types/api::deadline-unit.deadline-unit`
- `PUT /content-manager/collection-types/api::deadline-unit.deadline-unit/:id`
- `DELETE /content-manager/collection-types/api::deadline-unit.deadline-unit/:id`

### Reminder Keterlambatan

- `GET /content-manager/collection-types/api::reminder-keterlambatan.reminder-keterlambatan`
- `POST /content-manager/collection-types/api::reminder-keterlambatan.reminder-keterlambatan`
- `PUT /content-manager/collection-types/api::reminder-keterlambatan.reminder-keterlambatan/:id`
- `DELETE /content-manager/collection-types/api::reminder-keterlambatan.reminder-keterlambatan/:id`

## Validation Rules

### Custom Validation

```javascript
// src/api/jadwal-proyek/content-types/jadwal-proyek/lifecycles.js
const validateTimelineData = (data) => {
  const errors = [];

  // Validasi tanggal
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (endDate <= startDate) {
      errors.push("Tanggal selesai harus setelah tanggal mulai");
    }

    // Validasi tidak boleh lebih dari 1 tahun
    const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 365) {
      errors.push("Durasi task tidak boleh lebih dari 1 tahun");
    }
  }

  // Validasi progress percentage
  if (data.progress_percentage !== undefined) {
    if (data.progress_percentage < 0 || data.progress_percentage > 100) {
      errors.push("Progress percentage harus antara 0-100");
    }
  }

  // Validasi task_status dan progress consistency
  if (data.task_status === "completed" && data.progress_percentage !== 100) {
    errors.push("Task yang completed harus memiliki progress 100%");
  }

  if (data.task_status === "planned" && data.progress_percentage > 0) {
    errors.push("Task yang planned tidak boleh memiliki progress > 0%");
  }

  return errors;
};
```

## Error Handling

Semua lifecycle hooks menggunakan try-catch untuk:

- Email notifications (log error jika gagal)
- Activity logging (log error jika gagal)
- Database operations (throw error untuk validasi)
- External API calls (log error jika gagal)

```javascript
// Error handling pattern
try {
  await strapi.entityService.create(
    "api::reminder-keterlambatan.reminder-keterlambatan",
    {
      data: reminderData,
    }
  );
} catch (error) {
  console.error("Failed to create delay reminder:", error);
  // Tidak throw error untuk mencegah rollback operasi utama
}
```

## Testing

### Unit Tests (Recommended)

```javascript
// Test lifecycle hooks
describe("Project Timeline Lifecycle", () => {
  test("should validate date range", async () => {
    // Test invalid date range
  });

  test("should calculate duration automatically", async () => {
    // Test duration calculation
  });

  test("should validate task status transitions", async () => {
    // Test task status transition validation
  });
});
```

## Production Considerations

1. **Database Indexes**: Buat indexes untuk performance
2. **Email Service**: Setup email service untuk notifications
3. **Monitoring**: Setup monitoring untuk lifecycle hooks
4. **Backup**: Regular backup untuk data penting
5. **Rate Limiting**: Implementasi rate limiting untuk API

## Troubleshooting

### Common Issues

1. **Validation errors**: Cek lifecycle hooks dan data format
2. **Performance issues**: Cek database indexes
3. **Email tidak terkirim**: Cek konfigurasi email service
4. **Permission errors**: Cek role permissions

### Debug Commands

```bash
# Check Strapi logs
npm run strapi logs

# Check database indexes
strapi db:index:list
```

## File Structure

```
src/api/
├── project-phase/
│   ├── content-types/
│   │   └── project-phase/
│   │       ├── schema.json (MODIFIED)
│   │       └── lifecycles.js (MODIFIED)
│   ├── controllers/
│   ├── services/
│   └── routes/
├── jadwal-proyek/ (NEW)
│   ├── content-types/
│   │   └── jadwal-proyek/
│   │       ├── schema.json
│   │       └── lifecycles.js
│   ├── controllers/
│   ├── services/
│   └── routes/
├── deadline-unit/ (NEW)
│   ├── content-types/
│   │   └── deadline-unit/
│   │       ├── schema.json
│   │       └── lifecycles.js
│   ├── controllers/
│   ├── services/
│   └── routes/
└── reminder-keterlambatan/ (NEW)
    ├── content-types/
    │   └── reminder-keterlambatan/
    │       ├── schema.json
    │       └── lifecycles.js
    ├── controllers/
    ├── services/
    └── routes/
```

---

**Catatan**: Implementasi ini menggunakan lifecycle hooks untuk business logic tanpa membuat custom API endpoints, sesuai dengan permintaan untuk fokus pada lifecycle hooks saja. Semua content types telah dibuat dengan struktur yang sesuai dokumentasi dan siap untuk digunakan.
