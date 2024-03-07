# CodeLLM Core

The core of the CodeLLM system is responsible for orchestrating the agents and tools.

## Architecture

The core of the system is composed of a few main components. It is designed to be extensible and pluggable. The main components are:

- agent: Interface to the LLM provider and tools. It is responsible for taking a query, using an LLM to choose tools that gather data, and then sending the data to the provider to get a response.
- importer: Responsible for running the import functions for each available tool.
- llm: Manages the available llm providers in an extensible way.
- prompt: Responsible for building a prompt for the LLM provider using langchain prompts.
- tool: Manages the available tools in an extensible way.
- vectorDb: Manages the vector database that stores embeddings of code files and other data.
