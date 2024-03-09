import type { Config, Service } from '@/.';

import { getConfig } from '@/config/index.js';
import { isError, promiseMapMaybe } from '@/error/index.js';
import log from '@/log/index.js';
import { getLlm, newClient, setLlm } from './index.js';

export const initLlmClients = async (
  config: Config,
  servicesToInit: Service[],
) => {
  const llmsMap = servicesToInit.map(async (service) => {
    const llm = await newClient({ config, service });
    if (isError(llm)) {
      return llm;
    }
    setLlm(service, llm);
    return llm;
  });

  const resolvedLlms = await promiseMapMaybe(llmsMap, 'llm:initClients');
  if (isError(resolvedLlms)) {
    return resolvedLlms;
  }

  return false;
};

export const initLlmModels = async (servicesToInit: Service[]) => {
  const initModelsMap = servicesToInit.map(async (service) => {
    const client = getLlm(service);
    if (isError(client)) {
      return client;
    }

    log('Initializing model', 'debug', { service: client.service });
    await client.initModel();
    return client;
  });
  const resolvedInitModels = await promiseMapMaybe(
    initModelsMap,
    'llm:initModels',
  );
  if (isError(resolvedInitModels)) {
    return resolvedInitModels;
  }

  return false;
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
  if (isError(initLlmClientsRes)) {
    return initLlmClientsRes;
  }

  const initLlmModelsRes = await initLlmModels(servicesToInit);
  if (isError(initLlmModelsRes)) {
    return initLlmModelsRes;
  }

  return false;
};
