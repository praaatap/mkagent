import { ProjectIntelligence } from '../core/detect.js';

export const cursorrulesTemplate = (projectName: string, projectType: string, description: string, commands: string, forbidden: string, intelligence?: ProjectIntelligence) => `# Cursor Rules for ${projectName}

## Project Context
- Project: ${projectName}
- Type: ${projectType}
- Description: ${description}
${intelligence?.hasTypeScript ? '- Language: TypeScript (strict mode)' : '- Language: JavaScript'}
${intelligence?.isMonorepo ? '- Architecture: Monorepo' : ''}

## Code Style
- Use ${intelligence?.hasTypeScript ? 'TypeScript with strict types. Avoid \`any\`.' : 'modern JavaScript (ES2022+).'}
- ${intelligence?.hasTailwind ? 'Use Tailwind CSS utility classes for styling.' : 'Follow the existing CSS patterns in the project.'}
- Prefer \`const\` declarations. Use \`let\` only when reassignment is necessary.
- Use async/await over raw Promises. Handle errors with try/catch.
- Keep functions small and focused. One function, one responsibility.

## File Organization
- Follow the existing directory structure. Do not create new top-level directories without asking.
- ${intelligence?.isMonorepo ? 'Respect workspace boundaries. Do not import across packages without using proper workspace references.' : 'Keep related files close together.'}
- Forbidden areas: ${forbidden}

## Commands
- Dev: ${commands}
- Build: npm run build
- Test: npm test

## Behavior
- Always explain changes before making them.
- Read existing code patterns before introducing new conventions.
- Do not install dependencies without confirmation.
- Write production-quality code. No placeholder or TODO implementations.
- No emojis in code or documentation.
`;
