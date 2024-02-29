import type { SERVICES_TYPE } from './constants.js';

import type {
  LogFormat,
  LogLevel,
  Provider,
  ProviderConfigs,
  ProviderServiceItem,
  ToolConfigItem,
  VectorDb,
} from '@/.';

export type Service = (typeof SERVICES_TYPE)[keyof typeof SERVICES_TYPE];

export type ConfigCommon = {
  llmProvider: Provider;
  logFormat: LogFormat;
  logLevel: LogLevel;
  path: string;
  vectorDb: VectorDb;
  tools?: ToolConfigItem[];
};

export type Config = ConfigCommon & {
  llms: Record<Service, ProviderServiceItem>;
  providers: ProviderConfigs;
};

export type PartialConfig = Partial<ConfigCommon> & {
  llms?: Partial<Record<Service, ProviderServiceItem>>;
  providers?: ProviderConfigs;
};
