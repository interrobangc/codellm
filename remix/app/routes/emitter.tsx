import type { LoaderFunction } from '@remix-run/node';
import { EventStream } from '@remix-sse/server';
import { eventStreamEmitter } from '@remix/.server/chat.js';

export const loader: LoaderFunction = ({ request }) => {
  // Return the EventStream from your route loader
  return new EventStream(request, (send) => {
    eventStreamEmitter.on('agent', (params) => send(JSON.stringify(params)));

    return () => {
      eventStreamEmitter.off('agent', (params) => send(JSON.stringify(params)));
    };
  });
};
