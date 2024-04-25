import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { createChat } from '@remix/.server/services/chat';
import { isError } from '@remix/.server/errors';

export const loader: LoaderFunction = async ({ request }) => {
  const newChat = await createChat({ request });

  if (isError(newChat)) return redirect('/');

  return redirect(`/chat/${newChat.id}`);
};
