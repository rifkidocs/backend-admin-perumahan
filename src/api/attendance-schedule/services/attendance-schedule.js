"use strict";

/**
 * attendance-schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::attendance-schedule.attendance-schedule');
