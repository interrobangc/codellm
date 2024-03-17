import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';

import { json, redirect } from '@remix-run/node';
import { isError } from '@codellm/core';
import {
  deleteChat,
  getChat,
  getMostRecentChat,
  sendChat,
  updateChat,
} from './services/chats';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.chatId) return json({ error: 'Invalid chatId' }, { status: 400 });
  const { chatId } = params;

  console.log('chat.$chatId.ts loader chatId', chatId);

  const currentChat = await getChat(chatId);
  if (!currentChat) return json({ error: 'Chat not found' }, { status: 404 });

  return json({ currentChat });
};
export type ChatLoaderData = Awaited<ReturnType<typeof loader>>;

export const sendChatAction = async (
  chatId: string,
  formData: Awaited<ReturnType<ActionFunctionArgs['request']['formData']>>,
) => {
  const result = {
    error: null,
    llmResponse: null,
  };

  const userMessage = formData.get('userMessage') as string;

  // We don't want to wait because it will block the event stream
  // triggered revalidation if this action is locked in a loading state
  sendChat(chatId, userMessage);

  return null;
};

export const deleteChatAction = async (chatId: string) => {
  await deleteChat(chatId);
  const mostRecentChat = await getMostRecentChat();
  if (mostRecentChat) return redirect(`/chat/${mostRecentChat.id}`);

  return redirect('/chat');
};

export const renameChat = (chatId: string, newName: string) => {
  return updateChat(chatId, { name: newName });
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
