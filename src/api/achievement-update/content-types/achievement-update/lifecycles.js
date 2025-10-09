'use strict';

/**
 * achievement-update lifecycle
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Calculate commission earned based on unit breakdown and target commission structure
        if (data.marketing_target && data.unit_breakdown) {
            try {
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
                        const commission = parseFloat(target.komisi_per_unit[unitType]) || 0;
                        commissionEarned += commission * (parseInt(unitCount) || 0);
                    });

                    data.commission_earned = commissionEarned;
                }
            } catch (error) {
                console.error('Error in achievement-update beforeCreate lifecycle:', error);
                // Set default commission if calculation fails
                data.commission_earned = 0;
            }
        }
    },

    async afterCreate(event) {
        const { data, where } = event.params;
        const { result } = event;

        // Update target achievement totals
        if (data.marketing_target) {
            try {
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

                    // Handle case where achievement_updates might be null or undefined
                    const updates = target.achievement_updates || [];

                    updates.forEach((update) => {
                        totalUnits += update.unit_achieved || 0;
                        totalNominal += parseFloat(update.nominal_achieved) || 0;

                        if (update.unit_breakdown) {
                            Object.entries(update.unit_breakdown).forEach(([unitType, count]) => {
                                unitBreakdown[unitType] = (unitBreakdown[unitType] || 0) + (count || 0);
                            });
                        }
                    });

                    // Calculate total commission
                    let totalCommission = 0;
                    if (target.komisi_per_unit) {
                        Object.entries(target.komisi_per_unit).forEach(([unitType, commission]) => {
                            const unitCount = unitBreakdown[unitType] || 0;
                            totalCommission += (parseFloat(commission) || 0) * unitCount;
                        });
                    }

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
            } catch (error) {
                console.error('Error in achievement-update afterCreate lifecycle:', error);
                // Don't throw error to prevent creation failure
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
