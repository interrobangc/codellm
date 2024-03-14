import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { AgentHistory } from '@codellm/core';

import { json } from '@remix-run/node';
import { isAgentResponseResponse, isError } from '@codellm/core';
import { getChat, initChat } from './chats';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.chatId) return json({ error: 'Invalid chatId' }, { status: 400 });

  const agent = await getChat(params.chatId);

  console.dir(agent, { depth: null });

  const history = agent.client.getHistory();
  return json({ history });
};
export type ChatLoaderData = {
  history: AgentHistory;
};

export const sendChatAction = async (
  chatId: string,
  formData: Awaited<ReturnType<ActionFunctionArgs['request']['formData']>>,
) => {
  const result = {
    error: null,
    llmResponse: null,
  };

  const agent = await getChat(chatId);
  const agentResponse = await agent.client.chat(
    formData.get('userMessage') as string,
  );
  if (isError(agentResponse)) return { ...result, error: agentResponse };

  return {
    ...result,
    llmResponse: isAgentResponseResponse(agentResponse)
      ? agentResponse.content
      : null,
  };
};

export const clearAgent = async (chatId: string) => {
  await initChat(chatId);
  return { ok: true };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const intent = formData.get('intent');

  const { chatId } = params;
  if (!chatId) return json({ error: 'Invalid chatId' }, { status: 400 });

  switch (intent) {
    case 'clearAgent':
      return clearAgent(chatId);
    case 'sendChat':
      return sendChatAction(chatId, formData);
    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
};
