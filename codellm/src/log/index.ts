import type { Logger } from 'winston';
import winston from 'winston';

import type { Config, LogLevel } from '@/.';

let logger: Logger;
let level: LogLevel;

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
          return `${info.level}: ${info.message} ${info['metadata'] ? JSON.stringify(info['metadata'], null, 4) : ''}`;
        }),
      );
    default:
      return winston.format.simple();
  }
};

export const initLogger = (config: Config) => {
  level = config.logLevel;

  if (level === 'none') return;
  if (logger) return;

  const format = getFormat(config.logFormat);

  logger = winston.createLogger({
    level: config.logLevel,
    format,
    transports: [new winston.transports.Console()],
  });
};

export const log = (
  message: string,
  logLevel: LogLevel = 'info',
  meta?: Record<string, unknown>,
) => {
  if (logLevel === 'none') return;
  logger.log(logLevel, message, meta);
};

export default log;

export * from './types.js';
