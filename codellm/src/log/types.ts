const LOG_LEVELS = {
  none: 'none',
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly',
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

const LOG_FORMATS = {
  json: 'json',
  cli: 'cli',
} as const;

export type LogFormat = (typeof LOG_FORMATS)[keyof typeof LOG_FORMATS];
