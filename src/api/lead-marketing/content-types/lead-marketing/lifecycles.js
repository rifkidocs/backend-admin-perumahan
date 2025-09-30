'use strict';

/**
 * lead-marketing lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate date if not provided
        if (!data.date) {
            data.date = new Date().toISOString().split('T')[0];
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        // You can add any pre-update logic here
    }
};
