"use strict";

/**
 * stock-opname controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::stock-opname.stock-opname",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const response = await super.create(ctx);

        // Log stock opname creation
        strapi.log.info(
          `Stock Opname ${response.data.data.attributes.opname_number} created successfully`
        );

        return response;
      } catch (error) {
        strapi.log.error("Error creating stock opname:", error);
        ctx.badRequest("Error creating stock opname", { error: error.message });
      }
    },

    async update(ctx) {
      try {
        const response = await super.update(ctx);

        // Log stock opname update
        strapi.log.info(
          `Stock Opname ${response.data.data.attributes.opname_number} updated successfully`
        );

        return response;
      } catch (error) {
        strapi.log.error("Error updating stock opname:", error);
        ctx.badRequest("Error updating stock opname", { error: error.message });
      }
    },

    async find(ctx) {
      try {
        // Add population for related data
        ctx.query.populate = {
          ...ctx.query.populate,
          items: {
            populate: {
              material_gudang: {
                populate: ["material"],
              },
            },
          },
          pic: {
            populate: ["jabatan", "departemen"],
          },
          reviewer: {
            populate: ["jabatan", "departemen"],
          },
          document_attachment: true,
        };

        const response = await super.find(ctx);
        return response;
      } catch (error) {
        strapi.log.error("Error finding stock opnames:", error);
        ctx.badRequest("Error finding stock opnames", { error: error.message });
      }
    },

    async findOne(ctx) {
      try {
        // Add population for related data
        ctx.query.populate = {
          ...ctx.query.populate,
          items: {
            populate: {
              material_gudang: {
                populate: ["material"],
              },
            },
          },
          pic: {
            populate: ["jabatan", "departemen"],
          },
          reviewer: {
            populate: ["jabatan", "departemen"],
          },
          document_attachment: true,
        };

        const response = await super.findOne(ctx);
        return response;
      } catch (error) {
        strapi.log.error("Error finding stock opname:", error);
        ctx.badRequest("Error finding stock opname", { error: error.message });
      }
    },

    async generateReport(ctx) {
      try {
        const { id } = ctx.params;

        const stockOpname = await strapi.entityService.findOne(
          "api::stock-opname.stock-opname",
          id,
          {
            populate: {
              items: {
                populate: {
                  material_gudang: {
                    populate: ["material"],
                  },
                },
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
          return ctx.notFound("Stock Opname not found");
        }

        // Calculate report statistics
        const totalItems = stockOpname.items.length;
        const matchedItems = stockOpname.items.filter(
          (item) => item.difference === 0
        ).length;
        const overItems = stockOpname.items.filter(
          (item) => item.difference > 0
        ).length;
        const shortItems = stockOpname.items.filter(
          (item) => item.difference < 0
        ).length;

        const totalValueOver = stockOpname.items
          .filter(
            (item) =>
              item.difference > 0 &&
              item.material_gudang?.material?.harga_satuan
          )
          .reduce(
            (sum, item) =>
              sum +
              item.difference * item.material_gudang.material.harga_satuan,
            0
          );

        const totalValueShort = stockOpname.items
          .filter(
            (item) =>
              item.difference < 0 &&
              item.material_gudang?.material?.harga_satuan
          )
          .reduce(
            (sum, item) =>
              sum +
              Math.abs(item.difference) *
                item.material_gudang.material.harga_satuan,
            0
          );

        const reportData = {
          stockOpname,
          statistics: {
            totalItems,
            matchedItems,
            overItems,
            shortItems,
            totalValueOver,
            totalValueShort,
            totalVariance: stockOpname.total_variance || 0,
          },
        };

        return ctx.send({ data: reportData });
      } catch (error) {
        strapi.log.error("Error generating stock opname report:", error);
        ctx.badRequest("Error generating report", { error: error.message });
      }
    },
  })
);
