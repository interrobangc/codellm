import type { LoaderFunctionArgs } from '@remix-run/node';

import { json } from '@remix-run/node';
import { getChat } from '@remix/.server/services/chats';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.chatId) return json({ error: 'Invalid chatId' }, { status: 400 });
  const { chatId } = params;

  const currentChat = await getChat(chatId);
  if (!currentChat) return json({ error: 'Chat not found' }, { status: 404 });

  return json({ currentChat });
};
export type ChatLoaderData = Awaited<ReturnType<typeof loader>>;
