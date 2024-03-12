import type { Config, Provider } from '@/index.js';
import { CodeLlmError } from '@/error/index.js';

/**
 * Import the provider module for a given provider
 *
 * @param provider - The provider to import
 *
 * @returns - The provider module
 */
export const importClient = async (config: Config, provider: Provider) => {
  const providerConfigItem = config.providers[provider];

  if (!providerConfigItem) {
    return new CodeLlmError({
      code: 'llm:invalidProvider',
      meta: { provider },
    });
  }

  const { config: providerConfig, module } = providerConfigItem;

  const providerModule = await import(module);

  return {
    providerConfig,
    providerModule,
  };
};
