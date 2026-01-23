# Track: Security Guard Attendance & Patrol System

## Overview
Enhance the existing attendance system to specifically support security guard operations. This includes handling 12-hour shifts (7 AM - 7 PM and 7 PM - 7 AM), special weekend assignments, and a flexible patrol reporting mechanism using repeatable components within the attendance record.

## Functional Requirements

### 1. Enhanced Attendance (12-Hour Shifts)
- Support for 24-hour cycle shifts:
    - Shift A: 07:00 - 19:00 (Day)
    - Shift B: 19:00 - 07:00 (Night - spanning across two calendar days)
- Integration with the existing `absensi` collection.

### 2. Patrol Reporting System (Repeatable Component)
- Add a repeatable component `patrol_reports` to the `absensi` collection.
- Each report entry must include:
    - `foto`: Media (Image) - Mandatory.
    - `lokasi`: JSON (Lat, Lng, Address) - Mandatory.
    - `keterangan`: Text - Optional notes from the guard.
    - `status_keamanan`: Enumeration (e.g., "Aman", "Mencurigakan", "Kejadian").
- No minimum submission rule; guards can submit as many reports as needed during their shift.

### 3. Special Shift: Saturday Night (Rumah Pak Eko)
- Implement logic or configuration to handle a specific "Jaga Malam Minggu" shift at "Rumah Pak Eko".
- This shift should be identifiable in the scheduling and attendance logs.

## Non-Functional Requirements
- **Performance:** Ensure fetching attendance records with many patrol reports remains efficient.
- **Data Integrity:** Location and Photo must be captured at the time of report submission.

## Acceptance Criteria
- Security guards can check in for both day and night shifts.
- Guards can add multiple patrol reports (photo + location + status) throughout their shift.
- The night shift (19:00 - 07:00) correctly handles check-outs on the following day.
- A specific assignment for "Rumah Pak Eko" can be scheduled and recorded on Saturday nights.

## Out of Scope
- Real-time live tracking (continuous GPS streaming).
- Automated guard tour patrol hardware integration.
