# CodeLLM

<p align="center">
  <a href="https://github.com/interrobangc/codellm/actions/workflows/test.yml">
    <img src="https://github.com/interrobangc/codellm/actions/workflows/test.yml/badge.svg?branch=main" alt="Tests">
  </a>
</p>

CodeLLM is an extensible LLM agent pipeline framework that can be used to build a system of AI agents, tools, and datastores that interact to solve complex problems. It was initially inspired by the [groundcrew](https://github.com/prolego-team/groundcrew) project. It is initially focused on code and codebase analysis, but could be extended to other domains.

It is still very much a POC and is not ready for use beyond experimentation.

## Architecture

The system is composed of a few main components. It is designed to be extensible and pluggable. The main components are:

- [CLI](cli/): A simple command line interface to interact with the system.
- [Core](core/): The core of the system. It is responsible for orchestrating the agents and tools.
- [Providers](providers/): These are a standard interface for various LLM providers.
- [Tools](tools/): These are the tools that the agent uses to gather data. They are responsible for taking a query and returning data. They are not responsible for making the query to the provider.
- [VectorDbs](vectorDbs/): A vector database that stores embeddings of code files and other data.

## Prerequisites

### Code

- nvm (Node Version Manager) - [Installation Instructions](https://github.com/nvm-sh/nvm#installing-and-updating)
- docker - [Installation Instructions](https://docs.docker.com/get-docker/)

### Provider

The system currently supports [ollama](https://ollama.com/) and [openai](https://platform.openai.com/docs/quickstart?context=python) providers. You will need to have ollama running locally or configure an API key for openai.

## Quickstart

### Setup

```bash
nvm use
npm ci
```

### Datastore

The first step is to start the vector db. This will currently start a local instance of chromadb that listens on [http://localhost:8000](http://localhost:8000/api/v1/heartbeat) persists data to the `.chromadb` directory in the root of the project.

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

#### Use the archived chromadb

If you have [git-lfs](https://git-lfs.github.com/) installed, you can use the archived chromadb to import the embeddings. This is the fastest way to get started.

```bash
npm run extract:chromadb
```

#### Run the importer

The first step is to import the embeddings for your codebase. We use a locally running chromadb instance as a vector db. The initial import will take a while. It can be run again to update the embeddings and will only import updated and new files.

By default it will import ts code from this repository. You can change the `CODELLM_IMPORT_PATH` environment variable to point to a different codebase, modify the `cli/config.yml` file, or create a new yaml config file and set the `CODELLM_CONFIG` environment variable to point to it.

```bash
  npm run start:import
```

### Run the cli agent

#### Ollama

This assumes you have ollama running locally on the default port.

```bash
npm start
```

#### Anthropic (Claude)

This assumes you have an API key for anthropic set as an environment variable: `ANTHROPIC_API_KEY`.

```bash
CODELLM_PROVIDER=anthropic npm start
```

#### Mistral

This assumes you have an API key for mistral set as an environment variable: `MISTRAL_API_KEY`.

```bash
CODELLM_PROVIDER=mistral npm start
```

#### OpenAI

This assumes you have an API key for openai set as an environment variable: `OPENAI_API_KEY`.

```bash
CODELLM_PROVIDER=openai npm start
```

### Run the remix app

The remix app is a simple web interface that allows you to ask questions about the codebase and see the results. It is a work in progress.

```bash
npm run dev
```
