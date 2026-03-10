import { ProjectIntelligence } from '../core/detect.js';

export const agentsTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string, intelligence?: ProjectIntelligence) => `# AGENTS.md — Agent Coordination and Strategy

This document outlines the strategy for AI agents working within the \`${projectName}\` project.

## Project Intelligence

- **Name**: ${projectName}
- **Stack**: ${projectType}
- **Description**: ${description}
- **Architecture**: ${intelligence?.isMonorepo ? 'Monorepo (Turbo/Workspaces)' : 'Single Package'}
- **TypeScript**: ${intelligence?.hasTypeScript ? 'Enabled' : 'Not detected'}
- **Tailwind CSS**: ${intelligence?.hasTailwind ? 'Configured' : 'Not detected'}
- **ESLint**: ${intelligence?.hasESLint ? 'Active' : 'Not configured'}
- **Prettier**: ${intelligence?.hasPrettier ? 'Active' : 'Not configured'}
${intelligence?.configFiles?.length ? `- **Config Files**: ${intelligence.configFiles.join(', ')}` : ''}
${intelligence?.dependencies ? `- **Key Dependencies**: ${Object.keys(intelligence.dependencies).slice(0, 15).join(', ')}` : ''}

## Tech Stack and Architecture

This project uses a ${projectType} stack. Agents should be aware of the following:
- Primary language: ${intelligence?.hasTypeScript ? 'TypeScript (strict mode recommended)' : 'JavaScript'}
- Styling: ${intelligence?.hasTailwind ? 'Tailwind CSS utility-first approach' : 'Standard CSS/framework styling'}
- Package manager: Detected from lockfile (npm/pnpm/yarn)
${intelligence?.isMonorepo ? '- Monorepo: Use workspace-aware commands. Do not cd into packages manually.' : ''}

## Core Workflows (Commands)

- **Development**: ${commands}
- **Build**: npm run build
- **Lint**: npx eslint . (if configured)
- **Test**: npm test (if configured)

## Structural Mental Model

- Agents should think in terms of "modules" and "boundaries."
- Every function should have a single responsibility.
- Prefer composition over inheritance.
- Keep side effects at the edges of the system (I/O, API calls, file writes).
- When uncertain about a pattern, check existing code for precedent before introducing new ones.

## Guardrails and Safety

- **Forbidden zones**: ${forbidden}
- Never commit API keys, secrets, or tokens to version control.
- Always validate user input before processing.
- Prefer explicit error handling over silent failures.
- Do not install new dependencies without explicit user confirmation.

## Agent Personality and Instructions

- Be precise and technically rigorous. Avoid vague descriptions.
- Write clean, production-ready code. No placeholder implementations.
- Use professional English optimized for LLM parsing. No emojis in code or documentation.
- When making changes, explain the "why" not just the "what."
- Prioritize maintainability and readability over cleverness.
`;
