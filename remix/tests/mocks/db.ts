import { vi } from 'vitest';
import * as dbModule from '@remix/.server/db';
import { db } from '@remix/.server/db';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

export const chatQueryMock = mockDeep<typeof db.query.chatSchema>();
export const messageQueryMock = mockDeep<typeof db.query.messageSchema>();
export const userQueryMock = mockDeep<typeof db.query.userSchema>();

export const dbQueryMock = {
  chatSchema: chatQueryMock,
  messageSchema: messageQueryMock,
  userSchema: userQueryMock,
};

export const mockUser = {
  auth0Id: 'fake-auth0-id-0',
  createdAt: new Date().toISOString(),
  email: 'fake@fake.fake',
  firstName: 'Fake',
  id: 1,
  isVerified: true,
  lastName: 'User',
  password: 'fake-password',
  updatedAt: new Date().toISOString(),
};

export const mockChat = {
  createdAt: new Date().toISOString(),
  id: 1,
  isLoading: false,
  name: 'new chat',
  updatedAt: new Date().toISOString(),
  userId: mockUser.id,
};

vi.mock('@remix/.server/db', async (importOriginal) => {
  const original = (await importOriginal()) as typeof dbModule;
  return {
    ...original,
    db: {
      ...original.db,
      query: dbQueryMock,
    },
  };
});

// I don't think this is actually working.
beforeEach(() => {
  mockReset(chatQueryMock);
  mockReset(messageQueryMock);
  mockReset(userQueryMock);
  dbQueryMock.userSchema.findFirst.mockResolvedValue(mockUser);
});
