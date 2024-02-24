import type { Ollama } from 'ollama'

export const initModel = async (client: Ollama, model: string) => {
  await client.pull({model})
}

export default initModel;
