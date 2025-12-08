"use strict";

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

// Fungsi untuk menghitung jarak menggunakan Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
}



module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        try {
            console.log('[DEBUG LIFECYCLE] Incoming Data:', JSON.stringify(data, null, 2));

            // Validasi data lokasi
            if (!data.lokasi_absensi || !data.lokasi_absensi.check_in_location) {
                throw new Error('Data lokasi check-in diperlukan');
            }

            const { lat, lng } = data.lokasi_absensi.check_in_location;
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                throw new Error('Koordinat tidak valid');
            }

            // Helper to extract ID from relation input
            const getRelationId = (relation) => {
                if (!relation) return null;
                
                // Case: Simple ID (number or string)
                if (typeof relation === 'number' || typeof relation === 'string') return relation;
                
                // Case: Document Service "connect" syntax: { connect: [{ id: 1 }] } or { connect: [1] }
                if (relation.connect && Array.isArray(relation.connect) && relation.connect.length > 0) {
                    const first = relation.connect[0];
                    return typeof first === 'object' ? first.id : first;
                }

                // Case: Document Service "set" syntax: { set: [{ id: 1 }] } or { set: [1] }
                if (relation.set && Array.isArray(relation.set) && relation.set.length > 0) {
                    const first = relation.set[0];
                    return typeof first === 'object' ? first.id : first;
                }
                
                // Case: Direct object with ID: { id: 1 }
                if (relation.id) return relation.id;
                
                return null;
            };

            const karyawanId = getRelationId(data.karyawan);

            if (!karyawanId) {
                 // Maybe throw error or skip if not present (though schema says required)
                 // For now, let's assume it's required
                 throw new Error('Karyawan is required');
            }

            // Cari jadwal absensi aktif untuk karyawan
            const today = new Date().toISOString().split('T')[0];
            const attendanceSchedule = await strapi.entityService.findMany(
                'api::attendance-schedule.attendance-schedule',
                {
                    filters: {
                        employee: karyawanId,
                        is_active: true,
                        effective_date: { $lte: today },
                        $or: [
                            { expiry_date: { $gte: today } },
                            { expiry_date: { $null: true } }
                        ]
                    },
                    populate: ['employee', 'locations']
                }
            );

            if (!attendanceSchedule || attendanceSchedule.length === 0) {
                throw new Error('Tidak ada jadwal absensi aktif untuk karyawan ini');
            }

            const schedule = attendanceSchedule[0];
            data.attendance_schedule = schedule.id;

            // Hitung jarak dari lokasi target (support multiple locations)
            let minDistance = Infinity;
            let matchedLocationName = '';

            if (schedule.locations && Array.isArray(schedule.locations) && schedule.locations.length > 0) {
                for (const loc of schedule.locations) {
                    // Pastikan latitude/longitude ada dan valid
                    if (loc.latitude && loc.longitude) {
                        const dist = calculateDistance(
                            lat,
                            lng,
                            parseFloat(loc.latitude),
                            parseFloat(loc.longitude)
                        );
                        if (dist < minDistance) {
                            minDistance = dist;
                            matchedLocationName = loc.nama_lokasi;
                        }
                    }
                }
            } else {
                throw new Error('Jadwal absensi tidak memiliki konfigurasi lokasi yang valid');
            }
            
            // Set distance to the closest location
            data.distance_from_target = minDistance;
            data.is_within_radius = minDistance <= schedule.radius_meters;

            // Set status absensi default ke 'hadir' karena hanya perlu verifikasi lokasi
            if (!data.status_absensi) {
                data.status_absensi = 'hadir';
            }

            // Hitung keterlambatan
            let timeNote = '';
            if (data.jam_masuk && schedule.jam_masuk) {
                const attendanceDate = new Date(data.jam_masuk);
                const [scheduleHour, scheduleMinute, scheduleSecond] = schedule.jam_masuk.split(':').map(Number);
                
                // Buat object date untuk waktu jadwal pada hari yang sama dengan absensi
                const scheduledTime = new Date(attendanceDate);
                scheduledTime.setHours(scheduleHour, scheduleMinute, scheduleSecond || 0, 0);
                
                const diffMs = attendanceDate - scheduledTime;
                const diffMinutes = Math.floor(diffMs / 60000);
                
                if (diffMinutes <= 0) {
                    timeNote = 'Tepat Waktu';
                } else {
                    timeNote = `Terlambat ${diffMinutes} menit`;
                }
            }

            // Construct keterangan notes
            const locationNote = data.is_within_radius 
                ? `Lokasi: ${matchedLocationName} (${minDistance.toFixed(2)}m)`
                : `Lokasi di luar radius (Terdekat: ${matchedLocationName}, Jarak: ${minDistance.toFixed(2)}m, Max: ${schedule.radius_meters}m)`;
            
            const autoNote = timeNote ? `${timeNote}. ${locationNote}` : locationNote;
            
            // Append to existing notes if any, or set new
            data.keterangan = data.keterangan ? `${data.keterangan}. ${autoNote}` : autoNote;

            // Set approval status berdasarkan lokasi
            if (!data.is_within_radius) {
                data.approval_status = 'pending';
            } else {
                data.approval_status = 'approved';
            }

            // Log verifikasi lokasi
            strapi.log.info(`Verifikasi lokasi absensi - Karyawan: ${data.karyawan}, Jarak: ${minDistance.toFixed(2)}m, Dalam radius: ${data.is_within_radius}, Note: ${autoNote}`);

        } catch (error) {
            strapi.log.error('Error dalam validasi absensi:', error.message);
            throw error;
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);

        const { data } = event.params;

        try {
            // Jika ada update lokasi check-out
            if (data.lokasi_absensi && data.lokasi_absensi.check_out_location) {
                const { lat, lng } = data.lokasi_absensi.check_out_location;
                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    throw new Error('Koordinat check-out tidak valid');
                }
            }

        } catch (error) {
            strapi.log.error('Error dalam update absensi:', error.message);
            throw error;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log pembuatan record absensi
        strapi.log.info(`Record absensi dibuat - ID: ${result.id}, Karyawan: ${result.karyawan}, Status: ${result.status_absensi}, Dalam radius: ${result.is_within_radius}`);

        // Jika lokasi di luar radius, kirim notifikasi (opsional)
        if (!result.is_within_radius) {
            strapi.log.warn(`PERHATIAN: Absensi karyawan ${result.karyawan} di luar radius yang diizinkan`);
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log update record absensi
        strapi.log.info(`Record absensi diupdate - ID: ${result.id}, Status: ${result.status_absensi}`);
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};
