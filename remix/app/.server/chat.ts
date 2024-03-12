import type { ActionFunctionArgs } from '@remix-run/node';
import type { Agent } from '@codellm/core';

import { EventEmitter } from 'events';
import { json } from '@remix-run/node';
import {
  CodeLlmError,
  isAgentResponseResponse,
  isError,
  newAgent,
} from '@codellm/core';
import config from '../../config';

let agent: Agent | CodeLlmError;

export const eventStreamEmitter = new EventEmitter();

// @ts-expect-error - ignore for testing
const onAgentEmit = (params) => eventStreamEmitter.emit('agent', params);

export const loader = async () => {
  agent = await newAgent(config);

  if (isError(agent)) {
    console.dir(agent, { depth: null });
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
