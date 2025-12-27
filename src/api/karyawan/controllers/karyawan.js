// @ts-nocheck
"use strict";
const jwt = require("jsonwebtoken");

/**
 * karyawan controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::karyawan.karyawan",
  ({ strapi }) => ({
    async findSchedulable(ctx) {
      const { data, meta } = await super.find({
        ...ctx,
        query: {
          ...ctx.query,
          filters: {
            ...ctx.query.filters,
            can_be_scheduled: true,
          },
          populate: ["jabatan", "shift_preference"],
        },
      });

      return { data, meta };
    },

    async createAdminAccount(ctx) {
      try {
        // Validation: Verify Admin Token manually since we disabled default auth
        const authHeader = ctx.request.header.authorization;
        if (!authHeader) {
          return ctx.unauthorized("No authorization header");
        }

        const token = authHeader.replace("Bearer ", "");
        let payload;

        try {
          const adminVerify = (token) => {
            const adminAuth = strapi.config.get("admin.auth");
            const secret =
              adminAuth && adminAuth.secret
                ? adminAuth.secret
                : strapi.config.get("admin.auth.secret");

            if (!secret) {
              throw new Error("Admin auth secret not found in config");
            }

            if (Array.isArray(secret)) {
              let lastError;
              for (const s of secret) {
                try {
                  return jwt.verify(token, s);
                } catch (err) {
                  lastError = err;
                  if (err.message === "invalid signature") continue;
                  throw err;
                }
              }
              throw lastError || new Error("Invalid signature");
            }
            return jwt.verify(token, secret);
          };

          payload = adminVerify(token);
        } catch (err) {
          return ctx.unauthorized("Invalid token");
        }

        const adminId = payload.id || payload.userId;

        if (!adminId) {
          return ctx.unauthorized("Invalid token payload");
        }

        // Fetch Admin User with roles to check for Super Admin
        const adminUser = await strapi.db.query("admin::user").findOne({
          where: { id: adminId },
          populate: ["roles"],
        });

        if (!adminUser) {
          return ctx.unauthorized("Admin user not found");
        }

        // Check if user is Super Admin
        const isSuperAdmin = adminUser.roles.some(
          (r) => r.code === "strapi-super-admin"
        );

        if (!isSuperAdmin) {
          return ctx.forbidden(
            "Access denied: Only Super Admin can create admin accounts"
          );
        }

        const { id } = ctx.params;
        const { email, firstname, lastname, password, username, roleName } =
          ctx.request.body;

        // ... (rest of the createAdminAccount function continues below)

        if (!email || !password || !firstname || !lastname || !roleName) {
          return ctx.badRequest(
            "Missing required fields: email, firstname, lastname, password, roleName are required"
          );
        }

        // Check if Karyawan exists
        // Try to find by Document ID first (v5 standard), if not found, try regular ID just in case
        let karyawan = await strapi.entityService.findOne(
          "api::karyawan.karyawan",
          id
        );

        if (!karyawan) {
          // Fallback: Try finding by documentId explicitly if the default findOne expects an integer ID
          const karyawans = await strapi.entityService.findMany(
            "api::karyawan.karyawan",
            {
              filters: { documentId: id },
              limit: 1,
            }
          );
          if (karyawans && karyawans.length > 0) {
            karyawan = karyawans[0];
          }
        }

        if (!karyawan) {
          return ctx.notFound(`Karyawan not found with ID: ${id}`);
        }

        // Check if Karyawan already has a user
        if (karyawan.user) {
          return ctx.badRequest("Karyawan already has an admin account linked");
        }

        // Find Admin Role
        const role = await strapi.db.query("admin::role").findOne({
          where: { name: roleName },
        });

        if (!role) {
          return ctx.badRequest(`Admin role "${roleName}" not found`);
        }

        // Check if email already exists in Admin users
        const existingAdmin = await strapi.db.query("admin::user").findOne({
          where: { email },
        });

        if (existingAdmin) {
          return ctx.badRequest("Email already registered as Admin");
        }

        // Create Admin User
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
        const targetDocumentId = karyawan.documentId;
        console.log(
          "DEBUG: Attempting update with documentId:",
          targetDocumentId
        );
        console.log("DEBUG: Linking to Admin User ID:", newAdmin.id);

        // Switch to strapi.db.query to bypass potential entityService filtering issues
        const updatedKaryawan = await strapi.db
          .query("api::karyawan.karyawan")
          .update({
            where: { documentId: targetDocumentId },
            data: {
              user: newAdmin.id,
            },
            populate: ["user"],
          });

        console.log(
          "DEBUG: updatedKaryawan result:",
          updatedKaryawan ? "Found" : "NULL"
        );

        if (!updatedKaryawan) {
          // Fallback debug if update returns null
          console.log(
            "DEBUG: Update returned null. Checking if document exists with documentId..."
          );
        }

        return ctx.send({
          message: "Admin account created and linked successfully",
          data: {
            karyawanId: targetDocumentId,
            adminUserId: newAdmin.id,
            email: newAdmin.email,
            role: role.name,
            linked: updatedKaryawan ? !!updatedKaryawan.user : false,
          },
        });
      } catch (error) {
        strapi.log.error("Error creating admin account for karyawan:", error);
        return ctx.badRequest("Failed to create admin account", {
          error: error.message,
        });
      }
    },

    async resetAdminPassword(ctx) {
      try {
        // Validation: Verify Admin Token manually since we disabled default auth
        const authHeader = ctx.request.header.authorization;
        if (!authHeader) {
          return ctx.unauthorized("No authorization header");
        }

        const token = authHeader.replace("Bearer ", "");
        let payload;

        try {
          const adminVerify = (token) => {
            const adminAuth = strapi.config.get("admin.auth");
            const secret =
              adminAuth && adminAuth.secret
                ? adminAuth.secret
                : strapi.config.get("admin.auth.secret");

            if (!secret) {
              throw new Error("Admin auth secret not found in config");
            }

            if (Array.isArray(secret)) {
              let lastError;
              for (const s of secret) {
                try {
                  return jwt.verify(token, s);
                } catch (err) {
                  lastError = err;
                  if (err.message === "invalid signature") continue;
                  throw err;
                }
              }
              throw lastError || new Error("Invalid signature");
            }
            return jwt.verify(token, secret);
          };

          payload = adminVerify(token);
        } catch (err) {
          return ctx.unauthorized("Invalid token");
        }

        const adminId = payload.id || payload.userId;

        if (!adminId) {
          return ctx.unauthorized("Invalid token payload");
        }

        // Fetch Admin User with roles to check for Super Admin
        const adminUser = await strapi.db.query("admin::user").findOne({
          where: { id: adminId },
          populate: ["roles"],
        });

        if (!adminUser) {
          return ctx.unauthorized("Admin user not found");
        }

        // Check if user is Super Admin
        const isSuperAdmin = adminUser.roles.some(
          (r) => r.code === "strapi-super-admin"
        );

        if (!isSuperAdmin) {
          return ctx.forbidden(
            "Access denied: Only Super Admin can reset passwords"
          );
        }

        const { id } = ctx.params;
        const { password } = ctx.request.body;

        if (!password) {
          return ctx.badRequest("Password is required");
        }

        // Find Karyawan
        // Try to find by Document ID first (v5 standard), if not found, try regular ID just in case
        let karyawan = await strapi.entityService.findOne(
          "api::karyawan.karyawan",
          id,
          {
            populate: ["user"],
          }
        );

        if (!karyawan) {
          // Fallback: Try finding by documentId explicitly if the default findOne expects an integer ID
          const karyawans = await strapi.entityService.findMany(
            "api::karyawan.karyawan",
            {
              filters: { documentId: id },
              limit: 1,
              populate: ["user"],
            }
          );
          if (karyawans && karyawans.length > 0) {
            karyawan = karyawans[0];
          }
        }

        if (!karyawan) {
          return ctx.notFound(`Karyawan not found with ID: ${id}`);
        }

        if (!karyawan.user) {
          return ctx.badRequest(
            "Karyawan does not have a linked admin account"
          );
        }

        // Update Admin User Password
        // Use entityService to ensure lifecycles (like password hashing) are triggered
        await strapi.entityService.update("admin::user", karyawan.user.id, {
          data: {
            password: password,
          },
        });

        return ctx.send({
          message: "Password has been reset successfully",
        });
      } catch (error) {
        strapi.log.error("Error resetting admin password for karyawan:", error);
        return ctx.badRequest("Failed to reset password", {
          error: error.message,
        });
      }
    },
  })
);
