# CodeLLM langchain LLM provider

This provider wraps a langchain language model for use in CodeLLM.

## Usage

To use this provider, you must have the appropriate langchain model installed via npm as well as this module.

Example CodeLLM cli configuration:

```yaml
providers:
  langchain-openai:
    module: '@interrobangc/codellm-provider-langchain'
    config:
      module: '@langchain/openai'
      chatClass: ChatOpenAI

llms:
  agent:
    provider: langchain-openai
    model: gpt-4-turbo-preview
```
