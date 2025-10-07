'use strict';

/**
 * achievement-update lifecycle
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Calculate commission earned based on unit breakdown and target commission structure
        if (data.marketing_target && data.unit_breakdown) {
            const target = await strapi.entityService.findOne(
                'api::target-marketing.target-marketing',
                data.marketing_target,
                {
                    populate: false,
                }
            );

            if (target && target.komisi_per_unit) {
                let commissionEarned = 0;

                Object.entries(data.unit_breakdown).forEach(([unitType, unitCount]) => {
                    const commission = target.komisi_per_unit[unitType] || 0;
                    commissionEarned += commission * unitCount;
                });

                data.commission_earned = commissionEarned;
            }
        }
    },

    async afterCreate(event) {
        const { data, where } = event.params;
        const { result } = event;

        // Update target achievement totals
        if (data.marketing_target) {
            const target = await strapi.entityService.findOne(
                'api::target-marketing.target-marketing',
                data.marketing_target,
                {
                    populate: ['achievement_updates'],
                }
            );

            if (target) {
                let totalUnits = 0;
                let totalNominal = 0;
                let unitBreakdown = {};

                target.achievement_updates.forEach((update) => {
                    totalUnits += update.unit_achieved;
                    totalNominal += update.nominal_achieved;

                    Object.entries(update.unit_breakdown).forEach(([unitType, count]) => {
                        unitBreakdown[unitType] = (unitBreakdown[unitType] || 0) + count;
                    });
                });

                // Calculate total commission
                let totalCommission = 0;
                Object.entries(target.komisi_per_unit).forEach(([unitType, commission]) => {
                    const unitCount = unitBreakdown[unitType] || 0;
                    totalCommission += commission * unitCount;
                });

                await strapi.entityService.update(
                    'api::target-marketing.target-marketing',
                    data.marketing_target,
                    {
                        data: {
                            pencapaian_unit: totalUnits,
                            pencapaian_nominal: totalNominal,
                            total_komisi: totalCommission,
                        },
                    }
                );
            }
        }
    },

    async afterUpdate(event) {
        const { data, where } = event.params;
        const { result } = event;

        // Recalculate target achievement if achievement data changed
        if (data.marketing_target) {
            const target = await strapi.entityService.findOne(
                'api::target-marketing.target-marketing',
                data.marketing_target,
                {
                    populate: ['achievement_updates'],
                }
            );

            if (target) {
                let totalUnits = 0;
                let totalNominal = 0;
                let unitBreakdown = {};

                target.achievement_updates.forEach((update) => {
                    totalUnits += update.unit_achieved;
                    totalNominal += update.nominal_achieved;

                    Object.entries(update.unit_breakdown).forEach(([unitType, count]) => {
                        unitBreakdown[unitType] = (unitBreakdown[unitType] || 0) + count;
                    });
                });

                // Calculate total commission
                let totalCommission = 0;
                Object.entries(target.komisi_per_unit).forEach(([unitType, commission]) => {
                    const unitCount = unitBreakdown[unitType] || 0;
                    totalCommission += commission * unitCount;
                });

                await strapi.entityService.update(
                    'api::target-marketing.target-marketing',
                    data.marketing_target,
                    {
                        data: {
                            pencapaian_unit: totalUnits,
                            pencapaian_nominal: totalNominal,
                            total_komisi: totalCommission,
                        },
                    }
                );
            }
        }
    },

    async afterDelete(event) {
        const { result } = event;

        // Recalculate target achievement after deletion
        if (result.marketing_target) {
            const target = await strapi.entityService.findOne(
                'api::target-marketing.target-marketing',
                result.marketing_target,
                {
                    populate: ['achievement_updates'],
                }
            );

            if (target) {
                let totalUnits = 0;
                let totalNominal = 0;
                let unitBreakdown = {};

                target.achievement_updates.forEach((update) => {
                    totalUnits += update.unit_achieved;
                    totalNominal += update.nominal_achieved;

                    Object.entries(update.unit_breakdown).forEach(([unitType, count]) => {
                        unitBreakdown[unitType] = (unitBreakdown[unitType] || 0) + count;
                    });
                });

                // Calculate total commission
                let totalCommission = 0;
                Object.entries(target.komisi_per_unit).forEach(([unitType, commission]) => {
                    const unitCount = unitBreakdown[unitType] || 0;
                    totalCommission += commission * unitCount;
                });

                await strapi.entityService.update(
                    'api::target-marketing.target-marketing',
                    result.marketing_target,
                    {
                        data: {
                            pencapaian_unit: totalUnits,
                            pencapaian_nominal: totalNominal,
                            total_komisi: totalCommission,
                        },
                    }
                );
            }
        }
    },
};
