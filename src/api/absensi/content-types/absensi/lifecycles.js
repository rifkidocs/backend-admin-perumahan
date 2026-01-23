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

            // Cari jadwal absensi aktif untuk karyawan
            const todayStr = dayjs().format('YYYY-MM-DD');
            const attendanceSchedule = await strapi.entityService.findMany(
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
            
            data.distance_from_target = minDistance;
            data.is_within_radius = minDistance <= schedule.radius_meters;

            if (!data.status_absensi) {
                data.status_absensi = 'hadir';
            }

            // --- Logic Waktu (Delay Calculation) ---
            let timeNote = '';
            let jamMasukJadwal = schedule.jam_masuk;

            // Prioritaskan relation shift jika ada
            const shiftId = getRelationId(data.shift);
            if (shiftId) {
                const shiftData = await strapi.entityService.findOne('api::shift.shift', shiftId);
                if (shiftData && shiftData.jam_mulai) {
                    jamMasukJadwal = shiftData.jam_mulai;
                }
            }

            if (data.jam_masuk && jamMasukJadwal) {
                const attendanceTime = dayjs(data.jam_masuk);
                
                // Menentukan waktu jadwal yang paling relevan (Today, Yesterday, or Tomorrow)
                // Terutama penting untuk night shifts yang mungkin check-in setelah midnight
                const [h, m, s] = jamMasukJadwal.split(':').map(Number);
                
                const scheduledToday = attendanceTime.hour(h).minute(m).second(s || 0);
                const scheduledYesterday = scheduledToday.subtract(1, 'day');
                const scheduledTomorrow = scheduledToday.add(1, 'day');

                // Cari yang selisihnya paling kecil (absolut)
                const diffs = [
                    { date: scheduledYesterday, diff: attendanceTime.diff(scheduledYesterday, 'minute') },
                    { date: scheduledToday, diff: attendanceTime.diff(scheduledToday, 'minute') },
                    { date: scheduledTomorrow, diff: attendanceTime.diff(scheduledTomorrow, 'minute') }
                ];

                // Filter diffs yang masuk akal (misal check-in dalam rentang +/- 12 jam dari jadwal)
                const reasonableDiffs = diffs.filter(d => Math.abs(d.diff) <= 720); // 12 hours
                
                if (reasonableDiffs.length > 0) {
                    // Ambil yang paling mendekati 0 atau paling kecil positif jika ada
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
                : `Lokasi di luar radius (Terdekat: ${matchedLocationName}, Jarak: ${minDistance.toFixed(2)}m, Max: ${schedule.radius_meters}m)`;
            
            const autoNote = timeNote ? `${timeNote}. ${locationNote}` : locationNote;
            data.keterangan = data.keterangan ? `${data.keterangan}. ${autoNote}` : autoNote;

            if (!data.is_within_radius) {
                data.approval_status = 'pending';
            } else {
                data.approval_status = 'approved';
            }

            strapi.log.info(`Absensi Check-in - Karyawan: ${karyawanId}, Jarak: ${minDistance.toFixed(2)}m, Note: ${autoNote}`);

        } catch (error) {
            strapi.log.error('Error dalam validasi absensi (beforeCreate):', error.message);
            throw error;
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);

        const { data, where } = event.params;

        try {
            // Jika ada update lokasi check-out
            if (data.lokasi_absensi && data.lokasi_absensi.check_out_location) {
                const { lat, lng } = data.lokasi_absensi.check_out_location;
                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    throw new Error('Koordinat check-out tidak valid');
                }

                const existingRecord = await strapi.entityService.findOne('api::absensi.absensi', where.id, {
                    populate: {
                        attendance_schedule: { populate: ['locations'] },
                        shift: true
                    }
                });

                if (existingRecord && existingRecord.attendance_schedule) {
                    const schedule = existingRecord.attendance_schedule;
                    
                    let minDistance = Infinity;
                    let matchedLocationName = '';
        
                    if (schedule.locations && Array.isArray(schedule.locations) && schedule.locations.length > 0) {
                        for (const loc of schedule.locations) {
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
                    }

                    const isWithinRadius = minDistance <= schedule.radius_meters;
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

                    // --- Hitung Durasi Kerja / Overtime jika diperlukan ---
                    if (data.jam_keluar && existingRecord.jam_masuk) {
                        const start = dayjs(existingRecord.jam_masuk);
                        const end = dayjs(data.jam_keluar);
                        const durationHours = end.diff(start, 'hour', true);
                        
                        // Misal shift 12 jam, jika > 12 jam hitung overtime
                        // Ambil jam_selesai dari shift jika ada
                        let jamSelesaiJadwal = schedule.jam_pulang;
                        if (existingRecord.shift && existingRecord.shift.jam_selesai) {
                            jamSelesaiJadwal = existingRecord.shift.jam_selesai;
                        }

                        // ... logic overtime bisa ditambahkan di sini jika diperlukan ...
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
        strapi.log.info(`Record absensi dibuat - ID: ${result.id}`);
        if (!result.is_within_radius) {
            strapi.log.warn(`PERHATIAN: Absensi karyawan ${result.karyawan} di luar radius`);
        }
    },

    async afterUpdate(event) {
        const { result } = event;
        strapi.log.info(`Record absensi diupdate - ID: ${result.id}`);
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};