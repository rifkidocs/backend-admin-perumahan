'use strict';

/**
 * leave-policy lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Validate effective date vs expiry date
        if (data.expiry_date && data.effective_date) {
            const effectiveDate = new Date(data.effective_date);
            const expiryDate = new Date(data.expiry_date);

            if (expiryDate <= effectiveDate) {
                throw new Error('Tanggal berakhir harus setelah tanggal efektif');
            }
        }

        // Validate quota and duration are not negative
        if (data.default_quota < 0) {
            throw new Error('Kuota default tidak boleh negatif');
        }

        if (data.max_consecutive < 0) {
            throw new Error('Maksimal hari berturut-turut tidak boleh negatif');
        }

        if (data.min_advance_days < 0) {
            throw new Error('Minimal hari pemberitahuan tidak boleh negatif');
        }

        // Validate salary deduction percentage (0-100%)
        if (data.salary_deduction !== undefined && (data.salary_deduction < 0 || data.salary_deduction > 100)) {
            throw new Error('Persentase potongan gaji harus antara 0-100%');
        }

        // Set created_by if user is authenticated
        if (event.state?.user) {
            data.created_by = event.state.user.id;
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Validate effective date vs expiry date
        if (data.expiry_date !== undefined || data.effective_date !== undefined) {
            const currentData = await strapi.entityService.findOne(
                'api::leave-policy.leave-policy',
                event.params.where.id,
                { populate: '*' }
            );

            const effectiveDate = new Date(data.effective_date !== undefined ? data.effective_date : currentData.effective_date);
            const expiryDate = new Date(data.expiry_date !== undefined ? data.expiry_date : currentData.expiry_date);

            if (expiryDate <= effectiveDate) {
                throw new Error('Tanggal berakhir harus setelah tanggal efektif');
            }
        }

        // Validate quota and duration are not negative
        if (data.default_quota !== undefined && data.default_quota < 0) {
            throw new Error('Kuota default tidak boleh negatif');
        }

        if (data.max_consecutive !== undefined && data.max_consecutive < 0) {
            throw new Error('Maksimal hari berturut-turut tidak boleh negatif');
        }

        if (data.min_advance_days !== undefined && data.min_advance_days < 0) {
            throw new Error('Minimal hari pemberitahuan tidak boleh negatif');
        }

        // Validate salary deduction percentage (0-100%)
        if (data.salary_deduction !== undefined && (data.salary_deduction < 0 || data.salary_deduction > 100)) {
            throw new Error('Persentase potongan gaji harus antara 0-100%');
        }

        // Set updated_by if user is authenticated
        if (event.state?.user) {
            data.updated_by = event.state.user.id;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log policy creation
        strapi.log.info(`Leave policy created: ${result.policy_name} for ${result.leave_type}`);

        // TODO: Notify HR about new policy
        // TODO: Update related leave quotas if needed
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log policy update
        strapi.log.info(`Leave policy updated: ${result.policy_name} for ${result.leave_type}`);

        // TODO: Notify HR about policy changes
        // TODO: Update related leave quotas if needed
    }
};
