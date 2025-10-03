module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validate progress increment
        if (data.progress_after <= data.progress_before) {
            throw new Error("Progress after must be greater than progress before");
        }

        // Update unit progress automatically
        if (data.unit_rumah && data.progress_after !== undefined) {
            await strapi.entityService.update("api::unit-rumah.unit-rumah", data.unit_rumah, {
                data: { progress: data.progress_after },
            });
        }
    },
};
