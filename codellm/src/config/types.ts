export const PROVIDERS = {
  ollama: 'ollama',
  openai: 'openai',
} as const

export type CodeLlmProviders = keyof typeof PROVIDERS

export type CodeLlmProviderItem = {
  provider: CodeLlmProviders
  model: string
}

const SERVICES = {
  embedding: 'embedding',
  toolSelection: 'toolSelection',
  agent: 'agent',
} as const

export type CodeLlmServices = keyof typeof SERVICES

const DEBUG_LEVELS = {
  none: 'none',
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
} as const

export type CodeLlmDebugLevels = keyof typeof DEBUG_LEVELS

export type CodeLlmConfig = {
  debugLevel: CodeLlmDebugLevels,
  llms: Record<CodeLlmServices, CodeLlmProviderItem>
}
