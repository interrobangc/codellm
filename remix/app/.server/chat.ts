import type { ActionFunctionArgs } from '@remix-run/node';

import { json } from '@remix-run/node';
import { isAgentResponseResponse, isError } from '@codellm/core';
import { getAgent, initAgent } from './agent';

export const loader = async () => {
  const agent = await getAgent();

  const history = agent.getHistory();
  return json({ history });
};

export const sendChatAction = async (
  formData: Awaited<ReturnType<ActionFunctionArgs['request']['formData']>>,
) => {
  const result = {
    error: null,
    llmResponse: null,
  };

  const agent = await getAgent();
  const agentResponse = await agent.chat(formData.get('userMessage') as string);
  if (isError(agentResponse)) return { ...result, error: agentResponse };

  return {
    ...result,
    llmResponse: isAgentResponseResponse(agentResponse)
      ? agentResponse.content
      : null,
  };
};

export const clearAgent = async () => {
  await initAgent();
  return { ok: true };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const intent = formData.get('intent');

  console.log('intent', intent);

  switch (intent) {
    case 'clearAgent':
      return clearAgent();
    case 'sendChat':
      return sendChatAction(formData);
    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
};
