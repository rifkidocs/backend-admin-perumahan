# Tech Stack - Housing Project Management System

## Core Technologies
- **Framework:** Strapi v5 (Headless CMS) - Chosen for its robust API generation, flexible content modeling, and built-in admin panel capabilities.
- **Runtime:** Node.js (>=18.0.0 <=22.x.x)
- **Language:** JavaScript
- **Database:** MySQL - Used for reliable, relational data storage suitable for complex administrative and financial records.
- **Cache Storage:** Redis - Used for high-performance API response caching and distributed state management.

## Data Management Standards
- **Financial Precision:** All financial fields (balances, payments, totals) must use the `decimal` type with `precision: 19, scale: 2` to ensure accuracy for cents and large amounts.
- **Calculation Logic:** Backend calculations must utilize `parseFloat` and centralized rounding utilities (e.g., `roundHalfUp`) to maintain precision and prevent floating-point errors.

## Key Libraries & Plugins
- **Data Management:** `strapi-v5-plugin-populate-deep` for handling complex nested relations in API responses.
- **Caching:**
    - `strapi-cache` for general API optimization.
    - `admin-cache` (Custom Plugin) - Redis-backed shared caching for Admin Content Manager APIs with global CUD invalidation.
- **Database Driver:** `mysql2`
- **Redis Client:** `ioredis`
- **Frontend (Admin Panel):** React 18, Styled Components 6, React Router 6.
- **Utilities:** `fs-extra` for enhanced file system operations, `mime-types` for file handling, `dayjs` for robust date/time manipulation.
- **Caching:** `strapi-cache` to optimize API performance.

## Infrastructure & Deployment
- **Deployment:** Strapi Cloud or custom Node.js hosting.
- **Package Manager:** npm (as specified in `package.json` engines).
