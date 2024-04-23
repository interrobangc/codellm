import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getChat, getChats } from '@remix/.server/services/chats';

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  try {
    const chats = await getChats({ request });
    if (!params.chatId) return { chats };

    try {
      const currentChat = await getChat({ id: params.chatId, request });
      return json({
        chats,
        currentChat,
      });
    } catch (e) {
      return redirect('/chat');
    }
  } catch (e) {
    return redirect('/');
  }
};

export type ChatLayoutLoaderData = Awaited<ReturnType<typeof loader>>;
