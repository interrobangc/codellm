import { AgentHistoryItem } from './types';
import EventEmitter from 'events';
import { log } from '@/log/index.js';

export const emitter = new EventEmitter();

const event = 'agent';

export const emit = (msg: AgentHistoryItem) => {
  log('emitting', 'debug', msg);
  emitter.emit(event, msg);
};

export const on = (listener: (msg: AgentHistoryItem) => void) => {
  log('emit listener added', 'debug');
  emitter.on(event, listener);
};

export const off = (listener: (msg: AgentHistoryItem) => void) => {
  log('emit listener removed', 'debug');
  emitter.off(event, listener);
};
