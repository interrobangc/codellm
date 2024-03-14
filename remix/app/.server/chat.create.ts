import { redirect } from '@remix-run/node';
import { initChat } from './chats';

export const loader = async () => {
  const newChat = await initChat();
  return redirect(`/chat/${newChat.id}`);
};
