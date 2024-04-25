import type { ChatModel } from '@remix/.server/models';
import type { ChatLoaderData } from '@remix/routes/chat.$chatId/loader.server';

import { useLoaderData, useParams } from '@remix-run/react';
import { useChatEventStream } from './useChatEventStream';

export const useCurrentChat = () => {
  const { chatId } = useParams();
  const { currentChat } = useLoaderData<ChatLoaderData>();

  useChatEventStream<ChatModel>(`chat:${chatId}`);

  return currentChat;
};

export default useCurrentChat;
