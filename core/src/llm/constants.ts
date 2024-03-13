export const LLM_ERRORS = {
  'llm:initClients': {
    message: 'Error initializing LLM clients',
  },
  'llm:initModel': {
    message: 'Error initializing model',
  },
  'llm:initModels': {
    message: 'Error initializing models',
  },
  'llm:invalidProvider': {
    message: 'Invalid provider for LLM',
  },
  'llm:newLlmProviderClient': {
    message: 'Error creating new LLM provider client',
  },
  'llm:noConversationHistory': {
    message: 'No conversation history found',
  },
  'llm:noProviderConfig': {
    message: 'No provider config found',
  },
  'llm:noServiceConfig': {
    message: 'No service configuration found',
  },
  'llm:noServiceLlm': {
    message: 'No LLM initialized for service',
  },
  'llm:serviceNotInitialized': {
    message: 'Service not initialized',
  },
  'llm:validateClient': {
    message: 'Error validating the provided LLM client schema',
  },
} as const;

export const CHAT_MESSAGE_ROLES_TYPE = {
  assistant: 'assistant',
  system: 'system',
  user: 'user',
} as const;
