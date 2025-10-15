# Dokumentasi Strapi - Gambar & Dokumen Teknis

## Overview

Sistem manajemen dokumen teknis untuk proyek pembangunan perumahan yang mencakup site plan, gambar kerja, dokumen perizinan, BOQ/RAB, dan dokumen serah terima.

## Content Types

### 1. Site Plan Document

**Collection Type**: `site-plan-document`

**Fields**:

- `document_name` (Text, Required): Nama dokumen site plan
- `project` (Relation to Project): Proyek terkait
- `file` (Media, Required): File dokumen (PDF, DWG, JPG)
- `file_format` (Enumeration): PDF, DWG, JPG, PNG
- `file_size` (Number): Ukuran file dalam MB
- `version` (Text): Versi dokumen (e.g., "1.2")
- `upload_date` (DateTime): Tanggal upload
- `description` (Text): Deskripsi dokumen
- `status` (Enumeration): draft, active, archived

### 2. Technical Drawing

**Collection Type**: `technical-drawing`

**Fields**:

- `file_name` (Text, Required): Nama file gambar kerja
- `category` (Enumeration): Arsitektur, Struktur, MEP
- `project` (Relation to Project): Proyek terkait
- `file` (Media, Required): File gambar (DWG, PDF)
- `file_format` (Enumeration): DWG, PDF, JPG
- `file_size` (Number): Ukuran file dalam MB
- `version` (Text): Versi gambar
- `upload_date` (DateTime): Tanggal upload
- `unit_type` (Text): Tipe unit terkait (optional)
- `status` (Enumeration): draft, active, archived

### 3. Permit Document

**Collection Type**: `permit-document`

**Fields**:

- `document_type` (Enumeration): IMB, PBG, Izin Lingkungan, Izin Lainnya
- `document_number` (Text, Required): Nomor dokumen
- `project` (Relation to Project): Proyek terkait
- `file` (Media, Required): File dokumen
- `issue_date` (Date): Tanggal terbit
- `expiry_date` (Date): Tanggal berlaku
- `status` (Enumeration): active, expired, pending, draft
- `issuing_authority` (Text): Instansi penerbit
- `description` (Text): Deskripsi dokumen

### 4. BOQ Document

**Collection Type**: `boq-document`

**Fields**:

- `document_name` (Text, Required): Nama dokumen BOQ/RAB
- `document_type` (Enumeration): RAB, BOQ Material, BOQ Infrastruktur
- `project` (Relation to Project): Proyek terkait
- `unit_type` (Text): Tipe unit terkait
- `file` (Media, Required): File dokumen
- `total_amount` (Number): Total nilai dalam Rupiah
- `revision` (Text): Revisi dokumen
- `creation_date` (Date): Tanggal pembuatan
- `status` (Enumeration): draft, approved, active, archived

### 5. Handover Document

**Collection Type**: `handover-document`

**Fields**:

- `document_name` (Text, Required): Nama dokumen serah terima
- `document_type` (Enumeration): BAST, Check List, Dokumen Garansi
- `project` (Relation to Project): Proyek terkait
- `unit` (Text): Unit/blok terkait
- `buyer_name` (Text): Nama pembeli
- `file` (Media, Required): File dokumen
- `handover_date` (Date): Tanggal serah terima
- `status` (Enumeration): draft, signed, complete, active
- `signature_required` (Boolean): Apakah perlu tanda tangan

## Lifecycle Hooks

### Site Plan Document Lifecycle

```javascript
// src/api/site-plan-document/content-types/site-plan-document/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate version if not provided
    if (!data.version) {
      data.version = "1.0";
    }

    // Set upload date
    data.upload_date = new Date();

    // Validate file format
    if (
      data.file_format &&
      !["PDF", "DWG", "JPG", "PNG"].includes(data.file_format)
    ) {
      throw new Error("Format file tidak didukung");
    }

    // Set default status
    if (!data.status) {
      data.status = "draft";
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log document creation
    strapi.log.info(
      `Site plan document created: ${result.document_name} for project ${result.project}`
    );

    // Send notification to project manager
    if (result.project) {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "document_uploaded",
          title: "Dokumen Site Plan Baru",
          message: `Dokumen ${result.document_name} telah diupload`,
          project: result.project,
          priority: "medium",
        },
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Track version changes
    if (data.version) {
      const existingDoc = await strapi.entityService.findOne(
        "api::site-plan-document.site-plan-document",
        where.id
      );
      if (existingDoc && existingDoc.version !== data.version) {
        strapi.log.info(
          `Site plan document version updated from ${existingDoc.version} to ${data.version}`
        );
      }
    }

    // Validate status transitions
    if (data.status) {
      const existingDoc = await strapi.entityService.findOne(
        "api::site-plan-document.site-plan-document",
        where.id
      );
      if (existingDoc) {
        const validTransitions = {
          draft: ["active", "archived"],
          active: ["archived"],
          archived: ["active"],
        };

        if (!validTransitions[existingDoc.status]?.includes(data.status)) {
          throw new Error(
            `Status tidak dapat diubah dari ${existingDoc.status} ke ${data.status}`
          );
        }
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log document update
    strapi.log.info(`Site plan document updated: ${result.document_name}`);

    // Update project last modified date
    if (result.project) {
      await strapi.entityService.update(
        "api::project.project",
        result.project,
        {
          data: {
            last_modified: new Date(),
          },
        }
      );
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    // Check if document is referenced elsewhere
    const doc = await strapi.entityService.findOne(
      "api::site-plan-document.site-plan-document",
      where.id
    );
    if (doc && doc.status === "active") {
      throw new Error("Tidak dapat menghapus dokumen yang sedang aktif");
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Log document deletion
    strapi.log.info(`Site plan document deleted: ${result.document_name}`);

    // Clean up related files
    if (result.file) {
      await strapi.plugins["upload"].services.upload.remove(result.file);
    }
  },
};
```

### Technical Drawing Lifecycle

```javascript
// src/api/technical-drawing/content-types/technical-drawing/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate version if not provided
    if (!data.version) {
      data.version = "1.0";
    }

    // Set upload date
    data.upload_date = new Date();

    // Validate category
    if (
      data.category &&
      !["Arsitektur", "Struktur", "MEP"].includes(data.category)
    ) {
      throw new Error("Kategori gambar tidak valid");
    }

    // Set default status
    if (!data.status) {
      data.status = "draft";
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log drawing creation
    strapi.log.info(
      `Technical drawing created: ${result.file_name} (${result.category})`
    );

    // Send notification to engineering team
    await strapi.service("api::notification.notification").create({
      data: {
        type: "drawing_uploaded",
        title: "Gambar Kerja Baru",
        message: `Gambar ${result.file_name} telah diupload`,
        project: result.project,
        priority: "high",
      },
    });
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Track version changes
    if (data.version) {
      const existingDrawing = await strapi.entityService.findOne(
        "api::technical-drawing.technical-drawing",
        where.id
      );
      if (existingDrawing && existingDrawing.version !== data.version) {
        strapi.log.info(
          `Technical drawing version updated from ${existingDrawing.version} to ${data.version}`
        );

        // Archive previous version
        await strapi.entityService.update(
          "api::technical-drawing.technical-drawing",
          where.id,
          {
            data: {
              status: "archived",
              archived_at: new Date(),
            },
          }
        );
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log drawing update
    strapi.log.info(`Technical drawing updated: ${result.file_name}`);

    // Update project timeline if drawing is approved
    if (result.status === "active" && result.project) {
      await strapi.service("api::project-timeline.project-timeline").create({
        data: {
          event_type: "drawing_approved",
          event_date: new Date(),
          description: `Gambar ${result.file_name} telah disetujui`,
          project: result.project,
        },
      });
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    // Check if drawing is referenced in project timeline
    const drawing = await strapi.entityService.findOne(
      "api::technical-drawing.technical-drawing",
      where.id
    );
    if (drawing && drawing.status === "active") {
      throw new Error("Tidak dapat menghapus gambar yang sedang aktif");
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Log drawing deletion
    strapi.log.info(`Technical drawing deleted: ${result.file_name}`);

    // Clean up related files
    if (result.file) {
      await strapi.plugins["upload"].services.upload.remove(result.file);
    }
  },
};
```

### Permit Document Lifecycle

```javascript
// src/api/permit-document/content-types/permit-document/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate document number format
    if (data.document_number) {
      const validFormats = {
        IMB: /^\d+\/IMB\/\d{4}-\d+$/,
        PBG: /^PBG\/\d{4}\/\d+-\d+$/,
        "Izin Lingkungan": /^IL\/\d{4}\/\d+$/,
      };

      const format = validFormats[data.document_type];
      if (format && !format.test(data.document_number)) {
        throw new Error(
          `Format nomor dokumen ${data.document_type} tidak valid`
        );
      }
    }

    // Set default status
    if (!data.status) {
      data.status = "pending";
    }

    // Validate dates
    if (data.issue_date && data.expiry_date) {
      if (new Date(data.expiry_date) <= new Date(data.issue_date)) {
        throw new Error("Tanggal berlaku harus setelah tanggal terbit");
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log permit creation
    strapi.log.info(
      `Permit document created: ${result.document_type} - ${result.document_number}`
    );

    // Send notification to legal team
    await strapi.service("api::notification.notification").create({
      data: {
        type: "permit_created",
        title: "Dokumen Perizinan Baru",
        message: `Dokumen ${result.document_type} ${result.document_number} telah dibuat`,
        project: result.project,
        priority: "high",
      },
    });

    // Schedule expiry reminder
    if (result.expiry_date) {
      const expiryDate = new Date(result.expiry_date);
      const reminderDate = new Date(
        expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000
      ); // 30 days before

      await strapi.service("api::reminder.reminder").create({
        data: {
          type: "permit_expiry",
          title: "Pengingat Masa Berlaku Dokumen",
          message: `Dokumen ${result.document_type} ${result.document_number} akan berakhir dalam 30 hari`,
          reminder_date: reminderDate,
          project: result.project,
          permit_document: result.id,
        },
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Check status transitions
    if (data.status) {
      const existingPermit = await strapi.entityService.findOne(
        "api::permit-document.permit-document",
        where.id
      );
      if (existingPermit) {
        const validTransitions = {
          pending: ["active", "draft"],
          active: ["expired", "archived"],
          expired: ["active"],
          draft: ["pending", "active"],
        };

        if (!validTransitions[existingPermit.status]?.includes(data.status)) {
          throw new Error(
            `Status tidak dapat diubah dari ${existingPermit.status} ke ${data.status}`
          );
        }
      }
    }

    // Auto-set status to expired if past expiry date
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      data.status = "expired";
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log permit update
    strapi.log.info(
      `Permit document updated: ${result.document_type} - ${result.document_number}`
    );

    // Update project compliance status
    if (result.project) {
      await strapi
        .service("api::project-compliance.project-compliance")
        .updateProjectCompliance(result.project);
    }

    // Send notification if status changed to active
    if (result.status === "active") {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "permit_approved",
          title: "Dokumen Perizinan Disetujui",
          message: `Dokumen ${result.document_type} ${result.document_number} telah disetujui`,
          project: result.project,
          priority: "medium",
        },
      });
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    // Check if permit is active
    const permit = await strapi.entityService.findOne(
      "api::permit-document.permit-document",
      where.id
    );
    if (permit && permit.status === "active") {
      throw new Error(
        "Tidak dapat menghapus dokumen perizinan yang sedang aktif"
      );
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Log permit deletion
    strapi.log.info(
      `Permit document deleted: ${result.document_type} - ${result.document_number}`
    );

    // Clean up related reminders
    await strapi.entityService.deleteMany("api::reminder.reminder", {
      filters: {
        permit_document: result.id,
      },
    });

    // Clean up related files
    if (result.file) {
      await strapi.plugins["upload"].services.upload.remove(result.file);
    }
  },
};
```

### BOQ Document Lifecycle

```javascript
// src/api/boq-document/content-types/boq-document/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate revision if not provided
    if (!data.revision) {
      data.revision = "01";
    }

    // Set creation date
    data.creation_date = new Date();

    // Validate document type
    if (
      data.document_type &&
      !["RAB", "BOQ Material", "BOQ Infrastruktur"].includes(data.document_type)
    ) {
      throw new Error("Tipe dokumen BOQ tidak valid");
    }

    // Set default status
    if (!data.status) {
      data.status = "draft";
    }

    // Format total amount
    if (data.total_amount && typeof data.total_amount === "string") {
      data.total_amount = parseFloat(data.total_amount.replace(/[^\d.-]/g, ""));
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log BOQ creation
    strapi.log.info(
      `BOQ document created: ${result.document_name} (${result.document_type})`
    );

    // Send notification to finance team
    await strapi.service("api::notification.notification").create({
      data: {
        type: "boq_created",
        title: "Dokumen BOQ/RAB Baru",
        message: `Dokumen ${result.document_name} telah dibuat`,
        project: result.project,
        priority: "high",
      },
    });

    // Create budget allocation if RAB
    if (
      result.document_type === "RAB" &&
      result.total_amount &&
      result.project
    ) {
      await strapi.service("api::budget-allocation.budget-allocation").create({
        data: {
          allocation_name: result.document_name,
          allocated_amount: result.total_amount,
          project: result.project,
          boq_document: result.id,
          status: "pending",
        },
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Track revision changes
    if (data.revision) {
      const existingBOQ = await strapi.entityService.findOne(
        "api::boq-document.boq-document",
        where.id
      );
      if (existingBOQ && existingBOQ.revision !== data.revision) {
        strapi.log.info(
          `BOQ document revision updated from ${existingBOQ.revision} to ${data.revision}`
        );

        // Archive previous revision
        await strapi.entityService.update(
          "api::boq-document.boq-document",
          where.id,
          {
            data: {
              status: "archived",
              archived_at: new Date(),
            },
          }
        );
      }
    }

    // Validate status transitions
    if (data.status) {
      const existingBOQ = await strapi.entityService.findOne(
        "api::boq-document.boq-document",
        where.id
      );
      if (existingBOQ) {
        const validTransitions = {
          draft: ["approved", "archived"],
          approved: ["active", "archived"],
          active: ["archived"],
          archived: ["active"],
        };

        if (!validTransitions[existingBOQ.status]?.includes(data.status)) {
          throw new Error(
            `Status tidak dapat diubah dari ${existingBOQ.status} ke ${data.status}`
          );
        }
      }
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log BOQ update
    strapi.log.info(`BOQ document updated: ${result.document_name}`);

    // Update budget allocation if amount changed
    if (
      result.document_type === "RAB" &&
      result.total_amount &&
      result.project
    ) {
      await strapi.entityService.updateMany(
        "api::budget-allocation.budget-allocation",
        {
          filters: {
            boq_document: result.id,
          },
          data: {
            allocated_amount: result.total_amount,
          },
        }
      );
    }

    // Send notification if approved
    if (result.status === "approved") {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "boq_approved",
          title: "Dokumen BOQ/RAB Disetujui",
          message: `Dokumen ${result.document_name} telah disetujui`,
          project: result.project,
          priority: "medium",
        },
      });
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    // Check if BOQ is referenced in budget allocations
    const boq = await strapi.entityService.findOne(
      "api::boq-document.boq-document",
      where.id
    );
    if (boq && boq.status === "active") {
      throw new Error("Tidak dapat menghapus dokumen BOQ yang sedang aktif");
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Log BOQ deletion
    strapi.log.info(`BOQ document deleted: ${result.document_name}`);

    // Clean up related budget allocations
    await strapi.entityService.deleteMany(
      "api::budget-allocation.budget-allocation",
      {
        filters: {
          boq_document: result.id,
        },
      }
    );

    // Clean up related files
    if (result.file) {
      await strapi.plugins["upload"].services.upload.remove(result.file);
    }
  },
};
```

### Handover Document Lifecycle

```javascript
// src/api/handover-document/content-types/handover-document/lifecycles.js

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate document type
    if (
      data.document_type &&
      !["BAST", "Check List", "Dokumen Garansi"].includes(data.document_type)
    ) {
      throw new Error("Tipe dokumen serah terima tidak valid");
    }

    // Set default status
    if (!data.status) {
      data.status = "draft";
    }

    // Set signature required based on document type
    if (
      data.document_type === "BAST" &&
      data.signature_required === undefined
    ) {
      data.signature_required = true;
    }

    // Validate handover date
    if (data.handover_date && new Date(data.handover_date) > new Date()) {
      throw new Error("Tanggal serah terima tidak boleh di masa depan");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log handover document creation
    strapi.log.info(
      `Handover document created: ${result.document_name} for unit ${result.unit}`
    );

    // Send notification to sales team
    await strapi.service("api::notification.notification").create({
      data: {
        type: "handover_document_created",
        title: "Dokumen Serah Terima Baru",
        message: `Dokumen ${result.document_name} untuk unit ${result.unit} telah dibuat`,
        project: result.project,
        priority: "medium",
      },
    });

    // Create task for document completion if needed
    if (result.status === "draft") {
      await strapi.service("api::task.task").create({
        data: {
          title: `Selesaikan ${result.document_name}`,
          description: `Dokumen serah terima untuk unit ${result.unit} perlu diselesaikan`,
          project: result.project,
          handover_document: result.id,
          priority: "medium",
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Check status transitions
    if (data.status) {
      const existingDoc = await strapi.entityService.findOne(
        "api::handover-document.handover-document",
        where.id
      );
      if (existingDoc) {
        const validTransitions = {
          draft: ["signed", "complete"],
          signed: ["complete"],
          complete: ["active"],
          active: ["archived"],
        };

        if (!validTransitions[existingDoc.status]?.includes(data.status)) {
          throw new Error(
            `Status tidak dapat diubah dari ${existingDoc.status} ke ${data.status}`
          );
        }
      }
    }

    // Validate signature requirement
    if (
      data.status === "signed" &&
      data.signature_required &&
      !data.signature_file
    ) {
      throw new Error(
        "Dokumen yang memerlukan tanda tangan harus memiliki file tanda tangan"
      );
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // Log handover document update
    strapi.log.info(`Handover document updated: ${result.document_name}`);

    // Update unit status if document is complete
    if (result.status === "complete" && result.unit) {
      await strapi
        .service("api::unit.unit")
        .updateUnitStatus(result.unit, "handed_over");
    }

    // Send notification if signed
    if (result.status === "signed") {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "handover_document_signed",
          title: "Dokumen Serah Terima Ditandatangani",
          message: `Dokumen ${result.document_name} telah ditandatangani`,
          project: result.project,
          priority: "medium",
        },
      });
    }

    // Complete related tasks
    if (result.status === "complete") {
      await strapi.entityService.updateMany("api::task.task", {
        filters: {
          handover_document: result.id,
        },
        data: {
          status: "completed",
          completed_at: new Date(),
        },
      });
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    // Check if document is signed or complete
    const doc = await strapi.entityService.findOne(
      "api::handover-document.handover-document",
      where.id
    );
    if (doc && ["signed", "complete", "active"].includes(doc.status)) {
      throw new Error(
        "Tidak dapat menghapus dokumen yang sudah ditandatangani atau selesai"
      );
    }
  },

  async afterDelete(event) {
    const { result } = event;

    // Log handover document deletion
    strapi.log.info(`Handover document deleted: ${result.document_name}`);

    // Clean up related tasks
    await strapi.entityService.deleteMany("api::task.task", {
      filters: {
        handover_document: result.id,
      },
    });

    // Clean up related files
    if (result.file) {
      await strapi.plugins["upload"].services.upload.remove(result.file);
    }

    if (result.signature_file) {
      await strapi.plugins["upload"].services.upload.remove(
        result.signature_file
      );
    }
  },
};
```

## API Endpoints

### Site Plan Documents

- `GET /api/site-plan-documents` - List site plan documents
- `POST /api/site-plan-documents` - Create site plan document
- `GET /api/site-plan-documents/:id` - Get specific site plan document
- `PUT /api/site-plan-documents/:id` - Update site plan document
- `DELETE /api/site-plan-documents/:id` - Delete site plan document

### Technical Drawings

- `GET /api/technical-drawings` - List technical drawings
- `POST /api/technical-drawings` - Create technical drawing
- `GET /api/technical-drawings/:id` - Get specific technical drawing
- `PUT /api/technical-drawings/:id` - Update technical drawing
- `DELETE /api/technical-drawings/:id` - Delete technical drawing

### Permit Documents

- `GET /api/permit-documents` - List permit documents
- `POST /api/permit-documents` - Create permit document
- `GET /api/permit-documents/:id` - Get specific permit document
- `PUT /api/permit-documents/:id` - Update permit document
- `DELETE /api/permit-documents/:id` - Delete permit document

### BOQ Documents

- `GET /api/boq-documents` - List BOQ documents
- `POST /api/boq-documents` - Create BOQ document
- `GET /api/boq-documents/:id` - Get specific BOQ document
- `PUT /api/boq-documents/:id` - Update BOQ document
- `DELETE /api/boq-documents/:id` - Delete BOQ document

### Handover Documents

- `GET /api/handover-documents` - List handover documents
- `POST /api/handover-documents` - Create handover document
- `GET /api/handover-documents/:id` - Get specific handover document
- `PUT /api/handover-documents/:id` - Update handover document
- `DELETE /api/handover-documents/:id` - Delete handover document

## Permissions

### Public Access

- `find` - Read access to published documents
- `findOne` - Read access to specific published documents

### Authenticated Users

- `find` - Read access to all documents
- `findOne` - Read access to specific documents
- `create` - Create documents (with validation)
- `update` - Update documents (with status validation)
- `delete` - Delete documents (with status validation)

### Admin Access

- Full CRUD access to all documents
- Bypass status validation
- Access to archived documents

## File Upload Configuration

```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      sizeLimit: 100 * 1024 * 1024, // 100MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      provider: "local",
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024,
      },
    },
  },
};
```

## Validation Rules

### File Format Validation

- Site Plan: PDF, DWG, JPG, PNG
- Technical Drawings: DWG, PDF, JPG
- Permit Documents: PDF, JPG, PNG
- BOQ Documents: XLSX, PDF
- Handover Documents: PDF, JPG, PNG

### File Size Limits

- Maximum file size: 100MB
- Recommended file sizes:
  - PDF documents: < 10MB
  - DWG files: < 50MB
  - Image files: < 5MB

### Document Number Formats

- IMB: `{number}/IMB/{year}-{sequence}`
- PBG: `PBG/{year}/{number}-{sequence}`
- Izin Lingkungan: `IL/{year}/{number}`

## Notifications

The system automatically sends notifications for:

- Document uploads
- Status changes
- Approval notifications
- Expiry reminders
- Signature requirements

## Integration Points

- Project Management System
- Budget Allocation System
- Task Management System
- Notification System
- File Storage System
- Compliance Tracking System
