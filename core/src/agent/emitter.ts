import { AgentEmitterChannels, AgentHistoryItem } from './types';
import EventEmitter from 'events';
import { CodeLlmError } from '@/error/index.js';
import { log } from '@/log/index.js';
import { AGENT_EMITTER_CHANNELS } from './constants.js';

export const emitters = new Map<string, EventEmitter>();

export const getChannelEvent = (type: AgentEmitterChannels) =>
  AGENT_EMITTER_CHANNELS[type];

export const emit = (emitter: EventEmitter) => (msg: AgentHistoryItem) => {
  log('emitting', 'debug', { event: getChannelEvent(msg.role), msg });
  emitter.emit(getChannelEvent(msg.role), msg);
};

export const on =
  (emitter: EventEmitter) =>
  (
    channel: AgentEmitterChannels,
    listener: (msg: AgentHistoryItem) => void,
  ) => {
    log('emit listener added', 'debug');
    emitter.on(getChannelEvent(channel), listener);
  };

export const off =
  (emitter: EventEmitter) =>
  (
    channel: AgentEmitterChannels,
    listener: (msg: AgentHistoryItem) => void,
  ) => {
    log('emit listener removed', 'debug');
    emitter.off(getChannelEvent(channel), listener);
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
