import type { Config, Service } from '@/.';

import { getConfig } from '@/config/index.js';
import { isError, promiseMapMayFail, promiseMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { getLlm, getLlms, setLlm } from './llms.js';
import { newLlmClient } from './newLlmClient.js';

export const initLlmClients = async (
  config: Config,
  servicesToInit: Service[],
) => {
  const llmsMap = servicesToInit.map(async (service) => {
    const llmClient = await newLlmClient({ config, service });
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
  if (isError(config)) return config;

  const initLlmClientsRes = await initLlmClients(config, servicesToInit);
  if (isError(initLlmClientsRes)) return initLlmClientsRes;

  const initLlmModelsRes = await initLlmModels(servicesToInit);
  if (isError(initLlmModelsRes)) return initLlmModelsRes;

  return getLlms();
};
