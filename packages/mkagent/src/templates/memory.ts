import { ProjectIntelligence } from '../core/detect.js';

export const memoryTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string, intelligence?: ProjectIntelligence) => `# MEMORY.md — Persistent Project Context

This document captures the long-term context, decisions, and evolution of the \`${projectName}\` project.

## Project Intelligence

- **Name**: ${projectName}
- **Type**: ${projectType}
- **Description**: ${description}
- **Current Stack**: ${intelligence?.hasTypeScript ? 'TypeScript' : 'JavaScript'} / ${projectType}
${intelligence?.isMonorepo ? '- **Architecture**: Monorepo with workspace management' : ''}

## Evolution and Decisions

- **Initial Setup**: Project bootstrapped with mkagent intelligence layer.
- **Stack Choice**: ${projectType} selected for ${description || 'the project requirements'}.
${intelligence?.hasTypeScript ? '- **TypeScript**: Enabled for type safety and better developer experience.' : ''}
${intelligence?.hasTailwind ? '- **Tailwind CSS**: Chosen for rapid, utility-first UI development.' : ''}

## Core Workflows

- **Development**: ${commands}
- **Build**: npm run build
- **Test**: npm test (when configured)

## Context for Agents

- This file is a living document. Update it when significant architectural decisions are made.
- Use this file to understand the "Why" behind the project's current state.
- Agents should reference this file before making structural changes.

## Guardrails

- Forbidden areas: ${forbidden}
- Capture breaking changes and migration notes in this file.
- Do not remove historical context, append new decisions below existing ones.
`;
