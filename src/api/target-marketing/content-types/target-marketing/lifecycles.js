'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * target-marketing lifecycle
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Auto-generate target ID if not provided
        if (!data.target_id) {
            const currentYear = new Date().getFullYear();
            const lastTarget = await strapi.entityService.findMany(
                'api::target-marketing.target-marketing',
                {
                    filters: {
                        target_id: {
                            $startsWith: `TGT-${currentYear}-`,
                        },
                    },
                    sort: { target_id: 'desc' },
                    limit: 1,
                }
            );

            let nextNumber = 1;
            if (lastTarget.length > 0) {
                const lastId = lastTarget[0].target_id;
                const lastNumber = parseInt(lastId.split('-')[2]);
                nextNumber = lastNumber + 1;
            }

            data.target_id = `TGT-${currentYear}-${nextNumber
                .toString()
                .padStart(3, '0')}`;
        }

        // Set default values
        if (!data.pencapaian_unit) {
            data.pencapaian_unit = 0;
        }
        if (!data.pencapaian_nominal) {
            data.pencapaian_nominal = 0;
        }
        if (!data.status_pembayaran_komisi) {
            data.status_pembayaran_komisi = 'belum-dibayar';
        }

        // Calculate total commission
        if (data.komisi_per_unit && data.pencapaian_unit) {
            let totalCommission = 0;
            const unitBreakdown = data.unit_breakdown || {};

            Object.entries(data.komisi_per_unit).forEach(([unitType, commission]) => {
                const unitCount = unitBreakdown[unitType] || 0;
                totalCommission += commission * unitCount;
            });

            data.total_komisi = totalCommission;
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);
    },

    async afterUpdate(event) {
        const { data, where } = event.params;
        const { result } = event;

        // Recalculate total commission when achievement changes
        if (data.pencapaian_unit !== undefined || data.komisi_per_unit) {
            const target = await strapi.entityService.findOne(
                'api::target-marketing.target-marketing',
                result.id,
                {
                    populate: ['achievement_updates'],
                }
            );

            if (target) {
                let totalCommission = 0;
                const unitBreakdown = target.unit_breakdown || {};

                Object.entries(target.komisi_per_unit).forEach(
                    ([unitType, commission]) => {
                        const unitCount = unitBreakdown[unitType] || 0;
                        totalCommission += commission * unitCount;
                    }
                );

                await strapi.entityService.update(
                    'api::target-marketing.target-marketing',
                    result.id,
                    {
                        data: { total_komisi: totalCommission },
                    }
                );
            }
        }
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};
