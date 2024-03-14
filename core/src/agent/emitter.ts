import { AgentHistoryItem } from './types';
import EventEmitter from 'events';
import { CodeLlmError } from '@/error/index.js';
import { log } from '@/log/index.js';

export const emitters = new Map<string, EventEmitter>();

const event = 'agent';

export const emit = (emitter: EventEmitter) => (msg: AgentHistoryItem) => {
  log('emitting', 'debug', msg);
  emitter.emit(event, msg);
};

export const on =
  (emitter: EventEmitter) => (listener: (msg: AgentHistoryItem) => void) => {
    log('emit listener added', 'debug');
    emitter.on(event, listener);
  };

export const off =
  (emitter: EventEmitter) => (listener: (msg: AgentHistoryItem) => void) => {
    log('emit listener removed', 'debug');
    emitter.off(event, listener);
  };

export const getEmitter = (id: string) => {
  if (!emitters.has(id)) {
    emitters.set(id, new EventEmitter());
  }

  const emitter = emitters.get(id);

  if (!emitter) {
    return new CodeLlmError({
      code: 'agent:emitter:getEmmitter',
      meta: { id },
    });
  }

  return {
    emit: emit(emitter),
    off: off(emitter),
    on: on(emitter),
  };
};
