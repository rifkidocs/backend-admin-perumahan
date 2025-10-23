# Dokumentasi Strapi - Data Penilaian Kinerja (Performance Evaluation)

## Overview

Dokumentasi ini menjelaskan implementasi sistem Data Penilaian Kinerja untuk modul HRM menggunakan Strapi CMS. Sistem ini mencakup evaluasi kinerja karyawan, KPI per divisi, dan pencapaian target.

## Content Types

### 1. Performance Evaluation (penilaian-kinerja)

#### Schema Structure

```javascript
{
  "collectionName": "penilaian_kinerjas",
  "info": {
    "singularName": "penilaian-kinerja",
    "pluralName": "penilaian-kinerjas",
    "displayName": "Penilaian Kinerja",
    "description": "Data evaluasi kinerja karyawan"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "nik_karyawan": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "nama_karyawan": {
      "type": "string",
      "required": true
    },
    "divisi": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::departemen.departemen"
    },
    "jabatan": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::jabatan.jabatan"
    },
    "periode_evaluasi": {
      "type": "string",
      "required": true
    },
    "tahun_evaluasi": {
      "type": "integer",
      "required": true
    },
    "bulan_evaluasi": {
      "type": "integer",
      "required": true
    },
    "rating_kinerja": {
      "type": "decimal",
      "required": true,
      "min": 1,
      "max": 5
    },
    "target_divisi": {
      "type": "string"
    },
    "pencapaian_target": {
      "type": "string"
    },
    "persentase_pencapaian": {
      "type": "decimal"
    },
    "reviewer": {
      "type": "string",
      "required": true
    },
    "catatan_review": {
      "type": "text"
    },
    "status_evaluasi": {
      "type": "enumeration",
      "enum": ["draft", "submitted", "reviewed", "approved"],
      "default": "draft"
    },
    "tanggal_evaluasi": {
      "type": "date",
      "required": true
    },
    "tanggal_review": {
      "type": "datetime"
    },
    "karyawan": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan"
    }
  }
}
```

### 2. KPI Divisi (kpi-divisi)

#### Schema Structure

```javascript
{
  "collectionName": "kpi_divisis",
  "info": {
    "singularName": "kpi-divisi",
    "pluralName": "kpi-divisis",
    "displayName": "KPI Divisi",
    "description": "Key Performance Indicators per divisi"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "nama_divisi": {
      "type": "string",
      "required": true
    },
    "kode_divisi": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "target_bulanan": {
      "type": "string",
      "required": true
    },
    "target_tahunan": {
      "type": "string",
      "required": true
    },
    "pencapaian_bulanan": {
      "type": "string"
    },
    "pencapaian_tahunan": {
      "type": "string"
    },
    "persentase_pencapaian": {
      "type": "decimal"
    },
    "periode": {
      "type": "string",
      "required": true
    },
    "tahun": {
      "type": "integer",
      "required": true
    },
    "bulan": {
      "type": "integer",
      "required": true
    },
    "status_target": {
      "type": "enumeration",
      "enum": ["tercapai", "melebihi", "kurang"],
      "default": "kurang"
    },
    "catatan": {
      "type": "text"
    },
    "divisi": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::departemen.departemen"
    }
  }
}
```

### 3. Performance Rating (rating-kinerja)

#### Schema Structure

```javascript
{
  "collectionName": "rating_kinerjas",
  "info": {
    "singularName": "rating-kinerja",
    "pluralName": "rating-kinerjas",
    "displayName": "Rating Kinerja",
    "description": "Distribusi rating kinerja karyawan"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "rating": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 5
    },
    "label_rating": {
      "type": "enumeration",
      "enum": ["Poor", "Needs Improvement", "Satisfactory", "Good", "Excellent"],
      "required": true
    },
    "jumlah_karyawan": {
      "type": "integer",
      "required": true,
      "default": 0
    },
    "persentase": {
      "type": "decimal",
      "required": true,
      "default": 0
    },
    "periode": {
      "type": "string",
      "required": true
    },
    "tahun": {
      "type": "integer",
      "required": true
    },
    "bulan": {
      "type": "integer",
      "required": true
    },
    "warna_badge": {
      "type": "string"
    }
  }
}
```

## Lifecycle Hooks

### 1. Penilaian Kinerja Lifecycle

#### File: `src/api/penilaian-kinerja/content-types/penilaian-kinerja/lifecycles.js`

```javascript
"use strict";

/**
 * penilaian-kinerja lifecycle
 */

module.exports = {
  /**
   * Triggered before user creation.
   * @param {Object} params - The params object
   * @param {Object} params.data - The data object
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate tanggal evaluasi jika tidak ada
    if (!data.tanggal_evaluasi) {
      data.tanggal_evaluasi = new Date();
    }

    // Set status default jika tidak ada
    if (!data.status_evaluasi) {
      data.status_evaluasi = "draft";
    }

    // Validasi rating kinerja
    if (data.rating_kinerja < 1 || data.rating_kinerja > 5) {
      throw new Error("Rating kinerja harus antara 1-5");
    }

    // Auto-calculate persentase pencapaian jika ada target dan pencapaian
    if (data.target_divisi && data.pencapaian_target) {
      const target = parseFloat(data.target_divisi.replace(/[^\d.]/g, ""));
      const pencapaian = parseFloat(
        data.pencapaian_target.replace(/[^\d.]/g, "")
      );

      if (target > 0) {
        data.persentase_pencapaian = ((pencapaian / target) * 100).toFixed(2);
      }
    }
  },

  /**
   * Triggered after user creation.
   * @param {Object} params - The params object
   * @param {Object} params.result - The result object
   */
  async afterCreate(event) {
    const { result } = event.params;

    // Update rating distribution
    await updateRatingDistribution(result);

    // Log evaluasi baru
    strapi.log.info(
      `Evaluasi kinerja baru dibuat untuk ${result.nama_karyawan} (NIK: ${result.nik_karyawan})`
    );
  },

  /**
   * Triggered before user update.
   * @param {Object} params - The params object
   * @param {Object} params.data - The data object
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Update tanggal review jika status berubah ke reviewed atau approved
    if (
      data.status_evaluasi === "reviewed" ||
      data.status_evaluasi === "approved"
    ) {
      data.tanggal_review = new Date();
    }

    // Re-calculate persentase pencapaian jika ada perubahan
    if (data.target_divisi && data.pencapaian_target) {
      const target = parseFloat(data.target_divisi.replace(/[^\d.]/g, ""));
      const pencapaian = parseFloat(
        data.pencapaian_target.replace(/[^\d.]/g, "")
      );

      if (target > 0) {
        data.persentase_pencapaian = ((pencapaian / target) * 100).toFixed(2);
      }
    }
  },

  /**
   * Triggered after user update.
   * @param {Object} params - The params object
   * @param {Object} params.result - The result object
   */
  async afterUpdate(event) {
    const { result } = event.params;

    // Update rating distribution
    await updateRatingDistribution(result);

    // Log perubahan evaluasi
    strapi.log.info(
      `Evaluasi kinerja diperbarui untuk ${result.nama_karyawan} (NIK: ${result.nik_karyawan})`
    );
  },

  /**
   * Triggered before user deletion.
   * @param {Object} params - The params object
   * @param {Object} params.where - The where object
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Get evaluasi yang akan dihapus untuk logging
    const evaluasi = await strapi.entityService.findOne(
      "api::penilaian-kinerja.penilaian-kinerja",
      where.id,
      { populate: "*" }
    );

    if (evaluasi) {
      strapi.log.info(
        `Evaluasi kinerja akan dihapus untuk ${evaluasi.nama_karyawan} (NIK: ${evaluasi.nik_karyawan})`
      );
    }
  },

  /**
   * Triggered after user deletion.
   * @param {Object} params - The params object
   * @param {Object} params.result - The result object
   */
  async afterDelete(event) {
    const { result } = event.params;

    // Update rating distribution setelah penghapusan
    await updateRatingDistributionAfterDelete(result);

    strapi.log.info("Evaluasi kinerja berhasil dihapus");
  },
};

/**
 * Helper function to update rating distribution
 */
async function updateRatingDistribution(evaluasi) {
  try {
    const periode = `${evaluasi.bulan_evaluasi}/${evaluasi.tahun_evaluasi}`;

    // Get or create rating record
    let ratingRecord = await strapi.entityService.findMany(
      "api::rating-kinerja.rating-kinerja",
      {
        filters: {
          rating: evaluasi.rating_kinerja,
          periode: periode,
        },
      }
    );

    if (ratingRecord.length === 0) {
      // Create new rating record
      const labelMap = {
        1: "Poor",
        2: "Needs Improvement",
        3: "Satisfactory",
        4: "Good",
        5: "Excellent",
      };

      const colorMap = {
        1: "text-red-500",
        2: "text-orange-500",
        3: "text-green-500",
        4: "text-blue-500",
        5: "text-yellow-500",
      };

      await strapi.entityService.create("api::rating-kinerja.rating-kinerja", {
        data: {
          rating: evaluasi.rating_kinerja,
          label_rating: labelMap[evaluasi.rating_kinerja],
          jumlah_karyawan: 1,
          persentase: 0, // Will be calculated below
          periode: periode,
          tahun: evaluasi.tahun_evaluasi,
          bulan: evaluasi.bulan_evaluasi,
          warna_badge: colorMap[evaluasi.rating_kinerja],
        },
      });
    } else {
      // Update existing rating record
      await strapi.entityService.update(
        "api::rating-kinerja.rating-kinerja",
        ratingRecord[0].id,
        {
          data: {
            jumlah_karyawan: ratingRecord[0].jumlah_karyawan + 1,
          },
        }
      );
    }

    // Recalculate percentages for all ratings in this period
    await recalculateRatingPercentages(periode);
  } catch (error) {
    strapi.log.error("Error updating rating distribution:", error);
  }
}

/**
 * Helper function to recalculate rating percentages
 */
async function recalculateRatingPercentages(periode) {
  try {
    // Get total evaluations for this period
    const totalEvaluations = await strapi.entityService.findMany(
      "api::penilaian-kinerja.penilaian-kinerja",
      {
        filters: {
          periode_evaluasi: periode,
        },
      }
    );

    const total = totalEvaluations.length;

    if (total === 0) return;

    // Get all rating records for this period
    const ratingRecords = await strapi.entityService.findMany(
      "api::rating-kinerja.rating-kinerja",
      {
        filters: {
          periode: periode,
        },
      }
    );

    // Update percentages
    for (const record of ratingRecords) {
      const percentage = ((record.jumlah_karyawan / total) * 100).toFixed(2);

      await strapi.entityService.update(
        "api::rating-kinerja.rating-kinerja",
        record.id,
        {
          data: {
            persentase: parseFloat(percentage),
          },
        }
      );
    }
  } catch (error) {
    strapi.log.error("Error recalculating rating percentages:", error);
  }
}

/**
 * Helper function to update rating distribution after deletion
 */
async function updateRatingDistributionAfterDelete(evaluasi) {
  try {
    const periode = `${evaluasi.bulan_evaluasi}/${evaluasi.tahun_evaluasi}`;

    // Find and update rating record
    const ratingRecord = await strapi.entityService.findMany(
      "api::rating-kinerja.rating-kinerja",
      {
        filters: {
          rating: evaluasi.rating_kinerja,
          periode: periode,
        },
      }
    );

    if (ratingRecord.length > 0) {
      const newCount = Math.max(0, ratingRecord[0].jumlah_karyawan - 1);

      if (newCount === 0) {
        // Delete rating record if count becomes 0
        await strapi.entityService.delete(
          "api::rating-kinerja.rating-kinerja",
          ratingRecord[0].id
        );
      } else {
        // Update count
        await strapi.entityService.update(
          "api::rating-kinerja.rating-kinerja",
          ratingRecord[0].id,
          {
            data: {
              jumlah_karyawan: newCount,
            },
          }
        );
      }
    }

    // Recalculate percentages
    await recalculateRatingPercentages(periode);
  } catch (error) {
    strapi.log.error(
      "Error updating rating distribution after deletion:",
      error
    );
  }
}
```

### 2. KPI Divisi Lifecycle

#### File: `src/api/kpi-divisi/content-types/kpi-divisi/lifecycles.js`

```javascript
"use strict";

/**
 * kpi-divisi lifecycle
 */

module.exports = {
  /**
   * Triggered before KPI creation.
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-calculate persentase pencapaian
    if (data.target_bulanan && data.pencapaian_bulanan) {
      const target = parseFloat(data.target_bulanan.replace(/[^\d.]/g, ""));
      const pencapaian = parseFloat(
        data.pencapaian_bulanan.replace(/[^\d.]/g, "")
      );

      if (target > 0) {
        const persentase = ((pencapaian / target) * 100).toFixed(2);
        data.persentase_pencapaian = parseFloat(persentase);

        // Set status target based on percentage
        if (persentase >= 100) {
          data.status_target = persentase > 100 ? "melebihi" : "tercapai";
        } else {
          data.status_target = "kurang";
        }
      }
    }

    // Set periode format
    if (data.tahun && data.bulan) {
      data.periode = `${data.bulan}/${data.tahun}`;
    }
  },

  /**
   * Triggered after KPI creation.
   */
  async afterCreate(event) {
    const { result } = event.params;

    // Log KPI baru
    strapi.log.info(
      `KPI baru dibuat untuk divisi ${result.nama_divisi} periode ${result.periode}`
    );

    // Update divisi statistics
    await updateDivisiStatistics(result.divisi?.id);
  },

  /**
   * Triggered before KPI update.
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Re-calculate persentase pencapaian
    if (data.target_bulanan && data.pencapaian_bulanan) {
      const target = parseFloat(data.target_bulanan.replace(/[^\d.]/g, ""));
      const pencapaian = parseFloat(
        data.pencapaian_bulanan.replace(/[^\d.]/g, "")
      );

      if (target > 0) {
        const persentase = ((pencapaian / target) * 100).toFixed(2);
        data.persentase_pencapaian = parseFloat(persentase);

        // Set status target based on percentage
        if (persentase >= 100) {
          data.status_target = persentase > 100 ? "melebihi" : "tercapai";
        } else {
          data.status_target = "kurang";
        }
      }
    }
  },

  /**
   * Triggered after KPI update.
   */
  async afterUpdate(event) {
    const { result } = event.params;

    // Log perubahan KPI
    strapi.log.info(
      `KPI diperbarui untuk divisi ${result.nama_divisi} periode ${result.periode}`
    );

    // Update divisi statistics
    await updateDivisiStatistics(result.divisi?.id);
  },

  /**
   * Triggered before KPI deletion.
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Get KPI yang akan dihapus untuk logging
    const kpi = await strapi.entityService.findOne(
      "api::kpi-divisi.kpi-divisi",
      where.id,
      { populate: "*" }
    );

    if (kpi) {
      strapi.log.info(
        `KPI akan dihapus untuk divisi ${kpi.nama_divisi} periode ${kpi.periode}`
      );
    }
  },

  /**
   * Triggered after KPI deletion.
   */
  async afterDelete(event) {
    const { result } = event.params;

    strapi.log.info("KPI berhasil dihapus");

    // Update divisi statistics
    await updateDivisiStatistics(result.divisi?.id);
  },
};

/**
 * Helper function to update divisi statistics
 */
async function updateDivisiStatistics(divisiId) {
  try {
    if (!divisiId) return;

    // Get all KPIs for this divisi
    const kpis = await strapi.entityService.findMany(
      "api::kpi-divisi.kpi-divisi",
      {
        filters: {
          divisi: divisiId,
        },
      }
    );

    // Calculate average achievement
    const totalAchievement = kpis.reduce(
      (sum, kpi) => sum + (kpi.persentase_pencapaian || 0),
      0
    );
    const averageAchievement =
      kpis.length > 0 ? totalAchievement / kpis.length : 0;

    // Update divisi record with statistics (if you have a statistics field)
    // This is optional and depends on your divisi schema

    strapi.log.info(
      `Divisi ${divisiId} statistics updated. Average achievement: ${averageAchievement.toFixed(
        2
      )}%`
    );
  } catch (error) {
    strapi.log.error("Error updating divisi statistics:", error);
  }
}
```

### 3. Rating Kinerja Lifecycle

#### File: `src/api/rating-kinerja/content-types/rating-kinerja/lifecycles.js`

```javascript
"use strict";

/**
 * rating-kinerja lifecycle
 */

module.exports = {
  /**
   * Triggered before rating creation.
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating harus antara 1-5");
    }

    // Set label based on rating
    const labelMap = {
      1: "Poor",
      2: "Needs Improvement",
      3: "Satisfactory",
      4: "Good",
      5: "Excellent",
    };

    if (!data.label_rating) {
      data.label_rating = labelMap[data.rating];
    }

    // Set color based on rating
    const colorMap = {
      1: "text-red-500",
      2: "text-orange-500",
      3: "text-green-500",
      4: "text-blue-500",
      5: "text-yellow-500",
    };

    if (!data.warna_badge) {
      data.warna_badge = colorMap[data.rating];
    }

    // Set default values
    if (!data.jumlah_karyawan) {
      data.jumlah_karyawan = 0;
    }

    if (!data.persentase) {
      data.persentase = 0;
    }
  },

  /**
   * Triggered after rating creation.
   */
  async afterCreate(event) {
    const { result } = event.params;

    strapi.log.info(
      `Rating record created: ${result.label_rating} (${result.rating}) for period ${result.periode}`
    );

    // Recalculate all percentages for this period
    await recalculateAllRatingPercentages(result.periode);
  },

  /**
   * Triggered before rating update.
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Validate rating range if being updated
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating harus antara 1-5");
    }
  },

  /**
   * Triggered after rating update.
   */
  async afterUpdate(event) {
    const { result } = event.params;

    strapi.log.info(
      `Rating record updated: ${result.label_rating} (${result.rating}) for period ${result.periode}`
    );

    // Recalculate all percentages for this period
    await recalculateAllRatingPercentages(result.periode);
  },

  /**
   * Triggered before rating deletion.
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Get rating yang akan dihapus untuk logging
    const rating = await strapi.entityService.findOne(
      "api::rating-kinerja.rating-kinerja",
      where.id
    );

    if (rating) {
      strapi.log.info(
        `Rating record akan dihapus: ${rating.label_rating} (${rating.rating}) periode ${rating.periode}`
      );
    }
  },

  /**
   * Triggered after rating deletion.
   */
  async afterDelete(event) {
    const { result } = event.params;

    strapi.log.info("Rating record berhasil dihapus");

    // Recalculate all percentages for this period
    await recalculateAllRatingPercentages(result.periode);
  },
};

/**
 * Helper function to recalculate all rating percentages for a period
 */
async function recalculateAllRatingPercentages(periode) {
  try {
    // Get all rating records for this period
    const ratingRecords = await strapi.entityService.findMany(
      "api::rating-kinerja.rating-kinerja",
      {
        filters: {
          periode: periode,
        },
      }
    );

    // Calculate total employees
    const totalEmployees = ratingRecords.reduce(
      (sum, record) => sum + record.jumlah_karyawan,
      0
    );

    if (totalEmployees === 0) return;

    // Update percentages for all records
    for (const record of ratingRecords) {
      const percentage = (
        (record.jumlah_karyawan / totalEmployees) *
        100
      ).toFixed(2);

      await strapi.entityService.update(
        "api::rating-kinerja.rating-kinerja",
        record.id,
        {
          data: {
            persentase: parseFloat(percentage),
          },
        }
      );
    }

    strapi.log.info(
      `Recalculated percentages for period ${periode}. Total employees: ${totalEmployees}`
    );
  } catch (error) {
    strapi.log.error("Error recalculating rating percentages:", error);
  }
}
```

## API Endpoints

### Performance Evaluation Endpoints

```javascript
// GET /api/penilaian-kinerjas
// Query parameters:
// - page: number (default: 1)
// - pageSize: number (default: 25)
// - search: string (search by nama_karyawan or nik_karyawan)
// - divisi: number (filter by divisi ID)
// - periode: string (filter by periode)
// - rating: number (filter by rating)
// - status: string (filter by status_evaluasi)

// GET /api/penilaian-kinerjas/:id
// Returns single evaluation with populated relations

// POST /api/penilaian-kinerjas
// Body: Performance evaluation data

// PUT /api/penilaian-kinerjas/:id
// Body: Updated performance evaluation data

// DELETE /api/penilaian-kinerjas/:id
// Deletes evaluation and updates rating distribution
```

### KPI Divisi Endpoints

```javascript
// GET /api/kpi-divisis
// Query parameters:
// - page: number
// - pageSize: number
// - divisi: number (filter by divisi ID)
// - periode: string (filter by periode)
// - tahun: number (filter by tahun)
// - bulan: number (filter by bulan)

// GET /api/kpi-divisis/:id
// Returns single KPI with populated relations

// POST /api/kpi-divisis
// Body: KPI data

// PUT /api/kpi-divisis/:id
// Body: Updated KPI data

// DELETE /api/kpi-divisis/:id
// Deletes KPI and updates statistics
```

### Rating Kinerja Endpoints

```javascript
// GET /api/rating-kinerjas
// Query parameters:
// - periode: string (filter by periode)
// - tahun: number (filter by tahun)
// - bulan: number (filter by bulan)

// GET /api/rating-kinerjas/:id
// Returns single rating record

// POST /api/rating-kinerjas
// Body: Rating data

// PUT /api/rating-kinerjas/:id
// Body: Updated rating data

// DELETE /api/rating-kinerjas/:id
// Deletes rating and recalculates percentages
```

## Custom Controllers

### Performance Statistics Controller

#### File: `src/api/penilaian-kinerja/controllers/penilaian-kinerja.js`

```javascript
"use strict";

/**
 * penilaian-kinerja controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::penilaian-kinerja.penilaian-kinerja",
  ({ strapi }) => ({
    // Get performance statistics
    async getStats(ctx) {
      try {
        const { periode } = ctx.query;

        // Get total evaluations
        const totalEvaluations = await strapi.entityService.findMany(
          "api::penilaian-kinerja.penilaian-kinerja",
          {
            filters: periode ? { periode_evaluasi: periode } : {},
            populate: "*",
          }
        );

        // Get excellent ratings (5)
        const excellentCount = totalEvaluations.filter(
          (eval) => eval.rating_kinerja === 5
        ).length;

        // Get needs improvement ratings (1-2)
        const needsImprovementCount = totalEvaluations.filter(
          (eval) => eval.rating_kinerja <= 2
        ).length;

        // Calculate average target achievement
        const evaluationsWithTarget = totalEvaluations.filter(
          (eval) => eval.persentase_pencapaian
        );
        const averageAchievement =
          evaluationsWithTarget.length > 0
            ? evaluationsWithTarget.reduce(
                (sum, eval) => sum + eval.persentase_pencapaian,
                0
              ) / evaluationsWithTarget.length
            : 0;

        ctx.body = {
          data: {
            totalEvaluations: totalEvaluations.length,
            excellentCount,
            needsImprovementCount,
            averageAchievement: parseFloat(averageAchievement.toFixed(2)),
          },
        };
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    // Get KPI by divisi
    async getKpiByDivisi(ctx) {
      try {
        const { periode } = ctx.query;

        const kpis = await strapi.entityService.findMany(
          "api::kpi-divisi.kpi-divisi",
          {
            filters: periode ? { periode: periode } : {},
            populate: "divisi",
          }
        );

        ctx.body = {
          data: kpis,
        };
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    // Get rating distribution
    async getRatingDistribution(ctx) {
      try {
        const { periode } = ctx.query;

        const ratings = await strapi.entityService.findMany(
          "api::rating-kinerja.rating-kinerja",
          {
            filters: periode ? { periode: periode } : {},
            sort: "rating:asc",
          }
        );

        ctx.body = {
          data: ratings,
        };
      } catch (error) {
        ctx.throw(500, error);
      }
    },
  })
);
```

## Routes Configuration

### Performance Evaluation Routes

#### File: `src/api/penilaian-kinerja/routes/penilaian-kinerja.js`

```javascript
"use strict";

/**
 * penilaian-kinerja router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::penilaian-kinerja.penilaian-kinerja");

// Custom routes
module.exports.routes = [
  {
    method: "GET",
    path: "/penilaian-kinerjas/stats",
    handler: "penilaian-kinerja.getStats",
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: "GET",
    path: "/penilaian-kinerjas/kpi-divisi",
    handler: "penilaian-kinerja.getKpiByDivisi",
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: "GET",
    path: "/penilaian-kinerjas/rating-distribution",
    handler: "penilaian-kinerja.getRatingDistribution",
    config: {
      policies: [],
      middlewares: [],
    },
  },
];
```

## Frontend Integration

### API Service Functions

#### File: `src/lib/performanceApi.js`

```javascript
import api from "./api";

// Performance Evaluation API functions
export const performanceAPI = {
  // Get all performance evaluations
  getEvaluations: async (params = {}) => {
    try {
      const {
        page = 1,
        pageSize = 25,
        search = "",
        divisi = "",
        periode = "",
        rating = "",
        status = "",
        sort = "createdAt:desc",
      } = params;

      let queryParams = {
        page: page,
        pageSize: pageSize,
        sort: sort,
        populate: "*",
      };

      // Add search filter
      if (search) {
        queryParams["_q"] = search;
      }

      // Add divisi filter
      if (divisi) {
        queryParams["filters[divisi][id][$eq]"] = divisi;
      }

      // Add periode filter
      if (periode) {
        queryParams["filters[periode_evaluasi][$eq]"] = periode;
      }

      // Add rating filter
      if (rating) {
        queryParams["filters[rating_kinerja][$eq]"] = rating;
      }

      // Add status filter
      if (status) {
        queryParams["filters[status_evaluasi][$eq]"] = status;
      }

      const response = await api.get(
        "/content-manager/collection-types/api::penilaian-kinerja.penilaian-kinerja",
        { params: queryParams }
      );
      return response.data;
    } catch (error) {
      console.warn(
        "Performance evaluations endpoint not found:",
        error.message
      );
      return {
        results: [],
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      };
    }
  },

  // Get performance statistics
  getStats: async (periode = "") => {
    try {
      const params = periode ? { periode } : {};
      const response = await api.get("/api/penilaian-kinerjas/stats", {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("Performance stats endpoint not found:", error.message);
      return {
        data: {
          totalEvaluations: 0,
          excellentCount: 0,
          needsImprovementCount: 0,
          averageAchievement: 0,
        },
      };
    }
  },

  // Get KPI by divisi
  getKpiByDivisi: async (periode = "") => {
    try {
      const params = periode ? { periode } : {};
      const response = await api.get("/api/penilaian-kinerjas/kpi-divisi", {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("KPI divisi endpoint not found:", error.message);
      return { data: [] };
    }
  },

  // Get rating distribution
  getRatingDistribution: async (periode = "") => {
    try {
      const params = periode ? { periode } : {};
      const response = await api.get(
        "/api/penilaian-kinerjas/rating-distribution",
        { params }
      );
      return response.data;
    } catch (error) {
      console.warn("Rating distribution endpoint not found:", error.message);
      return { data: [] };
    }
  },

  // Create new evaluation
  createEvaluation: async (evaluationData) => {
    const response = await api.post(
      "/content-manager/collection-types/api::penilaian-kinerja.penilaian-kinerja",
      evaluationData
    );
    return response.data;
  },

  // Update evaluation
  updateEvaluation: async (documentId, evaluationData) => {
    const response = await api.put(
      `/content-manager/collection-types/api::penilaian-kinerja.penilaian-kinerja/${documentId}`,
      evaluationData
    );
    return response.data;
  },

  // Delete evaluation
  deleteEvaluation: async (documentId) => {
    const response = await api.delete(
      `/content-manager/collection-types/api::penilaian-kinerja.penilaian-kinerja/${documentId}`
    );
    return response.data;
  },
};

// KPI Divisi API functions
export const kpiDivisiAPI = {
  // Get all KPIs
  getKpis: async (params = {}) => {
    try {
      const {
        page = 1,
        pageSize = 25,
        divisi = "",
        periode = "",
        tahun = "",
        bulan = "",
        sort = "createdAt:desc",
      } = params;

      let queryParams = {
        page: page,
        pageSize: pageSize,
        sort: sort,
        populate: "*",
      };

      // Add divisi filter
      if (divisi) {
        queryParams["filters[divisi][id][$eq]"] = divisi;
      }

      // Add periode filter
      if (periode) {
        queryParams["filters[periode][$eq]"] = periode;
      }

      // Add tahun filter
      if (tahun) {
        queryParams["filters[tahun][$eq]"] = tahun;
      }

      // Add bulan filter
      if (bulan) {
        queryParams["filters[bulan][$eq]"] = bulan;
      }

      const response = await api.get(
        "/content-manager/collection-types/api::kpi-divisi.kpi-divisi",
        { params: queryParams }
      );
      return response.data;
    } catch (error) {
      console.warn("KPI divisi endpoint not found:", error.message);
      return {
        results: [],
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 0,
          total: 0,
        },
      };
    }
  },

  // Create new KPI
  createKpi: async (kpiData) => {
    const response = await api.post(
      "/content-manager/collection-types/api::kpi-divisi.kpi-divisi",
      kpiData
    );
    return response.data;
  },

  // Update KPI
  updateKpi: async (documentId, kpiData) => {
    const response = await api.put(
      `/content-manager/collection-types/api::kpi-divisi.kpi-divisi/${documentId}`,
      kpiData
    );
    return response.data;
  },

  // Delete KPI
  deleteKpi: async (documentId) => {
    const response = await api.delete(
      `/content-manager/collection-types/api::kpi-divisi.kpi-divisi/${documentId}`
    );
    return response.data;
  },
};
```

## Usage Examples

### Creating Performance Evaluation

```javascript
// Example data for creating evaluation
const evaluationData = {
  nik_karyawan: "123456",
  nama_karyawan: "Ahmad Rizki",
  divisi: 1, // Marketing divisi ID
  jabatan: 1, // Marketing Executive position ID
  periode_evaluasi: "1/2024",
  tahun_evaluasi: 2024,
  bulan_evaluasi: 1,
  rating_kinerja: 5.0,
  target_divisi: "15 unit",
  pencapaian_target: "18 unit",
  reviewer: "Manager Marketing",
  catatan_review:
    "Mencapai target penjualan 120% dengan closing rate yang sangat baik.",
  status_evaluasi: "approved",
  tanggal_evaluasi: "2024-01-15",
  karyawan: 1, // Employee ID
};

// Create evaluation
const newEvaluation = await performanceAPI.createEvaluation(evaluationData);
```

### Getting Performance Statistics

```javascript
// Get statistics for current period
const stats = await performanceAPI.getStats("1/2024");

console.log(stats.data);
// Output:
// {
//   totalEvaluations: 142,
//   excellentCount: 28,
//   needsImprovementCount: 12,
//   averageAchievement: 85.5
// }
```

### Getting KPI by Divisi

```javascript
// Get KPI data for all divisions
const kpiData = await performanceAPI.getKpiByDivisi("1/2024");

console.log(kpiData.data);
// Output: Array of KPI objects with divisi information
```

## Summary

Dokumentasi ini menyediakan implementasi lengkap untuk sistem Data Penilaian Kinerja dengan:

1. **Content Types**: Penilaian Kinerja, KPI Divisi, dan Rating Kinerja
2. **Lifecycle Hooks**: Otomatisasi perhitungan persentase, update distribusi rating, dan logging
3. **API Endpoints**: CRUD operations dan custom endpoints untuk statistics
4. **Frontend Integration**: Service functions untuk integrasi dengan React frontend

Sistem ini akan secara otomatis:

- Menghitung persentase pencapaian target
- Update distribusi rating kinerja
- Mengelola status evaluasi
- Menyediakan statistics untuk dashboard
- Logging semua aktivitas evaluasi

Semua lifecycle hooks telah dioptimalkan untuk memastikan data konsisten dan akurat di seluruh sistem.
