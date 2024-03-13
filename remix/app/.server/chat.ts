import type { ActionFunctionArgs } from '@remix-run/node';
import type { AgentHistoryItem } from '@codellm/core';

import { EventEmitter } from 'events';
import { json } from '@remix-run/node';
import { isAgentResponseResponse, isError, log } from '@codellm/core';
import { getAgent } from './agent';

export const eventStreamEmitter = new EventEmitter();

const onAgentEmit = (params: AgentHistoryItem) => {
  log('onAgentEmit emitting', 'debug', params);
  eventStreamEmitter.emit('agent', params);
};

export const loader = async () => {
  const agent = await getAgent();
  agent.onEmit(onAgentEmit);

  const history = agent.getHistory();
  return json({ history });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = {
    error: null,
    llmResponse: null,
  };

  const agent = await getAgent();
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
