import type { Agent, CodeLlmError } from '@codellm/core';
import { isError, newAgent } from '@codellm/core';
import config from '../../config';

let agent: Agent;

export const getAgent = async () => {
  if (agent) return agent;
  const agentRes = await newAgent(config);
  if (isError(agentRes)) {
    throw agentRes;
  }
  agent = agentRes;

  return agent;
};
