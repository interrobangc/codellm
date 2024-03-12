import { AgentHistoryItem } from './types';
import EventEmitter from 'events';
import { log } from '@/log/index.js';

export const emitter = new EventEmitter();

const event = 'agent';

export const emit = (msg: AgentHistoryItem) => {
  log('emitting', 'info', msg);
  emitter.emit(event, msg);
};

export const on = (listener: (...args: unknown[]) => void) => {
  emitter.on(event, listener);
};
