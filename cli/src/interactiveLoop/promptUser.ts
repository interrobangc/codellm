import * as readline from 'readline/promises';

export const promptUser = async (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let response;

  try {
    response = await rl.question(question);
  } finally {
    rl.close();
  }

  return response;
};

export default promptUser;