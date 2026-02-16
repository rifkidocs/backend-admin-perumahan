'use strict';

/**
 * salary lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Calculate net salary
        const basic = data.basic_salary || 0;
        const positionAllowance = data.position_allowance || 0;
        const tunjanganKinerja = data.tunjangan_kinerja || 0;
        const harian = data.harian || 0;
        const tunjanganBpjsKesehatan = data.tunjangan_bpjs_kesehatan || 0;
        const tunjanganBpjsKetenagakerjaan = data.tunjangan_bpjs_ketenagakerjaan || 0;
        const deductions = data.deductions || 0;

        data.net_salary =
            basic +
            positionAllowance +
            tunjanganKinerja +
            harian +
            tunjanganBpjsKesehatan +
            tunjanganBpjsKetenagakerjaan -
            deductions;
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Recalculate net salary on update
        if (
            data.basic_salary ||
            data.position_allowance ||
            data.tunjangan_kinerja ||
            data.harian ||
            data.tunjangan_bpjs_kesehatan ||
            data.tunjangan_bpjs_ketenagakerjaan ||
            data.deductions
        ) {
            const basic = data.basic_salary || 0;
            const positionAllowance = data.position_allowance || 0;
            const tunjanganKinerja = data.tunjangan_kinerja || 0;
            const harian = data.harian || 0;
            const tunjanganBpjsKesehatan = data.tunjangan_bpjs_kesehatan || 0;
            const tunjanganBpjsKetenagakerjaan = data.tunjangan_bpjs_ketenagakerjaan || 0;
            const deductions = data.deductions || 0;

            data.net_salary =
                basic +
                positionAllowance +
                tunjanganKinerja +
                harian +
                tunjanganBpjsKesehatan +
                tunjanganBpjsKetenagakerjaan -
                deductions;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        try {
            console.log('Salary created with ID:', result.id);

            // Get the full salary data with populated relations
            const salaryWithRelations = await strapi.entityService.findOne(
                'api::salary.salary',
                result.id,
                {
                    populate: {
                        karyawan: true
                    }
                }
            );

            if (!salaryWithRelations.karyawan) {
                console.warn('Employee not found for salary:', result.id);
                return;
            }

            console.log('Employee found:', salaryWithRelations.karyawan.nama_lengkap);

            // Create automatic cash out transaction
            const transaction = await strapi.service('api::salary.salary').createCashOutTransaction(salaryWithRelations, salaryWithRelations.karyawan);
            console.log('Cash out transaction created successfully:', transaction.id);
        } catch (error) {
            console.error('Error in afterCreate lifecycle:', error.message);
            // Don't throw the error to prevent breaking the salary creation process
        }
    },

    async afterUpdate(event) {
        const { result } = event;

        try {
            // Get the full salary data with populated relations
            const salaryWithRelations = await strapi.entityService.findOne(
                'api::salary.salary',
                result.id,
                {
                    populate: {
                        karyawan: true
                    }
                }
            );

            if (!salaryWithRelations.karyawan) {
                console.warn('Employee not found for salary:', result.id);
                return;
            }

            // Check if cash out transaction already exists for this salary period
            const existingTransactions = await strapi.entityService.findMany(
                'api::kas-keluar.kas-keluar',
                {
                    filters: {
                        invoiceNumber: `SALARY-${result.id}-${new Date(result.effective_date).toISOString().slice(0, 7)}`
                    }
                }
            );

            const existingTransaction = existingTransactions.length > 0 ? existingTransactions[0] : null;

            if (existingTransaction) {
                // Update existing transaction
                await strapi.service('api::salary.salary').updateCashOutTransaction(existingTransaction, salaryWithRelations, salaryWithRelations.karyawan);
            } else {
                // Create new transaction
                await strapi.service('api::salary.salary').createCashOutTransaction(salaryWithRelations, salaryWithRelations.karyawan);
            }
        } catch (error) {
            console.error('Error in afterUpdate lifecycle:', error);
        }
    }
};
