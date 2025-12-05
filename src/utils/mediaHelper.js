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

    console.log('--- cleanupMediaOnDelete DEBUG START ---');
    console.log('Model:', model.uid);
    console.log('Params:', JSON.stringify(params, null, 2));

    if (mediaFields.length === 0) {
        console.log('No media fields found.');
        return;
    }

    // Find the identifier (documentId or numericId)
    const documentId = params.documentId || (params.where && params.where.documentId);
    const numericId = params.where && params.where.id;

    console.log('Derived documentId:', documentId);
    console.log('Derived numericId:', numericId);

    if (!documentId && !numericId) {
         console.log('No ID found for deletion cleanup.');
         return;
    }

    // Fetch entry before deletion to get file data
    let entry;
    if (documentId) {
         entry = await strapi.documents(model.uid).findOne({
            documentId: documentId,
            populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        });
    } else if (numericId) {
        console.log('Using numeric ID to find entry for deletion...');
        try {
            entry = await strapi.entityService.findOne(model.uid, numericId, {
                populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
            });
        } catch (err) {
            console.error('Error fetching entry for deletion:', err);
        }
    }

    console.log('Entry to delete found:', entry ? 'Yes' : 'No');

    if (!entry) return;

    for (const field of mediaFields) {
      const media = entry[field];
      if (!media) continue;

      console.log(`Deleting media for field '${field}'`);

      if (Array.isArray(media)) {
        await Promise.all(media.map((file) => deleteFile(file)));
      } else {
        await deleteFile(media);
      }
    }
    console.log('--- cleanupMediaOnDelete DEBUG END ---');
  },

  async cleanupMediaOnUpdate(event) {
    const { model, params } = event;
    const { data } = params;
    const mediaFields = getMediaFields(model.uid);

    console.log('--- cleanupMediaOnUpdate DEBUG START ---');
    console.log('Model:', model.uid);
    console.log('Params:', JSON.stringify(params, null, 2));
    console.log('Detected Media Fields:', mediaFields);

    if (mediaFields.length === 0) {
        console.log('No media fields found, exiting.');
        return;
    }

    // Find the identifier. In Strapi v5, it might be in params.documentId (documentId) or params.where.id (numeric ID)
    const documentId = params.documentId || (params.where && params.where.documentId);
    const numericId = params.where && params.where.id;

    console.log('Derived documentId:', documentId);
    console.log('Derived numericId:', numericId);

    if (!documentId && !numericId) {
      console.log('No documentId or numericId found in update params, skipping media cleanup');
      return;
    }

    let previousEntry;
    if (documentId) {
        // Fetch previous state using documentId
        previousEntry = await strapi.documents(model.uid).findOne({
            documentId: documentId,
            populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        });
    } else if (numericId) {
        // Fetch previous state using numeric ID via Entity Service (fallback if documents API needs documentId)
        // Or trying documents API with 'where' if supported, but Entity Service is safer for numeric IDs in v5 context if mixed.
        // However, documents API is preferred in v5. Let's try documents API with filters first if possible, or fallback to entity service.
        // Actually, strapi.documents().findOne() expects documentId. 
        // If we only have numeric ID (SQL ID), we might need to use strapi.db.query().findOne() or strapi.entityService.findOne().
        
        console.log('Using numeric ID to find entry...');
        try {
             // Try finding by ID using standard Entity Service (which supports numeric IDs)
             previousEntry = await strapi.entityService.findOne(model.uid, numericId, {
                populate: mediaFields.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
             });
        } catch (err) {
            console.error('Error fetching by numeric ID:', err);
        }
    }

    console.log('Previous Entry Found:', previousEntry ? 'Yes' : 'No');
    if (previousEntry) {
        console.log('Previous Entry Media Data:', JSON.stringify(
            mediaFields.reduce((acc, key) => ({ ...acc, [key]: previousEntry[key] }), {}), 
            null, 2
        ));
    }

    if (!previousEntry) {
       return;
    }

    for (const field of mediaFields) {
      // Only check fields present in the update data
      if (data[field] === undefined) {
          console.log(`Field '${field}' not present in update data, skipping.`);
          continue;
      }

      const oldMedia = previousEntry[field];
      console.log(`Processing field '${field}'...`);
      console.log('Old Media:', JSON.stringify(oldMedia, null, 2));
      console.log('New Data for Field:', JSON.stringify(data[field], null, 2));

      if (!oldMedia) {
          console.log('No old media to delete, skipping.');
          continue;
      }

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
      
      console.log('New IDs to keep:', newIds);

      // if newMediaValue is null/nullish, newIds is empty, meaning all old files should be deleted

      const oldFiles = Array.isArray(oldMedia) ? oldMedia : [oldMedia];

      // Delete files that are in oldFiles but NOT in newIds
      const filesToDelete = oldFiles.filter(file => !newIds.includes(file.id));
      
      console.log('Files to Delete:', filesToDelete.map(f => f.id));

      if (filesToDelete.length > 0) {
        console.log(`Deleting ${filesToDelete.length} files for field ${field}`);
        await Promise.all(filesToDelete.map(file => deleteFile(file)));
      }
    }
    console.log('--- cleanupMediaOnUpdate DEBUG END ---');
  }
};
