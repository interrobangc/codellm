import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { isError } from '@remix/.server/errors';
import { getMostRecentChat } from '@remix/.server/services/chat';

export const loader: LoaderFunction = async ({ request }) => {
  const chat = await getMostRecentChat({ request });

  if (isError(chat)) return redirect('/');

  if (chat) return redirect(`${chat.id}`);

  return redirect('create');
};
