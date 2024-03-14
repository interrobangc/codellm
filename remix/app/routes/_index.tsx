import type { MetaFunction } from '@remix-run/node';

import ContentWrapper from '@remix/components/common/ContentWrapper';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM' },
    { content: 'Welcome to CodeLLM!', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <ContentWrapper>
      <h1 className="text-4xl">Welcome to CodeLLM!</h1>
      <p className="text-lg">
        This is a chatbot that can answer your questions about a code project.
      </p>
    </ContentWrapper>
  );
}
