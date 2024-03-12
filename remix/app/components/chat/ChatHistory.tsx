import { useLoaderData } from '@remix-run/react';
import type { ChatLoaderData } from './types';
import { ChatMessage } from './ChatMessage';
import { ChatLoadingMessage } from './ChatLoadingMessage';
import { AgentHistory } from '@codellm/core';

export const ChatHistory = () => {
  const loaderData = useLoaderData<ChatLoaderData>();

  // dirty hack. See https://github.com/remix-run/remix/issues/7246
  const history = loaderData.history as AgentHistory;
  if (!history) return null;

  return (
    <div className="p-2">
      {history.map((message, index) => {
        return <ChatMessage key={index} message={message} />;
      })}
      <ChatLoadingMessage />
    </div>
  );
};

export default ChatHistory;
