import { useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useEventStream } from '@remix-sse/client';
import { AgentHistory, AgentHistoryItem } from '@codellm/core';
import type { ChatLoaderData } from '@remix/components/chat/types';

export const useChatHistory = () => {
  const loaderData = useLoaderData<ChatLoaderData>();
  const navigation = useNavigation();
  const [currentMessages, updateCurrentMessages] = useState<AgentHistoryItem[]>(
    [],
  );

  const eventStream = useEventStream('/emitter', {
    deserialize: (raw) => JSON.parse(raw) as AgentHistoryItem,
    returnLatestOnly: true,
  });

  useEffect(() => {
    if (navigation.state === 'idle') {
      updateCurrentMessages([]);
    } else if (
      navigation.state === 'submitting' &&
      eventStream &&
      eventStream?.role !== 'assistant'
    ) {
      updateCurrentMessages([...currentMessages, eventStream]);
    }
  }, [currentMessages, eventStream, navigation.state]);

  // dirty hack. See https://github.com/remix-run/remix/issues/7246
  return [...(loaderData.history as AgentHistory), ...currentMessages];
};

export default useChatHistory;