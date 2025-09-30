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
        const transportAllowance = data.transport_allowance || 0;
        const mealAllowance = data.meal_allowance || 0;
        const bonus = data.bonus || 0;
        const deductions = data.deductions || 0;

        data.net_salary =
            basic +
            positionAllowance +
            transportAllowance +
            mealAllowance +
            bonus -
            deductions;
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // Recalculate net salary on update
        if (
            data.basic_salary ||
            data.position_allowance ||
            data.transport_allowance ||
            data.meal_allowance ||
            data.bonus ||
            data.deductions
        ) {
            const basic = data.basic_salary || 0;
            const positionAllowance = data.position_allowance || 0;
            const transportAllowance = data.transport_allowance || 0;
            const mealAllowance = data.meal_allowance || 0;
            const bonus = data.bonus || 0;
            const deductions = data.deductions || 0;

            data.net_salary =
                basic +
                positionAllowance +
                transportAllowance +
                mealAllowance +
                bonus -
                deductions;
        }
    }
};
