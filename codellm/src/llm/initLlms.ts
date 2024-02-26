import type { Config, Llms, Service } from '@/.';
import { newClient } from '@/llm/index.js';

/**
 * Initialize LLMs and their respective clients for later use
 *
 * @param config - The configuration to use
 * @param servicesToInit - The services for which to initialize clients
 *
 * @returns - The initialized LLM Clients
 *
 * @throws - If the service is not found
 * @throws - If there is an error initializing the client
 * @throws - If there is an error initializing the model
 */
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
