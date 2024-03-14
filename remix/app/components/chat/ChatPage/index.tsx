import type { MetaFunction } from '@remix-run/node';

import ContentWrapper from '@remix/components/common/ContentWrapper';
import ChatForm from './ChatForm';
import ChatHistory from './ChatHistory';
import ChatPageHeader from './ChatPageHeader';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM - Chat' },
    { content: 'Chat with CodeLLM', name: 'description' },
  ];
};

export const ChatPage = () => {
  return (
    <>
      <ContentWrapper>
        <ChatPageHeader />
        <ChatHistory />
        <ChatForm />
      </ContentWrapper>
    </>
  );
};

export default ChatPage;
