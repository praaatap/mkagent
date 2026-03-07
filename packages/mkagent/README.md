# mkagent CLI

**The AI-first CLI for generating agent-ready documentation.**

This package contains the core CLI utility for `mkagent`. It analyzes your project structure and generates instruction files (AGENTS.md, CLAUDE.md, GEMINI.md) optimized for AI agent parsing.

## Installation

```bash
npm install -g mkagent
```

## Usage

### 1. First-Run Setup
Run the config command to set up your AI provider (OpenAI, Anthropic, or Google) and save your API keys. Keys are saved securely in `~/.mkagent/config.json`.

```bash
mkagent config
```

### 2. Project Initialisation
Run init in any directory to scaffold a new project structure or generate agent instructions for an existing one.

```bash
mkagent init
```

### 3. Regeneration
To update your agent instructions when your project structure or package definitions change:

```bash
mkagent regenerate
```

## Features

- **Context Retention**: Reads project metadata to generate rules that ensure agents maintain deep context.
- **Multi-Model Support**: Supports GPT-4o, Claude 3.5 Sonnet, and Gemini 2.0 Flash.
- **LLM-Optimized**: Generates structured, instruction-dense markdown optimized for AI reasoning, strictly emoji-free.

## Build and Development

1. Run `npm install`.
2. Run `npm run build` to compile the TypeScript source.
3. Use `npm run dev` to watch for changes during development.
