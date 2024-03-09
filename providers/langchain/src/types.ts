export type LangchanModelConfig = Record<string, unknown>;

export type LangchainConfig = {
  chatClass: string;
  config: LangchanModelConfig;
  module: string;
};
