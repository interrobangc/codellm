import type {
  LogFormat,
  LogLevel,
  Provider,
  ProviderConfig,
  ProviderItem,
  VectorDb,
} from '@/.';

const SERVICES = {
  agent: 'agent',
  embedding: 'embedding',
  summarize: 'summarize',
  tool: 'tool',
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
