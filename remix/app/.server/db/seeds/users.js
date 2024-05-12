import { db } from '@remix/.server/db';
import { userSchema } from '@remix/.server/db/schema.js';

const users = [
  {
    auth0Id: 'mock-user',
    email: 'bo+codellm-mock@interrobang.consulting',
    firstName: 'Bo',
    isVerified: true,
    lastName: 'Davis',
  },
];

export default async function seedUsers() {
  for (const user of users) {
    await db.insert(userSchema).values(user);
  }
}
