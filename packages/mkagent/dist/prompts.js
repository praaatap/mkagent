"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConfigPrompt = runConfigPrompt;
exports.runInitPrompt = runInitPrompt;
const prompts_1 = require("@clack/prompts");
const config_js_1 = require("./config.js");
async function runConfigPrompt() {
    let config = await (0, config_js_1.getConfig)();
    if (!config) {
        config = { activeProfile: 'default', profiles: {} };
    }
    const mode = await (0, prompts_1.select)({
        message: 'What would you like to do?',
        options: [
            { value: 'active', label: 'Use/Configure Active Profile' },
            { value: 'create', label: 'Create New Profile' },
            { value: 'switch', label: 'Switch Active Profile' }
        ]
    });
    if ((0, prompts_1.isCancel)(mode))
        return (0, prompts_1.cancel)('Operation cancelled');
    if (mode === 'switch') {
        const profile = await (0, prompts_1.select)({
            message: 'Select profile to activate:',
            options: Object.keys(config.profiles).map(p => ({ value: p, label: p }))
        });
        if ((0, prompts_1.isCancel)(profile))
            return (0, prompts_1.cancel)('Operation cancelled');
        config.activeProfile = profile;
        await (0, config_js_1.saveConfig)(config);
        return config;
    }
    let profileName = config.activeProfile;
    if (mode === 'create') {
        const name = await (0, prompts_1.text)({
            message: 'Name for the new profile:',
            placeholder: 'work, personal, project-x'
        });
        if ((0, prompts_1.isCancel)(name))
            return (0, prompts_1.cancel)('Operation cancelled');
        profileName = name;
    }
    let pConfig = config.profiles[profileName] || { defaultModel: 'anthropic', keys: {} };
    const defaultModel = await (0, prompts_1.select)({
        message: `[${profileName}] Which AI model for this profile?`,
        options: [
            { value: 'openai', label: 'OpenAI (GPT-4o)' },
            { value: 'anthropic', label: 'Anthropic (Claude)' },
            { value: 'gemini', label: 'Google (Gemini)' }
        ],
        initialValue: pConfig.defaultModel
    });
    if ((0, prompts_1.isCancel)(defaultModel))
        return (0, prompts_1.cancel)('Operation cancelled');
    const apiKey = await (0, prompts_1.text)({
        message: 'Enter Primary API key:',
        placeholder: 'sk-...',
        validate(value) {
            if (value.length === 0)
                return 'Value is required!';
        }
    });
    if ((0, prompts_1.isCancel)(apiKey))
        return (0, prompts_1.cancel)('Operation cancelled');
    const advanced = await (0, prompts_1.confirm)({
        message: 'Configure advanced settings? (Backup keys, params, Gist token)',
        initialValue: false
    });
    if ((0, prompts_1.isCancel)(advanced))
        return (0, prompts_1.cancel)('Operation cancelled');
    if (advanced) {
        const backupKey = await (0, prompts_1.text)({
            message: 'Enter Backup API key (optional):',
            placeholder: 'sk-...'
        });
        if (!(0, prompts_1.isCancel)(backupKey) && backupKey.length > 0) {
            pConfig.backupKeys = { ...pConfig.backupKeys, [defaultModel]: backupKey };
        }
        const temp = await (0, prompts_1.text)({
            message: 'Model Temperature (0.0 to 1.0):',
            placeholder: '0.7',
            defaultValue: '0.7'
        });
        if (!(0, prompts_1.isCancel)(temp)) {
            const t = parseFloat(temp);
            if (!isNaN(t)) {
                if (!pConfig.modelParams)
                    pConfig.modelParams = {};
                const m = defaultModel;
                pConfig.modelParams[m] = { ...pConfig.modelParams[m], temperature: t };
            }
        }
        const githubToken = await (0, prompts_1.text)({
            message: 'GitHub Token (for Gist sync):',
            placeholder: 'ghp_...'
        });
        if (!(0, prompts_1.isCancel)(githubToken) && githubToken.length > 0) {
            pConfig.githubToken = githubToken;
        }
    }
    pConfig.defaultModel = defaultModel;
    pConfig.keys[pConfig.defaultModel] = apiKey;
    config.profiles[profileName] = pConfig;
    config.activeProfile = profileName;
    await (0, config_js_1.saveConfig)(config);
    return config;
}
async function runInitPrompt() {
    const template = await (0, prompts_1.select)({
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
    if ((0, prompts_1.isCancel)(template))
        return (0, prompts_1.cancel)('Operation cancelled');
    const folderName = await (0, prompts_1.text)({
        message: 'What is your project folder name?',
        placeholder: 'my-app',
        defaultValue: 'my-app'
    });
    if ((0, prompts_1.isCancel)(folderName))
        return (0, prompts_1.cancel)('Operation cancelled');
    const projectType = await (0, prompts_1.select)({
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
    if ((0, prompts_1.isCancel)(projectType))
        return (0, prompts_1.cancel)('Operation cancelled');
    let advancedOptions = {};
    if (projectType === 'Next.js') {
        const useAppRouter = await (0, prompts_1.confirm)({
            message: 'Use App Router? (Recommended)',
            initialValue: true
        });
        if ((0, prompts_1.isCancel)(useAppRouter))
            return (0, prompts_1.cancel)('Operation cancelled');
        const useTailwind = await (0, prompts_1.confirm)({
            message: 'Include Tailwind CSS?',
            initialValue: true
        });
        if ((0, prompts_1.isCancel)(useTailwind))
            return (0, prompts_1.cancel)('Operation cancelled');
        const useSrcDir = await (0, prompts_1.confirm)({
            message: 'Use `src/` directory?',
            initialValue: true
        });
        if ((0, prompts_1.isCancel)(useSrcDir))
            return (0, prompts_1.cancel)('Operation cancelled');
        const importAlias = await (0, prompts_1.text)({
            message: 'Configure import alias?',
            placeholder: '@/*',
            defaultValue: '@/*'
        });
        if ((0, prompts_1.isCancel)(importAlias))
            return (0, prompts_1.cancel)('Operation cancelled');
        advancedOptions = { useAppRouter, useTailwind, useSrcDir, importAlias };
    }
    const description = await (0, prompts_1.text)({
        message: 'Short description of your project?',
        placeholder: 'A premium AI-agent ready project'
    });
    if ((0, prompts_1.isCancel)(description))
        return (0, prompts_1.cancel)('Operation cancelled');
    const technicalLevel = await (0, prompts_1.select)({
        message: 'Agent Technical Level?',
        options: [
            { value: 'Senior', label: 'Senior Engineer' },
            { value: 'Expert', label: 'Expert Developer' },
            { value: 'Architect', label: 'System Architect' }
        ],
        initialValue: 'Expert'
    });
    if ((0, prompts_1.isCancel)(technicalLevel))
        return (0, prompts_1.cancel)('Operation cancelled');
    const focusArea = await (0, prompts_1.select)({
        message: 'Agent Focus Area?',
        options: [
            { value: 'Fullstack', label: 'Balanced Fullstack' },
            { value: 'Performance', label: 'High Performance' },
            { value: 'Security', label: 'Security & Hardening' },
            { value: 'Testing', label: 'Test-Driven Development' }
        ],
        initialValue: 'Fullstack'
    });
    if ((0, prompts_1.isCancel)(focusArea))
        return (0, prompts_1.cancel)('Operation cancelled');
    const agents = await (0, prompts_1.multiselect)({
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
    if ((0, prompts_1.isCancel)(agents))
        return (0, prompts_1.cancel)('Operation cancelled');
    return {
        folderName: folderName,
        projectType: projectType,
        description: description,
        commands: projectType === 'Next.js' ? 'npm run dev' : 'npm start',
        forbidden: 'dist, .env, .next, node_modules',
        agents: agents,
        ...advancedOptions,
        technicalLevel: technicalLevel,
        focusArea: focusArea,
        template: template
    };
}
