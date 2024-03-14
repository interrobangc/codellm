import { redirect } from '@remix-run/node';
import { getMostRecentChat } from './chats';

export const loader = () => {
  const chat = getMostRecentChat();
  if (chat) return redirect(`${chat.id}`);
  return redirect('create');
};
