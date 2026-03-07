# mkagent

**High-fidelity AI context for agentic workflows.**

mkagent is an AI-first CLI designed to bridge the gap between human intent and AI agent execution. It analyzes your project structure and generates deeply technical, non-generic instruction files (AGENTS.md, CLAUDE.md, GEMINI.md) that help LLMs understand your codebase without the noise.

## Features

- **Context Retention**: Scans project structure and package definitions to generate rules that ensure agents maintain deep context.
- **Multi-Model Support**: Seamlessly switch between GPT-4o, Claude 3.5 Sonnet, and Gemini 2.0 Flash.
- **Framework Scaffolding**: Automates the creation of Next.js and React project structures with standardized patterns.
- **LLM-Optimized**: Generates structured, instruction-dense markdown optimized for AI reasoning, strictly emoji-free.

## Quick Start

### Installation

```bash
npm install -g mkagent
```

### Configuration

Set up your AI providers and default model:

```bash
mkagent config
```

### Usage

Initialize a new project or generate agent files for an existing one:

```bash
mkagent init
```

## Monorepo Structure

- `apps/docs`: The premium 3-page documentation site built with React, Router, and Tailwind 4.
- `packages/mkagent`: The core CLI tool.

## Contributing

1. Clone the repository.
2. Run `npm install`.
3. Use `npm run build` to compile the monorepo using Turborepo.

## License

MIT
