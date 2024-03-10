import type { Ollama } from 'ollama';

export const initModel = async (client: Ollama, model: string) => {
  const models = await client.list();

  if (!models.models.some((m) => m.name === model)) {
    await client.pull({ model });
  }
};

export default initModel;
