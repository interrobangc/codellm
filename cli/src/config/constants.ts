export const DEFAULTS = {
  configFile: './config.yml',
} as const;

export const OPTIONS = {
  configFile: {
    alias: 'c',
    type: 'string',
    description: 'Path to the config file',
    default: process.env['CODELLM_CONFIG_FILE'],
  },
  llmProvider: {
    alias: 'lp',
    type: 'string',
    description: 'LLM provider',
    options: ['ollama', 'openai'],
    default: process.env['CODELLM_LLM_PROVIDER'],
  },
  logLevel: {
    alias: 'l',
    type: 'string',
    description: 'Log level',
    options: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    default: process.env['CODELLM_LOG_LEVEL'],
  },
  'project.path': {
    alias: 'p',
    type: 'string',
    description: 'Path to search',
    default: process.env['CODELLM_PROJECT_PATH'],
  },
  'project.name': {
    alias: 'n',
    type: 'string',
    description: 'Name of the project',
    default: process.env['CODELLM_PROJECT_NAME'],
  },
  'providers.mistral.config.apiKey': {
    type: 'string',
    description: 'Mistral API key',
    default: process.env['MISTRAL_API_KEY'],
  },
  'providers.openai.config.apiKey': {
    type: 'string',
    description: 'OpenAI API key',
    default: process.env['OPENAI_API_KEY'],
  },
} as const;

export const OPTION_NAMES = Object.keys(OPTIONS);
