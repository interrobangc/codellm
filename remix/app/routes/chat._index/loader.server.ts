import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { isError } from '@remix/.server/errors';
import { getMostRecentChat } from '@remix/.server/services/chat';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const chat = await getMostRecentChat({ request });

  if (isError(chat)) throw redirect('/');

  if (chat) throw redirect(`${chat.id}`);

  throw redirect('create');
};
