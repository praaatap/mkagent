import { text, select, confirm, multiselect, isCancel, cancel } from '@clack/prompts';
import { MkagentConfig, getConfig, saveConfig } from './config.js';

export async function runConfigPrompt() {
    let currentConfig = await getConfig();
    if (!currentConfig) {
        currentConfig = { defaultModel: 'anthropic', keys: {} } as MkagentConfig;
    }

    const defaultModel = await select({
        message: 'Which AI model do you want to use?',
        options: [
            { value: 'openai', label: 'OpenAI (GPT-4o)' },
            { value: 'anthropic', label: 'Anthropic (Claude)' },
            { value: 'gemini', label: 'Google (Gemini)' }
        ],
        initialValue: currentConfig.defaultModel
    });
    if (isCancel(defaultModel)) return cancel('Operation cancelled');

    const apiKey = await text({
        message: 'Enter your API key:',
        placeholder: 'sk-...',
        validate(value) {
            if (value.length === 0) return 'Value is required!';
        }
    });
    if (isCancel(apiKey)) return cancel('Operation cancelled');

    const setAsDefault = await confirm({
        message: 'Set as default model?',
        initialValue: true
    });
    if (isCancel(setAsDefault)) return cancel('Operation cancelled');

    if (setAsDefault) {
        currentConfig.defaultModel = defaultModel as 'openai' | 'anthropic' | 'gemini';
    }
    const safeModel = defaultModel as 'openai' | 'anthropic' | 'gemini';
    currentConfig.keys[safeModel] = apiKey as string;

    await saveConfig(currentConfig);
    return currentConfig;
}

export interface ProjectOptions {
    folderName: string;
    projectType: string;
    description: string;
    commands: string;
    forbidden: string;
    agents: string[];
    // Advanced Next.js Options
    useAppRouter?: boolean;
    useTailwind?: boolean;
    useSrcDir?: boolean;
    importAlias?: string;
    // Agent Persona Options
    technicalLevel?: 'Senior' | 'Expert' | 'Architect';
    focusArea?: 'Performance' | 'Security' | 'Testing' | 'Fullstack';
}

export async function runInitPrompt(): Promise<ProjectOptions | void> {
    const folderName = await text({
        message: 'What is your project folder name?',
        placeholder: 'my-app',
        defaultValue: 'my-app'
    });
    if (isCancel(folderName)) return cancel('Operation cancelled');

    const projectType = await select({
        message: 'What type of project?',
        options: [
            { value: 'Next.js', label: 'Next.js (Recommended)' },
            { value: 'React', label: 'React (Vite)' },
            { value: 'Node.js API', label: 'Node.js API' },
            { value: 'Python', label: 'Python' },
            { value: 'Monorepo', label: 'Monorepo' },
            { value: 'Other', label: 'Other' }
        ]
    });
    if (isCancel(projectType)) return cancel('Operation cancelled');

    let advancedOptions: any = {};
    if (projectType === 'Next.js') {
        const useAppRouter = await confirm({
            message: 'Use App Router? (Recommended)',
            initialValue: true
        });
        if (isCancel(useAppRouter)) return cancel('Operation cancelled');

        const useTailwind = await confirm({
            message: 'Include Tailwind CSS?',
            initialValue: true
        });
        if (isCancel(useTailwind)) return cancel('Operation cancelled');

        const useSrcDir = await confirm({
            message: 'Use `src/` directory?',
            initialValue: true
        });
        if (isCancel(useSrcDir)) return cancel('Operation cancelled');

        const importAlias = await text({
            message: 'Configure import alias?',
            placeholder: '@/*',
            defaultValue: '@/*'
        });
        if (isCancel(importAlias)) return cancel('Operation cancelled');

        advancedOptions = { useAppRouter, useTailwind, useSrcDir, importAlias };
    }

    const description = await text({
        message: 'Short description of your project?',
        placeholder: 'A premium AI-agent ready project'
    });
    if (isCancel(description)) return cancel('Operation cancelled');

    const technicalLevel = await select({
        message: 'Agent Technical Level?',
        options: [
            { value: 'Senior', label: 'Senior Engineer' },
            { value: 'Expert', label: 'Expert Developer' },
            { value: 'Architect', label: 'System Architect' }
        ],
        initialValue: 'Expert'
    });
    if (isCancel(technicalLevel)) return cancel('Operation cancelled');

    const focusArea = await select({
        message: 'Agent Focus Area?',
        options: [
            { value: 'Fullstack', label: 'Balanced Fullstack' },
            { value: 'Performance', label: 'High Performance' },
            { value: 'Security', label: 'Security & Hardening' },
            { value: 'Testing', label: 'Test-Driven Development' }
        ],
        initialValue: 'Fullstack'
    });
    if (isCancel(focusArea)) return cancel('Operation cancelled');

    const agents = await multiselect({
        message: 'Which agent files to generate?',
        options: [
            { value: 'AGENTS.md', label: 'AGENTS.md (Coordination)' },
            { value: 'CLAUDE.md', label: 'CLAUDE.md (Dev Rules)' },
            { value: 'MEMORY.md', label: 'MEMORY.md (Context)' }
        ],
        initialValues: ['AGENTS.md', 'CLAUDE.md', 'MEMORY.md']
    });
    if (isCancel(agents)) return cancel('Operation cancelled');

    return {
        folderName: folderName as string,
        projectType: projectType as string,
        description: description as string,
        commands: projectType === 'Next.js' ? 'npm run dev' : 'npm start',
        forbidden: 'dist, .env, .next, node_modules',
        agents: agents as string[],
        ...advancedOptions,
        technicalLevel: technicalLevel as any,
        focusArea: focusArea as any
    };
}
