# API Usage Documentation - Tools & Materi Promosi System

## Overview

Dokumentasi ini menjelaskan cara penggunaan API untuk sistem Tools & Materi Promosi dengan 4 content types utama. Semua endpoint menggunakan format `/content-manager/collection-types/` untuk akses melalui Strapi Admin Panel.

## Content Types API Endpoints

### 1. Brochure API (`api::brochure.brochure`)

#### Base URL

```
/content-manager/collection-types/api::brochure.brochure
```

#### Endpoints

| Method | Endpoint                                                       | Description         |
| ------ | -------------------------------------------------------------- | ------------------- |
| GET    | `/content-manager/collection-types/api::brochure.brochure`     | Get all brochures   |
| GET    | `/content-manager/collection-types/api::brochure.brochure/:id` | Get brochure by ID  |
| POST   | `/content-manager/collection-types/api::brochure.brochure`     | Create new brochure |
| PUT    | `/content-manager/collection-types/api::brochure.brochure/:id` | Update brochure     |
| DELETE | `/content-manager/collection-types/api::brochure.brochure/:id` | Delete brochure     |

#### Request Examples

**Create Brochure:**

```json
POST /content-manager/collection-types/api::brochure.brochure
Content-Type: application/json

{
  "title": "Cluster Anggrek - Brosur 2023",
  "file": [file_upload],
  "thumbnail": [file_upload],
  "project": 1,
  "unit_types": ["Tipe 45", "Tipe 36"],
  "description": "Brosur lengkap untuk Cluster Anggrek",
  "is_active": true
}
```

**Update Brochure:**

```json
PUT /content-manager/collection-types/api::brochure.brochure/1
Content-Type: application/json

{
  "title": "Cluster Anggrek - Brosur 2024",
  "description": "Brosur terbaru untuk Cluster Anggrek",
  "is_active": false
}
```

#### Schema Fields

| Field Name    | Type     | Required | Description                   |
| ------------- | -------- | -------- | ----------------------------- |
| `title`       | String   | Yes      | Judul brosur/katalog          |
| `file`        | Media    | Yes      | File brosur (PDF)             |
| `thumbnail`   | Media    | No       | Thumbnail brosur              |
| `project`     | Relation | Yes      | Relasi ke project             |
| `unit_types`  | JSON     | Yes      | Array tipe unit yang tercakup |
| `description` | Text     | No       | Deskripsi brosur              |
| `is_active`   | Boolean  | Yes      | Status aktif brosur           |

---

### 2. Marketing Video API (`api::marketing-video.marketing-video`)

#### Base URL

```
/content-manager/collection-types/api::marketing-video.marketing-video
```

#### Endpoints

| Method | Endpoint                                                                     | Description              |
| ------ | ---------------------------------------------------------------------------- | ------------------------ |
| GET    | `/content-manager/collection-types/api::marketing-video.marketing-video`     | Get all marketing videos |
| GET    | `/content-manager/collection-types/api::marketing-video.marketing-video/:id` | Get video by ID          |
| POST   | `/content-manager/collection-types/api::marketing-video.marketing-video`     | Create new video         |
| PUT    | `/content-manager/collection-types/api::marketing-video.marketing-video/:id` | Update video             |
| DELETE | `/content-manager/collection-types/api::marketing-video.marketing-video/:id` | Delete video             |

#### Request Examples

**Create Marketing Video:**

```json
POST /content-manager/collection-types/api::marketing-video.marketing-video
Content-Type: application/json

{
  "title": "Video Tour Tipe 45",
  "video_file": [file_upload],
  "thumbnail": [file_upload],
  "video_type": "Tour Standar",
  "project": 1,
  "unit_type": "Tipe 45",
  "description": "Video tour unit tipe 45",
  "is_active": true
}
```

**Update Video Status:**

```json
PUT /content-manager/collection-types/api::marketing-video.marketing-video/1
Content-Type: application/json

{
  "is_active": false,
  "description": "Video tidak aktif untuk sementara"
}
```

#### Schema Fields

| Field Name    | Type        | Required | Description                                               |
| ------------- | ----------- | -------- | --------------------------------------------------------- |
| `title`       | String      | Yes      | Judul video                                               |
| `video_file`  | Media       | No       | File video (MP4)                                          |
| `thumbnail`   | Media       | No       | Thumbnail video                                           |
| `video_type`  | Enumeration | Yes      | Jenis video (Tour Standar, Tour 360°, Promosi, Testimoni) |
| `project`     | Relation    | Yes      | Relasi ke project                                         |
| `unit_type`   | String      | No       | Tipe unit yang ditampilkan                                |
| `description` | Text        | No       | Deskripsi video                                           |
| `is_active`   | Boolean     | Yes      | Status aktif video                                        |

---

### 3. Communication Template API (`api::communication-template.communication-template`)

#### Base URL

```
/content-manager/collection-types/api::communication-template.communication-template
```

#### Endpoints

| Method | Endpoint                                                                                   | Description         |
| ------ | ------------------------------------------------------------------------------------------ | ------------------- |
| GET    | `/content-manager/collection-types/api::communication-template.communication-template`     | Get all templates   |
| GET    | `/content-manager/collection-types/api::communication-template.communication-template/:id` | Get template by ID  |
| POST   | `/content-manager/collection-types/api::communication-template.communication-template`     | Create new template |
| PUT    | `/content-manager/collection-types/api::communication-template.communication-template/:id` | Update template     |
| DELETE | `/content-manager/collection-types/api::communication-template.communication-template/:id` | Delete template     |

#### Request Examples

**Create Communication Template:**

```json
POST /content-manager/collection-types/api::communication-template.communication-template
Content-Type: application/json

{
  "title": "Template Email - Penawaran",
  "category": "Email",
  "lead_category": "Berminat",
  "subject": "Penawaran Khusus Perumahan {{project_name}}",
  "content": "Halo {{customer_name}}, kami memiliki penawaran khusus untuk Anda...",
  "is_active": true,
  "usage_count": 0
}
```

**Update Template Usage:**

```json
PUT /content-manager/collection-types/api::communication-template.communication-template/1
Content-Type: application/json

{
  "usage_count": 5,
  "content": "Halo {{customer_name}}, kami memiliki penawaran terbaru untuk Anda..."
}
```

#### Schema Fields

| Field Name      | Type        | Required | Description                                 |
| --------------- | ----------- | -------- | ------------------------------------------- |
| `title`         | String      | Yes      | Judul template                              |
| `category`      | Enumeration | Yes      | Kategori template (Email, WhatsApp)         |
| `lead_category` | Enumeration | Yes      | Kategori lead (Berminat, Prioritas, Closed) |
| `subject`       | String      | No       | Subject email (untuk template email)        |
| `content`       | RichText    | Yes      | Konten template                             |
| `is_active`     | Boolean     | Yes      | Status aktif template                       |
| `usage_count`   | Number      | No       | Jumlah penggunaan template                  |

---

### 4. Social Media Content API (`api::social-media-content.social-media-content`)

#### Base URL

```
/content-manager/collection-types/api::social-media-content.social-media-content
```

#### Endpoints

| Method | Endpoint                                                                               | Description                  |
| ------ | -------------------------------------------------------------------------------------- | ---------------------------- |
| GET    | `/content-manager/collection-types/api::social-media-content.social-media-content`     | Get all social media content |
| GET    | `/content-manager/collection-types/api::social-media-content.social-media-content/:id` | Get content by ID            |
| POST   | `/content-manager/collection-types/api::social-media-content.social-media-content`     | Create new content           |
| PUT    | `/content-manager/collection-types/api::social-media-content.social-media-content/:id` | Update content               |
| DELETE | `/content-manager/collection-types/api::social-media-content.social-media-content/:id` | Delete content               |

#### Request Examples

**Create Social Media Content:**

```json
POST /content-manager/collection-types/api::social-media-content.social-media-content
Content-Type: application/json

{
  "title": "Promo Akhir Tahun",
  "platform": "Instagram",
  "post_type": "Image",
  "content_images": [file_uploads],
  "caption": "Miliki hunian impian di akhir tahun dengan promo spesial...",
  "hashtags": "#RumahImpian #PromoAkhirTahun #PerumahanBerkualitas",
  "thumbnail": [file_upload],
  "scheduled_date": "2023-12-01T10:00:00.000Z",
  "is_published": false
}
```

**Update Content Status:**

```json
PUT /content-manager/collection-types/api::social-media-content.social-media-content/1
Content-Type: application/json

{
  "is_published": true,
  "caption": "Promo akhir tahun telah dimulai! Segera hubungi kami..."
}
```

#### Schema Fields

| Field Name       | Type        | Required | Description                                                   |
| ---------------- | ----------- | -------- | ------------------------------------------------------------- |
| `title`          | String      | Yes      | Judul konten                                                  |
| `platform`       | Enumeration | Yes      | Platform sosial media (Instagram, Facebook, TikTok, LinkedIn) |
| `post_type`      | Enumeration | Yes      | Jenis post (Image, Video, Carousel, Reels, Story)             |
| `caption`        | Text        | Yes      | Caption konten                                                |
| `hashtags`       | String      | No       | Hashtag yang digunakan                                        |
| `thumbnail`      | Media       | No       | Thumbnail konten                                              |
| `scheduled_date` | DateTime    | No       | Tanggal jadwal posting                                        |
| `is_published`   | Boolean     | Yes      | Status publikasi                                              |

---

## Authentication & Permissions

### Required Headers

```json
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}
```

### Permission Levels

**Public (Read Only):**

- `find` - Get all records
- `findOne` - Get single record

**Authenticated (Full Access):**

- `create` - Create new record
- `update` - Update existing record
- `delete` - Delete record

## Error Handling

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Title is required"
  }
}
```

**Not Found Error (404):**

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Brochure not found"
  }
}
```

**Unauthorized Error (401):**

```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Unauthorized"
  }
}
```

## Query Parameters

### Pagination

```
?pagination[page]=1&pagination[pageSize]=10
```

### Sorting

```
?sort=createdAt:desc
?sort=title:asc
```

### Filtering

```
?filters[is_active][$eq]=true
?filters[platform][$eq]=Instagram
?filters[video_type][$eq]=Tour Standar
```

### Population (Relations)

```
?populate=project
?populate=project.developer
```

## File Upload Guidelines

### Brochure Files

- **Allowed Types**: PDF only
- **Max Size**: 50MB
- **Field**: `file` (required), `thumbnail` (optional)

### Marketing Video Files

- **Allowed Types**: MP4, MOV, AVI
- **Max Size**: 500MB
- **Field**: `video_file` (optional), `thumbnail` (optional)

### Social Media Content Files

- **Images**: JPG, PNG, GIF
- **Videos**: MP4, MOV
- **Max Image Size**: 10MB
- **Max Video Size**: 100MB
- **Fields**: `content_images` (multiple), `content_video` (single), `thumbnail` (optional)

## Best Practices

1. **File Management**: Always validate file types and sizes before upload
2. **Content Validation**: Ensure content matches post type requirements
3. **Scheduling**: Set realistic scheduled dates for social media content
4. **Status Management**: Use `is_active` and `is_published` fields appropriately
5. **Relations**: Always populate project relations when needed
6. **Error Handling**: Handle file upload errors gracefully

## Testing Examples

### Test Brochure Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::brochure.brochure' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Brochure",
    "project": 1,
    "unit_types": ["Tipe 36", "Tipe 45"],
    "description": "Test brochure for development",
    "is_active": true
  }'
```

### Test Marketing Video Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::marketing-video.marketing-video' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Video Tour",
    "video_type": "Tour Standar",
    "project": 1,
    "unit_type": "Tipe 36",
    "description": "Test video for development",
    "is_active": true
  }'
```

### Test Communication Template Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::communication-template.communication-template' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Email Template",
    "category": "Email",
    "lead_category": "Berminat",
    "subject": "Test Subject {{project_name}}",
    "content": "Test content with {{customer_name}}",
    "is_active": true,
    "usage_count": 0
  }'
```

### Test Social Media Content Creation

```bash
curl -X POST \
  'http://localhost:1337/content-manager/collection-types/api::social-media-content.social-media-content' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Test Social Media Post",
    "platform": "Instagram",
    "post_type": "Image",
    "caption": "Test caption for development #TestHashtag",
    "hashtags": "#TestHashtag #Development",
    "is_published": false
  }'
```

## Content Type Relationships

### Brochure Relations

- **project** (Many-to-One) → Proyek Perumahan
- **unit_types** (JSON Array) → Unit Types

### Marketing Video Relations

- **project** (Many-to-One) → Proyek Perumahan
- **unit_type** (String) → Unit Type

### Communication Template Relations

- **No direct relations** (standalone templates)

### Social Media Content Relations

- **No direct relations** (standalone content)

---

**Note**: Semua operasi CRUD menggunakan Strapi default behavior tanpa lifecycle hooks custom. Pastikan untuk memahami schema requirements dan validasi built-in Strapi untuk menghindari error dan memastikan data konsisten.
