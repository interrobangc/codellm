import type { ActionFunctionArgs } from '@remix-run/node';
import type { Chat } from '@prisma/client';

import { json, redirect } from '@remix-run/node';
import {
  deleteChat,
  getMostRecentChat,
  sendChat,
  updateChat,
} from '@remix/.server/services/chats';

export type ChatActionParams = {
  formData: FormData;
  id: Chat['id'];
  request: Request;
};

export const sendChatAction = async ({
  formData,
  id,
  request,
}: ChatActionParams) => {
  const message = formData.get('userMessage') as string;

  // We don't want to wait because it will block the event stream
  // triggered revalidation if this action is locked in a loading state
  sendChat({ id, message, request });

  return null;
};

export const deleteChatAction = async (params: ChatActionParams) => {
  await deleteChat(params);
  const mostRecentChat = await getMostRecentChat(params);
  if (mostRecentChat) return redirect(`/chat/${mostRecentChat.id}`);

  return redirect('/chat');
};

export const renameChat = (params: ChatActionParams) =>
  updateChat({
    ...params,
    update: { name: params.formData.get('name') as string },
  });

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { chatId } = params;
  if (!chatId) return json({ error: 'Invalid chatId' }, { status: 400 });

  const formData = await request.clone().formData();
  const intent = formData.get('intent');
  const requestParams = { formData, id: chatId, request };
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
