# MEMORY.md — Persistent Project Context

This document captures the long-term context, decisions, and evolution of the `mkagent` project.

## Project Intelligence
- **Evolution**: Started as a basic scaffolding tool; evolved into a deep project intelligence engine for AI agents.
- **Current Focus**: Enhancing the "Dev Docs" portal and polishing the CLI experience (e.g., `doctor` command).

## Tech Stack and Architecture
- **Initial Choice**: Commander.js + Clack for CLI.
- **Pivot**: Replaced simple stack detection with a comprehensive `ProjectIntelligence` object in `detect.ts`.
- **Refinement**: Integrated Tailwind-friendly linting and premium animations in the Documentation site.

## Core Workflows (Commands)
- **Build & Link**: `npm run build && npm link` (for local development of the CLI).
- **Run Tests**: (Placeholder for future test suite integration).

## Structural Mental Model
- `mkagent` is a gateway. It takes a messy project structure and distills it into clear, technical rules for AI agents.
- The "Dogfooding" principle: Use `mkagent` on itself to ensure it meets the highest standards of agent communication.

## Guardrails and Safety
- Avoid dependencies that bloat the CLI package.
- Maintain compatibility with OpenAI, Anthropic, and Google AI offerings.

## Agent Personality and Instructions
- Capture architectural decisions in this file whenever they significantly change.
- Use this file to understand the "Why" behind the project's current state.
