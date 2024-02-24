import { getClient } from '../llm/index.js';
import { CodeLlmConfig, CodeLlmService, services } from '../config/types.js';
import { CodeLlmLlms } from './types';

export const initLlms = async (config: CodeLlmConfig): Promise<CodeLlmLlms> => {
  const llmsMap = services.map(async (service) => {
    return {
      [service as CodeLlmService]: await getClient({ config, service }),
    };
  });

  const resolvedLlms = await Promise.all(llmsMap);
  const llms: CodeLlmLlms = Object.assign({}, ...resolvedLlms);

  Object.entries(llms).map(async ([, client]) => {
    await client.initModel();
  });

  return llms;
};
