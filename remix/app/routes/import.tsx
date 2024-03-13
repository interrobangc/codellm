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
      <div className="p-10 bg-base-100 ">
        <div className="p-5 border-2 border-primary rounded-lg">
          <h1 className="text-2xl font-bold mb-5">Run Tool Imports</h1>
        </div>
      </div>
    </div>
  );
}

export { action, loader } from '@remix/.server/chat';
