'use strict';

/**
 * karyawan controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::karyawan.karyawan', ({ strapi }) => ({
  async findSchedulable(ctx) {
    const { data, meta } = await super.find({
      ...ctx,
      query: {
        ...ctx.query,
        filters: {
          ...ctx.query.filters,
          can_be_scheduled: true
        },
        populate: ['jabatan', 'shift_preference']
      }
    });

    return { data, meta };
  },

  async createAdminAccount(ctx) {
    try {
      const { id } = ctx.params;
      const { email, firstname, lastname, password, username, roleName } = ctx.request.body;

      if (!email || !password || !firstname || !lastname || !roleName) {
        return ctx.badRequest('Missing required fields: email, firstname, lastname, password, roleName are required');
      }

      // Check if Karyawan exists
      const karyawan = await strapi.entityService.findOne('api::karyawan.karyawan', id);
      if (!karyawan) {
        return ctx.notFound('Karyawan not found');
      }

      // Check if Karyawan already has a user
      if (karyawan.user) {
        return ctx.badRequest('Karyawan already has an admin account linked');
      }

      // Find Admin Role
      const role = await strapi.db.query('admin::role').findOne({
        where: { name: roleName }
      });

      if (!role) {
        return ctx.badRequest(`Admin role "${roleName}" not found`);
      }

      // Check if email already exists in Admin users
      const existingAdmin = await strapi.db.query('admin::user').findOne({
        where: { email }
      });

      if (existingAdmin) {
        return ctx.badRequest('Email already registered as Admin');
      }

      // Create Admin User
      // Note: strapi.admin.services.user.create automatically hashes password in some versions, 
      // but to be safe we use the standard approach. 
      // In v4/v5, strapi.admin.services.user.create handles hashing if password is provided.
      const newAdmin = await strapi.admin.services.user.create({
        email,
        firstname,
        lastname,
        username: username || email, // Fallback username to email
        password,
        roles: [role.id],
        isActive: true,
      });

      // Link to Karyawan
      await strapi.entityService.update('api::karyawan.karyawan', id, {
        data: {
          user: newAdmin.id
        }
      });

      return ctx.send({
        message: 'Admin account created and linked successfully',
        data: {
          karyawanId: id,
          adminUserId: newAdmin.id,
          email: newAdmin.email,
          role: role.name
        }
      });

    } catch (error) {
      strapi.log.error('Error creating admin account for karyawan:', error);
      return ctx.badRequest('Failed to create admin account', { error: error.message });
    }
  }
}));
