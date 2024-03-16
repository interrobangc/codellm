import { redirect } from '@remix-run/node';
import { getChat } from './services/chats';

export const loader = async () => {
  const newChat = await getChat();
  return redirect(`/chat/${newChat.id}`);
};
