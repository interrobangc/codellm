import type { ChatModel } from '@remix/.server/models';
import type { ChatLoaderData } from '@remix/routes/chat.$chatId/loader.server';

import { useLoaderData, useParams } from '@remix-run/react';
import { useChatEventStream } from './useChatEventStream';

export const useCurrentChat = () => {
  const { chatId } = useParams();
  // @ts-expect-error - we know this is a ChatLoaderData but probably need to check for error
  const { currentChat } = useLoaderData<ChatLoaderData>();

  useChatEventStream<ChatModel>(`chat:${chatId}`);

  return currentChat as ChatModel;
};

export default useCurrentChat;
