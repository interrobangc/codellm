import type { LoaderFunction } from '@remix-run/node';
import { EventStream } from '@remix-sse/server';
import { getEventStreamEmitter } from '@remix/.server/chats.js';

export const loader: LoaderFunction = ({ request }) => {
  const eventStreamEmitter = getEventStreamEmitter();
  // Return the EventStream from your route loader
  return new EventStream(request, (send) => {
    eventStreamEmitter.on('agent', (params) => send(JSON.stringify(params)));

    return () => {
      eventStreamEmitter.off('agent', (params) => send(JSON.stringify(params)));
    };
  });
};
