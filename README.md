# CodeLLM

This is the start of a locally running LLM agent that can be used to analyze code with the context of your own codebase using LLM models. It is heavily inspired by the [groundcrew](https://github.com/prolego-team/groundcrew) project.

## Prerequisites

### Code

- nvm (Node Version Manager) - [Installation Instructions](https://github.com/nvm-sh/nvm#installing-and-updating)
- docker - [Installation Instructions](https://docs.docker.com/get-docker/)

### Provider

The system currently supports [ollama](https://ollama.com/) and [openai](https://platform.openai.com/docs/quickstart?context=python) providers. You will need to have ollama running locally or configure an API key for openai.

## CLI Quickstart

The CLI is a simple way to interact with the system. It is

### Setup

```bash
nvm use
npm ci
```

### Datastore

The first step is to start the vector db. This will currently start a local instance of chromadb that persists data to the `.chromadb` directory in the root of the project.

```bash
npm run start:datastore
```

To stop the datastore:

```bash
npm run stop:datastore
```

To view logs from the datastore:

```bash
npm run logs:datastore
```

### Import embeddings

The first step is to import the embeddings for your codebase. We use a locally running chromadb instance as a vector db. The initial import will take a while. It can be run again to update the embeddings and will only import updated and new files.

By default it will import ts code from this repository. You can change the `CODELLM_IMPORT_PATH` environment variable to point to a different codebase, modify the `cli/config.yml` file, or create a new yaml config file and set the `CODELLM_CONFIG` environment variable to point to it.

```bash
  npm run start:import
```

### Ollama

This assumes you have ollama running locally on the default port.

```bash
npm start
```

### OpenAI

This assumes you have an API key for openai set as an environment variable: `OPENAI_API_KEY`.

```bash
CODELLM_PROVIDER=openai npm start
```
