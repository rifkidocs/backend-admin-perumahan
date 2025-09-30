# Backend Implementation - Marketing Leads System

## Overview

This document describes the implementation of the marketing leads system backend using Strapi CMS. The system has been built based on the existing codebase structure and modified to match the documentation requirements.

## Implementation Summary

### Content Types Created/Modified

1. **Lead (Modified existing `lead-marketing`)**

   - Updated schema to match documentation requirements
   - Changed collection name from `lead_marketings` to `leads`
   - Updated field names and validations
   - Added relations to `communication` and `reminder`

2. **Communication (New)**

   - Created new content type for tracking communication history
   - Includes date, type, notes, and relation to lead

3. **Reminder (New)**

   - Created new content type for follow-up reminders
   - Includes date, activity, status, and relation to lead

4. **Marketing Staff (Using existing `karyawan`)**
   - Leveraged existing `karyawan` content type
   - Updated relation name from `lead_marketings` to `leads`

## File Structure

```
src/api/
├── lead-marketing/
│   ├── content-types/
│   │   └── lead-marketing/
│   │       ├── schema.json (Modified)
│   │       └── lifecycles.js (New)
│   ├── controllers/
│   │   └── lead-marketing.js (Updated)
│   ├── services/
│   │   └── lead-marketing.js (Updated)
│   └── routes/
│       └── lead-marketing.js (Existing)
├── communication/
│   ├── content-types/
│   │   └── communication/
│   │       └── schema.json (New)
│   ├── controllers/
│   │   └── communication.js (New)
│   ├── services/
│   │   └── communication.js (New)
│   └── routes/
│       └── communication.js (New)
├── reminder/
│   ├── content-types/
│   │   └── reminder/
│   │       └── schema.json (New)
│   ├── controllers/
│   │   └── reminder.js (New)
│   ├── services/
│   │   └── reminder.js (New)
│   └── routes/
│       └── reminder.js (New)
└── karyawan/
    └── content-types/
        └── karyawan/
            └── schema.json (Modified - relation name)
```

## Content Type Schemas

### 1. Lead Schema

```json
{
  "kind": "collectionType",
  "collectionName": "leads",
  "info": {
    "singularName": "lead",
    "pluralName": "leads",
    "displayName": "Lead",
    "description": "Marketing leads management system"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "minLength": 2,
      "maxLength": 100
    },
    "phone": {
      "type": "string",
      "required": true,
      "regex": "^08[0-9]{8,11}$"
    },
    "email": {
      "type": "email",
      "required": true
    },
    "address": {
      "type": "text",
      "maxLength": 500
    },
    "source": {
      "type": "enumeration",
      "enum": ["website", "pameran", "referensi", "iklan", "sosmed", "lainnya"],
      "required": true
    },
    "interest": {
      "type": "string",
      "maxLength": 50
    },
    "budget": {
      "type": "string",
      "maxLength": 50
    },
    "status": {
      "type": "enumeration",
      "enum": ["baru", "berminat", "prioritas"],
      "required": true,
      "default": "baru"
    },
    "date": {
      "type": "date",
      "required": true
    },
    "notes": {
      "type": "text",
      "maxLength": 1000
    },
    "marketing": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::karyawan.karyawan",
      "inversedBy": "leads"
    },
    "communications": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::communication.communication",
      "mappedBy": "lead"
    },
    "reminders": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::reminder.reminder",
      "mappedBy": "lead"
    }
  }
}
```

### 2. Communication Schema

```json
{
  "kind": "collectionType",
  "collectionName": "communications",
  "info": {
    "singularName": "communication",
    "pluralName": "communications",
    "displayName": "Communication",
    "description": "Communication history with leads"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true
    },
    "type": {
      "type": "enumeration",
      "enum": ["telepon", "whatsapp", "email", "kunjungan", "lainnya"],
      "required": true
    },
    "notes": {
      "type": "text",
      "required": true,
      "minLength": 10,
      "maxLength": 1000
    },
    "lead": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::lead-marketing.lead-marketing",
      "inversedBy": "communications"
    }
  }
}
```

### 3. Reminder Schema

```json
{
  "kind": "collectionType",
  "collectionName": "reminders",
  "info": {
    "singularName": "reminder",
    "pluralName": "reminders",
    "displayName": "Reminder",
    "description": "Follow-up reminders for leads"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "date": {
      "type": "date",
      "required": true
    },
    "activity": {
      "type": "string",
      "required": true,
      "minLength": 5,
      "maxLength": 200
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "completed", "cancelled"],
      "required": true,
      "default": "pending"
    },
    "lead": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::lead-marketing.lead-marketing",
      "inversedBy": "reminders"
    }
  }
}
```

## API Endpoints

### Lead Endpoints

- `GET /api/lead-marketings` - Get all leads with filtering and pagination
- `GET /api/lead-marketings/:id` - Get specific lead by ID
- `POST /api/lead-marketings` - Create new lead
- `PUT /api/lead-marketings/:id` - Update lead
- `DELETE /api/lead-marketings/:id` - Delete lead

### Communication Endpoints

- `GET /api/communications` - Get all communications
- `GET /api/communications/:id` - Get specific communication by ID
- `POST /api/communications` - Create new communication
- `PUT /api/communications/:id` - Update communication
- `DELETE /api/communications/:id` - Delete communication

### Reminder Endpoints

- `GET /api/reminders` - Get all reminders
- `GET /api/reminders/:id` - Get specific reminder by ID
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### Marketing Staff Endpoints

- `GET /api/karyawans` - Get all marketing staff (karyawan)
- `GET /api/karyawans/:id` - Get specific marketing staff by ID
- `POST /api/karyawans` - Create new marketing staff
- `PUT /api/karyawans/:id` - Update marketing staff
- `DELETE /api/karyawans/:id` - Delete marketing staff

## Custom Service Methods

### Lead Service Methods

- `findWithRelations(params)` - Find leads with all related data
- `findByStatus(status, params)` - Find leads by status
- `findByMarketingStaff(marketingId, params)` - Find leads by marketing staff
- `searchLeads(searchTerm, params)` - Search leads by name, phone, or email

### Communication Service Methods

- `findWithLeadInfo(params)` - Find communications with lead information
- `findByLeadId(leadId, params)` - Find communications by lead ID

### Reminder Service Methods

- `findWithLeadInfo(params)` - Find reminders with lead information
- `findByLeadId(leadId, params)` - Find reminders by lead ID
- `findPendingReminders(params)` - Find pending reminders that are due
- `updateStatus(id, status)` - Update reminder status

## Lifecycle Hooks

### Lead Lifecycle

- `beforeCreate` - Auto-generates date field if not provided
- `beforeUpdate` - Placeholder for future update logic

## Database Relations

### Lead Relations

- **Many-to-One** with `karyawan` (marketing staff)
- **One-to-Many** with `communication` (communication history)
- **One-to-Many** with `reminder` (follow-up reminders)

### Communication Relations

- **Many-to-One** with `lead` (parent lead)

### Reminder Relations

- **Many-to-One** with `lead` (parent lead)

### Karyawan Relations

- **One-to-Many** with `lead` (assigned leads)

## Validation Rules

### Lead Validation

- `name`: Required, 2-100 characters
- `phone`: Required, Indonesian phone format (08xxxxxxxxx)
- `email`: Required, valid email format
- `address`: Optional, max 500 characters
- `source`: Required, enumeration
- `interest`: Optional, max 50 characters
- `budget`: Optional, max 50 characters
- `status`: Required, enumeration with default "baru"
- `date`: Required, auto-generated if not provided
- `notes`: Optional, max 1000 characters

### Communication Validation

- `date`: Required
- `type`: Required, enumeration
- `notes`: Required, 10-1000 characters
- `lead`: Required, relation to lead

### Reminder Validation

- `date`: Required
- `activity`: Required, 5-200 characters
- `status`: Required, enumeration with default "pending"
- `lead`: Required, relation to lead

## Usage Examples

### Creating a New Lead

```javascript
// POST /api/lead-marketings
{
  "data": {
    "name": "John Doe",
    "phone": "081234567890",
    "email": "john@example.com",
    "address": "Jl. Contoh No. 1",
    "source": "website",
    "interest": "Tipe 36/72",
    "budget": "300-400 Juta",
    "status": "baru",
    "notes": "Catatan tambahan",
    "marketing": 1
  }
}
```

### Adding Communication

```javascript
// POST /api/communications
{
  "data": {
    "date": "2023-09-15",
    "type": "telepon",
    "notes": "Follow-up pembelian",
    "lead": 1
  }
}
```

### Creating Reminder

```javascript
// POST /api/reminders
{
  "data": {
    "date": "2023-09-20",
    "activity": "Follow-up keputusan pembelian",
    "status": "pending",
    "lead": 1
  }
}
```

### Querying Leads with Relations

```javascript
// GET /api/lead-marketings?populate=marketing,communications,reminders
// GET /api/lead-marketings?filters[status][$eq]=prioritas
// GET /api/lead-marketings?filters[marketing][id][$eq]=1
// GET /api/lead-marketings?filters[name][$containsi]=john
```

## Migration Notes

### Changes Made to Existing Code

1. **Lead Marketing Schema**: Updated to match documentation requirements
2. **Karyawan Schema**: Changed relation name from `lead_marketings` to `leads`
3. **Collection Name**: Changed from `lead_marketings` to `leads`
4. **Field Names**: Updated to match documentation (e.g., `nama_lengkap` → `name`)

### Backward Compatibility

- Existing data will need to be migrated
- API endpoints remain `/api/lead-marketings` (no change)
- Field names in API requests/responses updated to match documentation

## Next Steps

1. **Database Migration**: Run Strapi migration to update existing data
2. **Permissions Setup**: Configure permissions for all content types
3. **Testing**: Test all API endpoints and relations
4. **Frontend Integration**: Update frontend to use new API structure
5. **Documentation**: Update API documentation for frontend team

## Security Considerations

1. **Authentication**: Ensure JWT-based authentication is configured
2. **Authorization**: Set up role-based permissions
3. **Validation**: All validation rules are enforced at the schema level
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints
5. **Data Privacy**: Sensitive data like phone numbers should be handled securely

## Performance Optimizations

1. **Database Indexing**: Index frequently queried fields (status, source, date)
2. **Pagination**: Implement pagination for large datasets
3. **Selective Population**: Use selective field population to minimize response size
4. **Caching**: Consider implementing caching for frequently accessed data

## Troubleshooting

### Common Issues

1. **Relation Errors**: Ensure all relation targets are correctly specified
2. **Validation Errors**: Check field requirements and formats
3. **Permission Errors**: Verify user permissions for content types
4. **Migration Issues**: Check database schema consistency

### Debug Tips

1. Check Strapi logs for detailed error messages
2. Verify content type schemas are valid JSON
3. Test API endpoints using tools like Postman
4. Check database relations are properly configured
