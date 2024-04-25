import type { Config, Provider } from '@/index.js';

import isString from 'lodash/isString.js';
import { newError, promiseMayFail } from '@/error/index.js';

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
    return newError({
      code: 'llm:invalidProvider',
      meta: { provider },
    });
  }

  const { config: providerConfig, module } = providerConfigItem;

  if (!isString(module)) {
    return {
      providerConfig,
      providerModule: module,
    };
  }

  const providerModule = await promiseMayFail(
    import(module),
    'llm:importProviderModule',
    { providerConfigItem },
  );

  return {
    providerConfig,
    providerModule,
  };
};
