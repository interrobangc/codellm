import { useLoaderData, useParams } from '@remix-run/react';
import type { Chat, ChatLoaderData } from '@remix/components/chat/types';
import { useChatEventStream } from './useChatEventStream';

export const useCurrentChat = () => {
  const { chatId } = useParams();
  // @ts-expect-error - we know this is a ChatLoaderData but probably need to check for error
  const { currentChat } = useLoaderData<ChatLoaderData>();

  useChatEventStream<Chat>(`chat:${chatId}`);

  return currentChat as Chat;
};

export default useCurrentChat;
