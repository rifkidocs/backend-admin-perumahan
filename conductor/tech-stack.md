# Tech Stack - Housing Project Management System

## Core Technologies
- **Framework:** Strapi v5 (Headless CMS) - Chosen for its robust API generation, flexible content modeling, and built-in admin panel capabilities.
- **Runtime:** Node.js (>=18.0.0 <=22.x.x)
- **Language:** JavaScript
- **Database:** MySQL - Used for reliable, relational data storage suitable for complex administrative and financial records.

## Key Libraries & Plugins
- **Data Management:** `strapi-v5-plugin-populate-deep` for handling complex nested relations in API responses.
- **Database Driver:** `mysql2`
- **Frontend (Admin Panel):** React 18, Styled Components 6, React Router 6.
- **Utilities:** `fs-extra` for enhanced file system operations, `mime-types` for file handling, `dayjs` for robust date/time manipulation.
- **Caching:** `strapi-cache` to optimize API performance.

## Infrastructure & Deployment
- **Deployment:** Strapi Cloud or custom Node.js hosting.
- **Package Manager:** npm (as specified in `package.json` engines).
