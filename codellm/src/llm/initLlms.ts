import type { Config, Llms, Service } from '@/.';
import { newClient } from '@/llm/index.js';

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
