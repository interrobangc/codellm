import { newClient } from '../llm/index.js';
import { Config, Service } from '../config/types.js';
import { Llms } from './types';

export const initLlms = async (
  config: Config,
  servicesToInit: Service[],
): Promise<Llms> => {
  const llmsMap = servicesToInit.map(async (service) => {
    return {
      [service as Service]: await newClient({ config, service }),
    };
  });

  const resolvedLlms = await Promise.all(llmsMap);
  const llms: Llms = Object.assign({}, ...resolvedLlms);

  Object.entries(llms).map(async ([, client]) => {
    await client.initModel();
  });

  return llms;
};
