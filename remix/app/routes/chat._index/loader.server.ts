import { redirect } from '@remix-run/node';
import { getMostRecentChat } from '@remix/.server/services/chats';

export const loader = async () => {
  const chat = await getMostRecentChat();
  if (chat) return redirect(`${chat.id}`);
  return redirect('create');
};
