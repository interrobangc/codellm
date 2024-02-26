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

export type ConfigCommon = {
  include: string[];
  exclude: string[];
  llmProvider: Provider;
  logFormat: LogFormat;
  logLevel: LogLevel;
  path: string;
  vectorDb: VectorDb;
};

export type Config = ConfigCommon & {
  llms: Record<Service, ProviderItem>;
  providers: Record<Provider, ProviderConfig>;
};

export type PartialConfig = Partial<ConfigCommon> & {
  llms?: Partial<Record<Service, ProviderItem>>;
  providers?: Partial<Record<Provider, ProviderConfig>>;
};
