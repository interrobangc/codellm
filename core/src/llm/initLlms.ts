import type { Config, Llms, Service } from '@/.';
import log from '@/log/index.js';
import { newClient } from '@/llm/index.js';

/**
 * Initialize LLMs and their respective clients for later use
 *
 * @param config - The configuration to use
 * @param servicesToInit - The services for which to initialize clients
 *
 * @returns - The initialized LLM Clients
 *
 */
export const initLlms = async (config: Config, servicesToInit: Service[]) => {
  const llmsMap = servicesToInit.map(async (service) => {
    return {
      [service as Service]: await newClient({ config, service }),
    };
  });

  const resolvedLlms = await Promise.all(llmsMap);
  const llms: Llms = Object.assign({}, ...resolvedLlms);

  await Promise.all(
    Object.entries(llms).map(async ([, client]) => {
      log('Initializing model', 'debug', { service: client.service });
      await client.initModel();
    }),
  );

  return llms;
};
