import { PrismaClient } from '@prisma/client';
import { mock } from 'node:test';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

export const mockUser = {
  createdAt: new Date(),
  email: 'fake@fake.fake',
  firstName: 'Fake',
  id: 'fake-user-id-0',
  lastName: 'User',
  password: 'fake-password',
  updatedAt: new Date(),
};
prismaMock.user.findUnique.mockResolvedValue(mockUser);

export const mockChat = {
  createdAt: new Date(),
  id: 'fake-chat-id-0',
  isLoading: false,
  name: 'new chat',
  updatedAt: new Date(),
  userId: mockUser.id,
};

export { prismaMock };
