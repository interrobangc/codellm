const users = [
  {
    email: 'bo@interrobang.consulting',
    firstName: 'Bo',
    lastName: 'Davis',
    password: 'password',
  },
];

export default async function seedUsers(prisma) {
  for (const user of users) {
    await prisma.user.upsert({
      create: user,
      update: {},
      where: { email: user.email },
    });
  }
}
