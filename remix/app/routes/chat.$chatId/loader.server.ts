import type { LoaderFunctionArgs } from '@remix-run/node';

import { redirect } from '@remix-run/node';
import { isError } from '@remix/.server/errors';
import { getChat } from '@remix/.server/services/chat';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.chatId) throw redirect('/chat');
  const { chatId: id } = params;

  const currentChat = await getChat({
    id,
    request,
  });
  if (!currentChat || isError(currentChat)) throw redirect('/');

  return { currentChat };
};
export type ChatLoaderData = Awaited<ReturnType<typeof loader>>;
