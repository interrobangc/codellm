import { AGENT_ERRORS } from '@/agent/constants.js';
import { CONFIG_ERRORS } from '@/config/constants.js';
import { LLM_ERRORS } from '@/llm/constants.js';
import { LOG_ERRORS } from '@/log/constants.js';

export const ERROR_ERRORS = {
  'error:unknown': {
    message: 'Unknown error',
  },
} as const;

export const ERRORS = {
  ...AGENT_ERRORS,
  ...CONFIG_ERRORS,
  ...ERROR_ERRORS,
  ...LLM_ERRORS,
  ...LOG_ERRORS,
} as const;
