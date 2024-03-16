import { useParams } from '@remix-run/react';
import type { AgentHistoryItem } from '@codellm/core';
import { useChatEventStream } from './useChatEventStream';
import useCurrentChat from './useCurrentChat';

export const useChatHistory = () => {
  const { chatId } = useParams();
  const currentChat = useCurrentChat();
  useChatEventStream<AgentHistoryItem>(`agent:${chatId}`);

  // @ts-expect-error - not fighting with Prisma types for now
  return currentChat?.messages || [];
};

export default useChatHistory;
