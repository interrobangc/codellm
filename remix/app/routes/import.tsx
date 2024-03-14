import type { MetaFunction } from '@remix-run/node';

import ContentWrapper from '@remix/components/common/ContentWrapper';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM - Importer' },
    { content: 'CodeLLM Importer', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <ContentWrapper>
      <p>Import your project into CodeLLM</p>
    </ContentWrapper>
  );
}

export { action, loader } from '@remix/.server/chat/chatPage';
