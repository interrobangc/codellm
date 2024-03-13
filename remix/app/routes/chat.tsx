import type { MetaFunction } from '@remix-run/node';

import ChatForm from '@remix/components/chat/ChatForm';
import ChatHistory from '@remix/components/chat/ChatHistory';
import ContentWrapper from '@remix/components/common/ContentWrapper';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM - Chat' },
    { content: 'Chat with CodeLLM', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <ContentWrapper>
      <ChatHistory />
      <ChatForm />
    </ContentWrapper>
  );
}

export { action, loader } from '@remix/.server/chat';
