'use strict';

/**
 * absensi controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

// Haversine formula to calculate distance between two points in meters
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in meters
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = createCoreController('api::absensi.absensi', ({ strapi }) => ({
  async create(ctx) {
    const headers = ctx.request.headers;
    
    // 1. Security: Verify HMAC Signature
    const clientSecret = process.env.ABSENSI_CLIENT_SECRET;
    if (!clientSecret) {
        // Log error for admin but return generic error to user
        strapi.log.error('ABSENSI_CLIENT_SECRET is missing in .env');
        return ctx.badRequest('Service unavailable (configuration error)');
    }

    const signature = headers['x-app-signature'];
    const requestTimestamp = headers['x-app-timestamp'];
    const deviceId = headers['x-device-id'] || ''; // Optional binding
    
    if (!signature || !requestTimestamp) {
        return ctx.badRequest('Missing security headers');
    }

    // Verify timestamp freshness (e.g., 60 seconds)
    const now = Date.now();
    const reqTime = parseInt(requestTimestamp, 10);
    if (isNaN(reqTime) || Math.abs(now - reqTime) > 60000) { // 1 minute tolerance
        return ctx.badRequest('Request expired or invalid timestamp');
    }

    // Reconstruct payload to sign: timestamp + device_id
    // Ensure this matches exactly what the frontend generates
    const payloadToSign = `${requestTimestamp}${deviceId}`;
    const expectedSignature = crypto
        .createHmac('sha256', clientSecret)
        .update(payloadToSign)
        .digest('hex');

    if (signature !== expectedSignature) {
        return ctx.badRequest('Invalid signature');
    }

    // 2. Parse Body Data
    let bodyData;
    if (ctx.is('multipart')) {
        try {
            bodyData = JSON.parse(ctx.request.body.data);
        } catch (e) {
            return ctx.badRequest('Invalid JSON in data field');
        }
    } else {
        bodyData = ctx.request.body.data || ctx.request.body;
    }

    const { lat, lng } = bodyData;

    if (lat === undefined || lng === undefined) {
        return ctx.badRequest('Latitude (lat) and Longitude (lng) are required');
    }

    // 3. Identify User & Karyawan
    const user = ctx.state.user;
    if (!user) {
        return ctx.unauthorized('You must be logged in');
    }

    // Find Karyawan linked to this user
    const karyawan = await strapi.db.query('api::karyawan.karyawan').findOne({
        where: { user: user.id },
        populate: ['attendance_schedules']
    });

    if (!karyawan) {
        return ctx.notFound('Karyawan profile not found for this user account');
    }

    if (!karyawan.attendance_schedules || karyawan.attendance_schedules.length === 0) {
        return ctx.badRequest('No attendance schedule assigned to this employee');
    }

    // 4. Geofencing Logic
    // Find active schedule
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize for date comparison if needed
    
    const activeSchedule = karyawan.attendance_schedules.find(s => {
        if (!s.is_active) return false;
        const effective = new Date(s.effective_date);
        const expiry = s.expiry_date ? new Date(s.expiry_date) : null;
        return today >= effective && (!expiry || today <= expiry);
    });

    if (!activeSchedule) {
        return ctx.badRequest('No active attendance schedule found for today');
    }

    const { attendance_location, radius_meters } = activeSchedule;
    
    if (!attendance_location || attendance_location.lat === undefined || attendance_location.lng === undefined) {
         return ctx.badRequest('Invalid schedule configuration: missing location');
    }

    const target = { lat: attendance_location.lat, lng: attendance_location.lng };
    const current = { lat: parseFloat(lat), lng: parseFloat(lng) };

    if (isNaN(current.lat) || isNaN(current.lng)) {
        return ctx.badRequest('Invalid coordinates provided');
    }

    const dist = getDistanceFromLatLonInMeters(current.lat, current.lng, target.lat, target.lng);
    const isWithinRadius = dist <= radius_meters;

    if (!isWithinRadius) {
        return ctx.badRequest(`You are outside the allowed radius. Distance: ${dist.toFixed(2)}m, Allowed: ${radius_meters}m`);
    }

    // 5. Prepare Data for Creation
    console.log('[DEBUG] Karyawan ID found:', karyawan.id);
    console.log('[DEBUG] Schedule ID found:', activeSchedule.id);

    const newData = {
        ...bodyData,
        karyawan: karyawan.id,
        attendance_schedule: activeSchedule.id,
        is_within_radius: isWithinRadius,
        distance_from_target: dist,
        lokasi_absensi: {
             check_in_location: {
                 lat: current.lat,
                 lng: current.lng,
                 address: bodyData.address || 'Unknown',
                 accuracy: bodyData.accuracy || 0
             }
        },
        tanggal: new Date().toISOString().split('T')[0],
        jam_masuk: new Date().toISOString(), // Override with server time
        status_absensi: bodyData.status_absensi || 'hadir'
    };
    
    console.log('[DEBUG] Payload to Strapi Create:', JSON.stringify(newData, null, 2));

    // Update the context body
    if (ctx.is('multipart')) {
        ctx.request.body.data = JSON.stringify(newData);
    } else {
        ctx.request.body.data = newData;
    }

    try {
      // Call default create
      const response = await super.create(ctx);
      return response;
    } catch (err) {
      console.error('[DEBUG] Error in super.create:', err);
      console.error('[DEBUG] Error Details:', JSON.stringify(err.details, null, 2));
      throw err;
    }
  }
}));
