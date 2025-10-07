# Marketing Targets & Commission System - Backend Implementation

## Overview

This document describes the implementation of the Marketing Targets & Commission System backend using Strapi CMS. The system has been enhanced from the existing basic `target-marketing` content type to a comprehensive commission management system.

## Implementation Summary

### Existing Content Types Enhanced

#### 1. Target Marketing (`target-marketing`)

**Location**: `src/api/target-marketing/`

**Enhancements Made**:

- Added `target_id` field with auto-generation (format: TGT-YYYY-XXX)
- Enhanced `periode` field with regex validation (YYYY-MM format)
- Changed `komisi_per_unit` from decimal to JSON for multiple unit types
- Added payment tracking fields: `tanggal_pembayaran`, `metode_pembayaran`, `bukti_pembayaran`
- Added `notes` field for additional information
- Added relations to `achievement_updates` and `commission_payments`

**Schema Changes**:

```json
{
  "target_id": {
    "type": "string",
    "required": true,
    "unique": true,
    "regex": "^TGT-[0-9]{4}-[0-9]{3}$"
  },
  "periode": {
    "type": "string",
    "required": true,
    "regex": "^[0-9]{4}-[0-9]{2}$"
  },
  "komisi_per_unit": {
    "type": "json",
    "required": true
  }
}
```

### New Content Types Created

#### 2. Achievement Update (`achievement-update`)

**Location**: `src/api/achievement-update/`

**Purpose**: Track individual achievement updates for marketing targets

**Key Fields**:

- `update_date`: Date of achievement update
- `unit_achieved`: Number of units achieved
- `nominal_achieved`: Nominal value achieved
- `unit_breakdown`: JSON breakdown by unit type
- `commission_earned`: Auto-calculated commission
- `verified_by` & `verified_date`: Verification tracking

**Relations**:

- `marketing_target`: Many-to-One relation to target-marketing
- `marketing_staff`: Many-to-One relation to karyawan

#### 3. Commission Payment (`commission-payment`)

**Location**: `src/api/commission-payment/`

**Purpose**: Track commission payments to marketing staff

**Key Fields**:

- `payment_date`: Date of payment
- `amount_paid`: Amount paid
- `payment_method`: Transfer, cash, or check
- `payment_status`: Pending, completed, or failed
- `reference_number`: Payment reference
- `bank_account`: Bank account details
- `processed_by`: Who processed the payment

**Relations**:

- `marketing_target`: Many-to-One relation to target-marketing

#### 4. Commission Structure (`commission-structure`)

**Location**: `src/api/commission-structure/`

**Purpose**: Define commission structures for different unit types

**Key Fields**:

- `unit_type`: Type of unit (e.g., "36/72", "45/90")
- `commission_rate`: Commission rate percentage
- `commission_amount`: Fixed commission amount
- `bonus_threshold`: Threshold for bonus
- `bonus_rate`: Bonus rate percentage
- `cash_incentive`: Cash incentive amount
- `is_active`: Active status
- `effective_date` & `expiry_date`: Validity period

## Lifecycle Hooks Implementation

### Target Marketing Lifecycle (`target-marketing/lifecycles.js`)

**beforeCreate**:

- Auto-generates `target_id` with format TGT-YYYY-XXX
- Sets default values for achievement fields
- Calculates initial total commission

**afterUpdate**:

- Recalculates total commission when achievements change
- Updates target achievement totals

### Achievement Update Lifecycle (`achievement-update/lifecycles.js`)

**beforeCreate**:

- Calculates commission earned based on unit breakdown and target commission structure

**afterCreate**:

- Updates parent target's achievement totals
- Aggregates unit breakdown across all updates

### Commission Payment Lifecycle (`commission-payment/lifecycles.js`)

**afterCreate**:

- Updates target's payment status based on total payments vs total commission
- Automatically sets status to "lunas", "sebagian", or "belum-dibayar"

## API Endpoints

All content types follow Strapi's standard REST API pattern:

### Target Marketing

- `GET /api/target-marketings` - List all targets
- `GET /api/target-marketings/:id` - Get specific target
- `POST /api/target-marketings` - Create new target
- `PUT /api/target-marketings/:id` - Update target
- `DELETE /api/target-marketings/:id` - Delete target

### Achievement Updates

- `GET /api/achievement-updates` - List all updates
- `GET /api/achievement-updates/:id` - Get specific update
- `POST /api/achievement-updates` - Create new update
- `PUT /api/achievement-updates/:id` - Update update
- `DELETE /api/achievement-updates/:id` - Delete update

### Commission Payments

- `GET /api/commission-payments` - List all payments
- `GET /api/commission-payments/:id` - Get specific payment
- `POST /api/commission-payments` - Create new payment
- `PUT /api/commission-payments/:id` - Update payment
- `DELETE /api/commission-payments/:id` - Delete payment

### Commission Structures

- `GET /api/commission-structures` - List all structures
- `GET /api/commission-structures/:id` - Get specific structure
- `POST /api/commission-structures` - Create new structure
- `PUT /api/commission-structures/:id` - Update structure
- `DELETE /api/commission-structures/:id` - Delete structure

## Query Examples

### Get targets with relations

```
GET /api/target-marketings?populate[marketing][populate]=true&populate[proyek_perumahan][populate]=true&populate[achievement_updates][populate]=true&populate[commission_payments][populate]=true
```

### Filter targets by period

```
GET /api/target-marketings?filters[periode][$eq]=2023-09
```

### Filter targets by marketing staff

```
GET /api/target-marketings?filters[marketing][id][$eq]=1
```

### Filter targets by payment status

```
GET /api/target-marketings?filters[status_pembayaran_komisi][$eq]=lunas
```

## Data Flow

### 1. Target Creation

1. Marketing manager creates target with period, unit target, nominal target
2. System auto-generates target_id
3. Commission structure is defined per unit type
4. Target is assigned to marketing staff and project

### 2. Achievement Tracking

1. Marketing staff reports achievements via achievement-update
2. System calculates commission earned automatically
3. Target's achievement totals are updated
4. Commission totals are recalculated

### 3. Commission Payment

1. Finance processes commission payment
2. Payment record is created with amount and method
3. Target's payment status is automatically updated
4. Payment history is maintained

## Business Rules Implemented

### Auto-Generation Rules

- Target ID: TGT-YYYY-XXX format with sequential numbering
- Commission calculation based on unit breakdown and commission structure
- Payment status updates based on total payments vs total commission

### Validation Rules

- Target ID format validation
- Period format validation (YYYY-MM)
- Minimum values for targets and achievements
- Required fields validation

### Data Integrity

- Achievement updates automatically update parent target
- Payment records automatically update target payment status
- Commission calculations are consistent across the system

## Integration Points

### Existing System Integration

- **Karyawan**: Marketing staff are linked via existing karyawan content type
- **Proyek Perumahan**: Projects are linked via existing project content type
- **Lead Marketing**: Can be integrated with existing lead system

### Future Integration Possibilities

- **HR System**: Commission data for payroll integration
- **Finance System**: Payment records for accounting
- **CRM System**: Achievement data for performance tracking

## Security Considerations

### Data Access

- Marketing staff can only see their own targets and achievements
- Finance can see all payment records
- Management can see all data with proper permissions

### Validation

- Server-side validation for all input data
- Commission calculation validation
- Payment amount validation

## Performance Optimizations

### Database Indexing

- Index on `target_id` for fast lookups
- Index on `periode` for period-based queries
- Index on `marketing` relation for staff-based queries
- Index on `status_pembayaran_komisi` for payment status queries

### Caching Strategy

- Commission structures can be cached as they change infrequently
- Target summaries can be cached for dashboard views

## Monitoring and Analytics

### Key Metrics

- Target achievement rates per marketing staff
- Commission payment status distribution
- Performance trends over time
- Revenue from commission payments

### Reporting Capabilities

- Target vs achievement reports
- Commission payment reports
- Marketing performance reports
- Financial commission reports

## Deployment Notes

### Database Migration

- Existing `target-marketing` data will be preserved
- New fields will be added with default values
- Relations will be established automatically

### Configuration

- Set up proper permissions for each content type
- Configure API rate limiting
- Set up file upload limits for payment proofs

### Testing

- Test target creation with auto-ID generation
- Test achievement update calculations
- Test payment status updates
- Test commission calculations with different structures

## Maintenance

### Regular Tasks

- Monitor commission calculation accuracy
- Review payment status consistency
- Update commission structures as needed
- Archive old targets and payments

### Troubleshooting

- Check lifecycle hook execution
- Verify relation integrity
- Monitor calculation accuracy
- Review payment status updates

## Conclusion

The Marketing Targets & Commission System has been successfully implemented with:

- ✅ Enhanced existing `target-marketing` content type
- ✅ Created 3 new content types for comprehensive functionality
- ✅ Implemented lifecycle hooks for auto-calculation and validation
- ✅ Maintained integration with existing karyawan and project systems
- ✅ Followed Strapi best practices for API design
- ✅ Implemented business rules and validation
- ✅ Created comprehensive documentation

The system is ready for frontend integration and can be extended with additional features as needed.
