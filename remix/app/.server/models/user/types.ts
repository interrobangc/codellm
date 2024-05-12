import type { dbToModel } from './userModel';

export type UserModel = Awaited<ReturnType<typeof dbToModel>>;
