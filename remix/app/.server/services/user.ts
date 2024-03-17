import { userModel } from '../models';

import { remember } from '@epic-web/remember';

// Hardcoded user for now
const user = await remember(
  'user',
  async () => await userModel.getByEmail('bo@interrobang.consulting'),
);

export const getUser = () => user;
