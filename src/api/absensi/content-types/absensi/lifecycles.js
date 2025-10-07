"use strict";

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

// Fungsi untuk menentukan status absensi berdasarkan waktu
function determineAttendanceStatus(checkInTime, workStartTime) {
    const checkInDate = new Date(checkInTime);
    const workStartDate = new Date(checkInTime.split('T')[0] + 'T' + workStartTime);

    const timeDiff = checkInDate.getTime() - workStartDate.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff <= 0) {
        return 'hadir';
    } else if (minutesDiff <= 30) {
        return 'terlambat';
    } else {
        return 'terlambat';
    }
}

// Fungsi untuk menghitung jam lembur
function calculateOvertimeHours(checkOutTime, workEndTime) {
    if (!checkOutTime || !workEndTime) return 0;

    const checkOutDate = new Date(checkOutTime);
    const workEndDate = new Date(checkOutTime.split('T')[0] + 'T' + workEndTime);

    const timeDiff = checkOutDate.getTime() - workEndDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return Math.max(0, hoursDiff);
}

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

            // Cari jadwal absensi aktif untuk karyawan
            const today = new Date().toISOString().split('T')[0];
            const attendanceSchedule = await strapi.entityService.findMany(
                'api::attendance-schedule.attendance-schedule',
                {
                    filters: {
                        employee: data.karyawan,
                        is_active: true,
                        effective_date: { $lte: today },
                        $or: [
                            { expiry_date: { $gte: today } },
                            { expiry_date: { $null: true } }
                        ]
                    },
                    populate: ['employee']
                }
            );

            if (!attendanceSchedule || attendanceSchedule.length === 0) {
                throw new Error('Tidak ada jadwal absensi aktif untuk karyawan ini');
            }

            const schedule = attendanceSchedule[0];
            data.attendance_schedule = schedule.id;

            // Hitung jarak dari lokasi target
            const targetLocation = schedule.attendance_location;
            const distance = calculateDistance(
                lat,
                lng,
                targetLocation.lat,
                targetLocation.lng
            );

            data.distance_from_target = distance;
            data.is_within_radius = distance <= schedule.radius_meters;

            // Tentukan status absensi berdasarkan waktu
            if (data.jam_masuk) {
                data.status_absensi = determineAttendanceStatus(
                    data.jam_masuk,
                    schedule.work_start_time
                );
            }

            // Set approval status berdasarkan lokasi
            if (!data.is_within_radius) {
                data.approval_status = 'pending';
                data.keterangan = `Lokasi di luar radius yang diizinkan. Jarak: ${distance.toFixed(2)}m, Radius maksimal: ${schedule.radius_meters}m`;
            } else {
                data.approval_status = 'approved';
            }

            // Log verifikasi lokasi
            strapi.log.info(`Verifikasi lokasi absensi - Karyawan: ${data.karyawan}, Jarak: ${distance.toFixed(2)}m, Dalam radius: ${data.is_within_radius}`);

        } catch (error) {
            strapi.log.error('Error dalam validasi absensi:', error.message);
            throw error;
        }
    },

    async beforeUpdate(event) {
        const { data, where } = event.params;

        try {
            // Jika ada update jam keluar, hitung jam lembur
            if (data.jam_keluar) {
                const existingRecord = await strapi.entityService.findOne(
                    'api::absensi.absensi',
                    where.id,
                    {
                        populate: ['attendance_schedule']
                    }
                );

                if (existingRecord && existingRecord.attendance_schedule) {
                    const schedule = existingRecord.attendance_schedule;
                    data.overtime_hours = calculateOvertimeHours(
                        data.jam_keluar,
                        schedule.work_end_time
                    );

                    // Update status jika lembur
                    if (data.overtime_hours > 0) {
                        data.status_absensi = 'lembur';
                    }
                }
            }

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
        strapi.log.info(`Record absensi diupdate - ID: ${result.id}, Status: ${result.status_absensi}, Jam lembur: ${result.overtime_hours || 0} jam`);
    }
};
