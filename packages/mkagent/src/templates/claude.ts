import { ProjectIntelligence } from '../core/detect.js';

export const claudeTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string, intelligence?: ProjectIntelligence) => `# CLAUDE.md — ${projectName} Development Guide

This document provides essential technical context and instructions for Claude when developing the \`${projectName}\` project.

## Project Intelligence

- **Name**: ${projectName}
- **Type**: ${projectType}
- **Description**: ${description}
- **TypeScript**: ${intelligence?.hasTypeScript ? 'Yes — use strict types, avoid \`any\`' : 'No'}
- **Monorepo**: ${intelligence?.isMonorepo ? 'Yes — use workspace-aware commands' : 'No'}
${intelligence?.configFiles?.length ? `- **Config Files**: ${intelligence.configFiles.join(', ')}` : ''}

## Tech Stack and Architecture

- **Runtime**: Node.js with ${intelligence?.hasTypeScript ? 'TypeScript' : 'JavaScript'}
- **Styling**: ${intelligence?.hasTailwind ? 'Tailwind CSS — use utility classes, avoid custom CSS unless necessary' : 'Standard CSS approach'}
- **Linting**: ${intelligence?.hasESLint ? 'ESLint active — run linter before committing' : 'No linter configured'}
- **Formatting**: ${intelligence?.hasPrettier ? 'Prettier active — format on save' : 'Manual formatting'}
${intelligence?.dependencies ? `- **Key Dependencies**: ${Object.keys(intelligence.dependencies).slice(0, 15).join(', ')}` : ''}

## Core Workflows (Commands)

- **Development**: ${commands}
- **Build**: npm run build
- **Lint**: npx eslint . (if configured)
- **Test**: npm test (if configured)

## Structural Mental Model

- Think step-by-step before writing code. Plan the approach, then implement.
- Read existing patterns in the codebase before introducing new ones.
- When modifying a function, understand its callers and dependencies first.
- Small, focused commits are better than large, sweeping changes.
- Always consider edge cases and error states.

## Guardrails and Safety

- **Forbidden zones**: ${forbidden}
- Never overwrite files without explicit user confirmation.
- Always validate API availability before making network calls.
- Do not log raw API keys or sensitive data — use masking utilities.
- Prefer \`const\` over \`let\`. Avoid \`var\` entirely.
- Handle async errors with try/catch, not unhandled promise rejections.

## Agent Personality and Instructions

- Use detailed step-by-step reasoning for complex implementations.
- Write tests alongside implementation when modifying core logic.
- Provide concise but complete explanations of architectural decisions.
- Use clean, professional English. No emojis in code or documentation.
- When generating markdown files, ensure they are optimized for LLM parsing.
- Proactively identify potential issues and suggest preventive measures.
`;
