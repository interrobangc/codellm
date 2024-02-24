import { getClient } from '../llm/index.js';
import { Config, Service, services } from '../config/types.js';
import { Llms } from './types';

export const initLlms = async (config: Config): Promise<Llms> => {
  const llmsMap = services.map(async (service) => {
    return {
      [service as Service]: await getClient({ config, service }),
    };
  });

  const resolvedLlms = await Promise.all(llmsMap);
  const llms: Llms = Object.assign({}, ...resolvedLlms);

  Object.entries(llms).map(async ([, client]) => {
    await client.initModel();
  });

  return llms;
};
