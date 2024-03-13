import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM - Importer' },
    { content: 'CodeLLM Importer', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <div>
      <div className="pr-10 pl-10 bg-base-100 ">
        <div className="p-5 border-2 border-primary rounded-lg"></div>
      </div>
    </div>
  );
}

export { action, loader } from '@remix/.server/chat';
