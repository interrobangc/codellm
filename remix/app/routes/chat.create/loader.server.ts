import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { createChat } from '@remix/.server/services/chat';
import { isError } from '@remix/.server/errors';

export const loader = async (args: LoaderFunctionArgs) => {
  const newChat = await createChat(args);

  if (isError(newChat)) throw redirect('/');

  throw redirect(`/chat/${newChat.id}`);
};
