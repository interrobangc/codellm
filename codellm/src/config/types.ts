export const PROVIDERS = {
  ollama: 'ollama',
  openai: 'openai',
} as const;

export type CodeLlmProvider = (typeof PROVIDERS)[keyof typeof PROVIDERS];

export type CodeLlmProviderItem = {
  provider: CodeLlmProvider;
  model: string;
};

const SERVICES = {
  embedding: 'embedding',
  summarization: 'summarization',
  agent: 'agent',
} as const;

export const services = Object.keys(SERVICES) as CodeLlmService[];

export type CodeLlmService = (typeof SERVICES)[keyof typeof SERVICES];

const DEBUG_LEVELS = {
  none: 'none',
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
} as const;

export type CodeLlmDebugLevel =
  (typeof DEBUG_LEVELS)[keyof typeof DEBUG_LEVELS];

export type CodeLlmConfig = {
  debugLevel: CodeLlmDebugLevel;
  llms: Record<CodeLlmService, CodeLlmProviderItem>;
};
