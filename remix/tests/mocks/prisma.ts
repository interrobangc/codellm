import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();

export const mockUser = {
  auth0Id: 'fake-auth0-id-0',
  createdAt: new Date(),
  email: 'fake@fake.fake',
  firstName: 'Fake',
  id: 'fake-user-id-0',
  lastName: 'User',
  password: 'fake-password',
  updatedAt: new Date(),
};

export const mockChat = {
  createdAt: new Date(),
  id: 'fake-chat-id-0',
  isLoading: false,
  name: 'new chat',
  updatedAt: new Date(),
  userId: mockUser.id,
};

vi.mock('@remix/.server/models/prisma', () => ({
  prisma: prismaMock,
}));

// I don't think this is actually working.
beforeEach(() => {
  mockReset(prismaMock);
  prismaMock.user.findUnique.mockResolvedValue(mockUser);
});
