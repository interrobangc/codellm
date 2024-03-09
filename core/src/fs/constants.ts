export const FS_ERRORS = {
  'fs:invalidPath': {
    message: 'The file path is not within the project paths',
  },
  'fs:mkdirError': {
    message: 'Error creating directory',
  },
  'fs:readFileError': {
    message: 'Error reading file',
  },
  'fs:statError': {
    message: 'Error getting file status',
  },
  'fs:writeFileError': {
    message: 'Error writing file',
  },
} as const;
