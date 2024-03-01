import type { LOG_FORMATS_TYPE, LOG_LEVELS_TYPE } from './constants';

export type LogLevel = (typeof LOG_LEVELS_TYPE)[keyof typeof LOG_LEVELS_TYPE];

export type LogFormat =
  (typeof LOG_FORMATS_TYPE)[keyof typeof LOG_FORMATS_TYPE];
