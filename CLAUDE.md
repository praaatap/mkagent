# CLAUDE.md — mkagent Development Guide

This document provides essential technical context and instructions for AI agents developing the `mkagent` project.

## Project Intelligence
- **Stack**: Node.js, TypeScript, Turbo (Monorepo)
- **Frontend**: Vite, React, Tailwind CSS (in `apps/docs`)
- **CLI**: Commander.js, Clack Prompts, AI (OpenAI, Anthropic, Gemini) integration
- **Building**: `npm run build` (Turbo) or `cd packages/mkagent && npm run build`

## Tech Stack and Architecture
- `packages/mkagent`: The core CLI tool.
  - `src/detect.ts`: Logic for scanning projects and returning `ProjectIntelligence`.
  - `src/ai.ts`: Orchestrates AI model calls with detailed structural context.
  - `src/generate.ts`: Handles the generation of markdown agent files and project scaffolding.
- `apps/docs`: The documentation portal built with React and Tailwind CSS.

## Core Workflows (Commands)
- **Local Dev (CLI)**: `npm run build --filter=mkagent`
- **Local Dev (Docs)**: `npm run dev --filter=docs`
- **Health Check**: `node packages/mkagent/dist/index.js doctor` (after build)
- **Initialization**: `node packages/mkagent/dist/index.js init`

## Structural Mental Model
- **mkagent** is an "intelligence-first" tool. It doesn't just scaffold; it understands.
- **ProjectIntelligence** is the core bridge between the local filesystem and the AI prompt.
- **Emoji-Free Policy**: All generated markdown files and documentation must be technical, professional, and free of emojis to ensure maximum clarity for LLMs.

## Guardrails and Safety
- Always respect `.gitignore` during scans.
- Do not overwrite existing files in `init` without explicit user confirmation.
- API keys must be masked in all CLI outputs using `maskKey`.

## Agent Personality and Instructions
- You are a precise, efficient, and technically sophisticated AI engineer.
- Be proactive but never destructive.
- When generating agent files, prioritize high-fidelity technical instructions over generic boilerplate.
