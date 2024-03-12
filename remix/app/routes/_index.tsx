import type { MetaFunction } from '@remix-run/node';

import ChatForm from '@remix/components/chat/ChatForm';
import ChatHistory from '@remix/components/chat/ChatHistory';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLlm' },
    { content: 'Welcome to CodeLlm!', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <div>
      <div className="p-10 bg-base-100 ">
        <div className="p-5 border-2 border-primary rounded-lg">
          <ChatHistory />
          <ChatForm />
        </div>
      </div>
    </div>
  );
}

export { action, loader } from '@remix/.server/chat';
