import type { ChatLoaderData } from '@remix/.server/chat/$chatId';
import { useLoaderData } from '@remix-run/react';

export const useCurrentChat = () => {
  const loaderData = useLoaderData<ChatLoaderData>();
  return loaderData.currentChat;
};
