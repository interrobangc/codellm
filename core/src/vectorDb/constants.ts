export const VECTOR_DB_ERRORS = {
  'vectorDb:configNotFound': {
    message: 'VectorDb config not found',
  },
  'vectorDb:importError': {
    message: 'VectorDb import error',
  },
  'vectorDb:invalidModule': {
    message: 'VectorDb module does not appear to be a valid VectorDb module',
  },
  'vectorDb:notFound': {
    message: 'VectorDb not found',
  },
} as const;
