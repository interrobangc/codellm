import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getClientSafeChats, getClientSafeChat } from './chats';

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const chats = getClientSafeChats();

  if (!params.chatId) return { chats };

  try {
    const currentChat = getClientSafeChat(params.chatId);
    return json({
      chats,
      currentChat,
    });
  } catch (e) {
    return redirect('/chat');
  }
};
export type ChatLayoutLoaderData = {
  chats: ReturnType<typeof getClientSafeChats>;
  currentChat?: ReturnType<typeof getClientSafeChat>;
};
