import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MkagentConfig } from './config.js';
import { agentsTemplate } from '../templates/agents.js';
import { claudeTemplate } from '../templates/claude.js';
import { geminiTemplate } from '../templates/gemini.js';
import { ProjectIntelligence } from './detect.js';

export interface PromptContext {
    folderName: string;
    projectType: string;
    description: string;
    commands: string;
    forbidden: string;
    intelligence?: ProjectIntelligence;
    technicalLevel?: string;
    focusArea?: string;
    useAppRouter?: boolean;
    useTailwind?: boolean;
    overridePrompt?: string;
}

function getFallback(filename: string, context: PromptContext): string {
    if (filename === 'CLAUDE.md') {
        return claudeTemplate(context.folderName, context.projectType, context.description, context.commands, context.forbidden);
    }
    if (filename === 'GEMINI.md') {
        return geminiTemplate(context.folderName, context.projectType, context.description, context.commands, context.forbidden);
    }
    return agentsTemplate(context.folderName, context.projectType, context.description, context.commands, context.forbidden);
}

import { ProfileConfig } from './config.js';

export async function generateContent(
    profile: ProfileConfig,
    filename: string,
    context: PromptContext
): Promise<{ success: boolean; content: string; error?: string }> {
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

    async function attemptGeneration(apiKey: string): Promise<string> {
        if (model === 'openai') {
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'system', content: prompt }],
                model: 'gpt-4o',
                temperature: params.temperature ?? 0.7,
                max_tokens: params.maxTokens ?? 2000
            });
            return completion.choices[0].message.content || '';
        } else if (model === 'anthropic') {
            const anthropic = new Anthropic({ apiKey });
            const msg = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: params.maxTokens ?? 2000,
                temperature: params.temperature ?? 0.7,
                messages: [{ role: 'user', content: prompt }]
            });
            return msg.content.map(b => 'text' in b ? b.text : '').join('');
        } else if (model === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
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
            } catch (primaryErr) {
                if (backupKey) {
                    content = await attemptGeneration(backupKey);
                } else {
                    throw primaryErr;
                }
            }
        } else if (backupKey) {
            content = await attemptGeneration(backupKey);
        }

        return { success: true, content };
    } catch (err: any) {
        return { success: false, content: getFallback(filename, context), error: err.message || 'Unknown error during API call' };
    }
}

export async function verifyKey(model: 'openai' | 'anthropic' | 'gemini', apiKey: string): Promise<boolean> {
    try {
        if (model === 'openai') {
            const openai = new OpenAI({ apiKey });
            await openai.models.list();
            return true;
        } else if (model === 'anthropic') {
            const anthropic = new Anthropic({ apiKey });
            await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'hi' }]
            });
            return true;
        } else if (model === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            await geminiModel.generateContent('hi');
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}
