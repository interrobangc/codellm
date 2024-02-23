export const DEFAULTS = {
  configFile: './config.yml',
  llms: {
    default: {
      provider: 'ollama',
      model: 'mixtral:8x7b'
    },
  }
} as const

export default DEFAULTS;