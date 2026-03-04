# Specification - Decimal Support in Financial Records

## Overview
The client requires the housing project management system to support decimal/cent values (e.g., Rp. 1.112.762,50) in all financial-related modules. This necessitates a change from integer/biginteger data types to a high-precision decimal type in the database and ensuring all calculation logic handles decimals correctly without precision loss.

## Functional Requirements

### 1. Database Schema Migration
- Change the data type of the following fields from `biginteger` or `integer` to `decimal` with **precision 19** and **scale 2** (supports up to 17 digits before the decimal and 2 digits after):
  - **Pos Keuangan:** `saldo_awal`, `saldo_saat_ini`.
  - **Kas Masuk:** `nominal`.
  - **Kas Keluar:** `nominal`.
  - **Piutang Konsumen:** `total_piutang`, `sisa_piutang`, `nominal_pembayaran`.
  - **Tagihan Hutang:** `total_tagihan`, `sisa_tagihan`, `nominal_pembayaran`.
  - **Riwayat Pembayaran:** `nominal`.

### 2. Backend Calculation Logic
- Ensure all automated calculations (e.g., updating `saldo_saat_ini` in `pos-keuangan` when a `kas-masuk` or `kas-keluar` entry is created/updated) use `parseFloat` or a precision library to maintain accuracy.
- Implement **Round Half Up** (standard rounding) for all financial calculations where more than 2 decimal places might be generated (e.g., tax or interest calculations if added in the future).
- Validate that input values are correctly parsed as decimals.

### 3. API Input/Output
- API endpoints must accept decimal strings or numbers (e.g., `1112762.50`).
- Responses must return the exact decimal value to 2 decimal places.

## Non-Functional Requirements
- **Data Integrity:** No existing data should be lost or rounded incorrectly during the migration from integer to decimal.
- **Precision:** Use `decimal` type (not `float` or `double`) in MySQL via Strapi content modeling to prevent floating-point errors.
- **Performance:** Ensure that database queries involving decimal calculations remain optimized.

## Acceptance Criteria
1.  All identified financial fields can store and retrieve values with 2 decimal places (e.g., `.50`, `.25`).
2.  Creating a `Kas Masuk` for `100.50` correctly increments the related `Pos Keuangan` saldo by `100.50`.
3.  Calculations for `Piutang` and `Hutang` correctly reflect decimal payments and remaining balances.
4.  Existing integer data (e.g., `1000000`) is preserved as `1000000.00`.

## Out of Scope
- Frontend UI formatting (e.g., adding `,` as decimal separator in the Admin panel or client app).
- Updating other non-financial numeric fields (e.g., unit counts, employee ages).
- Handling more than 2 decimal places for storage.
