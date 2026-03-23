import { text, select, confirm, multiselect, isCancel, cancel } from '@clack/prompts';
import { MkagentConfig, getConfig, saveConfig } from './config.js';

export async function runConfigPrompt() {
    let config = await getConfig();
    if (!config) {
        config = { activeProfile: 'default', profiles: {} };
    }

    const mode = await select({
        message: 'What would you like to do?',
        options: [
            { value: 'active', label: 'Use/Configure Active Profile' },
            { value: 'create', label: 'Create New Profile' },
            { value: 'switch', label: 'Switch Active Profile' }
        ]
    });
    if (isCancel(mode)) return cancel('Operation cancelled');

    if (mode === 'switch') {
        const profile = await select({
            message: 'Select profile to activate:',
            options: Object.keys(config.profiles).map(p => ({ value: p, label: p }))
        });
        if (isCancel(profile)) return cancel('Operation cancelled');
        config.activeProfile = profile as string;
        await saveConfig(config);
        return config;
    }

    let profileName = config.activeProfile;
    if (mode === 'create') {
        const name = await text({
            message: 'Name for the new profile:',
            placeholder: 'work, personal, project-x'
        });
        if (isCancel(name)) return cancel('Operation cancelled');
        profileName = name as string;
    }

    let pConfig = config.profiles[profileName] || { defaultModel: 'anthropic', keys: {} };

    const defaultModel = await select({
        message: `[${profileName}] Which AI model for this profile?`,
        options: [
            { value: 'openai', label: 'OpenAI (GPT-4o)' },
            { value: 'anthropic', label: 'Anthropic (Claude)' },
            { value: 'gemini', label: 'Google (Gemini)' },
            { value: 'groq', label: 'Groq (Llama 3)' },
            { value: 'openai-compatible', label: 'OpenAI-Compatible (LM Studio, vLLM, etc.)' },
            { value: 'local', label: 'Local (Ollama)' }
        ],
        initialValue: pConfig.defaultModel
    });
    if (isCancel(defaultModel)) return cancel('Operation cancelled');

    const isLocal = defaultModel === 'local';
    const isCompatible = defaultModel === 'openai-compatible';
    const isCloud = ['openai', 'anthropic', 'gemini', 'groq'].includes(defaultModel as string);

    // Prompt for model name if requested or for local/compatible
    if (isLocal || isCompatible || isCloud) {
        let defaultModelName = 'default';
        if (isLocal) defaultModelName = 'llama3.2';
        if (defaultModel === 'openai') defaultModelName = 'gpt-4o';
        if (defaultModel === 'anthropic') defaultModelName = 'claude-3-5-sonnet-20241022';
        if (defaultModel === 'gemini') defaultModelName = 'gemini-1.5-flash';
        if (defaultModel === 'groq') defaultModelName = 'llama-3.3-70b-versatile';

        const modelName = await text({
            message: `Enter model name (leave default for ${defaultModelName}):`,
            placeholder: defaultModelName,
            defaultValue: defaultModelName
        });
        if (isCancel(modelName)) return cancel('Operation cancelled');
        pConfig.modelName = modelName as string;

        if (isLocal || isCompatible) {
            const defaultUrl = isLocal ? 'http://localhost:11434/v1' : 'http://localhost:1234/v1';
            const baseUrl = await text({
                message: `Enter ${isLocal ? 'Ollama' : 'API'} endpoint URL:`,
                placeholder: defaultUrl,
                defaultValue: defaultUrl
            });
            if (isCancel(baseUrl)) return cancel('Operation cancelled');
            pConfig.baseUrl = baseUrl as string;

            if (isLocal) {
                pConfig.keys[pConfig.defaultModel as keyof typeof pConfig.keys] = 'ollama';
            }
        }
    }

    // For cloud models, prompt for API key
    if (!isLocal) {
        const apiKey = await text({
            message: `Enter ${isCompatible ? 'API key (or leave empty if none needed)' : 'Primary API key'}:`,
            placeholder: 'sk-...',
            validate(value) {
                if (!isCompatible && value.length === 0) return 'Value is required!';
            }
        });
        if (isCancel(apiKey)) return cancel('Operation cancelled');
        pConfig.keys[defaultModel as keyof typeof pConfig.keys] = (apiKey as string) || 'none';
    }

    const advanced = await confirm({
        message: 'Configure advanced settings? (Backup keys, params, Gist token)',
        initialValue: false
    });
    if (isCancel(advanced)) return cancel('Operation cancelled');

    if (advanced) {
        const backupKey = await text({
            message: 'Enter Backup API key (optional):',
            placeholder: 'sk-...'
        });
        if (!isCancel(backupKey) && backupKey.length > 0) {
            pConfig.backupKeys = { ...pConfig.backupKeys, [defaultModel as string]: backupKey as string };
        }

        const temp = await text({
            message: 'Model Temperature (0.0 to 1.0):',
            placeholder: '0.7',
            defaultValue: '0.7'
        });
        if (!isCancel(temp)) {
            const t = parseFloat(temp as string);
            if (!isNaN(t)) {
                if (!pConfig.modelParams) pConfig.modelParams = {};
                const m = defaultModel as string;
                (pConfig.modelParams as any)[m] = { ...(pConfig.modelParams as any)[m], temperature: t };
            }
        }

        const githubToken = await text({
            message: 'GitHub Token (for Gist sync):',
            placeholder: 'ghp_...'
        });
        if (!isCancel(githubToken) && githubToken.length > 0) {
            pConfig.githubToken = githubToken as string;
        }
    }

    pConfig.defaultModel = defaultModel as any;
    if (!isLocal && !isCompatible) {
        // Keys already set above for non-local/compatible
    }
    config.profiles[profileName] = pConfig;
    config.activeProfile = profileName;

    await saveConfig(config);
    return config;
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
    // Templates
    template?: 'saas' | 'api' | 'dashboard' | 'landing' | 'ecommerce' | 'none';
}

export async function runInitPrompt(): Promise<ProjectOptions | void> {
    const template = await select({
        message: 'Choose a preset template (fills defaults)?',
        options: [
            { value: 'none', label: 'None (Custom)' },
            { value: 'saas', label: 'SaaS Starter' },
            { value: 'api', label: 'REST/GraphQL API' },
            { value: 'dashboard', label: 'Admin Dashboard' },
            { value: 'landing', label: 'Marketing Landing' },
            { value: 'ecommerce', label: 'E-commerce' }
        ],
        initialValue: 'none'
    });
    if (isCancel(template)) return cancel('Operation cancelled');

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
            { value: 'MEMORY.md', label: 'MEMORY.md (Context)' },
            { value: 'GEMINI.md', label: 'GEMINI.md (Google AI)' },
            { value: '.cursorrules', label: '.cursorrules (Cursor IDE)' },
            { value: 'COPILOT.md', label: 'COPILOT.md (Github Copilot)' },
            { value: '.windsurfrules', label: '.windsurfrules (Windsurf)' },
            { value: 'CONTRIBUTING.md', label: 'CONTRIBUTING.md (AI Guide)' },
            { value: 'ARCHITECTURE.md', label: 'ARCHITECTURE.md (System Doc)' }
        ],
        initialValues: ['AGENTS.md', 'CLAUDE.md', 'MEMORY.md', '.cursorrules']
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
        focusArea: focusArea as any,
        template: template as any
    };
}

export async function runLocalGeneratePrompt(): Promise<ProjectOptions | void> {
    const description = await text({
        message: 'Short description of this project? (It helps the AI generate accurate rules)',
        placeholder: 'A web app for tracking fitness goals'
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
        message: 'Which agent files to generate in the current directory?',
        options: [
            { value: 'AGENTS.md', label: 'AGENTS.md (Coordination)' },
            { value: 'CLAUDE.md', label: 'CLAUDE.md (Dev Rules)' },
            { value: 'MEMORY.md', label: 'MEMORY.md (Context)' },
            { value: 'GEMINI.md', label: 'GEMINI.md (Google AI)' },
            { value: '.cursorrules', label: '.cursorrules (Cursor IDE)' },
            { value: 'COPILOT.md', label: 'COPILOT.md (Github Copilot)' },
            { value: '.windsurfrules', label: '.windsurfrules (Windsurf)' },
            { value: 'CONTRIBUTING.md', label: 'CONTRIBUTING.md (AI Guide)' },
            { value: 'ARCHITECTURE.md', label: 'ARCHITECTURE.md (System Doc)' }
        ],
        initialValues: ['AGENTS.md', 'CLAUDE.md', 'MEMORY.md', '.cursorrules']
    });
    if (isCancel(agents)) return cancel('Operation cancelled');

    return {
        folderName: '', // Root dir
        projectType: 'Detected', // Will be filled dynamically by intelligence
        description: description as string,
        commands: 'npm run dev', // Default placeholder
        forbidden: 'dist, .env, node_modules, .git',
        agents: agents as string[],
        technicalLevel: technicalLevel as any,
        focusArea: focusArea as any,
        template: 'none'
    };
}

