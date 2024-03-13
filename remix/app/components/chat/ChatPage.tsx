import type { MetaFunction } from '@remix-run/node';

import ContentWrapper from '@remix/components/common/ContentWrapper';
import ChatForm from './ChatForm';
import ChatHistory from './ChatHistory';
import ChatResetButton from './ChatResetButton';

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
        <ChatResetButton
          buttonClassName="btn-sm btn-secondary"
          formClassName="flex flex-row justify-end"
        />
        <ChatHistory />
        <ChatForm />
      </ContentWrapper>
    </>
  );
};

export default ChatPage;
