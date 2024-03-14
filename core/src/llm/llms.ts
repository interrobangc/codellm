import type { LlmClient, Llms, Service } from '@/.';

import { CodeLlmError } from '@/error/index.js';

const llms: Llms = new Map();

export const getLlm = (service: Service) => {
  const llm = llms.get(service);
  if (!llm) {
    return new CodeLlmError({
      code: 'llm:noServiceLlm',
      meta: { llms: Object.fromEntries(llms), service },
    });
  }
  return llm;
};

export const getLlms = () => llms;

export const setLlm = (service: Service, client: LlmClient) => {
  llms.set(service, client);
};
