import type { dbToModel } from './chatModel';

export type ChatModel = Awaited<ReturnType<typeof dbToModel>>;
