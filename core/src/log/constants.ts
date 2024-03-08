import type { ErrorConsts } from '@/.';

export const LOG_ERRORS: ErrorConsts = {
  'log:initError': {
    message: 'Log initialization error',
  },
} as const;

export const LOG_FORMATS_TYPE = {
  json: 'json',
  cli: 'cli',
} as const;

export const LOG_LEVELS_TYPE = {
  none: 'none',
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly',
} as const;
