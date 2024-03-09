export const LLM_ERRORS = {
  'llm:initClients': {
    message: 'Error initializing LLM clients',
  },
  'llm:initModels': {
    message: 'Error initializing models',
  },
  'llm:invalidProvider': {
    message: 'Invalid provider for LLM',
  },
  'llm:noServiceLlm': {
    message: 'No LLM initialized for service',
  },
  'llm:serviceNotInitialized': {
    message: 'Service not initialized',
  },
} as const;

export const CHAT_MESSAGE_ROLES_TYPE = {
  assistant: 'assistant',
  system: 'system',
  user: 'user',
} as const;
