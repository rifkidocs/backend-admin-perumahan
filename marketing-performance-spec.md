---
title: "Marketing Performance Monitoring System"
created: "2026-04-16T10:00:00Z"
status: "approved"
authors: ["TechLead", "User"]
type: "design"
design_depth: "standard"
task_complexity: "complex"
---

# Marketing Performance Monitoring System Design & Backend Spec

## Problem Statement
The marketing team needs an automated way to monitor and score employee performance on a monthly basis. Currently, targets are only focused on sales units and commissions, but managers want to track daily activities (visits) and conversion events (bookings) aggregated over a month to calculate a comprehensive performance rating.

## Requirements

### Functional Requirements
1. **REQ-1 (Daily Visit Target):** Managers can set a daily visit target (default 10) for each marketing staff.
2. **REQ-2 (Monthly Aggregation):** The system must automatically count completed visits from `jadwal-marketing` and new bookings from `booking` for a given month.
3. **REQ-3 (Performance Scoring):** Automate the calculation of performance scores based on weighted metrics:
   - Visits Achievement (30%)
   - Bookings Achievement (30%)
   - Sales Achievement (40%)
4. **REQ-4 (Rating):** Assign a performance rating (Poor, Satisfactory, Good, Excellent) based on the total score.
5. **REQ-5 (Dashboard):** A frontend dashboard to view scorecard cards and a performance table for all staff.

## Backend Implementation Specification (For Backend Developer)

### 1. New Content Type: `marketing-performance`
**Singular:** `marketing-performance` | **Plural:** `marketing-performances`

| Field Name | Type | Description |
|------------|------|-------------|
| `marketing_staff` | Relation | Many-to-One to `api::marketing-staff.marketing-staff` |
| `periode` | String | Format "YYYY-MM" (e.g., "2026-04") |
| `target_kunjungan_harian` | Integer | Daily visit target (default 10) |
| `target_booking` | Integer | Monthly booking target (set manually by manager) |
| `pencapaian_kunjungan` | Integer | (Calculated) Total completed visits in the month |
| `pencapaian_booking` | Integer | (Calculated) Total new bookings in the month |
| `target_penjualan` | Decimal | (Fetched) Monthly sales target from `marketing-target` |
| `pencapaian_penjualan` | Decimal | (Fetched) Actual sales achievement from `marketing-target` |
| `skor_kinerja` | Decimal | (Calculated) Weighted total score (0-100) |
| `rating` | Enumeration | Options: `poor`, `satisfactory`, `good`, `excellent` |
| `notes` | Text | Manager's evaluation notes |

### 2. Automation Logic (Lifecycle Hooks)
Implement in `api/marketing-performance/content-types/marketing-performance/lifecycles.js`:

**`beforeCreate` / `beforeUpdate` Logic:**
1. Get the `marketing_staff` ID and `periode`.
2. Determine `startDate` and `endDate` for the month.
3. **Count Visits:** Query `api::jadwal-marketing.jadwal-marketing` where:
   - `assigned_staff` contains the staff.
   - `activity_type` in `['site_visit', 'customer_visit', 'canvassing']`.
   - `status` = 'completed'.
   - `start_date` between `startDate` and `endDate`.
4. **Count Bookings:** Query `api::booking.booking` where:
   - `marketing_staff` = staff ID.
   - `booking_date` between `startDate` and `endDate`.
5. **Fetch Sales Achievement:** Query `api::marketing-target.marketing-target` for the same staff and period.
6. **Calculate Score:**
   - `VisitRatio = (Actual Visits / (Daily Target * 22)) * 100` (Assumes 22 working days)
   - `BookingRatio = (Actual Bookings / Target Booking) * 100`
   - `SalesRatio = (Actual Sales / Target Sales) * 100`
   - `Skor = (VisitRatio * 0.3) + (BookingRatio * 0.3) + (SalesRatio * 0.4)`
7. **Assign Rating:**
   - `< 60`: Poor
   - `60 - 75`: Satisfactory
   - `75 - 90`: Good
   - `> 90`: Excellent

## Frontend Plan (React/Next.js)

### New Route: `src/app/marketing/performance/page.jsx`

1. **Stats Cards:** Top-level summary of aggregated performance for the selected month.
2. **Staff Scorecard Table:**
   - Columns: Staff Name, Visits (Achieved/Target), Bookings (Achieved/Target), Sales (Achieved/Target), Total Score, Rating.
3. **Filter Bar:**
   - Period Picker (Month/Year).
   - Staff Search.
4. **Detail Dialog:** Clicking a row shows a breakdown of activities and a chart of daily visit trends for that staff.

## Agent Team (Phases)

| Phase | Agent(s) | Parallel | Deliverables |
|-------|----------|----------|--------------|
| 1     | Coder    | No       | Performance Page Scaffold & API Hooks |
| 2     | Coder    | No       | Performance Scorecard & Table Components |
| 3     | Tester   | No       | Unit Tests for Scoring Logic |

## Success Criteria
1. Backend spec delivered to developer.
2. Frontend page successfully aggregates activity data and displays weighted performance scores.
3. Managers can filter performance by month and individual staff.
