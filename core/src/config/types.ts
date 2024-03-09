import type { REQUIRED_PATHS } from './constants';
import type {
  LogFormat,
  LogLevel,
  Provider,
  ProviderConfigs,
  ProviderServiceItem,
  ToolConfigs,
  VectorDbConfigs,
} from '@/.';

import { z } from 'zod';
import { SERVICES_TYPE } from './constants.js';
import { getEnumConstValues } from '@/type/index.js';

export const serviceSchema = z.enum(getEnumConstValues(SERVICES_TYPE));
export type Service = z.infer<typeof serviceSchema>;

export type ConfigRequiredPaths = (typeof REQUIRED_PATHS)[number];

export type ConfigPaths = Record<ConfigRequiredPaths, string>;

export type ConfigProject = {
  name: string;
};

export type ConfigCommon = {
  cacheDir: string;
  formatInUserMessage: boolean;
  llmProvider: Provider;
  logFormat: LogFormat;
  logLevel: LogLevel;
  paths: ConfigPaths;
  project: ConfigProject;
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
