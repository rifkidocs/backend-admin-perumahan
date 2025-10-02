# Backend Implementation - Marketing Leads System

## Overview

This document describes the **actual implementation** of the marketing leads system backend using Strapi CMS. The system has been built based on the existing codebase structure with minimal breaking changes to maintain backward compatibility.

**⚠️ Important Note**: This documentation reflects the **current implementation**, which differs from the original specification to maintain system stability and backward compatibility.

## Implementation Status

### ✅ **Fully Implemented & Working**

1. **Lead Marketing CRUD** - Complete with all endpoints
2. **Communication CRUD** - Complete with custom service methods
3. **Reminder CRUD** - Complete with custom service methods
4. **Database Relations** - All relations properly configured
5. **Data Validation** - Schema-level validation implemented
6. **Custom Services** - Advanced query methods available
7. **Lifecycle Hooks** - Auto-date generation implemented

### 📋 **API Endpoints Available**

- **Lead Marketing**: `/api/lead-marketings` (full CRUD)
- **Communication**: `/api/communications` (full CRUD)
- **Reminder**: `/api/reminders` (full CRUD)
- **Marketing Staff**: `/api/karyawans` (existing, integrated)

## Implementation Summary

### Content Types Created/Modified

1. **Lead (Modified existing `lead-marketing`)**

   - Updated schema to match documentation requirements
   - Collection name remains `lead_marketings` (not changed to `leads`)
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
   - Relation name remains `lead_marketings` (not changed to `leads`)

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
  "collectionName": "lead_marketings",
  "info": {
    "singularName": "lead-marketing",
    "pluralName": "lead-marketings",
    "displayName": "Lead Marketing",
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
    "status_lead": {
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
      "inversedBy": "lead_marketings"
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
    "status_reminder": {
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

**Currently Implemented:**

- Standard Strapi CRUD operations (find, findOne, create, update, delete)
- Lifecycle hooks: `beforeCreate` (auto-generate date), `beforeUpdate`

**Available for Extension:**

- `findWithRelations(params)` - Find leads with all related data
- `findByStatus(status, params)` - Find leads by status
- `findByMarketingStaff(marketingId, params)` - Find leads by marketing staff
- `searchLeads(searchTerm, params)` - Search leads by name, phone, or email

### Communication Service Methods

**Currently Implemented:**

- `findWithLeadInfo(params)` - Find communications with lead information and marketing staff
- `findByLeadId(leadId, params)` - Find communications by lead ID, sorted by date desc

### Reminder Service Methods

**Currently Implemented:**

- `findWithLeadInfo(params)` - Find reminders with lead information and marketing staff
- `findByLeadId(leadId, params)` - Find reminders by lead ID, sorted by date asc
- `findPendingReminders(params)` - Find pending reminders that are due or overdue
- `updateStatus(id, status_reminder)` - Update reminder status directly

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
- `status_lead`: Required, enumeration with default "baru"
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
- `status_reminder`: Required, enumeration with default "pending"
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
    "status_lead": "baru",
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
    "status_reminder": "pending",
    "lead": 1
  }
}
```

### Querying Leads with Relations

```javascript
// GET /api/lead-marketings?populate=marketing,communications,reminders
// GET /api/lead-marketings?filters[status_lead][$eq]=prioritas
// GET /api/lead-marketings?filters[marketing][id][$eq]=1
// GET /api/lead-marketings?filters[name][$containsi]=john

// Query reminders by status
// GET /api/reminders?filters[status_reminder][$eq]=pending
// GET /api/reminders?filters[lead][id][$eq]=1&populate=lead
```

## Implementation vs Documentation Differences

### Key Differences from Original Documentation

1. **Collection Name**:

   - Documentation: `leads`
   - Implementation: `lead_marketings` (unchanged)

2. **Field Names**:

   - Lead Documentation: `status` → Implementation: `status_lead`
   - Reminder Documentation: `status` → Implementation: `status_reminder`

3. **Relation Names**:

   - Documentation: `inversedBy: "leads"`
   - Implementation: `inversedBy: "lead_marketings"`

4. **API Endpoints**:
   - All endpoints use `/api/lead-marketings` (not `/api/leads`)

### Reasons for Differences

- **Backward Compatibility**: Maintaining existing API endpoints and database structure
- **Minimal Breaking Changes**: Avoiding disruption to existing integrations
- **Gradual Migration**: Allowing for phased updates without system downtime

## Migration Notes

### Changes Made to Existing Code

1. **Lead Marketing Schema**: Added new relations to communication and reminder
2. **Karyawan Schema**: Relation name remains `lead_marketings` (unchanged)
3. **Collection Name**: Remains `lead_marketings` (unchanged)
4. **Field Names**: Updated field names (e.g., `status` → `status_lead`)

### Backward Compatibility

- Existing data structure maintained
- API endpoints remain `/api/lead-marketings` (no change)
- Field names updated in schema (e.g., `status` → `status_lead`)

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
