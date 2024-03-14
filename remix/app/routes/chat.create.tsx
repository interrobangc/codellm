import { redirect } from '@remix-run/node';
import { initChat } from '@remix/.server/chat/chats';

export const loader = async () => {
  const newChat = await initChat();
  return redirect(`/chat/${newChat.id}`);
};
