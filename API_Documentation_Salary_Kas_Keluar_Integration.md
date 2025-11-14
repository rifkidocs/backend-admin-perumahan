# API Documentation - Salary & Kas Keluar Integration

## Overview

This document describes the integration between the Salary system and Cash Out (Kas Keluar) system. When salary data is created or updated, it automatically generates corresponding cash out transactions with the category "Gaji".

## Integration Features

### 1. Automatic Cash Out Generation
- **Trigger**: When a salary record is created or updated
- **Category**: Automatically set to "gaji"
- **Status**: Default to "pending" approval
- **Invoice Number**: Format `SALARY-{salary_id}-{period}` (e.g., SALARY-123-2024-11)

### 2. Data Mapping
```
Salary Fields → Kas Keluar Fields:
- net_salary → amount
- payment_method → payment_method
- effective_date → date
- karyawan.nama_karyawan → description (auto-generated)
- karyawan.rekening_bank → bankInfo (if transfer)
- "gaji" → category (fixed)
- current user → createdBy
```

### 3. Workflow
1. Salary record created/updated in system
2. Lifecycle hook triggers automatic cash out creation
3. Cash out transaction created with "pending" status
4. Manager can approve via batch approval or individual approval
5. Approved transactions affect cash flow reports

## API Endpoints

### Standard Salary Endpoints
- `GET /api/salaries` - Get all salary records
- `GET /api/salaries/:id` - Get single salary record
- `POST /api/salaries` - Create new salary record
- `PUT /api/salaries/:id` - Update salary record
- `DELETE /api/salaries/:id` - Delete salary record

### Custom Salary Endpoints

#### Batch Process Salaries
```http
POST /api/salaries/batch-process
Content-Type: application/json

{
  "employeeIds": [1, 2, 3],
  "effectiveDate": "2024-11-15"
}
```

**Response:**
```json
{
  "data": {
    "success": true,
    "message": "Batch salary processing completed",
    "processed": 3,
    "failed": 0,
    "results": [
      {
        "employeeId": 1,
        "employeeName": "John Doe",
        "transaction": {
          "id": 456,
          "category": "gaji",
          "amount": 5000000,
          "description": "Gaji bulanan John Doe - 2024-11",
          "approval_status": "pending"
        }
      }
    ],
    "errors": []
  }
}
```

#### Department Summary
```http
GET /api/salaries/department-summary?startDate=2024-11-01&endDate=2024-11-30
```

**Response:**
```json
{
  "data": {
    "period": {
      "startDate": "2024-11-01",
      "endDate": "2024-11-30"
    },
    "totalEmployees": 25,
    "totalNetSalary": 125000000,
    "departmentBreakdown": {
      "HRM": {
        "count": 5,
        "totalBasic": 15000000,
        "totalAllowances": 5000000,
        "totalDeductions": 1000000,
        "totalNet": 19000000
      },
      "Project": {
        "count": 15,
        "totalBasic": 60000000,
        "totalAllowances": 15000000,
        "totalDeductions": 3000000,
        "totalNet": 72000000
      }
    }
  }
}
```

#### Generate Cash Out Transaction
```http
POST /api/salaries/:id/generate-cash-out
```

**Response:**
```json
{
  "data": {
    "success": true,
    "message": "Cash out transaction generated successfully",
    "transaction": {
      "id": 789,
      "category": "gaji",
      "amount": 5000000,
      "date": "2024-11-15",
      "description": "Gaji bulanan John Doe - 2024-11",
      "payment_method": "transfer",
      "invoiceNumber": "SALARY-123-2024-11",
      "approval_status": "pending",
      "salary_id": 123
    }
  }
}
```

#### Approve Salary Cash Out Transactions
```http
POST /api/salaries/approve-cash-out-transactions
Content-Type: application/json

{
  "ids": [789, 790, 791],
  "approvedBy": 5,
  "notes": "Approved for November 2024 payroll"
}
```

**Response:**
```json
{
  "data": {
    "success": true,
    "message": "Cash out transactions processed",
    "processed": 3,
    "failed": 0,
    "results": [
      {
        "id": 789,
        "approval_status": "approved",
        "approvedAt": "2024-11-15T10:30:00.000Z",
        "approvedBy": 5
      }
    ],
    "errors": []
  }
}
```

## Database Schema Changes

### Salary Content Type Updates
Added relation to cash out transactions:
```json
"kas_keluars": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::kas-keluar.kas-keluar",
  "mappedBy": "salary_id"
}
```

### Kas Keluar Content Type Updates
Added fields for salary integration:
```json
"salary_id": {
  "type": "relation",
  "relation": "manyToOne",
  "target": "api::salary.salary",
  "inversedBy": "kas_keluars"
},
"bankInfo": {
  "type": "string",
  "maxLength": 200,
  "nullable": true
}
```

## Lifecycle Hooks

### Salary Lifecycle Hooks
The salary content type includes these lifecycle hooks:

#### afterCreate
- Automatically creates cash out transaction
- Maps salary data to transaction fields
- Generates unique invoice number

#### afterUpdate
- Updates existing cash out transaction if exists
- Creates new transaction if none exists
- Prevents duplicate transactions

## Error Handling

### Common Error Responses

#### Missing Required Fields
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Employee IDs are required"
  }
}
```

#### Salary Record Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Salary record not found"
  }
}
```

#### Transaction Already Exists
```json
{
  "data": {
    "success": true,
    "message": "Cash out transaction already exists for salary: 123",
    "transaction": {
      "id": 456,
      "invoiceNumber": "SALARY-123-2024-11"
    }
  }
}
```

## Business Logic

### Automatic Calculations
- **Net Salary**: `basic_salary + position_allowance + transport_allowance + meal_allowance + bonus - deductions`
- **Invoice Number**: `SALARY-{salary_id}-{YYYY-MM}`
- **Description**: `Gaji bulanan {employee_name} - {period}`

### Approval Workflow
1. Salary transaction created with `approval_status: "pending"`
2. Manager can use batch approval endpoint for multiple transactions
3. Cash flow reports only include transactions with `approval_status: "approved"`

### Duplicate Prevention
- System checks for existing transactions with same invoice number
- Updates existing transaction instead of creating duplicates
- Maintains data integrity

## Integration Benefits

### 1. Automation
- Eliminates manual data entry for salary payments
- Reduces human error in transaction recording
- Ensures consistent categorization

### 2. Tracking & Reporting
- Complete audit trail from salary to payment
- Department-wise salary expense reporting
- Cash flow impact visibility

### 3. Workflow Efficiency
- Batch processing for payroll periods
- Integrated approval system
- Real-time financial reporting

### 4. Data Consistency
- Single source of truth for salary data
- Synchronized updates across systems
- Maintained referential integrity

## Usage Examples

### Payroll Processing Workflow

```javascript
// 1. Process monthly payroll for all employees
const employeeIds = [1, 2, 3, 4, 5];
const effectiveDate = '2024-11-25';

const batchResult = await fetch('/api/salaries/batch-process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ employeeIds, effectiveDate })
});

// 2. Approve generated transactions
const transactionIds = batchResult.data.results.map(r => r.transaction.id);

await fetch('/api/salaries/approve-cash-out-transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: transactionIds,
    approvedBy: 5,
    notes: 'November 2024 payroll approved'
  })
});

// 3. Get department summary for reporting
const summary = await fetch(
  '/api/salaries/department-summary?startDate=2024-11-01&endDate=2024-11-30'
);
```

### Individual Salary Management

```javascript
// Create new salary record
const salary = await fetch('/api/salaries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      basic_salary: 5000000,
      position_allowance: 1000000,
      transport_allowance: 500000,
      meal_allowance: 300000,
      deductions: 500000,
      effective_date: '2024-11-15',
      payment_method: 'transfer',
      karyawan: 123
    }
  })
});

// Automatically generates cash out transaction with category "gaji"
```

## Migration Notes

### Existing Data
- Existing salary records can generate cash out transactions using `POST /api/salaries/:id/generate-cash-out`
- Batch processing can handle multiple employees at once
- No data loss during migration

### Backward Compatibility
- All existing Kas Keluar functionality preserved
- New fields are nullable
- Legacy fields maintained for compatibility

## Security Considerations

### Authorization
- All endpoints require authentication
- Manager role required for approval operations
- Department-based access control implemented

### Data Validation
- Net salary automatically calculated
- Invoice numbers enforced unique
- Required field validation on all endpoints

### Audit Trail
- All changes tracked with user attribution
- Transaction logs maintained
- Approval workflow documented

---

## Support

For questions or issues regarding the Salary & Kas Keluar integration, please contact the development team or refer to the main project documentation.