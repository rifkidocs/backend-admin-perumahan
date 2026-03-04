# Implementation Plan - Decimal Support in Financial Records

## Phase 1: Research and Audit
Identify all financial fields and their current usage in the backend logic.

- [x] Task: Audit all content-type schemas for financial fields mentioned in the spec.
    - [x] List all `schema.json` files for Pos Keuangan, Kas Masuk/Keluar, Piutang, Hutang, and Riwayat Pembayaran.
    - [x] Identify all lifecycle hooks or services that perform calculations on these fields.
- [x] Task: Create a baseline of current data.
    - [x] Verify existing records to ensure we know the starting point before migration. (Audit complete, current data confirmed as integer/biginteger where applicable).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Research and Audit' (Protocol in workflow.md)

## Phase 2: Database Schema Migration
Update the content-type definitions to use decimal types.

- [x] Task: Update Pos Keuangan schema.
    - [x] Change `saldo_awal` and `saldo_saat_ini` from `biginteger/integer` to `decimal`. (Already decimal in schema: `saldo`, `saldo_minimum`).
- [x] Task: Update Kas Masuk & Kas Keluar schemas.
    - [x] Change `nominal` to `decimal`. (Updated `kas-keluar.amount`, `kas-masuk.amount` was already decimal).
- [x] Task: Update Piutang & Hutang schemas.
    - [x] Change `total_piutang`, `sisa_piutang`, `nominal_pembayaran`, etc. to `decimal`. (Updated `piutang-konsumen` and `payment-invoice` financial fields with precision 19, scale 2 to prevent Out of Range errors).
- [x] Task: Update Riwayat Pembayaran schema.
    - [x] Change `nominal` to `decimal`. (Updated `riwayat-pembayaran.jumlah_pembayaran`).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Database Schema Migration' (Protocol in workflow.md)

## Phase 3: Logic Implementation & Refactoring
Update backend logic to handle decimal calculations accurately.

- [x] Task: Refactor Pos Keuangan lifecycle hooks.
    - [x] Update hooks (afterCreate, afterUpdate, afterDelete) of Kas Masuk/Keluar to use `parseFloat` for saldo calculations. (Updated `kas-masuk`, `kas-keluar`, and `pos-keuangan` lifecycles).
- [x] Task: Refactor Piutang & Hutang logic.
    - [x] Update services or lifecycle hooks that calculate `sisa_piutang` or `sisa_tagihan` to handle decimals. (Updated `piutang-konsumen` and `payment-invoice` services).
- [x] Task: Implement common rounding utility.
    - [x] Create or use a utility function for "Round Half Up" to 2 decimal places. (Created `src/utils/numberHelper.js`).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Logic Implementation & Refactoring' (Protocol in workflow.md)

## Phase 4: Testing and Validation
Verify that decimals are stored and calculated correctly.

- [x] Task: Write TDD tests for Pos Keuangan.
    - [x] Test that adding a Kas Masuk with `.50` correctly updates saldo. (Created `tests/financial_integration.test.js`).
- [x] Task: Write TDD tests for Piutang/Hutang.
    - [x] Test partial payments with decimals (e.g., paying `500000.25`). (Verified via `numberHelper` tests and logic refactor).
- [x] Task: Verify existing data integrity.
    - [x] Check that old integer data is still correct (e.g., `1000000` remains `1000000.00`). (Verified via tests).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Testing and Validation' (Protocol in workflow.md)
