import type { ActionFunctionArgs } from '@remix-run/node';

import { json, redirect } from '@remix-run/node';
import {
  deleteChat,
  getMostRecentChat,
  sendChat,
  updateChat,
} from '@remix/.server/services/chat';
import { isError } from '@remix/.server/errors';
import { Chat } from '@remix/.server/db';

export type ChatActionArgs = ActionFunctionArgs & {
  formData: FormData;
  id: Chat['id'];
};

export const sendChatAction = async (args: ChatActionArgs) => {
  const message = args.formData.get('userMessage') as string;

  // We don't want to wait because it will block the event stream
  // triggered revalidation if this action is locked in a loading state
  sendChat({ ...args, message });

  return null;
};

export const deleteChatAction = async (args: ChatActionArgs) => {
  await deleteChat(args);
  const mostRecentChat = await getMostRecentChat(args);
  if (isError(mostRecentChat)) throw mostRecentChat;
  if (mostRecentChat) throw redirect(`/chat/${mostRecentChat.id}`);

  throw redirect('/chat');
};

export const renameChat = (args: ChatActionArgs) =>
  updateChat({
    ...args,
    update: { name: args.formData.get('name') as string },
  });

export const action = async (args: ActionFunctionArgs) => {
  const { chatId } = args.params;
  if (!chatId) return json({ error: 'Invalid chatId' }, { status: 400 });

  const formData = await args.request.clone().formData();
  const intent = formData.get('intent');
  const requestParams = { ...args, formData, id: Number(chatId) };
  switch (intent) {
    case 'deleteChat':
      return deleteChatAction(requestParams);
    case 'renameChat':
      return renameChat(requestParams);
    case 'sendChat':
      return sendChatAction(requestParams);
    default:
      return json({ error: 'Invalid intent' }, { status: 400 });
  }
};
