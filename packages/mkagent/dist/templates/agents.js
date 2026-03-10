export const agentsTemplate = (projectName, projectType, description, commands, forbidden) => `
# AGENTS.md

## Project Overview
**Project Name:** ${projectName}
**Type:** ${projectType}
**Description:** ${description}

## Tech Stack
- AI-Generated scaffolding using mkagent.
- Fallback template used.

## Commands
- ${commands}

## File Structure
- Reference your Next.js-style or monorepo structure here.

## Rules & Boundaries
- Forbidden folders to touch: ${forbidden}
- Always follow standard styling boundaries.

## Agent-Specific Notes
- General instructions for all agents.
`;
