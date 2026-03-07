export const claudeTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string) => `
# CLAUDE.md

## Project Overview
**Project Name:** ${projectName}
**Type:** ${projectType}
**Description:** ${description}

## Tech Stack
- AI-Generated scaffolding using mkagent.
- Fallback template used (Claude specifics missing in fallback).

## Commands
- ${commands}

## File Structure
- Reference your workspace structure.

## Rules & Boundaries
- Forbidden folders: ${forbidden}

## Agent-Specific Notes
- Claude: Use detailed step-by-step thinking for code implementations.
- Claude: Write tests in your thought process.
`;
