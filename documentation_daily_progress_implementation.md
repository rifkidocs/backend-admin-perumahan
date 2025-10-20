# Dokumentasi Implementasi Progress Harian/Mingguan - Strapi Backend

## Overview

Dokumentasi ini menjelaskan implementasi backend Strapi untuk sistem Progress Harian/Mingguan yang mencakup tracking kemajuan konstruksi, dokumentasi pekerja, kondisi cuaca, penggunaan material, dan dokumentasi foto.

## Content Types yang Dibutuhkan

### 1. Daily Progress Report (Laporan Harian)

```javascript
// api/daily-progress-report/content-types/daily-progress-report/schema.json
{
  "kind": "collectionType",
  "collectionName": "daily_progress_reports",
  "info": {
    "singularName": "daily-progress-report",
    "pluralName": "daily-progress-reports",
    "displayName": "Laporan Progress Harian",
    "description": "Laporan kemajuan konstruksi harian"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "tanggal": {
      "type": "date",
      "required": true
    },
    "proyek": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan",
      "inversedBy": "progres_harians"
    },
    "blok_unit": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "aktivitas": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "status": {
      "type": "enumeration",
      "enum": ["sesuai_jadwal", "terlambat", "maju_jadwal"],
      "default": "sesuai_jadwal"
    },
    "persentase": {
      "type": "integer",
      "min": 0,
      "max": 100,
      "required": true
    },
    "deskripsi": {
      "type": "text"
    },
    "catatan": {
      "type": "text"
    },
    "dokumentasi_foto": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::progress-photo.progress-photo",
      "mappedBy": "laporan_progress"
    },
    "data_pekerja": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::worker-attendance.worker-attendance",
      "mappedBy": "laporan_progress"
    },
    "data_cuaca": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::weather-condition.weather-condition",
      "mappedBy": "laporan_progress"
    },
    "penggunaan_material": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::material-usage.material-usage",
      "mappedBy": "laporan_progress"
    },
    "created_by": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
```

### 2. Worker Attendance (Kehadiran Pekerja)

```javascript
// api/worker-attendance/content-types/worker-attendance/schema.json
{
  "kind": "collectionType",
  "collectionName": "worker_attendances",
  "info": {
    "singularName": "worker-attendance",
    "pluralName": "worker-attendances",
    "displayName": "Kehadiran Pekerja",
    "description": "Data kehadiran dan alokasi pekerja harian"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "tanggal": {
      "type": "date",
      "required": true
    },
    "proyek": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan"
    },
    "mandor": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "tukang_batu": {
      "type": "integer",
      "min": 0,
      "default": 0
    },
    "tukang_kayu": {
      "type": "integer",
      "min": 0,
      "default": 0
    },
    "tukang_cat": {
      "type": "integer",
      "min": 0,
      "default": 0
    },
    "kernet": {
      "type": "integer",
      "min": 0,
      "default": 0
    },
    "total_pekerja": {
      "type": "integer",
      "min": 0,
      "required": true
    },
    "persentase_kehadiran": {
      "type": "integer",
      "min": 0,
      "max": 100,
      "required": true
    },
    "catatan": {
      "type": "text"
    },
    "laporan_progress": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::daily-progress-report.daily-progress-report",
      "inversedBy": "data_pekerja"
    }
  }
}
```

### 3. Weather Condition (Kondisi Cuaca)

```javascript
// api/weather-condition/content-types/weather-condition/schema.json
{
  "kind": "collectionType",
  "collectionName": "weather_conditions",
  "info": {
    "singularName": "weather-condition",
    "pluralName": "weather-conditions",
    "displayName": "Kondisi Cuaca",
    "description": "Data kondisi cuaca dan dampaknya terhadap konstruksi"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "tanggal": {
      "type": "date",
      "required": true
    },
    "proyek": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan"
    },
    "kondisi_cuaca": {
      "type": "enumeration",
      "enum": ["cerah", "cerah_berawan", "berawan", "hujan_ringan", "hujan_sedang", "hujan_lebat", "angin_kencang"],
      "required": true
    },
    "suhu_min": {
      "type": "decimal",
      "min": -50,
      "max": 50
    },
    "suhu_max": {
      "type": "decimal",
      "min": -50,
      "max": 50
    },
    "kelembaban": {
      "type": "integer",
      "min": 0,
      "max": 100
    },
    "dampak_konstruksi": {
      "type": "enumeration",
      "enum": ["tidak_ada", "minor", "sedang", "signifikan"],
      "default": "tidak_ada"
    },
    "durasi_tunda": {
      "type": "integer",
      "min": 0,
      "description": "Durasi penundaan dalam menit"
    },
    "keterangan": {
      "type": "text"
    },
    "laporan_progress": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::daily-progress-report.daily-progress-report",
      "inversedBy": "data_cuaca"
    }
  }
}
```

### 4. Material Usage (Penggunaan Material)

```javascript
// api/material-usage/content-types/material-usage/schema.json
{
  "kind": "collectionType",
  "collectionName": "material_usages",
  "info": {
    "singularName": "material-usage",
    "pluralName": "material-usages",
    "displayName": "Penggunaan Material",
    "description": "Data penggunaan material dalam konstruksi"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "tanggal": {
      "type": "date",
      "required": true
    },
    "proyek": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan"
    },
    "material": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "kuantitas": {
      "type": "decimal",
      "min": 0,
      "required": true
    },
    "satuan": {
      "type": "string",
      "required": true,
      "maxLength": 50
    },
    "penggunaan": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "status_penggunaan": {
      "type": "enumeration",
      "enum": ["digunakan", "sebagian", "tidak_digunakan"],
      "default": "digunakan"
    },
    "harga_satuan": {
      "type": "decimal",
      "min": 0
    },
    "total_harga": {
      "type": "decimal",
      "min": 0
    },
    "catatan": {
      "type": "text"
    },
    "laporan_progress": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::daily-progress-report.daily-progress-report",
      "inversedBy": "penggunaan_material"
    }
  }
}
```

### 5. Progress Photo (Foto Progress)

```javascript
// api/progress-photo/content-types/progress-photo/schema.json
{
  "kind": "collectionType",
  "collectionName": "progress_photos",
  "info": {
    "singularName": "progress-photo",
    "pluralName": "progress-photos",
    "displayName": "Foto Progress",
    "description": "Dokumentasi foto kemajuan konstruksi"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "tanggal": {
      "type": "date",
      "required": true
    },
    "proyek": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::proyek-perumahan.proyek-perumahan"
    },
    "lokasi": {
      "type": "string",
      "required": true,
      "maxLength": 100
    },
    "judul": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "deskripsi": {
      "type": "text"
    },
    "foto": {
      "type": "media",
      "multiple": true,
      "required": true,
      "allowedTypes": ["images"]
    },
    "jumlah_foto": {
      "type": "integer",
      "min": 1,
      "required": true
    },
    "kategori": {
      "type": "enumeration",
      "enum": ["pondasi", "struktur", "atap", "finishing", "instalasi", "lainnya"],
      "default": "lainnya"
    },
    "laporan_progress": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::daily-progress-report.daily-progress-report",
      "inversedBy": "dokumentasi_foto"
    }
  }
}
```

## Lifecycle Hooks

### 1. Daily Progress Report Lifecycle

```javascript
// api/daily-progress-report/content-types/daily-progress-report/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi tanggal tidak boleh di masa depan
    if (new Date(data.tanggal) > new Date()) {
      throw new Error("Tanggal laporan tidak boleh di masa depan");
    }

    // Validasi persentase harus antara 0-100
    if (data.persentase < 0 || data.persentase > 100) {
      throw new Error("Persentase harus antara 0-100");
    }

    // Set created_by dari user yang sedang login
    if (event.state.user) {
      data.created_by = event.state.user.id;
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Validasi persentase
    if (
      data.persentase !== undefined &&
      (data.persentase < 0 || data.persentase > 100)
    ) {
      throw new Error("Persentase harus antara 0-100");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Update progress proyek secara otomatis
    await strapi
      .service("api::daily-progress-report.daily-progress-report")
      .updateProjectProgress(result.proyek);

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "CREATE_PROGRESS_REPORT",
      entity_type: "daily-progress-report",
      entity_id: result.id,
      description: `Laporan progress harian dibuat untuk ${
        result.proyek?.project_name || "proyek"
      }`,
    });
  },

  async afterUpdate(event) {
    const { result } = event;

    // Update progress proyek
    await strapi
      .service("api::daily-progress-report.daily-progress-report")
      .updateProjectProgress(result.proyek);

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "UPDATE_PROGRESS_REPORT",
      entity_type: "daily-progress-report",
      entity_id: result.id,
      description: `Laporan progress harian diperbarui untuk ${
        result.proyek?.project_name || "proyek"
      }`,
    });
  },

  async afterDelete(event) {
    const { result } = event;

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "DELETE_PROGRESS_REPORT",
      entity_type: "daily-progress-report",
      entity_id: result.id,
      description: `Laporan progress harian dihapus untuk ${
        result.proyek?.project_name || "proyek"
      }`,
    });
  },
};
```

### 2. Worker Attendance Lifecycle

```javascript
// api/worker-attendance/content-types/worker-attendance/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Hitung total pekerja secara otomatis
    data.total_pekerja =
      (data.tukang_batu || 0) +
      (data.tukang_kayu || 0) +
      (data.tukang_cat || 0) +
      (data.kernet || 0);

    // Validasi total pekerja minimal 1
    if (data.total_pekerja < 1) {
      throw new Error("Minimal harus ada 1 pekerja");
    }

    // Validasi persentase kehadiran
    if (data.persentase_kehadiran < 0 || data.persentase_kehadiran > 100) {
      throw new Error("Persentase kehadiran harus antara 0-100");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Hitung ulang total pekerja jika ada perubahan
    if (
      data.tukang_batu !== undefined ||
      data.tukang_kayu !== undefined ||
      data.tukang_cat !== undefined ||
      data.kernet !== undefined
    ) {
      data.total_pekerja =
        (data.tukang_batu || 0) +
        (data.tukang_kayu || 0) +
        (data.tukang_cat || 0) +
        (data.kernet || 0);
    }

    // Validasi persentase kehadiran
    if (
      data.persentase_kehadiran !== undefined &&
      (data.persentase_kehadiran < 0 || data.persentase_kehadiran > 100)
    ) {
      throw new Error("Persentase kehadiran harus antara 0-100");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "CREATE_WORKER_ATTENDANCE",
      entity_type: "worker-attendance",
      entity_id: result.id,
      description: `Data kehadiran pekerja dicatat: ${result.total_pekerja} pekerja dengan kehadiran ${result.persentase_kehadiran}%`,
    });
  },
};
```

### 3. Weather Condition Lifecycle

```javascript
// api/weather-condition/content-types/weather-condition/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi suhu
    if (data.suhu_min && data.suhu_max && data.suhu_min > data.suhu_max) {
      throw new Error(
        "Suhu minimum tidak boleh lebih besar dari suhu maksimum"
      );
    }

    // Validasi kelembaban
    if (data.kelembaban && (data.kelembaban < 0 || data.kelembaban > 100)) {
      throw new Error("Kelembaban harus antara 0-100");
    }

    // Set durasi tunda default jika dampak ada tapi durasi tidak diisi
    if (data.dampak_konstruksi !== "tidak_ada" && !data.durasi_tunda) {
      data.durasi_tunda = 0;
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Validasi suhu
    if (
      data.suhu_min !== undefined &&
      data.suhu_max !== undefined &&
      data.suhu_min > data.suhu_max
    ) {
      throw new Error(
        "Suhu minimum tidak boleh lebih besar dari suhu maksimum"
      );
    }

    // Validasi kelembaban
    if (
      data.kelembaban !== undefined &&
      (data.kelembaban < 0 || data.kelembaban > 100)
    ) {
      throw new Error("Kelembaban harus antara 0-100");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Jika ada dampak signifikan, kirim notifikasi
    if (result.dampak_konstruksi === "signifikan") {
      await strapi.service("api::notification.notification").sendWeatherAlert({
        project: result.proyek,
        weather: result.kondisi_cuaca,
        impact: result.dampak_konstruksi,
        delay: result.durasi_tunda,
      });
    }

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "CREATE_WEATHER_CONDITION",
      entity_type: "weather-condition",
      entity_id: result.id,
      description: `Kondisi cuaca dicatat: ${result.kondisi_cuaca} dengan dampak ${result.dampak_konstruksi}`,
    });
  },
};
```

### 4. Material Usage Lifecycle

```javascript
// api/material-usage/content-types/material-usage/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi kuantitas
    if (data.kuantitas <= 0) {
      throw new Error("Kuantitas material harus lebih dari 0");
    }

    // Hitung total harga jika harga satuan ada
    if (data.harga_satuan && data.kuantitas) {
      data.total_harga = data.harga_satuan * data.kuantitas;
    }

    // Validasi harga
    if (data.harga_satuan && data.harga_satuan < 0) {
      throw new Error("Harga satuan tidak boleh negatif");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Hitung ulang total harga jika ada perubahan
    if (data.harga_satuan !== undefined || data.kuantitas !== undefined) {
      const hargaSatuan = data.harga_satuan || event.params.where.harga_satuan;
      const kuantitas = data.kuantitas || event.params.where.kuantitas;

      if (hargaSatuan && kuantitas) {
        data.total_harga = hargaSatuan * kuantitas;
      }
    }

    // Validasi kuantitas
    if (data.kuantitas !== undefined && data.kuantitas <= 0) {
      throw new Error("Kuantitas material harus lebih dari 0");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Update stok material jika ada relasi dengan inventory
    if (result.material) {
      await strapi
        .service("api::material-usage.material-usage")
        .updateMaterialStock(result);
    }

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "CREATE_MATERIAL_USAGE",
      entity_type: "material-usage",
      entity_id: result.id,
      description: `Penggunaan material: ${result.material} sebanyak ${result.kuantitas} ${result.satuan}`,
    });
  },
};
```

### 5. Progress Photo Lifecycle

```javascript
// api/progress-photo/content-types/progress-photo/lifecycles.js
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Validasi minimal 1 foto
    if (!data.foto || data.foto.length === 0) {
      throw new Error("Minimal harus ada 1 foto");
    }

    // Set jumlah foto secara otomatis
    data.jumlah_foto = data.foto.length;

    // Validasi ukuran foto (maksimal 10MB per foto)
    for (const foto of data.foto) {
      if (foto.size > 10 * 1024 * 1024) {
        throw new Error(
          `Foto ${foto.name} terlalu besar. Maksimal 10MB per foto`
        );
      }
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Update jumlah foto jika ada perubahan
    if (data.foto !== undefined) {
      data.jumlah_foto = data.foto.length;
    }

    // Validasi ukuran foto
    if (data.foto) {
      for (const foto of data.foto) {
        if (foto.size > 10 * 1024 * 1024) {
          throw new Error(
            `Foto ${foto.name} terlalu besar. Maksimal 10MB per foto`
          );
        }
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Generate thumbnail untuk foto
    await strapi
      .service("api::progress-photo.progress-photo")
      .generateThumbnails(result.foto);

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "CREATE_PROGRESS_PHOTO",
      entity_type: "progress-photo",
      entity_id: result.id,
      description: `Foto progress diunggah: ${result.jumlah_foto} foto untuk ${result.judul}`,
    });
  },

  async afterDelete(event) {
    const { result } = event;

    // Hapus file foto dari storage
    if (result.foto && result.foto.length > 0) {
      for (const foto of result.foto) {
        await strapi.plugins.upload.services.upload.remove(foto);
      }
    }

    // Log aktivitas
    await strapi.service("api::activity-log.activity-log").create({
      action: "DELETE_PROGRESS_PHOTO",
      entity_type: "progress-photo",
      entity_id: result.id,
      description: `Foto progress dihapus: ${result.judul}`,
    });
  },
};
```

## Service Functions

### Daily Progress Report Service

```javascript
// api/daily-progress-report/services/daily-progress-report.js
module.exports = ({ strapi }) => ({
  async updateProjectProgress(projectId) {
    if (!projectId) return;

    // Ambil semua laporan progress untuk proyek ini
    const reports = await strapi.entityService.findMany(
      "api::daily-progress-report.daily-progress-report",
      {
        filters: { proyek: projectId },
        sort: { tanggal: "desc" },
        populate: ["proyek"],
      }
    );

    if (reports.length === 0) return;

    // Hitung rata-rata progress
    const totalProgress = reports.reduce(
      (sum, report) => sum + report.persentase,
      0
    );
    const averageProgress = Math.round(totalProgress / reports.length);

    // Update progress proyek
    await strapi.entityService.update(
      "api::proyek-perumahan.proyek-perumahan",
      projectId,
      {
        data: {
          progress_percentage: averageProgress,
          updatedAt: new Date(),
        },
      }
    );
  },

  async getProgressSummary(projectId, startDate, endDate) {
    const reports = await strapi.entityService.findMany(
      "api::daily-progress-report.daily-progress-report",
      {
        filters: {
          proyek: projectId,
          tanggal: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        sort: { tanggal: "asc" },
        populate: [
          "proyek",
          "data_pekerja",
          "data_cuaca",
          "penggunaan_material",
          "dokumentasi_foto",
        ],
      }
    );

    return {
      totalReports: reports.length,
      averageProgress:
        reports.length > 0
          ? Math.round(
              reports.reduce((sum, r) => sum + r.persentase, 0) / reports.length
            )
          : 0,
      onScheduleCount: reports.filter((r) => r.status === "sesuai_jadwal")
        .length,
      delayedCount: reports.filter((r) => r.status === "terlambat").length,
      aheadCount: reports.filter((r) => r.status === "maju_jadwal").length,
      reports,
    };
  },
});
```

### Weather Condition Service

```javascript
// api/weather-condition/services/weather-condition.js
module.exports = ({ strapi }) => ({
  async getWeatherImpact(projectId, startDate, endDate) {
    const conditions = await strapi.entityService.findMany(
      "api::weather-condition.weather-condition",
      {
        filters: {
          proyek: projectId,
          tanggal: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        sort: { tanggal: "asc" },
      }
    );

    const impactSummary = {
      totalDays: conditions.length,
      noImpact: conditions.filter((c) => c.dampak_konstruksi === "tidak_ada")
        .length,
      minorImpact: conditions.filter((c) => c.dampak_konstruksi === "minor")
        .length,
      moderateImpact: conditions.filter((c) => c.dampak_konstruksi === "sedang")
        .length,
      significantImpact: conditions.filter(
        (c) => c.dampak_konstruksi === "signifikan"
      ).length,
      totalDelayMinutes: conditions.reduce(
        (sum, c) => sum + (c.durasi_tunda || 0),
        0
      ),
    };

    return impactSummary;
  },
});
```

## API Endpoints

### Custom Routes

```javascript
// api/daily-progress-report/routes/custom.js
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/daily-progress/summary/:projectId",
      handler: "daily-progress-report.getProjectSummary",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/daily-progress/export/:projectId",
      handler: "daily-progress-report.exportToPDF",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/daily-progress/bulk-create",
      handler: "daily-progress-report.bulkCreate",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

### Custom Controllers

```javascript
// api/daily-progress-report/controllers/custom.js
module.exports = {
  async getProjectSummary(ctx) {
    const { projectId } = ctx.params;
    const { startDate, endDate } = ctx.query;

    try {
      const summary = await strapi
        .service("api::daily-progress-report.daily-progress-report")
        .getProgressSummary(projectId, startDate, endDate);

      ctx.body = summary;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async exportToPDF(ctx) {
    const { projectId } = ctx.params;
    const { startDate, endDate } = ctx.query;

    try {
      const summary = await strapi
        .service("api::daily-progress-report.daily-progress-report")
        .getProgressSummary(projectId, startDate, endDate);

      // Generate PDF logic here
      const pdfBuffer = await strapi
        .service("api::pdf-generator.pdf-generator")
        .generateProgressReport(summary);

      ctx.set("Content-Type", "application/pdf");
      ctx.set(
        "Content-Disposition",
        `attachment; filename="progress-report-${projectId}.pdf"`
      );
      ctx.body = pdfBuffer;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },

  async bulkCreate(ctx) {
    const { reports } = ctx.request.body;

    try {
      const createdReports = [];

      for (const report of reports) {
        const created = await strapi.entityService.create(
          "api::daily-progress-report.daily-progress-report",
          {
            data: report,
          }
        );
        createdReports.push(created);
      }

      ctx.body = {
        message: `${createdReports.length} laporan berhasil dibuat`,
        reports: createdReports,
      };
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
};
```

## Validasi dan Middleware

### Validation Rules

```javascript
// api/daily-progress-report/content-types/daily-progress-report/validators.js
module.exports = {
  async validateTanggal(value) {
    if (!value) {
      throw new Error("Tanggal wajib diisi");
    }

    const tanggal = new Date(value);
    const today = new Date();

    if (tanggal > today) {
      throw new Error("Tanggal tidak boleh di masa depan");
    }

    return true;
  },

  async validatePersentase(value) {
    if (value < 0 || value > 100) {
      throw new Error("Persentase harus antara 0-100");
    }

    return true;
  },
};
```

## Notifikasi dan Alert

### Weather Alert Service

```javascript
// api/notification/services/notification.js
module.exports = ({ strapi }) => ({
  async sendWeatherAlert({ project, weather, impact, delay }) {
    const projectData = await strapi.entityService.findOne(
      "api::proyek-perumahan.proyek-perumahan",
      project.id
    );

    const message = {
      title: "Peringatan Cuaca - Dampak Signifikan",
      body: `Proyek ${projectData.project_name} mengalami dampak ${impact} akibat cuaca ${weather}. Durasi penundaan: ${delay} menit.`,
      type: "weather_alert",
      priority: "high",
      project_id: project.id,
    };

    // Kirim notifikasi ke admin dan project manager
    await strapi
      .service("api::notification.notification")
      .sendToProjectTeam(project.id, message);
  },

  async sendToProjectTeam(projectId, message) {
    // Implementasi pengiriman notifikasi ke tim proyek
    // Bisa menggunakan email, SMS, atau push notification
  },
});
```

## Dashboard dan Analytics

### Progress Analytics Service

```javascript
// api/analytics/services/progress-analytics.js
module.exports = ({ strapi }) => ({
  async getProgressTrends(projectId, period = "30d") {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace("d", "")));

    const reports = await strapi.entityService.findMany(
      "api::daily-progress-report.daily-progress-report",
      {
        filters: {
          proyek: projectId,
          tanggal: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        sort: { tanggal: "asc" },
      }
    );

    return {
      trends: reports.map((r) => ({
        date: r.tanggal,
        progress: r.persentase,
        status: r.status,
      })),
      averageDailyProgress:
        reports.length > 0
          ? reports.reduce((sum, r) => sum + r.persentase, 0) / reports.length
          : 0,
      completionRate:
        (reports.filter((r) => r.persentase === 100).length / reports.length) *
        100,
    };
  },

  async getWorkerEfficiency(projectId, period = "30d") {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period.replace("d", "")));

    const attendances = await strapi.entityService.findMany(
      "api::worker-attendance.worker-attendance",
      {
        filters: {
          proyek: projectId,
          tanggal: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        sort: { tanggal: "asc" },
      }
    );

    return {
      averageAttendance:
        attendances.length > 0
          ? attendances.reduce((sum, a) => sum + a.persentase_kehadiran, 0) /
            attendances.length
          : 0,
      totalWorkers: attendances.reduce((sum, a) => sum + a.total_pekerja, 0),
      attendanceTrends: attendances.map((a) => ({
        date: a.tanggal,
        attendance: a.persentase_kehadiran,
        totalWorkers: a.total_pekerja,
      })),
    };
  },
});
```

## Konfigurasi dan Setup

### Plugin Configuration

```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      sizeLimit: 10 * 1024 * 1024, // 10MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      settings: {
        defaultFrom: process.env.SMTP_FROM,
        defaultReplyTo: process.env.SMTP_REPLY_TO,
      },
    },
  },
};
```

## Environment Variables

```bash
# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourcompany.com
SMTP_REPLY_TO=support@yourcompany.com

# File upload settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Notification settings
ENABLE_WEATHER_ALERTS=true
ENABLE_PROGRESS_NOTIFICATIONS=true
```

## Testing dan Development

### Test Data Seeder

```javascript
// database/seeders/progress-data-seeder.js
module.exports = {
  async seed() {
    // Seed sample progress reports
    const projects = await strapi.entityService.findMany(
      "api::proyek-perumahan.proyek-perumahan"
    );

    if (projects.length > 0) {
      const sampleProject = projects[0];

      // Create sample daily progress report
      await strapi.entityService.create(
        "api::daily-progress-report.daily-progress-report",
        {
          data: {
            tanggal: new Date(),
            proyek: sampleProject.id,
            blok_unit: "Blok A",
            aktivitas: "Pemasangan Atap",
            status: "sesuai_jadwal",
            persentase: 85,
            deskripsi: "Pemasangan atap berjalan sesuai jadwal",
            catatan: "Kondisi cuaca mendukung pengerjaan",
          },
        }
      );
    }
  },
};
```

Dokumentasi ini menyediakan implementasi lengkap untuk sistem Progress Harian/Mingguan dengan lifecycle hooks yang mencakup validasi, otomasi, dan logging. Semua content types saling terhubung untuk memberikan gambaran lengkap tentang kemajuan proyek konstruksi.
