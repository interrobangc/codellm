import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import seedUsers from './seeds/users.js';

const main = async () => {
  await seedUsers(prisma);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
