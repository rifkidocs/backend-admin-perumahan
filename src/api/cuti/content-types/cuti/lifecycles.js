'use strict';

const { cleanupMediaOnDelete, cleanupMediaOnUpdate } = require('../../../../utils/mediaHelper');

/**
 * cuti (leave-request) lifecycle callbacks
 */

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        // Debug logging (can be removed in production)
        // console.log('=== CUTI BEFORE CREATE DEBUG ===');
        // console.log('Raw data received:', JSON.stringify(data, null, 2));
        // console.log('Employee field type:', typeof data.employee);
        // console.log('Employee field value:', data.employee);
        // console.log('================================');

        // Validate dates
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);

            if (start > end) {
                throw new Error('Tanggal mulai tidak boleh setelah tanggal selesai');
            }

            // Calculate duration_days
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            data.duration_days = diffDays;
        }

        // Check quota availability
        if (data.employee && data.leave_type && data.duration_days) {
            // Extract employee ID from Strapi v5 set format
            let employeeId;
            if (data.employee.set && data.employee.set.length > 0) {
                employeeId = data.employee.set[0].id;
            } else if (data.employee.connect && data.employee.connect.length > 0) {
                employeeId = data.employee.connect[0];
            } else if (typeof data.employee === 'number') {
                employeeId = data.employee;
            } else {
                employeeId = data.employee;
            }

            // console.log('Employee ID extracted for quota validation:', employeeId);
            // console.log('Employee ID type:', typeof employeeId);

            await validateQuotaAvailability(
                employeeId,
                data.leave_type,
                data.duration_days,
                new Date().getFullYear()
            );
        }

        // Validate minimal advance notice based on policy
        if (data.start_date) {
            await validateAdvanceNotice(data.start_date, data.leave_type);
        }

        // Set is_paid based on request_type and policy
        data.is_paid = await determinePaymentStatus(data.request_type, data.leave_type);

        // Validate medical certificate for sick leave
        if (data.request_type === 'izin_sakit' && !data.medical_certificate) {
            throw new Error('Surat dokter diperlukan untuk izin sakit');
        }

        // Set default request_status
        if (!data.request_status) {
            data.request_status = 'pending';
        }

        // Set created_by if user is authenticated
        if (event.state?.user) {
            data.created_by = event.state.user.id;
        }
    },

    async beforeUpdate(event) {
        await cleanupMediaOnUpdate(event);

        const { data } = event.params;

        // Validate dates
        if (data.start_date || data.end_date) {
            const currentData = await strapi.entityService.findOne(
                'api::cuti.cuti',
                event.params.where.id,
                { populate: '*' }
            );

            const start = new Date(data.start_date !== undefined ? data.start_date : currentData.start_date);
            const end = new Date(data.end_date !== undefined ? data.end_date : currentData.end_date);

            if (start > end) {
                throw new Error('Tanggal mulai tidak boleh setelah tanggal selesai');
            }

            // Recalculate duration_days
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            data.duration_days = diffDays;
        }

        // Validate request_status changes
        if (data.request_status) {
            const currentData = await strapi.entityService.findOne(
                'api::cuti.cuti',
                event.params.where.id,
                { populate: '*' }
            );

            // Only pending requests can be approved/rejected
            if (currentData.request_status !== 'pending' && (data.request_status === 'approved' || data.request_status === 'rejected')) {
                throw new Error('Hanya pengajuan pending yang dapat di-approve atau di-reject');
            }

            // Set approval_date and approved_by when approved
            if (data.request_status === 'approved') {
                data.approval_date = new Date();
                if (event.state?.user) {
                    data.approved_by = event.state.user.id;
                }
            }

            // Validate rejection_reason when rejected
            if (data.request_status === 'rejected' && !data.rejection_reason) {
                throw new Error('Alasan penolakan diperlukan saat menolak pengajuan');
            }

            // Update quota if approved
            if (data.request_status === 'approved' && currentData.request_status === 'pending') {
                // Extract employee ID for quota update (handle Strapi v5 set format)
                let employeeId;
                if (currentData.employee?.set && currentData.employee.set.length > 0) {
                    employeeId = currentData.employee.set[0].id;
                } else if (currentData.employee?.connect && currentData.employee.connect.length > 0) {
                    employeeId = currentData.employee.connect[0];
                } else if (currentData.employee?.id) {
                    employeeId = currentData.employee.id;
                } else {
                    employeeId = currentData.employee;
                }

                await updateLeaveQuota(employeeId, currentData.leave_type, currentData.duration_days);
            }
        }

        // Update salary_deduction for personal leave
        if (data.request_type === 'izin_pribadi' && data.is_paid === false) {
            data.salary_deduction = 100; // Full salary deduction for unpaid personal leave
        }

        // Set updated_by if user is authenticated
        if (event.state?.user) {
            data.updated_by = event.state.user.id;
        }
    },

    async afterCreate(event) {
        const { result } = event;

        // Log leave request creation
        strapi.log.info(`Leave request created: ${result.request_type} for employee ${result.employee}`);

        // TODO: Send notification to supervisor for approval
        // TODO: Send email notification
    },

    async afterUpdate(event) {
        const { result } = event;

        // Log leave request update
        strapi.log.info(`Leave request updated: ${result.request_type} for employee ${result.employee} - Status: ${result.request_status}`);

        // TODO: Send notification to employee about status change
        // TODO: Send email notification
    },

    async beforeDelete(event) {
        await cleanupMediaOnDelete(event);
    }
};

// Helper functions
async function validateQuotaAvailability(employeeId, leaveType, requestedDays, year) {
    // console.log('=== VALIDATE QUOTA AVAILABILITY DEBUG ===');
    // console.log('employeeId:', employeeId, 'type:', typeof employeeId);
    // console.log('leaveType:', leaveType);
    // console.log('requestedDays:', requestedDays);
    // console.log('year:', year);

    let quota = await strapi.entityService.findMany('api::leave-quota.leave-quota', {
        filters: {
            employee: { id: employeeId },
            leave_type: leaveType,
            year: year,
            is_active: true,
        },
    });

    // console.log('Quota query result:', quota);
    // console.log('==========================================');

    if (!quota || quota.length === 0) {
        // Auto-create quota if not exists
        console.log('Creating new leave quota for employee:', employeeId);
        await createDefaultLeaveQuota(employeeId, leaveType, year);

        // Query again to get the created quota
        quota = await strapi.entityService.findMany('api::leave-quota.leave-quota', {
            filters: {
                employee: { id: employeeId },
                leave_type: leaveType,
                year: year,
                is_active: true,
            },
        });

        if (!quota || quota.length === 0) {
            throw new Error('Gagal membuat kuota cuti untuk karyawan ini');
        }
    }

    const availableQuota = quota[0].remaining_quota;
    if (requestedDays > availableQuota) {
        throw new Error(`Kuota tidak mencukupi. Tersisa ${availableQuota} hari`);
    }

    return true;
}

async function validateAdvanceNotice(startDate, leaveType) {
    const policy = await strapi.entityService.findMany('api::leave-policy.leave-policy', {
        filters: {
            leave_type: leaveType,
            is_active: true,
        },
    });

    if (policy && policy.length > 0) {
        const minAdvanceDays = policy[0].min_advance_days;
        const today = new Date();
        const start = new Date(startDate);
        const daysDiff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 3600 * 24));

        if (daysDiff < minAdvanceDays) {
            throw new Error(`Minimal pemberitahuan ${minAdvanceDays} hari sebelumnya`);
        }
    }

    return true;
}

async function determinePaymentStatus(requestType, leaveType) {
    switch (requestType) {
        case 'cuti':
            const policy = await strapi.entityService.findMany('api::leave-policy.leave-policy', {
                filters: {
                    leave_type: leaveType,
                    is_active: true,
                },
            });
            return policy && policy.length > 0 ? policy[0].is_paid : true;
        case 'izin_dinas':
            return true; // Always paid
        case 'izin_sakit':
            return true; // Always paid
        case 'izin_pribadi':
            return false; // Always unpaid
        default:
            return false;
    }
}

async function createDefaultLeaveQuota(employeeId, leaveType, year) {
    // Get default quota from leave policy
    const policy = await strapi.entityService.findMany('api::leave-policy.leave-policy', {
        filters: {
            leave_type: leaveType,
            is_active: true,
        },
    });

    let defaultQuota = 12; // Default annual leave quota
    if (policy && policy.length > 0) {
        defaultQuota = policy[0].quota_days || 12;
    }

    // Create new leave quota
    await strapi.entityService.create('api::leave-quota.leave-quota', {
        data: {
            employee: { set: [{ id: employeeId }] },
            leave_type: leaveType,
            year: year,
            annual_quota: defaultQuota,
            used_quota: 0,
            remaining_quota: defaultQuota,
            is_active: true,
        },
    });

    console.log(`Created default quota for employee ${employeeId}: ${defaultQuota} days`);
}

async function updateLeaveQuota(employeeId, leaveType, usedDays) {
    const year = new Date().getFullYear();
    let quota = await strapi.entityService.findMany('api::leave-quota.leave-quota', {
        filters: {
            employee: { id: employeeId },
            leave_type: leaveType,
            year: year,
            is_active: true,
        },
    });

    if (!quota || quota.length === 0) {
        // Auto-create quota if not exists
        console.log('Creating quota for update operation:', employeeId);
        await createDefaultLeaveQuota(employeeId, leaveType, year);

        // Query again
        quota = await strapi.entityService.findMany('api::leave-quota.leave-quota', {
            filters: {
                employee: { id: employeeId },
                leave_type: leaveType,
                year: year,
                is_active: true,
            },
        });
    }

    if (quota && quota.length > 0) {
        const currentQuota = quota[0];
        await strapi.entityService.update('api::leave-quota.leave-quota', currentQuota.id, {
            data: {
                used_quota: currentQuota.used_quota + usedDays,
            },
        });
    }
}
