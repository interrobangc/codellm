import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getMostRecentChat } from '@remix/.server/services/chats';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const chat = await getMostRecentChat({ request });
    if (chat) return redirect(`${chat.id}`);
  } catch (e) {
    return redirect('/');
  }

  return redirect('create');
};
