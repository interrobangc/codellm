import type { prismaToModel } from './userModel';

export type UserModel = Awaited<ReturnType<typeof prismaToModel>>;
