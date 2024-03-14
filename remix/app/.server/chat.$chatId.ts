import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { AgentHistory } from '@codellm/core';

import { json, redirect } from '@remix-run/node';
import { isAgentResponseResponse, isError } from '@codellm/core';
import {
  deleteChat,
  getChat,
  getClientSafeChat,
  getMostRecentChat,
} from './chats';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.chatId) return json({ error: 'Invalid chatId' }, { status: 400 });
  const { chatId } = params;

  const currentChat = await getChat(chatId);
  const history = currentChat.client.getHistory();

  return json({ currentChat: getClientSafeChat(chatId), history });
};
export type ChatLoaderData = {
  currentChat: ReturnType<typeof getClientSafeChat>;
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

  return json({
    ...result,
    llmResponse: isAgentResponseResponse(agentResponse)
      ? agentResponse.content
      : null,
  });
};

export const deleteChatAction = (chatId: string) => {
  deleteChat(chatId);
  const mostRecentChat = getMostRecentChat();
  if (mostRecentChat) return redirect(`/chat/${mostRecentChat.id}`);

  return redirect('/chat');
};

export const renameChat = async (chatId: string, newName: string) => {
  const chat = await getChat(chatId);
  chat.name = newName;
  return { ok: true };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { chatId } = params;
  if (!chatId) return json({ error: 'Invalid chatId' }, { status: 400 });

  const formData = await request.clone().formData();
  const intent = formData.get('intent');
  switch (intent) {
    case 'deleteChat':
      return deleteChatAction(chatId);
    case 'renameChat':
      return renameChat(chatId, formData.get('name') as string);
    case 'sendChat':
      return sendChatAction(chatId, formData);
    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
};