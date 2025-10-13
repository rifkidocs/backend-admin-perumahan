'use strict';

/**
 * leave-quota lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validate quota is not negative
        if (data.annual_quota < 0) {
            throw new Error('Kuota tahunan tidak boleh negatif');
        }

        if (data.used_quota < 0) {
            throw new Error('Kuota yang digunakan tidak boleh negatif');
        }

        // Validate year is within valid range
        if (data.year < 2020 || data.year > 2030) {
            throw new Error('Tahun harus antara 2020-2030');
        }

        // Auto-calculate remaining_quota
        data.remaining_quota = data.annual_quota - (data.used_quota || 0);

        // Validate used_quota doesn't exceed annual_quota
        if (data.used_quota > data.annual_quota) {
            throw new Error('Kuota yang digunakan tidak boleh melebihi kuota tahunan');
        }

        // Set created_by if user is authenticated
        if (event.state?.user) {
            data.created_by = event.state.user.id;
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Validate quota is not negative
        if (data.annual_quota !== undefined && data.annual_quota < 0) {
            throw new Error('Kuota tahunan tidak boleh negatif');
        }

        if (data.used_quota !== undefined && data.used_quota < 0) {
            throw new Error('Kuota yang digunakan tidak boleh negatif');
        }

        // Validate year is within valid range
        if (data.year !== undefined && (data.year < 2020 || data.year > 2030)) {
            throw new Error('Tahun harus antara 2020-2030');
        }

        // Auto-calculate remaining_quota if annual_quota or used_quota is updated
        if (data.annual_quota !== undefined || data.used_quota !== undefined) {
            const currentData = await strapi.entityService.findOne(
                'api::leave-quota.leave-quota',
                event.params.where.id,
                { populate: '*' }
            );

            const annualQuota = data.annual_quota !== undefined ? data.annual_quota : currentData.annual_quota;
            const usedQuota = data.used_quota !== undefined ? data.used_quota : currentData.used_quota;

            data.remaining_quota = annualQuota - usedQuota;

            // Validate used_quota doesn't exceed annual_quota
            if (usedQuota > annualQuota) {
                throw new Error('Kuota yang digunakan tidak boleh melebihi kuota tahunan');
            }
        }

        // Set updated_by if user is authenticated
        if (event.state?.user) {
            data.updated_by = event.state.user.id;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log quota creation
        strapi.log.info(`Leave quota created for employee ${result.employee} - ${result.leave_type} ${result.year}`);

        // Check if quota is running low and send notification
        if (result.remaining_quota <= 2) {
            strapi.log.warn(`Low leave quota warning: Employee ${result.employee} has only ${result.remaining_quota} days remaining for ${result.leave_type}`);
            // TODO: Send notification to HR
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log quota update
        strapi.log.info(`Leave quota updated for employee ${result.employee} - ${result.leave_type} ${result.year}`);

        // Check if quota is running low and send notification
        if (result.remaining_quota <= 2) {
            strapi.log.warn(`Low leave quota warning: Employee ${result.employee} has only ${result.remaining_quota} days remaining for ${result.leave_type}`);
            // TODO: Send notification to HR
        }

        // Update related leave requests if quota changed
        // This could trigger recalculation of pending requests
    }
};
