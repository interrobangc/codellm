import type { SERVICES_TYPE } from './constants.js';

import type {
  LogFormat,
  LogLevel,
  Provider,
  ProviderConfigs,
  ProviderServiceItem,
  ToolConfigs,
  VectorDbConfigs,
} from '@/.';

export type Service = (typeof SERVICES_TYPE)[keyof typeof SERVICES_TYPE];

export type ConfigCommon = {
  llmProvider: Provider;
  logFormat: LogFormat;
  logLevel: LogLevel;
  path: string;
  tools?: ToolConfigs;
};

export type Config = ConfigCommon & {
  llms: Record<Service, ProviderServiceItem>;
  providers: ProviderConfigs;
  vectorDbs: VectorDbConfigs;
};

export type PartialConfig = Partial<ConfigCommon> & {
  llms?: Partial<Record<Service, ProviderServiceItem>>;
  providers?: ProviderConfigs;
  vectorDbs?: VectorDbConfigs;
};
