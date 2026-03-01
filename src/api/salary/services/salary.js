// @ts-nocheck
'use strict';

/**
 * salary service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::salary.salary', ({ strapi }) => ({
  // Create automatic cash out transaction when salary is created
  async createCashOutTransaction(salaryData, employee) {
    try {
      const period = new Date(salaryData.effective_date).toISOString().slice(0, 7); // YYYY-MM format
      const invoiceNumber = `SALARY-${salaryData.id}-${period}`;

      // Check if transaction already exists
      const existingTransactions = await strapi.entityService.findMany(
        'api::kas-keluar.kas-keluar',
        {
            filters: { invoiceNumber }
        }
      );

      if (existingTransactions.length > 0) {
        console.log('Cash out transaction already exists for salary:', salaryData.id);
        return existingTransactions[0];
      }

      // Create cash out transaction
      const cashOutData = {
        category: 'gaji',
        amount: Math.round(salaryData.net_salary), // Convert to integer for kas-keluar
        date: salaryData.effective_date,
        description: `Gaji bulanan ${employee.nama_lengkap} - ${period}`,
        paymentMethod: salaryData.payment_method === 'check' ? 'cek' : salaryData.payment_method, // Map check -> cek
        invoiceNumber,
        approval_status: 'pending',
        urgent: false,
        department: 'hrm',
        notes: `Otomatis dari sistem gaji. ID Salary: ${salaryData.id}`,
        // Set supplier to null for salary transactions
        supplier: null,
        // Link to employee as the creator of this salary transaction
        createdBy: employee.id,
        // Bank information if transfer
        bankInfo: salaryData.payment_method === 'transfer' ?
          `${employee.nama_bank || ''} - ${employee.rekening_bank || ''}` : null,
        // Reference to salary
        salary_id: salaryData.id,
        // Link to pos keuangan
        pos_keuangan: salaryData.pos_keuangan?.id || salaryData.pos_keuangan
      };

      console.log('Creating cash out transaction with data:', JSON.stringify(cashOutData, null, 2));

      const transaction = await strapi.entityService.create('api::kas-keluar.kas-keluar', {
        data: cashOutData
      });

      console.log('Created cash out transaction for salary:', salaryData.id, 'Transaction:', transaction.id);
      return transaction;

    } catch (error) {
      console.error('Error creating cash out transaction:', error.message);
      console.error('Error details:', error.details || 'No details available');
      throw error;
    }
  },

  // Update existing cash out transaction when salary is updated
  async updateCashOutTransaction(transaction, salaryData, employee) {
    try {
      const period = new Date(salaryData.effective_date).toISOString().slice(0, 7);

      const updateData = {
        amount: Math.round(salaryData.net_salary), // Convert to integer for kas-keluar
        date: salaryData.effective_date,
        description: `Gaji bulanan ${employee.nama_lengkap} - ${period}`,
        paymentMethod: salaryData.payment_method === 'check' ? 'cek' : salaryData.payment_method, // Map check -> cek
        bankInfo: salaryData.payment_method === 'transfer' ?
          `${employee.nama_bank || ''} - ${employee.rekening_bank || ''}` : null,
        notes: `Diperbarui dari sistem gaji. ID Salary: ${salaryData.id}`,
        pos_keuangan: salaryData.pos_keuangan?.id || salaryData.pos_keuangan
      };

      const updatedTransaction = await strapi.entityService.update('api::kas-keluar.kas-keluar', transaction.id, {
        data: updateData
      });

      console.log('Updated cash out transaction for salary:', salaryData.id, 'Transaction:', transaction.id);
      return updatedTransaction;

    } catch (error) {
      console.error('Error updating cash out transaction:', error);
      throw error;
    }
  },

  // Batch process salaries for multiple employees
  async batchProcessSalaries(employeeIds, effectiveDate) {
    try {
      const results = [];
      const errors = [];

      for (const employeeId of employeeIds) {
        try {
          const employee = await strapi.entityService.findOne('api::karyawan.karyawan', employeeId, {
            populate: {
              salary: {
                populate: ['pos_keuangan']
              },
              penggajian: true
            }
          });

          if (!employee) {
            errors.push({ employeeId, error: 'Employee not found' });
            continue;
          }

          if (!employee.salary) {
            errors.push({ employeeId, error: 'No salary configuration found' });
            continue;
          }

          // Create cash out transaction
          const transaction = await this.createCashOutTransaction(employee.salary, employee);
          results.push({ employeeId, employeeName: employee.nama_lengkap, transaction });

        } catch (error) {
          errors.push({ employeeId, error: error.message });
        }
      }

      return {
        processed: results.length,
        failed: errors.length,
        results,
        errors
      };

    } catch (error) {
      console.error('Error in batch salary processing:', error);
      throw error;
    }
  },

  // Get salary summary by department
  async getSalarySummaryByDepartment(startDate, endDate) {
    try {
      const salaries = await strapi.entityService.findMany('api::salary.salary', {
        filters: {
          effective_date: {
            $gte: startDate,
            $lte: endDate
          }
        },
        populate: {
          karyawan: {
            populate: ['departemen']
          }
        }
      });

      const departmentTotals = salaries.reduce((acc, salary) => {
        const department = salary.karyawan?.departemen?.nama_departemen || 'Unknown';
        if (!acc[department]) {
          acc[department] = {
            count: 0,
            totalBasic: 0,
            totalAllowances: 0,
            totalDeductions: 0,
            totalNet: 0
          };
        }

        acc[department].count++;
        acc[department].totalBasic += salary.basic_salary;
        acc[department].totalAllowances +=
          (salary.position_allowance || 0) +
          (salary.tunjangan_kinerja || 0) +
          (salary.harian || 0) +
          (salary.tunjangan_bpjs_kesehatan || 0) +
          (salary.tunjangan_bpjs_ketenagakerjaan || 0);
        acc[department].totalDeductions += salary.deductions || 0;
        acc[department].totalNet += salary.net_salary;

        return acc;
      }, {});

      return {
        period: { startDate, endDate },
        totalEmployees: salaries.length,
        departmentBreakdown: departmentTotals,
        totalNetSalary: salaries.reduce((sum, s) => sum + s.net_salary, 0)
      };

    } catch (error) {
      console.error('Error getting salary summary:', error);
      throw error;
    }
  }
}));
