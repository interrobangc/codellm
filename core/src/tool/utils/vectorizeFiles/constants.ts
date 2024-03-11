export const VECTORIZE_FILES_ERRORS = {
  'vectorizeFiles:addDocuments': {
    message: 'Error adding documents to the database',
  },
  'vectorizeFiles:trackingCacheMkDir': {
    message: 'Error creating tracking cache directory',
  },
  'vectorizeFiles:trackingCacheParse': {
    message: 'Error parsing tracking cache',
  },
  'vectorizeFiles:updateTrackingCache': {
    message: 'Error updating tracking cache',
  },
} as const;
