"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = generateContent;
exports.verifyKey = verifyKey;
const openai_1 = __importDefault(require("openai"));
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const generative_ai_1 = require("@google/generative-ai");
const agents_js_1 = require("./templates/agents.js");
const claude_js_1 = require("./templates/claude.js");
const gemini_js_1 = require("./templates/gemini.js");
function getFallback(filename, context) {
    if (filename === 'CLAUDE.md') {
        return (0, claude_js_1.claudeTemplate)(context.folderName, context.projectType, context.description, context.commands, context.forbidden);
    }
    if (filename === 'GEMINI.md') {
        return (0, gemini_js_1.geminiTemplate)(context.folderName, context.projectType, context.description, context.commands, context.forbidden);
    }
    return (0, agents_js_1.agentsTemplate)(context.folderName, context.projectType, context.description, context.commands, context.forbidden);
}
async function generateContent(profile, filename, context) {
    const model = profile.defaultModel;
    const primaryKey = profile.keys[model];
    const backupKey = profile.backupKeys?.[model];
    const params = profile.modelParams?.[model] || {};
    if (!primaryKey && !backupKey) {
        return { success: false, content: getFallback(filename, context), error: `No API keys found for ${model}` };
    }
    const intelligenceSnippet = context.intelligence ? `
Deep Project Intelligence:
- TypeScript: ${context.intelligence.hasTypeScript}
- Tailwind CSS: ${context.intelligence.hasTailwind}
- ESLint: ${context.intelligence.hasESLint}
- Prettier: ${context.intelligence.hasPrettier}
- Config Files Detected: ${context.intelligence.configFiles.join(', ')}
- Is Monorepo: ${context.intelligence.isMonorepo}
- Dependencies: ${Object.keys(context.intelligence.dependencies).slice(0, 20).join(', ')} (truncated)
` : '';
    const personaSnippet = `
Agent Persona:
- Technical Level: ${context.technicalLevel || 'Expert'}
- Primary Focus: ${context.focusArea || 'Fullstack'}
`;
    const prompt = context.overridePrompt || `You are a world-class ${context.technicalLevel || 'Expert'} AI agent engineer. Your task is to generate a deeply technical, non-generic ${filename} file for a ${context.projectType} project named "${context.folderName}".

Project Context:
- Description: ${context.description}
- Key Commands: ${context.commands}
- Restricted/Forbidden Folders: ${context.forbidden}
${intelligenceSnippet}
${personaSnippet}

Requirements for the content:
1. DO NOT use generic boilerplate. 
2. Use clean, professional, human-like English that is highly optimized for LLM parsing.
3. STRICTLY NO EMOJIS in the output.
4. Analyze the project type and description to provide specific rules for the AI agent.
5. Focus heavily on ${context.focusArea || 'Fullstack'} aspects in the "Agent Personality and Instructions" section.
6. If the file is ${filename === '.cursorrules' ? 'Cursor IDE rules' : filename}, adapt the format accordingly (e.g. JSON-like or structured markdown).
7. The file MUST include these specific sections:
   ## Project Intelligence
   ## Tech Stack and Architecture 
   ## Core Workflows (Commands)
   ## Structural Mental Model
   ## Guardrails and Safety
   ## Agent Personality and Instructions

Output ONLY the raw content. Do not include markdown code block backticks unless they are part of the file content.`;
    async function attemptGeneration(apiKey) {
        if (model === 'openai') {
            const openai = new openai_1.default({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'system', content: prompt }],
                model: 'gpt-4o',
                temperature: params.temperature ?? 0.7,
                max_tokens: params.maxTokens ?? 2000
            });
            return completion.choices[0].message.content || '';
        }
        else if (model === 'anthropic') {
            const anthropic = new sdk_1.default({ apiKey });
            const msg = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: params.maxTokens ?? 2000,
                temperature: params.temperature ?? 0.7,
                messages: [{ role: 'user', content: prompt }]
            });
            return msg.content.map(b => 'text' in b ? b.text : '').join('');
        }
        else if (model === 'gemini') {
            const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            const geminiModel = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: {
                    temperature: params.temperature ?? 0.7,
                    maxOutputTokens: params.maxTokens ?? 2048
                }
            });
            const result = await geminiModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        throw new Error('Unsupported model');
    }
    try {
        let content = '';
        if (primaryKey) {
            try {
                content = await attemptGeneration(primaryKey);
            }
            catch (primaryErr) {
                if (backupKey) {
                    content = await attemptGeneration(backupKey);
                }
                else {
                    throw primaryErr;
                }
            }
        }
        else if (backupKey) {
            content = await attemptGeneration(backupKey);
        }
        return { success: true, content };
    }
    catch (err) {
        return { success: false, content: getFallback(filename, context), error: err.message || 'Unknown error during API call' };
    }
}
async function verifyKey(model, apiKey) {
    try {
        if (model === 'openai') {
            const openai = new openai_1.default({ apiKey });
            await openai.models.list();
            return true;
        }
        else if (model === 'anthropic') {
            const anthropic = new sdk_1.default({ apiKey });
            await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'hi' }]
            });
            return true;
        }
        else if (model === 'gemini') {
            const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            await geminiModel.generateContent('hi');
            return true;
        }
    }
    catch (e) {
        return false;
    }
    return false;
}
