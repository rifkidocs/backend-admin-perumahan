"use strict";

/**
 * stock-opname service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::stock-opname.stock-opname",
  ({ strapi }) => ({
    async generateOpnameNumber() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      // Get the last opname number for this month
      const lastOpname = await strapi.entityService.findMany(
        "api::stock-opname.stock-opname",
        {
          filters: {
            opname_number: {
              $startsWith: `OP-${year}-${month}`,
            },
          },
          sort: { opname_number: "desc" },
          limit: 1,
        }
      );

      let sequence = 1;
      if (lastOpname.length > 0) {
        const lastNumber = lastOpname[0].opname_number;
        const lastSequence = parseInt(lastNumber.split("-").pop()) || 0;
        sequence = lastSequence + 1;
      }

      return `OP-${year}-${month}-${sequence.toString().padStart(3, "0")}`;
    },

    async getStockOpnameSummary(stockOpnameId) {
      const stockOpname = await strapi.entityService.findOne(
        "api::stock-opname.stock-opname",
        stockOpnameId,
        {
          populate: {
            items: {
              populate: ["material_gudang", "material_gudang.material"],
            },
            pic: {
              populate: ["jabatan", "departemen"],
            },
            reviewer: {
              populate: ["jabatan", "departemen"],
            },
          },
        }
      );

      if (!stockOpname) {
        throw new Error("Stock Opname not found");
      }

      const items = stockOpname.items || [];
      const totalItems = items.length;
      const matchedItems = items.filter((item) => item.difference === 0).length;
      const varianceItems = items.filter(
        (item) => item.difference !== 0
      ).length;
      const overItems = items.filter((item) => item.difference > 0).length;
      const shortItems = items.filter((item) => item.difference < 0).length;

      // Calculate value variance
      const totalValueOver = items
        .filter(
          (item) =>
            item.difference > 0 && item.material_gudang?.material?.harga_satuan
        )
        .reduce(
          (sum, item) =>
            sum + item.difference * item.material_gudang.material.harga_satuan,
          0
        );

      const totalValueShort = items
        .filter(
          (item) =>
            item.difference < 0 && item.material_gudang?.material?.harga_satuan
        )
        .reduce(
          (sum, item) =>
            sum +
            Math.abs(item.difference) *
              item.material_gudang.material.harga_satuan,
          0
        );

      return {
        stockOpname,
        summary: {
          totalItems,
          matchedItems,
          varianceItems,
          overItems,
          shortItems,
          totalVariance: stockOpname.total_variance || 0,
          totalValueOver,
          totalValueShort,
          matchRate:
            totalItems > 0 ? ((matchedItems / totalItems) * 100).toFixed(2) : 0,
        },
      };
    },

    async completeStockOpname(stockOpnameId, reviewerId) {
      const stockOpname = await strapi.entityService.findOne(
        "api::stock-opname.stock-opname",
        stockOpnameId,
        {
          populate: ["items"],
        }
      );

      if (!stockOpname) {
        throw new Error("Stock Opname not found");
      }

      if (stockOpname.status === "Completed") {
        throw new Error("Stock Opname is already completed");
      }

      if (!stockOpname.items || stockOpname.items.length === 0) {
        throw new Error("Cannot complete Stock Opname without items");
      }

      // Update status and add reviewer
      const updatedStockOpname = await strapi.entityService.update(
        "api::stock-opname.stock-opname",
        stockOpnameId,
        {
          data: {
            status: "Completed",
            reviewer: reviewerId,
          },
        }
      );

      // Log completion
      strapi.log.info(
        `Stock Opname ${updatedStockOpname.opname_number} completed by reviewer ID: ${reviewerId}`
      );

      return updatedStockOpname;
    },

    async getVarianceAnalysis(stockOpnameId) {
      const stockOpname = await strapi.entityService.findOne(
        "api::stock-opname.stock-opname",
        stockOpnameId,
        {
          populate: {
            items: {
              populate: ["material_gudang", "material_gudang.material"],
            },
          },
        }
      );

      if (!stockOpname)
        return {
          totalVariances: 0,
          overages: [],
          shortages: [],
          categories: {},
          recommendations: [],
        };

      const items = stockOpname.items.filter((item) => item.difference !== 0);

      const analysis = {
        totalVariances: items.length,
        overages: items.filter((item) => item.difference > 0),
        shortages: items.filter((item) => item.difference < 0),
        categories: {},
        recommendations: [],
      };

      // Group by material category
      items.forEach((item) => {
        const category = item.material_gudang?.material?.kategori || "Unknown";
        if (!analysis.categories[category]) {
          analysis.categories[category] = {
            count: 0,
            totalVariance: 0,
            totalValue: 0,
          };
        }
        analysis.categories[category].count++;
        analysis.categories[category].totalVariance += item.difference;
        if (item.material_gudang?.material?.harga_satuan) {
          analysis.categories[category].totalValue +=
            Math.abs(item.difference) *
            item.material_gudang.material.harga_satuan;
        }
      });

      // Generate recommendations
      if (analysis.overages.length > 0) {
        analysis.recommendations.push(
          "Review receiving procedures for materials with consistent overages"
        );
      }
      if (analysis.shortages.length > 0) {
        analysis.recommendations.push(
          "Investigate potential causes of material shortages or theft"
        );
      }
      if (items.length > 0) {
        analysis.recommendations.push(
          "Consider implementing more frequent stock checks for high-variance materials"
        );
      }

      return analysis;
    },
  })
);
