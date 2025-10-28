# Booking System Revision Summary

## Changes Made

### 1. Added Project Selection to Booking ✅

**Files Modified:**

- `src/api/booking/content-types/booking/schema.json`
- `src/api/proyek-perumahan/content-types/proyek-perumahan/schema.json`

**Changes:**

- Added `project` relation to booking schema (manyToOne → proyek-perumahan)
- Added `bookings` relation to proyek-perumahan schema (oneToMany ← booking)

### 2. Added Booking Fee Type Field ✅

**Files Modified:**

- `src/api/booking/content-types/booking/schema.json`

**Changes:**

- Added `booking_fee_type` field (enumeration: "Subsidi" or "Komersial")

### 3. Added Price Tracking Fields ✅

**Files Modified:**

- `src/api/booking/content-types/booking/schema.json`

**Changes:**

- Added `original_price` field (decimal)
- Added `adjusted_price` field (decimal)

### 4. Implemented Price Calculation Logic ✅

**Files Modified:**

- `src/api/booking/content-types/booking/lifecycles.js`
- `src/api/unit-rumah/content-types/unit-rumah/schema.json`

**Changes:**

- Updated `status_unit` enum to include: "tersedia", "dipesan", "terjual"
- Implemented `beforeCreate` hook to calculate price based on booking_fee_type:
  - **Subsidi**: Booking fee does NOT reduce house price (adjusted_price = original_price)
  - **Komersial**: Booking fee reduces house price (adjusted_price = original_price - booking_fee)
- Implemented `beforeUpdate` hook to recalculate price when booking_fee or booking_fee_type changes
- Implemented `afterCreate` hook to update unit status to "dipesan"
- Implemented `beforeDelete` hook to reset unit status to "tersedia"

## Business Logic

### Price Calculation Rules

1. **Subsidi (Subsidy)**

   - Booking fee does NOT reduce the house price
   - `adjusted_price` = `original_price`

2. **Komersial (Commercial)**
   - Booking fee reduces the house price
   - `adjusted_price` = `original_price` - `booking_fee`

### Unit Status Management

- When booking is created → Unit status changes to "dipesan" (booked)
- When booking is deleted → Unit status changes back to "tersedia" (available)

## API Usage

### Creating a New Booking

```json
POST /api/bookings
{
  "project": 1,                    // Project ID (REQUIRED)
  "unit": 1,                      // Unit ID
  "customer": 1,                   // Customer ID
  "marketing_staff": 1,           // Marketing Staff ID
  "booking_fee": 5000000,          // Booking fee amount
  "booking_fee_type": "Komersial", // "Subsidi" or "Komersial"
  "payment_status": "pending",
  "booking_status": "menunggu-pembayaran",
  "payment_method": "transfer",
  "notes": "Customer booking notes"
}
```

### Booking Fee Type Behavior

**Subsidi Example:**

- House price: 500,000,000
- Booking fee: 5,000,000
- Adjusted price: 500,000,000 (no reduction)

**Komersial Example:**

- House price: 500,000,000
- Booking fee: 5,000,000
- Adjusted price: 495,000,000 (booking fee reduces house price)

## Schema Changes

### Booking Schema (`src/api/booking/content-types/booking/schema.json`)

Added fields:

- `booking_fee_type` (enumeration: "Subsidi" | "Komersial")
- `project` (relation to proyek-perumahan)
- `original_price` (decimal)
- `adjusted_price` (decimal)

### Proyek Perumahan Schema

Added relation:

- `bookings` (oneToMany ← booking)

### Unit Rumah Schema

Updated enum:

- `status_unit` now includes: "tersedia", "dipesan", "terjual"

## Testing Recommendations

1. **Test Subsidy Booking:**

   - Create booking with `booking_fee_type: "Subsidi"`
   - Verify `adjusted_price` equals `original_price`

2. **Test Commercial Booking:**

   - Create booking with `booking_fee_type: "Komersial"`
   - Verify `adjusted_price` equals `original_price - booking_fee`

3. **Test Unit Status Updates:**

   - Create booking → verify unit status = "dipesan"
   - Delete booking → verify unit status = "tersedia"

4. **Test Project Selection:**
   - Verify project relation is properly linked
   - Filter bookings by project

## Migration Notes

- No database migration required (Strapi will auto-migrate)
- Existing bookings will need to be updated with:
  - `project` relation
  - `booking_fee_type` field
  - Price tracking fields (if needed)

## Next Steps

1. Update frontend to:
   - Add project selection dropdown
   - Add booking fee type selection (Subsidi/Komersial)
   - Display price calculation breakdown
2. Consider adding:
   - Validation rules for booking fee amounts
   - Price calculation history/logging
   - Reports on booking fee revenue by type
