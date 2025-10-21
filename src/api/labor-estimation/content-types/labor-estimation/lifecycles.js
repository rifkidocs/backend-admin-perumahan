module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Hitung estimasi biaya jika tarif tersedia
        if (
            data.tarif_mandor &&
            data.tarif_tukang &&
            data.tarif_helper &&
            data.estimasi_jam_kerja
        ) {
            const biayaMandor =
                data.mandor * data.tarif_mandor * data.estimasi_jam_kerja;
            const biayaTukang =
                data.tukang * data.tarif_tukang * data.estimasi_jam_kerja;
            const biayaHelper =
                data.helper * data.tarif_helper * data.estimasi_jam_kerja;

            data.estimasi_biaya = biayaMandor + biayaTukang + biayaHelper;
        }

        // Validasi jumlah tenaga kerja
        if (data.mandor < 0 || data.tukang < 0 || data.helper < 0) {
            throw new Error("Jumlah tenaga kerja tidak boleh negatif");
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Update estimasi biaya jika ada perubahan tarif atau jumlah
        if (
            data.tarif_mandor ||
            data.tarif_tukang ||
            data.tarif_helper ||
            data.mandor ||
            data.tukang ||
            data.helper ||
            data.estimasi_jam_kerja
        ) {
            const biayaMandor =
                data.mandor * data.tarif_mandor * data.estimasi_jam_kerja;
            const biayaTukang =
                data.tukang * data.tarif_tukang * data.estimasi_jam_kerja;
            const biayaHelper =
                data.helper * data.tarif_helper * data.estimasi_jam_kerja;

            data.estimasi_biaya = biayaMandor + biayaTukang + biayaHelper;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log estimasi tenaga kerja
        strapi.log.info(
            `Estimasi tenaga kerja untuk ${result.item_pekerjaan.nama_pekerjaan}: ${result.mandor} mandor, ${result.tukang} tukang, ${result.helper} helper`
        );
    },
};
