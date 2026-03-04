# Implementation Plan - Decimal Support in Financial Records

## Phase 1: Research and Audit
Identify all financial fields and their current usage in the backend logic.

- [ ] Task: Audit all content-type schemas for financial fields mentioned in the spec.
    - [ ] List all `schema.json` files for Pos Keuangan, Kas Masuk/Keluar, Piutang, Hutang, and Riwayat Pembayaran.
    - [ ] Identify all lifecycle hooks or services that perform calculations on these fields.
- [ ] Task: Create a baseline of current data.
    - [ ] Verify existing records to ensure we know the starting point before migration.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Research and Audit' (Protocol in workflow.md)

## Phase 2: Database Schema Migration
Update the content-type definitions to use decimal types.

- [ ] Task: Update Pos Keuangan schema.
    - [ ] Change `saldo_awal` and `saldo_saat_ini` from `biginteger/integer` to `decimal`.
- [ ] Task: Update Kas Masuk & Kas Keluar schemas.
    - [ ] Change `nominal` to `decimal`.
- [ ] Task: Update Piutang & Hutang schemas.
    - [ ] Change `total_piutang`, `sisa_piutang`, `nominal_pembayaran`, etc. to `decimal`.
- [ ] Task: Update Riwayat Pembayaran schema.
    - [ ] Change `nominal` to `decimal`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Database Schema Migration' (Protocol in workflow.md)

## Phase 3: Logic Implementation & Refactoring
Update backend logic to handle decimal calculations accurately.

- [ ] Task: Refactor Pos Keuangan lifecycle hooks.
    - [ ] Update hooks (afterCreate, afterUpdate, afterDelete) of Kas Masuk/Keluar to use `parseFloat` for saldo calculations.
- [ ] Task: Refactor Piutang & Hutang logic.
    - [ ] Update services or lifecycle hooks that calculate `sisa_piutang` or `sisa_tagihan` to handle decimals.
- [ ] Task: Implement common rounding utility.
    - [ ] Create or use a utility function for "Round Half Up" to 2 decimal places.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Logic Implementation & Refactoring' (Protocol in workflow.md)

## Phase 4: Testing and Validation
Verify that decimals are stored and calculated correctly.

- [ ] Task: Write TDD tests for Pos Keuangan.
    - [ ] Test that adding a Kas Masuk with `.50` correctly updates saldo.
- [ ] Task: Write TDD tests for Piutang/Hutang.
    - [ ] Test partial payments with decimals (e.g., paying `500000.25`).
- [ ] Task: Verify existing data integrity.
    - [ ] Check that old integer data is still correct (e.g., `1000000` remains `1000000.00`).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Testing and Validation' (Protocol in workflow.md)
