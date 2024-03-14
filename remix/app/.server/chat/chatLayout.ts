import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getChat, getChats } from './chats';

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  const chats = getChats();

  if (!params.chatId) return { chats };

  const currentChat = getChat(params.chatId);
  return json({
    chats: chats.filter((chat) => chat.id !== params.id),
    currentChat,
  });
};
export type ChatLayoutLoaderData = {
  chats: ReturnType<typeof getChats>;
  currentChat?: ReturnType<typeof getChat>;
};
