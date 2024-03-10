import type { Logger } from 'winston';
import type { Config, LogLevel } from '@/.';
import winston from 'winston';
import isEmpty from 'lodash/isEmpty.js';

import { isError, mayFail } from '@/error/index.js';

let logger: Logger;
let level: LogLevel;

/**
 * Get the format for the winston logger
 *
 * @param format - The format to use
 *
 * @returns - The winston format
 */
export const getFormat = (format: string) => {
  switch (format) {
    case 'json':
      return winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      );
    case 'cli':
      return winston.format.combine(
        winston.format.metadata(),
        winston.format.colorize(),
        winston.format.printf(function (info) {
          return `${info.level}: ${info.message} ${isEmpty(info['metadata']) ? '' : JSON.stringify(info['metadata'], null, 4)}`;
        }),
      );
    default:
      return winston.format.simple();
  }
};

/**
 * Initialize the winston logger
 *
 * @param config - The configuration to use
 */
export const initLogger = (config: Config) => {
  level = config.logLevel;

  if (level === 'none') return;
  if (logger) return;

  const format = getFormat(config.logFormat);

  const newLogger = mayFail(
    () =>
      winston.createLogger({
        format,
        level: config.logLevel,
        transports: [new winston.transports.Console()],
      }),
    'log:init',
  );
  if (isError(newLogger)) throw newLogger;
  logger = newLogger;

  return logger;
};

/**
 * Log a message using the winston logger based on the log level
 *
 * @param message - The message to log
 * @param logLevel - The log level to use
 * @param meta - Additional metadata to log
 */
export const log = (
  message: string,
  logLevel: LogLevel = 'info',
  meta?: Record<string, unknown>,
) => {
  if (logLevel === 'none') return;
  if (!logger) {
    // eslint-disable-next-line no-console
    console.error('Logger not initialized');
    return;
  }
  logger.log(logLevel, message, meta);
};

export default log;

export * from './constants.js';
export * from './types.js';
