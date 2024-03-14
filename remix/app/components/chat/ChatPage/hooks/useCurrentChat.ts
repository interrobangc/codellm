import { useLoaderData } from '@remix-run/react';
import type { ChatLoaderData } from '@remix/components/chat/types';

export const useCurrentChat = () => {
  const loaderData = useLoaderData<ChatLoaderData>();
  return loaderData.currentChat;
};
