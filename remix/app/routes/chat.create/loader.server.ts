import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { createChat } from '@remix/.server/services/chats';

export const loader: LoaderFunction = async ({ request }) => {
  const newChat = await createChat({ request });
  return redirect(`/chat/${newChat.id}`);
};
