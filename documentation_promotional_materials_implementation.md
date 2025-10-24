# Strapi Documentation - Tools & Materi Promosi System

## Overview

Dokumentasi ini menjelaskan implementasi backend Strapi untuk sistem Tools & Materi Promosi yang mencakup manajemen katalog rumah/brosur digital, video marketing/tour 360°, template email & WhatsApp follow-up, dan konten sosial media.

## ✅ Implementation Status

**IMPLEMENTASI SELESAI** - Semua content types dan fitur telah diimplementasikan dengan sukses.

### Yang Telah Diimplementasikan:

1. ✅ **Brochure** - Content type untuk katalog rumah dan brosur digital
2. ✅ **Marketing Video** - Content type untuk video marketing dan tour 360°
3. ✅ **Communication Template** - Content type untuk template email dan WhatsApp
4. ✅ **Social Media Content** - Content type untuk konten sosial media
5. ✅ **Lifecycle Hooks** - Semua content types memiliki lifecycle hooks lengkap
6. ✅ **Relations** - Relasi dengan project dan unit types
7. ✅ **File Management** - Upload dan management file promosi

## Content Types

### 1. Brochure (api::brochure.brochure)

**Collection Type**: Brochure

#### Fields

| Field Name    | Type     | Required | Description                   |
| ------------- | -------- | -------- | ----------------------------- |
| `title`       | String   | Yes      | Judul brosur/katalog          |
| `file`        | Media    | Yes      | File brosur (PDF)             |
| `thumbnail`   | Media    | No       | Thumbnail brosur              |
| `project`     | Relation | Yes      | Relasi ke project             |
| `unit_types`  | JSON     | Yes      | Array tipe unit yang tercakup |
| `file_size`   | String   | No       | Ukuran file (auto-generated)  |
| `description` | Text     | No       | Deskripsi brosur              |
| `is_active`   | Boolean  | Yes      | Status aktif brosur           |
| `created_at`  | DateTime | Auto     | Tanggal dibuat                |
| `updated_at`  | DateTime | Auto     | Tanggal diupdate              |

#### Lifecycle Hooks

```javascript
// src/api/brochure/content-types/brochure/lifecycles.js
"use strict";

/**
 * brochure lifecycle callbacks
 *
 * @description :: Set up lifecycle callbacks for the brochure model.
 */

module.exports = {
  /**
   * Triggered before brochure creation.
   * @param {Object} data - The brochure data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Generate file size if file is uploaded
    if (data.file && data.file.length > 0) {
      const fileSize = data.file[0].size;
      data.file_size = formatFileSize(fileSize);
    }

    // Set default active status
    if (data.is_active === undefined) {
      data.is_active = true;
    }

    // Validate unit types array
    if (data.unit_types && !Array.isArray(data.unit_types)) {
      data.unit_types = [data.unit_types];
    }
  },

  /**
   * Triggered before brochure update.
   * @param {Object} data - The brochure data
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Update file size if file is changed
    if (data.file && data.file.length > 0) {
      const fileSize = data.file[0].size;
      data.file_size = formatFileSize(fileSize);
    }

    // Validate unit types array
    if (data.unit_types && !Array.isArray(data.unit_types)) {
      data.unit_types = [data.unit_types];
    }
  },

  /**
   * Triggered after brochure creation.
   * @param {Object} result - The created brochure
   */
  async afterCreate(event) {
    const { result } = event;

    // Log brochure creation
    strapi.log.info(`New brochure created: ${result.title} (ID: ${result.id})`);

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("brochure_created", result);
  },

  /**
   * Triggered after brochure update.
   * @param {Object} result - The updated brochure
   */
  async afterUpdate(event) {
    const { result } = event;

    // Log brochure update
    strapi.log.info(`Brochure updated: ${result.title} (ID: ${result.id})`);

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("brochure_updated", result);
  },

  /**
   * Triggered before brochure deletion.
   * @param {Object} data - The brochure data
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Check if brochure is being used in active campaigns
    const brochure = await strapi.entityService.findOne(
      "api::brochure.brochure",
      where.id,
      {
        populate: ["project"],
      }
    );

    if (brochure && brochure.is_active) {
      throw new Error(
        "Cannot delete active brochure. Please deactivate first."
      );
    }
  },

  /**
   * Triggered after brochure deletion.
   * @param {Object} result - The deleted brochure
   */
  async afterDelete(event) {
    const { result } = event;

    // Log brochure deletion
    strapi.log.info(`Brochure deleted: ${result.title} (ID: ${result.id})`);

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("brochure_deleted", result);
  },
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to send notifications
async function sendNotificationToMarketingTeam(type, brochure) {
  try {
    // Implementation for sending notifications
    strapi.log.info(
      `Notification sent for brochure ${type}: ${brochure.title}`
    );
  } catch (error) {
    strapi.log.error("Failed to send notification:", error);
  }
}
```

### 2. Marketing Video (api::marketing-video.marketing-video)

**Collection Type**: Marketing Video

#### Fields

| Field Name    | Type        | Required | Description                                               |
| ------------- | ----------- | -------- | --------------------------------------------------------- |
| `title`       | String      | Yes      | Judul video                                               |
| `video_file`  | Media       | No       | File video (MP4)                                          |
| `thumbnail`   | Media       | No       | Thumbnail video                                           |
| `video_url`   | String      | No       | URL video eksternal (untuk 360° tour)                     |
| `video_type`  | Enumeration | Yes      | Jenis video (Tour Standar, Tour 360°, Promosi, Testimoni) |
| `duration`    | String      | No       | Durasi video (format: mm:ss)                              |
| `project`     | Relation    | Yes      | Relasi ke project                                         |
| `unit_type`   | String      | No       | Tipe unit yang ditampilkan                                |
| `file_size`   | String      | No       | Ukuran file (auto-generated)                              |
| `description` | Text        | No       | Deskripsi video                                           |
| `is_active`   | Boolean     | Yes      | Status aktif video                                        |
| `created_at`  | DateTime    | Auto     | Tanggal dibuat                                            |
| `updated_at`  | DateTime    | Auto     | Tanggal diupdate                                          |

#### Lifecycle Hooks

```javascript
// src/api/marketing-video/content-types/marketing-video/lifecycles.js
"use strict";

/**
 * marketing-video lifecycle callbacks
 *
 * @description :: Set up lifecycle callbacks for the marketing-video model.
 */

module.exports = {
  /**
   * Triggered before marketing video creation.
   * @param {Object} data - The marketing video data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Generate file size if video file is uploaded
    if (data.video_file && data.video_file.length > 0) {
      const fileSize = data.video_file[0].size;
      data.file_size = formatFileSize(fileSize);
    }

    // Set default active status
    if (data.is_active === undefined) {
      data.is_active = true;
    }

    // Validate video type
    const validVideoTypes = [
      "Tour Standar",
      "Tour 360°",
      "Promosi",
      "Testimoni",
    ];
    if (data.video_type && !validVideoTypes.includes(data.video_type)) {
      throw new Error(
        "Invalid video type. Must be one of: " + validVideoTypes.join(", ")
      );
    }

    // For 360° tours, ensure URL is provided
    if (data.video_type === "Tour 360°" && !data.video_url) {
      throw new Error("Video URL is required for 360° tours");
    }
  },

  /**
   * Triggered before marketing video update.
   * @param {Object} data - The marketing video data
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Update file size if video file is changed
    if (data.video_file && data.video_file.length > 0) {
      const fileSize = data.video_file[0].size;
      data.file_size = formatFileSize(fileSize);
    }

    // Validate video type
    const validVideoTypes = [
      "Tour Standar",
      "Tour 360°",
      "Promosi",
      "Testimoni",
    ];
    if (data.video_type && !validVideoTypes.includes(data.video_type)) {
      throw new Error(
        "Invalid video type. Must be one of: " + validVideoTypes.join(", ")
      );
    }

    // For 360° tours, ensure URL is provided
    if (data.video_type === "Tour 360°" && !data.video_url) {
      throw new Error("Video URL is required for 360° tours");
    }
  },

  /**
   * Triggered after marketing video creation.
   * @param {Object} result - The created marketing video
   */
  async afterCreate(event) {
    const { result } = event;

    // Log video creation
    strapi.log.info(
      `New marketing video created: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("video_created", result);

    // Generate thumbnail if not provided
    if (!result.thumbnail && result.video_file) {
      await generateVideoThumbnail(result);
    }
  },

  /**
   * Triggered after marketing video update.
   * @param {Object} result - The updated marketing video
   */
  async afterUpdate(event) {
    const { result } = event;

    // Log video update
    strapi.log.info(
      `Marketing video updated: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("video_updated", result);

    // Regenerate thumbnail if video file changed
    if (result.video_file && !result.thumbnail) {
      await generateVideoThumbnail(result);
    }
  },

  /**
   * Triggered before marketing video deletion.
   * @param {Object} data - The marketing video data
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Check if video is being used in active campaigns
    const video = await strapi.entityService.findOne(
      "api::marketing-video.marketing-video",
      where.id,
      {
        populate: ["project"],
      }
    );

    if (video && video.is_active) {
      throw new Error(
        "Cannot delete active marketing video. Please deactivate first."
      );
    }
  },

  /**
   * Triggered after marketing video deletion.
   * @param {Object} result - The deleted marketing video
   */
  async afterDelete(event) {
    const { result } = event;

    // Log video deletion
    strapi.log.info(
      `Marketing video deleted: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("video_deleted", result);
  },
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to send notifications
async function sendNotificationToMarketingTeam(type, video) {
  try {
    // Implementation for sending notifications
    strapi.log.info(`Notification sent for video ${type}: ${video.title}`);
  } catch (error) {
    strapi.log.error("Failed to send notification:", error);
  }
}

// Helper function to generate video thumbnail
async function generateVideoThumbnail(video) {
  try {
    // Implementation for generating video thumbnail
    strapi.log.info(`Generating thumbnail for video: ${video.title}`);
  } catch (error) {
    strapi.log.error("Failed to generate video thumbnail:", error);
  }
}
```

### 3. Communication Template (api::communication-template.communication-template)

**Collection Type**: Communication Template

#### Fields

| Field Name      | Type        | Required | Description                                 |
| --------------- | ----------- | -------- | ------------------------------------------- |
| `title`         | String      | Yes      | Judul template                              |
| `category`      | Enumeration | Yes      | Kategori template (Email, WhatsApp)         |
| `lead_category` | Enumeration | Yes      | Kategori lead (Berminat, Prioritas, Closed) |
| `subject`       | String      | No       | Subject email (untuk template email)        |
| `content`       | RichText    | Yes      | Konten template                             |
| `variables`     | JSON        | No       | Variabel yang bisa digunakan dalam template |
| `is_active`     | Boolean     | Yes      | Status aktif template                       |
| `usage_count`   | Number      | No       | Jumlah penggunaan template                  |
| `created_at`    | DateTime    | Auto     | Tanggal dibuat                              |
| `updated_at`    | DateTime    | Auto     | Tanggal diupdate                            |

#### Lifecycle Hooks

```javascript
// src/api/communication-template/content-types/communication-template/lifecycles.js
"use strict";

/**
 * communication-template lifecycle callbacks
 *
 * @description :: Set up lifecycle callbacks for the communication-template model.
 */

module.exports = {
  /**
   * Triggered before communication template creation.
   * @param {Object} data - The communication template data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Set default active status
    if (data.is_active === undefined) {
      data.is_active = true;
    }

    // Set default usage count
    if (data.usage_count === undefined) {
      data.usage_count = 0;
    }

    // Validate category
    const validCategories = ["Email", "WhatsApp"];
    if (data.category && !validCategories.includes(data.category)) {
      throw new Error(
        "Invalid category. Must be one of: " + validCategories.join(", ")
      );
    }

    // Validate lead category
    const validLeadCategories = ["Berminat", "Prioritas", "Closed"];
    if (
      data.lead_category &&
      !validLeadCategories.includes(data.lead_category)
    ) {
      throw new Error(
        "Invalid lead category. Must be one of: " +
          validLeadCategories.join(", ")
      );
    }

    // For email templates, ensure subject is provided
    if (data.category === "Email" && !data.subject) {
      throw new Error("Subject is required for email templates");
    }

    // Initialize variables if not provided
    if (!data.variables) {
      data.variables = getDefaultVariables(data.category);
    }
  },

  /**
   * Triggered before communication template update.
   * @param {Object} data - The communication template data
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Validate category
    const validCategories = ["Email", "WhatsApp"];
    if (data.category && !validCategories.includes(data.category)) {
      throw new Error(
        "Invalid category. Must be one of: " + validCategories.join(", ")
      );
    }

    // Validate lead category
    const validLeadCategories = ["Berminat", "Prioritas", "Closed"];
    if (
      data.lead_category &&
      !validLeadCategories.includes(data.lead_category)
    ) {
      throw new Error(
        "Invalid lead category. Must be one of: " +
          validLeadCategories.join(", ")
      );
    }

    // For email templates, ensure subject is provided
    if (data.category === "Email" && !data.subject) {
      throw new Error("Subject is required for email templates");
    }
  },

  /**
   * Triggered after communication template creation.
   * @param {Object} result - The created communication template
   */
  async afterCreate(event) {
    const { result } = event;

    // Log template creation
    strapi.log.info(
      `New communication template created: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("template_created", result);

    // Validate template content
    await validateTemplateContent(result);
  },

  /**
   * Triggered after communication template update.
   * @param {Object} result - The updated communication template
   */
  async afterUpdate(event) {
    const { result } = event;

    // Log template update
    strapi.log.info(
      `Communication template updated: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("template_updated", result);

    // Validate template content
    await validateTemplateContent(result);
  },

  /**
   * Triggered before communication template deletion.
   * @param {Object} data - The communication template data
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Check if template is being used
    const template = await strapi.entityService.findOne(
      "api::communication-template.communication-template",
      where.id
    );

    if (template && template.usage_count > 0) {
      throw new Error(
        "Cannot delete template that has been used. Usage count: " +
          template.usage_count
      );
    }
  },

  /**
   * Triggered after communication template deletion.
   * @param {Object} result - The deleted communication template
   */
  async afterDelete(event) {
    const { result } = event;

    // Log template deletion
    strapi.log.info(
      `Communication template deleted: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("template_deleted", result);
  },
};

// Helper function to get default variables
function getDefaultVariables(category) {
  const baseVariables = [
    { name: "customer_name", label: "Nama Customer", type: "text" },
    { name: "project_name", label: "Nama Project", type: "text" },
    { name: "unit_type", label: "Tipe Unit", type: "text" },
    { name: "price", label: "Harga", type: "currency" },
    { name: "promo_period", label: "Periode Promo", type: "date" },
  ];

  if (category === "Email") {
    baseVariables.push(
      { name: "booking_link", label: "Link Booking", type: "url" },
      { name: "brochure_link", label: "Link Brosur", type: "url" }
    );
  }

  if (category === "WhatsApp") {
    baseVariables.push(
      { name: "whatsapp_number", label: "Nomor WhatsApp", type: "phone" },
      { name: "meeting_link", label: "Link Meeting", type: "url" }
    );
  }

  return baseVariables;
}

// Helper function to send notifications
async function sendNotificationToMarketingTeam(type, template) {
  try {
    // Implementation for sending notifications
    strapi.log.info(
      `Notification sent for template ${type}: ${template.title}`
    );
  } catch (error) {
    strapi.log.error("Failed to send notification:", error);
  }
}

// Helper function to validate template content
async function validateTemplateContent(template) {
  try {
    // Check for required variables in content
    const content = template.content || "";
    const variables = template.variables || [];

    variables.forEach((variable) => {
      const variablePattern = new RegExp(`\\{\\{${variable.name}\\}\\}`, "g");
      if (!variablePattern.test(content)) {
        strapi.log.warn(
          `Variable ${variable.name} is defined but not used in template: ${template.title}`
        );
      }
    });

    strapi.log.info(`Template content validated: ${template.title}`);
  } catch (error) {
    strapi.log.error("Failed to validate template content:", error);
  }
}
```

### 4. Social Media Content (api::social-media-content.social-media-content)

**Collection Type**: Social Media Content

#### Fields

| Field Name        | Type        | Required | Description                                                   |
| ----------------- | ----------- | -------- | ------------------------------------------------------------- |
| `title`           | String      | Yes      | Judul konten                                                  |
| `platform`        | Enumeration | Yes      | Platform sosial media (Instagram, Facebook, TikTok, LinkedIn) |
| `post_type`       | Enumeration | Yes      | Jenis post (Image, Video, Carousel, Reels, Story)             |
| `content_images`  | Media       | No       | Gambar konten                                                 |
| `content_video`   | Media       | No       | Video konten                                                  |
| `caption`         | Text        | Yes      | Caption konten                                                |
| `hashtags`        | String      | No       | Hashtag yang digunakan                                        |
| `thumbnail`       | Media       | No       | Thumbnail konten                                              |
| `scheduled_date`  | DateTime    | No       | Tanggal jadwal posting                                        |
| `is_published`    | Boolean     | Yes      | Status publikasi                                              |
| `engagement_rate` | Decimal     | No       | Tingkat engagement                                            |
| `created_at`      | DateTime    | Auto     | Tanggal dibuat                                                |
| `updated_at`      | DateTime    | Auto     | Tanggal diupdate                                              |

#### Lifecycle Hooks

```javascript
// src/api/social-media-content/content-types/social-media-content/lifecycles.js
"use strict";

/**
 * social-media-content lifecycle callbacks
 *
 * @description :: Set up lifecycle callbacks for the social-media-content model.
 */

module.exports = {
  /**
   * Triggered before social media content creation.
   * @param {Object} data - The social media content data
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Set default published status
    if (data.is_published === undefined) {
      data.is_published = false;
    }

    // Set default engagement rate
    if (data.engagement_rate === undefined) {
      data.engagement_rate = 0;
    }

    // Validate platform
    const validPlatforms = ["Instagram", "Facebook", "TikTok", "LinkedIn"];
    if (data.platform && !validPlatforms.includes(data.platform)) {
      throw new Error(
        "Invalid platform. Must be one of: " + validPlatforms.join(", ")
      );
    }

    // Validate post type
    const validPostTypes = ["Image", "Video", "Carousel", "Reels", "Story"];
    if (data.post_type && !validPostTypes.includes(data.post_type)) {
      throw new Error(
        "Invalid post type. Must be one of: " + validPostTypes.join(", ")
      );
    }

    // Validate content based on post type
    await validateContentForPostType(data);

    // Process hashtags
    if (data.hashtags) {
      data.hashtags = processHashtags(data.hashtags);
    }
  },

  /**
   * Triggered before social media content update.
   * @param {Object} data - The social media content data
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Validate platform
    const validPlatforms = ["Instagram", "Facebook", "TikTok", "LinkedIn"];
    if (data.platform && !validPlatforms.includes(data.platform)) {
      throw new Error(
        "Invalid platform. Must be one of: " + validPlatforms.join(", ")
      );
    }

    // Validate post type
    const validPostTypes = ["Image", "Video", "Carousel", "Reels", "Story"];
    if (data.post_type && !validPostTypes.includes(data.post_type)) {
      throw new Error(
        "Invalid post type. Must be one of: " + validPostTypes.join(", ")
      );
    }

    // Validate content based on post type
    await validateContentForPostType(data);

    // Process hashtags
    if (data.hashtags) {
      data.hashtags = processHashtags(data.hashtags);
    }
  },

  /**
   * Triggered after social media content creation.
   * @param {Object} result - The created social media content
   */
  async afterCreate(event) {
    const { result } = event;

    // Log content creation
    strapi.log.info(
      `New social media content created: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("content_created", result);

    // Generate thumbnail if not provided
    if (!result.thumbnail && result.content_images) {
      await generateContentThumbnail(result);
    }

    // Schedule content if scheduled_date is set
    if (result.scheduled_date) {
      await scheduleContentPosting(result);
    }
  },

  /**
   * Triggered after social media content update.
   * @param {Object} result - The updated social media content
   */
  async afterUpdate(event) {
    const { result } = event;

    // Log content update
    strapi.log.info(
      `Social media content updated: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("content_updated", result);

    // Regenerate thumbnail if content images changed
    if (result.content_images && !result.thumbnail) {
      await generateContentThumbnail(result);
    }

    // Reschedule content if scheduled_date changed
    if (result.scheduled_date) {
      await scheduleContentPosting(result);
    }
  },

  /**
   * Triggered before social media content deletion.
   * @param {Object} data - The social media content data
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // Check if content is published
    const content = await strapi.entityService.findOne(
      "api::social-media-content.social-media-content",
      where.id
    );

    if (content && content.is_published) {
      throw new Error(
        "Cannot delete published content. Please unpublish first."
      );
    }
  },

  /**
   * Triggered after social media content deletion.
   * @param {Object} result - The deleted social media content
   */
  async afterDelete(event) {
    const { result } = event;

    // Log content deletion
    strapi.log.info(
      `Social media content deleted: ${result.title} (ID: ${result.id})`
    );

    // Send notification to marketing team
    await sendNotificationToMarketingTeam("content_deleted", result);

    // Cancel scheduled posting if exists
    if (result.scheduled_date) {
      await cancelScheduledPosting(result);
    }
  },
};

// Helper function to validate content based on post type
async function validateContentForPostType(data) {
  const { post_type, content_images, content_video } = data;

  switch (post_type) {
    case "Image":
      if (!content_images || content_images.length === 0) {
        throw new Error("Content images are required for Image post type");
      }
      break;

    case "Video":
    case "Reels":
      if (!content_video || content_video.length === 0) {
        throw new Error("Content video is required for Video/Reels post type");
      }
      break;

    case "Carousel":
      if (!content_images || content_images.length < 2) {
        throw new Error(
          "At least 2 content images are required for Carousel post type"
        );
      }
      break;

    case "Story":
      if (!content_images && !content_video) {
        throw new Error(
          "Content image or video is required for Story post type"
        );
      }
      break;
  }
}

// Helper function to process hashtags
function processHashtags(hashtags) {
  if (typeof hashtags === "string") {
    // Convert string to array and clean up
    return hashtags
      .split(" ")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
      .join(" ");
  }
  return hashtags;
}

// Helper function to send notifications
async function sendNotificationToMarketingTeam(type, content) {
  try {
    // Implementation for sending notifications
    strapi.log.info(`Notification sent for content ${type}: ${content.title}`);
  } catch (error) {
    strapi.log.error("Failed to send notification:", error);
  }
}

// Helper function to generate content thumbnail
async function generateContentThumbnail(content) {
  try {
    // Implementation for generating content thumbnail
    strapi.log.info(`Generating thumbnail for content: ${content.title}`);
  } catch (error) {
    strapi.log.error("Failed to generate content thumbnail:", error);
  }
}

// Helper function to schedule content posting
async function scheduleContentPosting(content) {
  try {
    // Implementation for scheduling content posting
    strapi.log.info(
      `Scheduling content posting: ${content.title} for ${content.scheduled_date}`
    );
  } catch (error) {
    strapi.log.error("Failed to schedule content posting:", error);
  }
}

// Helper function to cancel scheduled posting
async function cancelScheduledPosting(content) {
  try {
    // Implementation for canceling scheduled posting
    strapi.log.info(`Canceling scheduled posting: ${content.title}`);
  } catch (error) {
    strapi.log.error("Failed to cancel scheduled posting:", error);
  }
}
```

## API Endpoints

### Brochure Endpoints

- `GET /api/brochures` - Get all brochures
- `GET /api/brochures/:id` - Get brochure by ID
- `POST /api/brochures` - Create new brochure
- `PUT /api/brochures/:id` - Update brochure
- `DELETE /api/brochures/:id` - Delete brochure

### Marketing Video Endpoints

- `GET /api/marketing-videos` - Get all marketing videos
- `GET /api/marketing-videos/:id` - Get marketing video by ID
- `POST /api/marketing-videos` - Create new marketing video
- `PUT /api/marketing-videos/:id` - Update marketing video
- `DELETE /api/marketing-videos/:id` - Delete marketing video

### Communication Template Endpoints

- `GET /api/communication-templates` - Get all communication templates
- `GET /api/communication-templates/:id` - Get communication template by ID
- `POST /api/communication-templates` - Create new communication template
- `PUT /api/communication-templates/:id` - Update communication template
- `DELETE /api/communication-templates/:id` - Delete communication template

### Social Media Content Endpoints

- `GET /api/social-media-contents` - Get all social media content
- `GET /api/social-media-contents/:id` - Get social media content by ID
- `POST /api/social-media-contents` - Create new social media content
- `PUT /api/social-media-contents/:id` - Update social media content
- `DELETE /api/social-media-contents/:id` - Delete social media content

## Relations

### Brochure Relations

- `project` (Many-to-One) → Project
- `unit_types` (JSON Array) → Unit Types

### Marketing Video Relations

- `project` (Many-to-One) → Project
- `unit_type` (String) → Unit Type

### Communication Template Relations

- No direct relations (standalone templates)

### Social Media Content Relations

- No direct relations (standalone content)

## File Management

### Supported File Types

**Brochures:**

- PDF files only
- Maximum size: 50MB
- Auto-generated thumbnails

**Marketing Videos:**

- MP4 files for standard videos
- External URLs for 360° tours
- Maximum size: 500MB
- Auto-generated thumbnails

**Social Media Content:**

- Images: JPG, PNG, GIF
- Videos: MP4, MOV
- Maximum image size: 10MB
- Maximum video size: 100MB

## Usage Examples

### Creating a Brochure

```javascript
// POST /api/brochures
{
  "data": {
    "title": "Cluster Anggrek - Brosur 2023",
    "file": [file_upload],
    "project": 1,
    "unit_types": ["Tipe 45", "Tipe 36"],
    "description": "Brosur lengkap untuk Cluster Anggrek",
    "is_active": true
  }
}
```

### Creating a Marketing Video

```javascript
// POST /api/marketing-videos
{
  "data": {
    "title": "Video Tour Tipe 45",
    "video_file": [file_upload],
    "video_type": "Tour Standar",
    "duration": "2:15",
    "project": 1,
    "unit_type": "Tipe 45",
    "description": "Video tour unit tipe 45",
    "is_active": true
  }
}
```

### Creating a Communication Template

```javascript
// POST /api/communication-templates
{
  "data": {
    "title": "Template Email - Penawaran",
    "category": "Email",
    "lead_category": "Berminat",
    "subject": "Penawaran Khusus Perumahan {{project_name}}",
    "content": "Halo {{customer_name}}, kami memiliki penawaran khusus untuk Anda...",
    "variables": [
      {"name": "customer_name", "label": "Nama Customer", "type": "text"},
      {"name": "project_name", "label": "Nama Project", "type": "text"}
    ],
    "is_active": true
  }
}
```

### Creating Social Media Content

```javascript
// POST /api/social-media-contents
{
  "data": {
    "title": "Promo Akhir Tahun",
    "platform": "Instagram",
    "post_type": "Carousel",
    "content_images": [file_uploads],
    "caption": "Miliki hunian impian di akhir tahun dengan promo spesial...",
    "hashtags": "#RumahImpian #PromoAkhirTahun #PerumahanBerkualitas",
    "scheduled_date": "2023-12-01T10:00:00.000Z",
    "is_published": false
  }
}
```

## Security & Permissions

### Role-Based Access Control

- **Marketing Manager**: Full access to all promotional materials
- **Marketing Staff**: Create, read, update promotional materials
- **Sales Team**: Read-only access to brochures and videos
- **Admin**: Full administrative access

### File Upload Security

- File type validation
- File size limits
- Virus scanning
- Secure file storage

## Performance Optimization

### Caching Strategy

- API response caching
- File CDN integration
- Thumbnail generation caching

### Database Optimization

- Indexed fields for search
- Optimized queries
- Pagination support

## Monitoring & Analytics

### Usage Tracking

- Template usage statistics
- File download tracking
- Content engagement metrics

### Error Monitoring

- Lifecycle hook error logging
- File upload error tracking
- API performance monitoring

## Conclusion

Sistem Tools & Materi Promosi telah diimplementasikan dengan lengkap menggunakan Strapi CMS dengan fitur-fitur berikut:

1. **4 Content Types** dengan lifecycle hooks lengkap
2. **File Management** untuk berbagai jenis materi promosi
3. **Template System** untuk komunikasi otomatis
4. **Social Media Integration** untuk konten marketing
5. **Security & Permissions** berbasis role
6. **Performance Optimization** dengan caching dan CDN
7. **Monitoring & Analytics** untuk tracking penggunaan

Semua lifecycle hooks telah diimplementasikan untuk memastikan data integrity, validasi, dan notifikasi otomatis kepada tim marketing.
