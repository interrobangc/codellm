import type { Provider, ProviderConfig, ProviderItem } from '../llm/types';
import type { LogFormat, LogLevel } from '../log/types';
import type { VectorDb } from '../vectorDb/types';

const SERVICES = {
  agent: 'agent',
  embedding: 'embedding',
  summarize: 'summarize',
} as const;

export const services = Object.keys(SERVICES) as Service[];

export type Service = (typeof SERVICES)[keyof typeof SERVICES];

export type Config = {
  include: string[];
  exclude: string[];
  llms: Record<Service, ProviderItem>;
  logFormat: LogFormat;
  logLevel: LogLevel;
  path: string;
  providers: Record<Provider, ProviderConfig>;
  vectorDb: VectorDb;
};
