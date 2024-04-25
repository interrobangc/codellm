import type { LoaderFunction } from '@remix-run/node';

import { json, redirect } from '@remix-run/node';
import { getChat } from '@remix/.server/services/chat';

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.chatId) return redirect('/chat');
  const { chatId: id } = params;

  const currentChat = await getChat({
    id,
    request,
  });
  if (!currentChat) return redirect('/chat');

  return json({ currentChat });
};
export type ChatLoaderData = Awaited<ReturnType<typeof loader>>;
