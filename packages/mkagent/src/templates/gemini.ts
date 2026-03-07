export const geminiTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string) => `
# GEMINI.md

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
- Consult the current working directory tree.

## Rules & Boundaries
- Forbidden folders: ${forbidden}

## Agent-Specific Notes
- Gemini: Write concise and modular code.
- Gemini: Prioritize fast and standard execution.
`;
