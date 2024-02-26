# codellm-cli

codellm-cli is a command-line interface (CLI) for codellm, a locally running LLM agent that can be used to analyze code with the context of your own codebase using LLM models.

## ENVIRONMENT VARIABLES

| Command                        | Description                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| `code-llm help`                | Display available commands and usage information.                                                   |
| `code-llm analyze`             | Analyze the codebase for cyclomatic complexity and list the most complex files.                     |
| `code-llm findusage <object>`  | Find the importable object in the codebase, list where it's imported, and how many times it's used. |
| `code-llm contents <filepath>` | Display the content of a specific file with an inexact path using fuzzy matching.                   |
| `code-llm install`             | Provide information on installation and usage based on the codebase documentation.                  |

## Configuration

You can configure Interrobang Code LLM by setting environment variables or providing a configuration file (by default, located at `./config.yml`). The following options are available:

| Option                  | Environment Variable | Default      | Description             |
| ----------------------- | -------------------- | ------------ | ----------------------- |
| configFile              | CODELLM_CONFIG_FILE  | ./config.yml | Path to the config file |
| llmProvider             | CODELLM_LLM_PROVIDER | openai       | LLM provider            |
| logLevel                | CODELLM_LOG_LEVEL    | info         | Log level               |
| path                    | CODELLM_PATH         | .            | Path to search          |
| providers.openai.apiKey | OPENAI_API_KEY       |              | OpenAI API key          |

### Configuration File Example

```yaml
configFile: './my-config.yml'
llmProvider: 'ollama'
logLevel: 'debug'
path: './src'
```
