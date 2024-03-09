export const LOG_ERRORS = {
  'log:init': {
    message: 'Log initialization error',
  },
} as const;

export const LOG_FORMATS_TYPE = {
  cli: 'cli',
  json: 'json',
} as const;

export const LOG_LEVELS_TYPE = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  none: 'none',
  silly: 'silly',
  verbose: 'verbose',
  warn: 'warn',
} as const;
