# Implementation Plan - Security Guard Attendance & Patrol System

## Phase 1: Data Modeling & Schema Updates [checkpoint: 3ed7c29]
- [x] Task: Create `patrol_report` Component [36b382e]
- [x] Task: Update `Absensi` Collection [af41b17]
- [x] Task: Create `Shift` Collection & Link to `Absensi` [23eff3f]
- [x] Task: Conductor - User Manual Verification 'Data Modeling & Schema Updates' (Protocol in workflow.md)

## Phase 2: Logic & Validation (12-Hour Shifts)
- [x] Task: Update Absensi Service for Night Shifts [33e353c]
    - [ ] Modify `check-out` logic to handle dates crossing midnight (e.g., check-in 19:00, check-out 07:00 next day).
    - [ ] Ensure validation logic respects the 12-hour duration.
- [ ] Task: Conductor - User Manual Verification 'Logic & Validation (12-Hour Shifts)' (Protocol in workflow.md)

## Phase 3: Patrol Reporting Implementation
- [x] Task: Implement Patrol Report Endpoint (Optional/Alternative) [8c69d1c]
    - [ ] *Note: Since we are using a component on the main type, standard update routes might suffice, but a dedicated endpoint for appending a report might be safer/easier for clients.*
    - [ ] Create custom route/controller `POST /api/absensi/:id/patrol` to push a single report item to the array without resending the whole object.
    - [ ] Write tests to verify adding multiple reports.
- [ ] Task: Conductor - User Manual Verification 'Patrol Reporting Implementation' (Protocol in workflow.md)

## Phase 4: Special Scheduling (Pak Eko)
- [ ] Task: Implement/Configure Special Shift Logic
    - [ ] Verify if `attendance-schedule` can handle "Location" or "Note" for the "Rumah Pak Eko" assignment.
    - [ ] If not, add necessary field to `attendance-schedule` or `penugasan` to designate the location.
- [ ] Task: Conductor - User Manual Verification 'Special Scheduling (Pak Eko)' (Protocol in workflow.md)
