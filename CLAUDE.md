# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v5 backend for a housing development management system (backend-admin-perumahan). It manages residential construction projects, materials, bookings, employees, and related business operations for a property development company.

## Development Commands

### Core Strapi Commands
- `npm run develop` or `npm run dev` - Start development server with auto-reload
- `npm run start` - Start production server (no auto-reload)
- `npm run build` - Build the admin panel for production
- `npm run deploy` - Deploy to Strapi Cloud
- `npm run console` - Open Strapi console for debugging
- `npm run upgrade` - Upgrade Strapi to latest version
- `npm run upgrade:dry` - Check upgrade without executing

### Custom Scripts
- `npm run seed:example` - Run database seeding script

## Architecture

### Core Content Types
- **Housing Projects** (`proyek-perumahan`): Central entity managing construction projects with phases, workers, materials, and documents
- **Units** (`unit-rumah`): Individual housing units within projects
- **Bookings** (`booking`): Marketing and sales booking system with payment tracking
- **Materials** (`material`): Construction material inventory with suppliers and stock management
- **Customers** (`konsumen`): Customer management for bookings and sales
- **Employees** (`karyawan`): Staff management including marketing, project managers, and workers

### Supporting Systems
- **Financial**: Budget tracking, cash flow (kas-masuk/kas-keluar), RAB (budget planning)
- **Operations**: Material requests, usage tracking, supplier management
- **HR**: Attendance, leave management, performance reviews, payroll
- **Marketing**: Lead tracking, campaigns, promotions, communications
- **Documentation**: Legal documents, technical drawings, progress photos

### Key Relationships
- Projects contain multiple units, phases, workers, and materials
- Bookings link customers to specific units within projects
- Materials have many-to-many relationships with suppliers
- Employees can be assigned to projects as managers or workers
- All entities support document attachments through media fields

### Component Structure
- `komponen/`: Indonesian-language components for specific business logic
- `shared/`: Reusable components across content types (material items, labor requirements)

## Database Configuration

The system supports MySQL, PostgreSQL, and SQLite databases. Configure via environment variables:
- `DATABASE_CLIENT` - Database type (mysql/postgres/sqlite)
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME` - Connection details
- `DATABASE_USERNAME`, `DATABASE_PASSWORD` - Authentication

## Important Patterns

### ID Conventions
- Projects: `PROJ-XXXXXX` (6 digits)
- Bookings: `BK-XXXX-XXX` (year + sequence)
- Materials use unique `kode_material` codes

### Status Management
Most entities use Indonesian status enums:
- Project status: `perencanaan`, `pembangunan`, `terjual habis`
- Booking status: `aktif`, `menunggu-pembayaran`, `dibatalkan`, `selesai`
- Payment status: `pending`, `lunas`, `overdue`

### Media Handling
Extensive use of media fields for:
- Project galleries and site plans
- Material photos
- Legal and technical documents
- Payment proofs

## Plugin Usage

- **strapi-v5-plugin-populate-deep**: Used for deep population of related entities
- Standard Strapi plugins: users-permissions, cloud

## Development Notes

The system is designed for Indonesian property development companies with:
- Mixed-use project support (subsidi + komersial)
- Complex material and supplier management
- Marketing automation and lead tracking
- Comprehensive project lifecycle management
- Financial tracking and reporting