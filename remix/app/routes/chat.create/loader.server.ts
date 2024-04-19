import { redirect } from '@remix-run/node';
import { getChat } from '@remix/.server/services/chats';

export const loader = async () => {
  const newChat = await getChat();
  return redirect(`/chat/${newChat.id}`);
};
