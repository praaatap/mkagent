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

export async function runInitPrompt() {
    const folderName = await text({
        message: 'What is your project folder name?',
        placeholder: 'my-app',
        defaultValue: 'my-app'
    });
    if (isCancel(folderName)) return cancel('Operation cancelled');

    const projectType = await select({
        message: 'What type of project?',
        options: [
            { value: 'Next.js', label: 'Next.js' },
            { value: 'React', label: 'React' },
            { value: 'Node.js API', label: 'Node.js API' },
            { value: 'Python', label: 'Python' },
            { value: 'Monorepo', label: 'Monorepo' },
            { value: 'Other', label: 'Other' }
        ]
    });
    if (isCancel(projectType)) return cancel('Operation cancelled');

    const description = await text({
        message: 'Short description of your project?',
        placeholder: 'A modern web application'
    });
    if (isCancel(description)) return cancel('Operation cancelled');

    const commands = await text({
        message: 'Main commands? (dev, build, test)',
        placeholder: 'npm run dev, npm run build',
        defaultValue: 'npm run dev, npm run build'
    });
    if (isCancel(commands)) return cancel('Operation cancelled');

    const forbidden = await text({
        message: 'Any folders AI should never touch?',
        placeholder: 'dist, .env, .next, node_modules',
        defaultValue: 'dist, .env, .next, node_modules'
    });
    if (isCancel(forbidden)) return cancel('Operation cancelled');

    const agents = await multiselect({
        message: 'Which agent files to generate?',
        options: [
            { value: 'AGENTS.md', label: 'AGENTS.md' },
            { value: 'CLAUDE.md', label: 'CLAUDE.md' },
            { value: 'GEMINI.md', label: 'GEMINI.md' }
        ],
        initialValues: ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md']
    });
    if (isCancel(agents)) return cancel('Operation cancelled');

    return {
        folderName: folderName as string,
        projectType: projectType as string,
        description: description as string,
        commands: commands as string,
        forbidden: forbidden as string,
        agents: agents as string[]
    };
}
