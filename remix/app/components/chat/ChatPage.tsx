import type { MetaFunction } from '@remix-run/node';

import ContentWrapper from '@remix/components/common/ContentWrapper';
import ChatForm from './ChatForm';
import ChatHistory from './ChatHistory';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM - Chat' },
    { content: 'Chat with CodeLLM', name: 'description' },
  ];
};

export const ChatPage = () => {
  return (
    <ContentWrapper>
      <ChatHistory />
      <ChatForm />
    </ContentWrapper>
  );
};

export default ChatPage;
