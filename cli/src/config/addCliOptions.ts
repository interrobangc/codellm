import type { Argv } from 'yargs';

import { OPTIONS } from './constants.js';

export const addCliOptions = (yargv: Argv) => yargv.options(OPTIONS);
