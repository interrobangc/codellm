export const DEFAULTS = {
  configFile: './config.yml',
} as const;

export const OPTIONS = {
  configFile: {
    alias: 'c',
    default: process.env['CODELLM_CONFIG_FILE'],
    description: 'Path to the config file',
    type: 'string',
  },
  llmProvider: {
    alias: 'lp',
    default: process.env['CODELLM_PROVIDER'],
    description: 'LLM provider',
    options: ['ollama', 'openai'],
    type: 'string',
  },
  logLevel: {
    alias: 'l',
    default: process.env['CODELLM_LOG_LEVEL'],
    description: 'Log level',
    options: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    type: 'string',
  },
  'project.name': {
    alias: 'n',
    default: process.env['CODELLM_PROJECT_NAME'],
    description: 'Name of the project',
    type: 'string',
  },
  'project.path': {
    alias: 'p',
    default: process.env['CODELLM_PROJECT_PATH'],
    description: 'Path to search',
    type: 'string',
  },
  'providers.anthropic.config.apiKey': {
    default: process.env['ANTHROPIC_API_KEY'],
    description: 'Anthropic API key',
    type: 'string',
  },
  'providers.mistral.config.apiKey': {
    default: process.env['MISTRAL_API_KEY'],
    description: 'Mistral API key',
    type: 'string',
  },
  'providers.openai.config.apiKey': {
    default: process.env['OPENAI_API_KEY'],
    description: 'OpenAI API key',
    type: 'string',
  },
} as const;

export const OPTION_NAMES = Object.keys(OPTIONS);
