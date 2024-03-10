import { PROCESS_FILES_ERRORS } from './processFiles/constants.js';
import { VECTORIZE_FILES_ERRORS } from './vectorizeFiles/constants.js';

export const TOOL_UTILS_ERRORS = {
  ...PROCESS_FILES_ERRORS,
  ...VECTORIZE_FILES_ERRORS,
} as const;
