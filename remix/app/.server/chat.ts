import type { ActionFunctionArgs } from '@remix-run/node';

import { json } from '@remix-run/node';
import { isAgentResponseResponse, isError } from '@codellm/core';
import { getAgent } from './agent';

export const loader = async () => {
  const agent = await getAgent();

  const history = agent.getHistory();
  return json({ history });
};

export const action = async (params: ActionFunctionArgs) => {
  const request = params.request;
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
