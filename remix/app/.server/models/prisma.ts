import { PrismaClient } from '@prisma/client';
import { remember } from '@epic-web/remember';

const prisma = remember('prisma', () => new PrismaClient());

export { prisma };
