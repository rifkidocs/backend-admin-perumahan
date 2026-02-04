"use strict";

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');
const dayjs = require('dayjs');

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

/**
 * Helper to extract ID from relation input
 */
const getRelationId = (relation) => {
    if (!relation) return null;
    if (typeof relation === 'number' || typeof relation === 'string') return relation;
    if (relation.connect && Array.isArray(relation.connect) && relation.connect.length > 0) {
        const first = relation.connect[0];
        return typeof first === 'object' ? first.id : first;
    }
    if (relation.set && Array.isArray(relation.set) && relation.set.length > 0) {
        const first = relation.set[0];
        return typeof first === 'object' ? first.id : first;
    }
    if (relation.id) return relation.id;
    return null;
};

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        try {
            // Validasi data lokasi
            if (!data.lokasi_absensi || !data.lokasi_absensi.check_in_location) {
                throw new Error('Data lokasi check-in diperlukan');
            }

            const { lat, lng } = data.lokasi_absensi.check_in_location;
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                throw new Error('Koordinat tidak valid');
            }

            const karyawanId = getRelationId(data.karyawan);
            if (!karyawanId) {
                 throw new Error('Karyawan is required');
            }

            const todayStr = dayjs().format('YYYY-MM-DD');
            let schedule = null;
            let isSecurity = false;

            // 1. Check for Security Schedule first
            const inputJadwalSecurityId = getRelationId(data.jadwal_security);
            if (inputJadwalSecurityId) {
                schedule = await strapi.entityService.findOne('api::jadwal-security.jadwal-security', inputJadwalSecurityId, {
                    populate: ['lokasi', 'shift']
                });
                if (schedule) isSecurity = true;
            }

            // 1b. Search for Security Schedule for today if not provided or not found yet
            // This prioritizes security role/schedule over regular schedule
            if (!schedule) {
                const securitySchedules = await strapi.entityService.findMany('api::jadwal-security.jadwal-security', {
                    filters: {
                        karyawan: karyawanId,
                        tanggal: todayStr,
                        status_jadwal: { $in: ['scheduled', 'attended'] }
                    },
                    populate: ['lokasi', 'shift']
                });

                if (securitySchedules && securitySchedules.length > 0) {
                    schedule = securitySchedules[0];
                    isSecurity = true;
                    // Auto-link to the found security schedule
                    data.jadwal_security = schedule.id;
                }
            }

            // 2. If not a security schedule, search for regular attendance schedule
            if (!schedule) {
                const attendanceSchedules = await strapi.entityService.findMany(
                    'api::attendance-schedule.attendance-schedule',
                    {
                        filters: {
                            employee: karyawanId,
                            is_active: true,
                            effective_date: { $lte: todayStr },
                            $or: [
                                { expiry_date: { $gte: todayStr } },
                                { expiry_date: { $null: true } }
                            ]
                        },
                        populate: ['employee', 'locations']
                    }
                );
                if (attendanceSchedules && attendanceSchedules.length > 0) {
                    schedule = attendanceSchedules[0];
                    data.attendance_schedule = schedule.id;
                }
            }

            if (!schedule) {
                throw new Error('Tidak ada jadwal (Regular/Security) aktif untuk karyawan ini');
            }

            // Hitung jarak dari lokasi target
            let minDistance = Infinity;
            let matchedLocationName = '';
            let targetRadius = 50;

            if (isSecurity) {
                // Security logic: location is a single relation 'lokasi'
                if (schedule.lokasi) {
                    minDistance = calculateDistance(lat, lng, schedule.lokasi.latitude, schedule.lokasi.longitude);
                    matchedLocationName = schedule.lokasi.nama_lokasi;
                    targetRadius = schedule.lokasi.radius_meters || 50;
                } else {
                    throw new Error('Jadwal security tidak memiliki konfigurasi lokasi');
                }
            } else {
                // Regular logic: locations is a repeatable component
                if (schedule.locations && Array.isArray(schedule.locations) && schedule.locations.length > 0) {
                    for (const loc of schedule.locations) {
                        if (loc.latitude && loc.longitude) {
                            const dist = calculateDistance(lat, lng, parseFloat(loc.latitude), parseFloat(loc.longitude));
                            if (dist < minDistance) {
                                minDistance = dist;
                                matchedLocationName = loc.nama_lokasi;
                            }
                        }
                    }
                    targetRadius = schedule.radius_meters || 50;
                } else {
                    throw new Error('Jadwal absensi tidak memiliki konfigurasi lokasi yang valid');
                }
            }
            
            data.distance_from_target = minDistance;
            data.is_within_radius = minDistance <= targetRadius;

            if (!data.status_absensi) {
                data.status_absensi = 'hadir';
            }

            // --- Logic Waktu (Delay Calculation) ---
            let timeNote = '';
            let jamMasukJadwal = isSecurity ? (schedule.shift?.jam_mulai) : schedule.jam_masuk;

            // Overwrite jamMasukJadwal if explicit shift relation is provided in data
            const explicitShiftId = getRelationId(data.shift);
            if (explicitShiftId) {
                const shiftData = await strapi.entityService.findOne('api::shift.shift', explicitShiftId);
                if (shiftData && shiftData.jam_mulai) {
                    jamMasukJadwal = shiftData.jam_mulai;
                }
            }

            if (data.jam_masuk && jamMasukJadwal) {
                const attendanceTime = dayjs(data.jam_masuk);
                const [h, m, s] = jamMasukJadwal.split(':').map(Number);
                const scheduledToday = attendanceTime.hour(h).minute(m).second(s || 0);
                const scheduledYesterday = scheduledToday.subtract(1, 'day');
                const scheduledTomorrow = scheduledToday.add(1, 'day');

                const diffs = [
                    { date: scheduledYesterday, diff: attendanceTime.diff(scheduledYesterday, 'minute') },
                    { date: scheduledToday, diff: attendanceTime.diff(scheduledToday, 'minute') },
                    { date: scheduledTomorrow, diff: attendanceTime.diff(scheduledTomorrow, 'minute') }
                ];

                const reasonableDiffs = diffs.filter(d => Math.abs(d.diff) <= 720); // 12 hours
                if (reasonableDiffs.length > 0) {
                    const bestMatch = reasonableDiffs.reduce((prev, curr) => 
                        Math.abs(curr.diff) < Math.abs(prev.diff) ? curr : prev
                    );

                    const diffMinutes = bestMatch.diff;
                    if (diffMinutes <= 5) { // 5 minutes grace period
                        timeNote = 'Tepat Waktu';
                    } else {
                        timeNote = `Terlambat ${diffMinutes} menit`;
                    }
                }
            }

            const locationNote = data.is_within_radius 
                ? `Lokasi: ${matchedLocationName} (${minDistance.toFixed(2)}m)`
                : `Lokasi di luar radius (Terdekat: ${matchedLocationName}, Jarak: ${minDistance.toFixed(2)}m, Max: ${targetRadius}m)`;
            
            const autoNote = timeNote ? `${timeNote}. ${locationNote}` : locationNote;
            data.keterangan = data.keterangan ? `${data.keterangan}. ${autoNote}` : autoNote;

            data.approval_status = data.is_within_radius ? 'approved' : 'pending';

        } catch (error) {
            strapi.log.error('Error dalam validasi absensi (beforeCreate):', error.message);
            throw error;
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);
        const { data, where } = event.params;

        try {
            if (data.lokasi_absensi && data.lokasi_absensi.check_out_location) {
                const { lat, lng } = data.lokasi_absensi.check_out_location;
                
                const existingRecord = await strapi.entityService.findOne('api::absensi.absensi', where.id, {
                    populate: {
                        attendance_schedule: { populate: ['locations'] },
                        jadwal_security: { populate: ['lokasi', 'shift'] },
                        shift: true
                    }
                });

                if (existingRecord) {
                    const isSecurity = !!existingRecord.jadwal_security;
                    const schedule = isSecurity ? existingRecord.jadwal_security : existingRecord.attendance_schedule;
                    
                    if (!schedule) return;

                    let minDistance = Infinity;
                    let matchedLocationName = '';
                    let targetRadius = 50;
        
                    if (isSecurity) {
                        if (schedule.lokasi) {
                            minDistance = calculateDistance(lat, lng, schedule.lokasi.latitude, schedule.lokasi.longitude);
                            matchedLocationName = schedule.lokasi.nama_lokasi;
                            targetRadius = schedule.lokasi.radius_meters || 50;
                        }
                    } else {
                        if (schedule.locations && Array.isArray(schedule.locations)) {
                            for (const loc of schedule.locations) {
                                if (loc.latitude && loc.longitude) {
                                    const dist = calculateDistance(lat, lng, parseFloat(loc.latitude), parseFloat(loc.longitude));
                                    if (dist < minDistance) {
                                        minDistance = dist;
                                        matchedLocationName = loc.nama_lokasi;
                                    }
                                }
                            }
                            targetRadius = schedule.radius_meters || 50;
                        }
                    }

                    const isWithinRadius = minDistance <= targetRadius;
                    const locationNote = isWithinRadius 
                        ? `Check-out: ${matchedLocationName} (${minDistance.toFixed(2)}m)`
                        : `Check-out di luar radius (Terdekat: ${matchedLocationName}, Jarak: ${minDistance.toFixed(2)}m)`;

                    const currentKeterangan = data.keterangan || existingRecord.keterangan || '';
                    if (!currentKeterangan.includes('Check-out:')) {
                        data.keterangan = currentKeterangan ? `${currentKeterangan}. ${locationNote}` : locationNote;
                    } else {
                         data.keterangan = `${currentKeterangan} | Update: ${locationNote}`;
                    }

                    if (!isWithinRadius) {
                        data.approval_status = 'pending';
                    }
                }
            }
        } catch (error) {
            strapi.log.error('Error dalam update absensi (beforeUpdate):', error.message);
            throw error;
        }
    },

    async afterCreate(event) {
        const { result } = event;
        
        // If this is a security attendance, update the schedule status
        const jadwalSecurityId = getRelationId(result.jadwal_security);
        if (jadwalSecurityId) {
            await strapi.entityService.update('api::jadwal-security.jadwal-security', jadwalSecurityId, {
                data: { status_jadwal: 'attended' }
            });
        }

        strapi.log.info(`Record absensi dibuat - ID: ${result.id}`);
    },

    async afterUpdate(event) {
        const { result } = event;
        strapi.log.info(`Record absensi diupdate - ID: ${result.id}`);
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};
