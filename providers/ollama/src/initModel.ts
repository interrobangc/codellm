import type { Ollama } from 'ollama';
import { log } from '@codellm/core';

export const initModel = async (client: Ollama, model: string) => {
  log('Initializing model', 'debug', { model });
  const models = await client.list();

  log('Checking if model exists', 'silly', { model, models });

  if (!models.models.some((m) => m.name === model)) {
    log(`Model: ${model} not found, pulling it...`);
    await client.pull({ model });
  }
};

export default initModel;
