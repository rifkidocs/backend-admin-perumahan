'use strict';

const crypto = require('crypto');

/**
 * `absensi-security` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Target only the Creation of Absensi via Content Manager
    // Path usually looks like: /content-manager/collection-types/api::absensi.absensi
    if (ctx.method === 'POST' && ctx.path.endsWith('/api::absensi.absensi')) {
        
        strapi.log.info('🛡️ Absensi Security Middleware: Intercepting request...');

        // 1. Load Secret
        const clientSecret = process.env.ABSENSI_CLIENT_SECRET;
        if (!clientSecret) {
            strapi.log.error('ABSENSI_CLIENT_SECRET is missing in .env');
            return ctx.badRequest('Service unavailable (configuration error)');
        }

        // 2. Get Headers
        const signature = ctx.request.headers['x-app-signature'];
        const requestTimestamp = ctx.request.headers['x-app-timestamp'];
        const deviceId = ctx.request.headers['x-device-id'] || ''; 

        // 3. Basic Validation
        if (!signature || !requestTimestamp) {
            strapi.log.warn('🛡️ Blocked: Missing security headers');
            return ctx.forbidden('Missing security headers (x-app-signature, x-app-timestamp)');
        }

        // 4. Time Validation (Anti-Replay) - 60 seconds window
        const now = Date.now();
        const reqTime = parseInt(requestTimestamp, 10);
        if (isNaN(reqTime) || Math.abs(now - reqTime) > 60000) {
            strapi.log.warn(`🛡️ Blocked: Timestamp expired. Server: ${now}, Client: ${reqTime}`);
            return ctx.forbidden('Request expired or invalid timestamp');
        }

        // 5. Signature Verification
        const payloadToSign = `${requestTimestamp}${deviceId}`;
        const expectedSignature = crypto
            .createHmac('sha256', clientSecret)
            .update(payloadToSign)
            .digest('hex');

        if (signature !== expectedSignature) {
            strapi.log.warn('🛡️ Blocked: Invalid signature mismatch');
            return ctx.forbidden('Invalid security signature');
        }

        strapi.log.info('✅ Absensi Security Middleware: Signature Verified. Proceeding.');
    }

    await next();
  };
};
