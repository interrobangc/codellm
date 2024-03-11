import { AGENT_ERRORS } from '@/agent/constants.js';
import { CONFIG_ERRORS } from '@/config/constants.js';
import { FS_ERRORS } from '@/fs/constants.js';
import { IMPORTER_ERRORS } from '@/importer/constants.js';
import { LLM_ERRORS } from '@/llm/constants.js';
import { LOG_ERRORS } from '@/log/constants.js';
import { PROMPT_ERRORS } from '@/prompt/constants.js';
import { TOOL_ERRORS } from '@/tool/constants.js';
import { VECTOR_DB_ERRORS } from '@/vectorDb/constants.js';

export const ERROR_ERRORS = {
  'error:unknown': {
    message: 'Unknown error',
  },
} as const;

export const CODE_LLM_ERRORS = {
  ...AGENT_ERRORS,
  ...CONFIG_ERRORS,
  ...FS_ERRORS,
  ...ERROR_ERRORS,
  ...IMPORTER_ERRORS,
  ...LLM_ERRORS,
  ...LOG_ERRORS,
  ...PROMPT_ERRORS,
  ...TOOL_ERRORS,
  ...VECTOR_DB_ERRORS,
} as const;
