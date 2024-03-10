import type { Config, Service } from '@/.';

import { getConfig } from '@/config/index.js';
import { isError, promiseMapMayFail, promiseMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { getLlm, newClient, setLlm } from './index.js';

export const initLlmClients = async (
  config: Config,
  servicesToInit: Service[],
) => {
  const llmsMap = servicesToInit.map(async (service) => {
    const llmClient = await newClient({ config, service });
    if (isError(llmClient)) return llmClient;

    setLlm(service, llmClient);
    return llmClient;
  });

  return promiseMapMayFail(llmsMap, 'llm:initClients');
};

export const initLlmModels = async (servicesToInit: Service[]) => {
  const initModelsMap = servicesToInit.map(async (service) => {
    const client = getLlm(service);
    if (isError(client)) return client;

    log('Initializing model', 'debug', { service: client.service });

    return promiseMayFail(client.initModel(), 'llm:initModel', {
      service,
    });
  });

  return promiseMapMayFail(initModelsMap, 'llm:initModels');
};

/**
 * Initialize LLMs and their respective clients for later use
 *
 * @param config - The configuration to use
 * @param servicesToInit - The services for which to initialize clients
 *
 * @returns - The initialized LLM Clients
 *
 */
export const initLlms = async (servicesToInit: Service[]) => {
  const config = getConfig();
  const initLlmClientsRes = await initLlmClients(config, servicesToInit);
  if (isError(initLlmClientsRes)) return initLlmClientsRes;

  return initLlmModels(servicesToInit);
};
