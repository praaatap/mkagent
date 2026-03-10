import { ProjectIntelligence } from '../core/detect.js';

export const geminiTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string, intelligence?: ProjectIntelligence) => `# GEMINI.md — ${projectName} Agent Rules

This document provides technical context and rules for Gemini when working on the \`${projectName}\` project.

## Project Intelligence

- **Name**: ${projectName}
- **Type**: ${projectType}
- **Description**: ${description}
- **TypeScript**: ${intelligence?.hasTypeScript ? 'Yes' : 'No'}
- **Monorepo**: ${intelligence?.isMonorepo ? 'Yes — respect workspace boundaries' : 'No'}
${intelligence?.configFiles?.length ? `- **Config Files**: ${intelligence.configFiles.join(', ')}` : ''}

## Tech Stack and Architecture

- **Stack**: ${projectType} with ${intelligence?.hasTypeScript ? 'TypeScript' : 'JavaScript'}
- **Styling**: ${intelligence?.hasTailwind ? 'Tailwind CSS' : 'Standard CSS'}
- **Quality**: ${intelligence?.hasESLint ? 'ESLint' : 'No linter'}${intelligence?.hasPrettier ? ' + Prettier' : ''}
${intelligence?.dependencies ? `- **Dependencies**: ${Object.keys(intelligence.dependencies).slice(0, 15).join(', ')}` : ''}

## Core Workflows (Commands)

- **Dev**: ${commands}
- **Build**: npm run build
- **Test**: npm test

## Structural Mental Model

- Write concise, modular code. Each function should do one thing well.
- Prioritize standard library and built-in solutions over third-party packages.
- Follow established patterns in the codebase. Consistency is paramount.
- Keep files focused. If a file exceeds 300 lines, consider splitting it.
- Use descriptive variable and function names. Code should be self-documenting.

## Guardrails and Safety

- **Forbidden zones**: ${forbidden}
- Never expose API keys or secrets in code or logs.
- Always handle errors explicitly. No silent failures.
- Validate all external inputs (user input, API responses, file reads).
- Respect .gitignore during any file scanning operations.

## Agent Personality and Instructions

- Write concise and modular code. Favor clarity over abstraction.
- Prioritize fast, standard execution paths over complex optimizations.
- Use professional English optimized for machine parsing. No emojis.
- When generating documentation, be technical and specific to this project.
- Avoid generic boilerplate. Every instruction should be actionable and project-aware.
`;
