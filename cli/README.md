# codellm-cli

codellm-cli is a command-line interface (CLI) for codellm, a locally running LLM agent that can be used to analyze code with the context of your own codebase using LLM models.

## Configuration

See [config.yml](./config.yml) for an example configuration file. You can also create a new yaml config file and set the `CODELLM_CONFIG` environment variable to point to it.

See [config/constants.ts](../src/config/constants.ts) for a list of environment variables and flags that can be set to override the default configuration.
