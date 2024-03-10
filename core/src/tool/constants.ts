import { TOOL_UTILS_ERRORS } from './utils/constants.js';

export const TOOL_ERRORS = {
  'tool:import': {
    message: 'Error importing tool',
  },
  'tool:init': {
    message: 'Error initializing tool',
  },
  'tool:invalidTool': {
    message: 'Invalid tool instance',
  },
  'tool:invalidToolModule': {
    message: 'Invalid tool module',
  },
  'tool:notFound': {
    message: 'Tool not found',
  },
  ...TOOL_UTILS_ERRORS,
} as const;
