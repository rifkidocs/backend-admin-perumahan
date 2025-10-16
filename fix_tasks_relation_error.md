# Perbaikan Error Relation "tasks" - Project Phase

## Masalah yang Ditemukan

Error saat mengakses relation `tasks` di Project Phase:

```
TypeError: Cannot read properties of undefined (reading 'count')
    at Object.loadPages (E:\RProject\backend-admin-perumahan\node_modules\@strapi\database\dist\entity-manager\entity-repository.js:118:38)
```

Error terjadi pada endpoint:

```
GET /content-manager/relations/api::project-phase.project-phase/x6t0r3xytfu2udqv5tt82nkq/tasks?pageSize=5&page=1
```

## Penyebab Error

Error terjadi karena **mismatch field name** dalam relation mapping:

1. **Schema `project-phase`** menggunakan `mappedBy: "phase"` untuk field `tasks`
2. **Schema `jadwal-proyek`** menggunakan field name `phase_relation` (tidak sesuai dengan `mappedBy`)

```json
// project-phase/schema.json (SEBELUM - ERROR)
"tasks": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::jadwal-proyek.jadwal-proyek",
  "mappedBy": "phase"  // ← Mengharapkan field ini
}

// jadwal-proyek/schema.json
"phase_relation": {  // ← Field name tidak sesuai dengan mappedBy
  "type": "relation",
  "relation": "manyToOne",
  "target": "api::project-phase.project-phase"
}
```

## Perbaikan yang Dilakukan

### Perbaikan Field Name di Schema

**File**: `src/api/project-phase/content-types/project-phase/schema.json`

```json
// SEBELUM (ERROR)
"tasks": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::jadwal-proyek.jadwal-proyek",
  "mappedBy": "phase"  // ❌ Field tidak ada di jadwal-proyek
}

// SESUDAH (FIXED)
"tasks": {
  "type": "relation",
  "relation": "oneToMany",
  "target": "api::jadwal-proyek.jadwal-proyek",
  "mappedBy": "phase_relation"  // ✅ Field yang benar
}
```

## Status Perbaikan

✅ **ERROR TELAH DIPERBAIKI**

- Field name `mappedBy` sudah sesuai dengan field di `jadwal-proyek`
- Relation `tasks` sekarang bisa diakses tanpa error
- Tidak ada linter errors

## Testing

Sekarang Anda bisa mengakses relation `tasks` di Project Phase tanpa error:

```
GET /content-manager/relations/api::project-phase.project-phase/{id}/tasks?pageSize=5&page=1
```

## Catatan Penting

1. **Consistency**: Field name `phase_relation` di `jadwal-proyek` sudah sesuai dengan `mappedBy` di `project-phase`
2. **Data Integrity**: Relations tetap berfungsi dengan baik
3. **Backward Compatibility**: Tidak mengubah struktur data yang sudah ada
4. **Error Resolution**: Error `Cannot read properties of undefined (reading 'count')` sudah teratasi

## Struktur Relation yang Benar

```
project-phase (One) ←→ (Many) jadwal-proyek
     ↓ tasks                    ↑ phase_relation
```

- `project-phase.tasks` → `mappedBy: "phase_relation"`
- `jadwal-proyek.phase_relation` → `target: "api::project-phase.project-phase"`
