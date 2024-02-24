// import OpenAI, {ClientOptions} from 'openai';


export const getClient = (model: string) => {
  // const client = new OpenAI(config)

  return {
    initModel: async () => {},
    chat: async (role: string, content: string) => {
      return `OpenAI chat: ${role} ${content} ${model}`
    }
  }
}