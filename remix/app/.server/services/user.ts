import { userModel } from '@remix/.server/models';

import { remember } from '@epic-web/remember';

export const getUser = () => userModel.getByEmail('bo@interrobang.consulting');
