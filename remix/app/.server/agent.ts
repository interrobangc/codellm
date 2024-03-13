import type { Agent, AgentHistoryItem } from '@codellm/core';

import { EventEmitter } from 'events';
import { isError, log, newAgent } from '@codellm/core';
import config from '../../config';

let agent: Agent;

export const eventStreamEmitter = new EventEmitter();

const onAgentEmit = (params: AgentHistoryItem) => {
  log('onAgentEmit emitting', 'debug', params);
  eventStreamEmitter.emit('agent', params);
};

export const initAgent = async () => {
  log('initAgent', 'debug', { agent });
  if (agent) agent.offEmit(onAgentEmit);

  const agentRes = await newAgent(config);
  if (isError(agentRes)) {
    throw agentRes;
  }
  agent = agentRes;
  agent.onEmit(onAgentEmit);

  return agent;
};

export const getAgent = () => {
  if (agent) return agent;
  return initAgent();
};
