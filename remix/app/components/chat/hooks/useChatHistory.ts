import { useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { AgentHistory, AgentHistoryItem } from '@codellm/core';
import type { ChatLoaderData } from '@remix/components/chat/types';

export const useChatHistory = () => {
  const loaderData = useLoaderData<ChatLoaderData>();
  const navigation = useNavigation();
  const [currentMessage, updateCurrentMessage] = useState<
    AgentHistoryItem | undefined
  >(undefined);

  const userMessage = navigation?.formData?.get('userMessage') as string;
  useEffect(() => {
    if (navigation.state === 'idle') {
      updateCurrentMessage(undefined);
    } else if (navigation.state === 'submitting' && userMessage) {
      updateCurrentMessage({
        content: userMessage,
        role: 'user',
      });
    }
  }, [navigation.state, userMessage]);

  const currentMessageArray = currentMessage ? [currentMessage] : [];
  // dirty hack. See https://github.com/remix-run/remix/issues/7246
  return [...(loaderData.history as AgentHistory), ...currentMessageArray];
};

export default useChatHistory;
