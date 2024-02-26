import type { SERVICES_TYPE } from './constants.js';

import type {
  LogFormat,
  LogLevel,
  Provider,
  ProviderConfig,
  ProviderItem,
  VectorDb,
} from '@/.';

export type Service = (typeof SERVICES_TYPE)[keyof typeof SERVICES_TYPE];

export type Config = {
  include: string[];
  exclude: string[];
  llms: Record<Service, ProviderItem>;
  llmProvider: Provider;
  logFormat: LogFormat;
  logLevel: LogLevel;
  path: string;
  providers: Record<Provider, ProviderConfig>;
  vectorDb: VectorDb;
};
