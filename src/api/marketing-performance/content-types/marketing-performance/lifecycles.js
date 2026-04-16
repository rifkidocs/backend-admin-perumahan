"use strict";

const dayjs = require("dayjs");

/**
 * marketing-performance lifecycle
 */

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    await calculatePerformance(data, data);
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Fetch existing data to ensure we have staff and period for calculation
    // especially if they are not being updated.
    const existing = await strapi.documents("api::marketing-performance.marketing-performance").findOne({
      documentId: where.documentId,
      populate: ["marketing_staff"],
    });

    if (!existing) return;

    // Merge existing data with updates for calculation purposes
    const fullData = {
      ...existing,
      ...data,
    };

    // Ensure marketing_staff is handled correctly if it's being updated
    if (data.marketing_staff) {
      fullData.marketing_staff = data.marketing_staff;
    }

    await calculatePerformance(data, fullData);
  },
};

/**
 * Calculates performance metrics based on aggregated data from other collections.
 * @param {Object} data - The data object to be updated (event.params.data)
 * @param {Object} fullData - The complete data (existing + updates) for calculation
 */
async function calculatePerformance(data, fullData) {
  // Extract staff identifier (prefer documentId for Strapi 5)
  let staffId =
    fullData.marketing_staff?.documentId ||
    fullData.marketing_staff?.id ||
    fullData.marketing_staff;

  // Handle Strapi 5 relation update format if necessary
  if (typeof staffId === "object" && staffId.connect) {
    staffId =
      staffId.connect[0]?.documentId ||
      staffId.connect[0]?.id ||
      staffId.connect[0];
  }

  const periode = fullData.periode;

  // We need both staff and period to perform aggregation
  if (!staffId || !periode) return;

  const startDate = dayjs(periode).startOf("month");
  const endDate = dayjs(periode).endOf("month");

  // 1. Count Completed Visits
  // Query 'api::jadwal-marketing.jadwal-marketing'
  const visits = await strapi
    .documents("api::jadwal-marketing.jadwal-marketing")
    .findMany({
      filters: {
        assigned_staff: {
          documentId: staffId,
        },
        activity_type: { $in: ["site_visit", "customer_visit", "canvassing"] },
        status_jadwal: "completed",
        start_date: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      },
    });
  data.pencapaian_kunjungan = visits.length;

  // 2. Count Bookings
  // Query 'api::booking.booking'
  const bookings = await strapi.documents("api::booking.booking").findMany({
    filters: {
      marketing_staff: {
        documentId: staffId,
      },
      booking_date: {
        $gte: startDate.format("YYYY-MM-DD"),
        $lte: endDate.format("YYYY-MM-DD"),
      },
    },
  });
  data.pencapaian_booking = bookings.length;

  // 3. Fetch Sales Achievement from 'api::target-marketing.target-marketing'
  const targets = await strapi
    .documents("api::target-marketing.target-marketing")
    .findMany({
      filters: {
        marketing: {
          documentId: staffId,
        },
        periode: periode,
      },
    });

  let targetUnit = 0;
  let pencapaianUnit = 0;
  targets.forEach((t) => {
    targetUnit += t.target_unit || 0;
    pencapaianUnit += t.pencapaian_unit || 0;
  });

  data.target_penjualan = targetUnit;
  data.pencapaian_penjualan = pencapaianUnit;

  // 4. Calculate Scores
  const targetKunjunganHarian =
    fullData.target_kunjungan_harian !== undefined
      ? fullData.target_kunjungan_harian
      : 10;
  const targetBooking = fullData.target_booking || 0;

  // VisitRatio = (Actual Visits / (target_kunjungan_harian * 22)) * 100
  const targetKunjunganTotal = targetKunjunganHarian * 22;
  let visitRatio = 0;
  if (targetKunjunganTotal > 0) {
    visitRatio = (data.pencapaian_kunjungan / targetKunjunganTotal) * 100;
  }

  // BookingRatio = (Actual Bookings / target_booking) * 100
  let bookingRatio = 0;
  if (targetBooking > 0) {
    bookingRatio = (data.pencapaian_booking / targetBooking) * 100;
  }

  // SalesRatio = (pencapaian_unit / target_unit) * 100
  let salesRatio = 0;
  if (targetUnit > 0) {
    salesRatio = (pencapaianUnit / targetUnit) * 100;
  }

  // skor_kinerja = (VisitRatio * 0.3) + (BookingRatio * 0.3) + (SalesRatio * 0.4)
  const totalScore = visitRatio * 0.3 + bookingRatio * 0.3 + salesRatio * 0.4;
  data.skor_kinerja = parseFloat(totalScore.toFixed(2));

  // 5. Assign Rating
  // < 60: poor, 60-75: satisfactory, 75-90: good, > 90: excellent
  if (data.skor_kinerja > 90) {
    data.rating = "excellent";
  } else if (data.skor_kinerja >= 75) {
    data.rating = "good";
  } else if (data.skor_kinerja >= 60) {
    data.rating = "satisfactory";
  } else {
    data.rating = "poor";
  }
}
