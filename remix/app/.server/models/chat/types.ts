import type { prismaToModel } from './chatModel';

export type ChatModel = Awaited<ReturnType<typeof prismaToModel>>;
