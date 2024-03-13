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

export const serviceSchema = z.string();
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
  llms: Record<Service, ProviderServiceItem>;
  logFormat: LogFormat;
  logLevel: LogLevel;
  paths: ConfigPaths;
  project: ConfigProject;
  providers: ProviderConfigs;
  shouldImportAsync: boolean;
  shouldThrow: boolean;
  tools?: ToolConfigs;
};

export type Config = ConfigCommon & {
  vectorDbs: VectorDbConfigs;
};

export type PartialConfig = Partial<ConfigCommon> & {
  vectorDbs?: VectorDbConfigs;
};
