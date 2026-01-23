# Implementation Plan - Security Guard Attendance & Patrol System

## Phase 1: Data Modeling & Schema Updates
- [x] Task: Create `patrol_report` Component [36b382e]
    - [ ] Create a new component `attendance.patrol_report`.
    - [ ] Add attributes: `foto` (media), `lokasi` (json), `keterangan` (text), `status_keamanan` (enum: Aman, Mencurigakan, Kejadian), `waktu_laporan` (datetime).
- [ ] Task: Update `Absensi` Collection
    - [ ] Add a dynamic zone or repeatable component field `laporan_patroli` using `attendance.patrol_report`.
    - [ ] Add `shift_type` (enum: Regular Day, Regular Night, Special Pak Eko) or link to a Schedule relation.
- [ ] Task: Conductor - User Manual Verification 'Data Modeling & Schema Updates' (Protocol in workflow.md)

## Phase 2: Logic & Validation (12-Hour Shifts)
- [ ] Task: Update Absensi Service for Night Shifts
    - [ ] Modify `check-out` logic to handle dates crossing midnight (e.g., check-in 19:00, check-out 07:00 next day).
    - [ ] Ensure validation logic respects the 12-hour duration.
- [ ] Task: Conductor - User Manual Verification 'Logic & Validation (12-Hour Shifts)' (Protocol in workflow.md)

## Phase 3: Patrol Reporting Implementation
- [ ] Task: Implement Patrol Report Endpoint (Optional/Alternative)
    - [ ] *Note: Since we are using a component on the main type, standard update routes might suffice, but a dedicated endpoint for appending a report might be safer/easier for clients.*
    - [ ] Create custom route/controller `POST /api/absensi/:id/patrol` to push a single report item to the array without resending the whole object.
    - [ ] Write tests to verify adding multiple reports.
- [ ] Task: Conductor - User Manual Verification 'Patrol Reporting Implementation' (Protocol in workflow.md)

## Phase 4: Special Scheduling (Pak Eko)
- [ ] Task: Implement/Configure Special Shift Logic
    - [ ] Verify if `attendance-schedule` can handle "Location" or "Note" for the "Rumah Pak Eko" assignment.
    - [ ] If not, add necessary field to `attendance-schedule` or `penugasan` to designate the location.
- [ ] Task: Conductor - User Manual Verification 'Special Scheduling (Pak Eko)' (Protocol in workflow.md)
