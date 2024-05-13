import type { LoaderFunctionArgs } from '@remix-run/node';

import { redirect } from '@remix-run/node';
import { isError } from '@remix/.server/errors';
import { getChat } from '@remix/.server/services/chat';

export const loader = async (args: LoaderFunctionArgs) => {
  if (!args.params.chatId) throw redirect('/chat');
  const { chatId } = args.params;

  const currentChat = await getChat({
    ...args,
    id: Number(chatId),
  });
  if (!currentChat || isError(currentChat)) throw redirect('/');

  return { currentChat };
};
export type ChatLoaderData = Awaited<ReturnType<typeof loader>>;
