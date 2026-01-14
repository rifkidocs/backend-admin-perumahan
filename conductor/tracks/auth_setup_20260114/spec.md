# Spec - User Authentication and Authorization Setup

## Overview
This track focuses on configuring the foundational security layer of the Housing Project Management System using Strapi's built-in User & Permissions plugin. We will define specific roles and permissions to ensure that data access is restricted according to departmental boundaries (Admin, Finance, HR, and Sales).

## Requirements

### Functional Requirements
1.  **Role Definition:** Create and configure the following roles in Strapi:
    -   **Admin:** Full access to all content types and settings.
    -   **Finance:** Access to financial records (Kas Keluar/Masuk, Payment Invoices, Piutang) and read access to relevant project data.
    -   **HR:** Access to employee data (Karyawan, Absensi, Cuti, Payroll) and performance reviews.
    -   **Sales:** Access to CRM data (Leads, Bookings, Consumer data) and promotional materials.
2.  **Authentication:** Ensure standard JWT-based authentication is active for all API endpoints.
3.  **Authorization:** Map the defined roles to specific permissions for each existing API content type.
4.  **Auditability:** Ensure that user actions (logins, data modifications) can be traced to the authenticated user.

### Non-Functional Requirements
-   **Security:** Follow the "Principle of Least Privilege" for all role configurations.
-   **Maintainability:** Use Strapi's native Role-Based Access Control (RBAC) to ensure compatibility with future updates.

## Technical Design
-   **Plugin:** `@strapi/plugin-users-permissions`
-   **Strategy:** Configure roles via the Strapi Admin Panel and document the permission mapping in this track.
-   **Testing:** Use automated tests to verify that restricted endpoints return 403 Forbidden for unauthorized roles and 200/201 for authorized roles.
