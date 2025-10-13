"use strict";

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validasi koordinat
        if (data.attendance_location) {
            const { lat, lng } = data.attendance_location;
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                throw new Error('Koordinat tidak valid. Latitude harus antara -90 dan 90, Longitude harus antara -180 dan 180');
            }
        }

        // Validasi tanggal efektif
        if (data.effective_date && data.expiry_date) {
            const effectiveDate = new Date(data.effective_date);
            const expiryDate = new Date(data.expiry_date);
            if (effectiveDate >= expiryDate) {
                throw new Error('Tanggal efektif harus sebelum tanggal berakhir');
            }
        }


        // Validasi radius
        if (data.radius_meters && (data.radius_meters < 10 || data.radius_meters > 5000)) {
            throw new Error('Radius harus antara 10-5000 meter');
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Validasi koordinat
        if (data.attendance_location) {
            const { lat, lng } = data.attendance_location;
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                throw new Error('Koordinat tidak valid. Latitude harus antara -90 dan 90, Longitude harus antara -180 dan 180');
            }
        }

        // Validasi tanggal efektif
        if (data.effective_date && data.expiry_date) {
            const effectiveDate = new Date(data.effective_date);
            const expiryDate = new Date(data.expiry_date);
            if (effectiveDate >= expiryDate) {
                throw new Error('Tanggal efektif harus sebelum tanggal berakhir');
            }
        }


        // Validasi radius
        if (data.radius_meters && (data.radius_meters < 10 || data.radius_meters > 5000)) {
            throw new Error('Radius harus antara 10-5000 meter');
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log aktivitas pembuatan jadwal
        strapi.log.info(`✅ Jadwal absensi dibuat - ID: ${result.id}, Karyawan: ${result.employee?.count || 'N/A'}, Lokasi: ${result.attendance_location?.place_name || 'N/A'}`);
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log aktivitas update jadwal
        strapi.log.info(`📝 Jadwal absensi diupdate - ID: ${result.id}, Karyawan: ${result.employee?.count || 'N/A'}, Lokasi: ${result.attendance_location?.place_name || 'N/A'}`);
    }
};
