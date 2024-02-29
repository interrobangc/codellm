export type LangchanModelConfig = Record<string, unknown>;

export type LangchainConfig = {
  module: string;
  chatClass: string;
  config: LangchanModelConfig;
};
