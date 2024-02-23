const PROVIDERS = {
  ollama: 'ollama',
  openai: 'openai',
} as const

export type CodeLlmConfigProviders = keyof typeof PROVIDERS

export type CodeLlmConfigProviderItem = {
  provider: CodeLlmConfigProviders
  model: string
}

const SERVICES = {
  default: 'default',
  embedding: 'embedding',
  toolSelection: 'toolSelection',
  agent: 'agent',
} as const

export type CodeLlmConfigServices = keyof typeof SERVICES

export type CodeLlmConfig = {
  llms: Record<CodeLlmConfigServices, CodeLlmConfigProviderItem>
}
