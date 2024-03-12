import type { ActionFunctionArgs } from '@remix-run/node';
import type { Agent, AgentHistoryItem } from '@codellm/core';

import { EventEmitter } from 'events';
import { json } from '@remix-run/node';
import {
  CodeLlmError,
  isAgentResponseResponse,
  isError,
  log,
  newAgent,
} from '@codellm/core';
import config from '../../config';

let agent: Agent | CodeLlmError;

export const eventStreamEmitter = new EventEmitter();

const onAgentEmit = (params: AgentHistoryItem) => {
  log('onAgentEmit emitting', 'debug', params);
  eventStreamEmitter.emit('agent', params);
};

export const loader = async () => {
  agent = await newAgent(config);
  if (isError(agent)) {
    throw agent;
  }
  agent.onEmit(onAgentEmit);

  const history = agent.getHistory();
  return json({ history });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = {
    error: null,
    llmResponse: null,
  };
  if (!agent || isError(agent)) return;

  const formData = await request.clone().formData();
  const agentResponse = await agent.chat(formData.get('userMessage') as string);
  if (isError(agentResponse)) return { ...result, error: agentResponse };

  return {
    ...result,
    llmResponse: isAgentResponseResponse(agentResponse)
      ? agentResponse.content
      : null,
  };
};
