import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getChats, getChat } from './services/chats';

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const chats = await getChats();

  if (!params.chatId) return { chats };

  try {
    const currentChat = await getChat(params.chatId);
    return json({
      chats,
      currentChat,
    });
  } catch (e) {
    return redirect('/chat');
  }
};

export type ChatLayoutLoaderData = ReturnType<typeof loader>;
