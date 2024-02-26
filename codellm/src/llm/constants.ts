import * as ollama from './provider/ollama/index.js';
import * as openai from './provider/openai/index.js';

export const PROVIDERS_TYPE = {
  ollama: 'ollama',
  openai: 'openai',
} as const;

export const PROVIDERS = Object.values(PROVIDERS_TYPE);

export const PROVIDER_MODULES = {
  ollama,
  openai,
} as const;

export const CHAT_MESSAGE_ROLES_TYPE = {
  assistant: 'assistant',
  system: 'system',
  user: 'user',
} as const;
