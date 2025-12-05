// Helper to get all media field names from a model
const getMediaFields = (uid) => {
  const model = strapi.contentTypes[uid];
  if (!model) return [];
  return Object.keys(model.attributes).filter(
    (key) => model.attributes[key].type === 'media'
  );
};

// Helper to delete a specific file
const deleteFile = async (file) => {
  if (!file || !file.id) return;
  try {
    await strapi.plugin('upload').service('upload').remove(file);
  } catch (err) {
    console.error(`Failed to delete file ${file.id}:`, err);
  }
};

module.exports = {
  async cleanupMediaOnDelete(event) {
    const { model, params } = event;
    const mediaFields = getMediaFields(model.uid);

    if (mediaFields.length === 0) return;

    // Find the identifier (documentId or numericId)
    const documentId = params.documentId || (params.where && params.where.documentId);
    const numericId = params.where && params.where.id;

    if (!documentId && !numericId) return;

    // Fetch entry before deletion to get file data
    let entry;
    if (documentId) {
         entry = await strapi.documents(model.uid).findOne({
            documentId: documentId,
            populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        });
    } else if (numericId) {
        try {
            entry = await strapi.entityService.findOne(model.uid, numericId, {
                populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
            });
        } catch (err) {
            console.error('Error fetching entry for deletion:', err);
        }
    }

    if (!entry) return;

    for (const field of mediaFields) {
      const media = entry[field];
      if (!media) continue;

      if (Array.isArray(media)) {
        await Promise.all(media.map((file) => deleteFile(file)));
      } else {
        await deleteFile(media);
      }
    }
  },

  async cleanupMediaOnUpdate(event) {
    const { model, params } = event;
    const { data } = params;
    const mediaFields = getMediaFields(model.uid);

    if (mediaFields.length === 0) return;

    // Find the identifier. In Strapi v5, it might be in params.documentId (documentId) or params.where.id (numeric ID)
    const documentId = params.documentId || (params.where && params.where.documentId);
    const numericId = params.where && params.where.id;

    if (!documentId && !numericId) return;

    let previousEntry;
    if (documentId) {
        // Fetch previous state using documentId
        previousEntry = await strapi.documents(model.uid).findOne({
            documentId: documentId,
            populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        });
    } else if (numericId) {
        // Fetch previous state using numeric ID via Entity Service
        try {
             previousEntry = await strapi.entityService.findOne(model.uid, numericId, {
                populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
             });
        } catch (err) {
            console.error('Error fetching by numeric ID:', err);
        }
    }

    if (!previousEntry) return;

    for (const field of mediaFields) {
      // Only check fields present in the update data
      if (data[field] === undefined) continue;

      const oldMedia = previousEntry[field];
      if (!oldMedia) continue;

      // Normalize new data to array of IDs
      const newMediaValue = data[field];
      let newIds = [];
      
      if (Array.isArray(newMediaValue)) {
        newIds = newMediaValue.map(item => {
             if (typeof item === 'object' && item !== null && item.id) return item.id;
             return item; // assume it's an ID if it's not an object
        }).filter(Boolean);
      } else if (newMediaValue) {
         if (typeof newMediaValue === 'object' && newMediaValue !== null && newMediaValue.id) {
             newIds = [newMediaValue.id];
         } else {
             newIds = [newMediaValue]; // assume it's an ID
         }
      }
      
      // if newMediaValue is null/nullish, newIds is empty, meaning all old files should be deleted

      const oldFiles = Array.isArray(oldMedia) ? oldMedia : [oldMedia];

      // Delete files that are in oldFiles but NOT in newIds
      const filesToDelete = oldFiles.filter(file => !newIds.includes(file.id));
      
      if (filesToDelete.length > 0) {
        await Promise.all(filesToDelete.map(file => deleteFile(file)));
      }
    }
  }
};
