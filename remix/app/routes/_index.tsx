import type { MetaFunction } from '@remix-run/node';
export const meta: MetaFunction = () => {
  return [
    { title: 'CodeLLM' },
    { content: 'Welcome to CodeLLM!', name: 'description' },
  ];
};

export default function Index() {
  // const isLoading = Boolean(transition.action?.type === 'idle');
  return (
    <div>
      <div className="p-10 bg-base-100 ">
        <div className="p-5 border-2 border-primary rounded-lg">
          <h1 className="text-4xl">Welcome to CodeLLM!</h1>
          <p className="text-lg">
            This is a chatbot that can answer your questions about a code
            project.
          </p>
        </div>
      </div>
    </div>
  );
}

export { action, loader } from '@remix/.server/chat';
