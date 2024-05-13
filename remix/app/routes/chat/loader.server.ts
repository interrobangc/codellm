import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getChat, getChats } from '@remix/.server/services/chat';
import { isError } from '@remix/.server/errors';

export const loader = async (args: LoaderFunctionArgs) => {
  const chats = await getChats(args);
  if (isError(chats)) throw redirect('/');
  if (!args.params.chatId) return { chats };

  const chat = await getChat({ id: Number(args.params.chatId), ...args });
  if (isError(chat)) throw redirect('/');
  return { chat, chats };
};

export type ChatLayoutLoaderData = Awaited<ReturnType<typeof loader>>;
