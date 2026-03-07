import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MkagentConfig } from './config.js';
import { agentsTemplate } from './templates/agents.js';
import { claudeTemplate } from './templates/claude.js';
import { geminiTemplate } from './templates/gemini.js';
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

export async function generateContent(
    config: MkagentConfig,
    filename: string,
    context: PromptContext
): Promise<{ success: boolean; content: string; error?: string }> {
    const model = config.defaultModel;
    const apiKey = config.keys[model];

    if (!apiKey) {
        return { success: false, content: getFallback(filename, context), error: `Invalid API key for ${model}` };
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

    const prompt = `You are a world-class ${context.technicalLevel || 'Expert'} AI agent engineer. Your task is to generate a deeply technical, non-generic ${filename} file for a ${context.projectType} project named "${context.folderName}".

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
6. The file MUST include these specific sections:
   ## Project Intelligence
   ## Tech Stack and Architecture 
   ## Core Workflows (Commands)
   ## Structural Mental Model
   ## Guardrails and Safety
   ## Agent Personality and Instructions

Output ONLY the raw markdown content. Do not include markdown code block backticks.`;


    try {
        let content = '';

        if (model === 'openai') {
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'system', content: prompt }],
                model: 'gpt-4o',
            });
            content = completion.choices[0].message.content || '';
        } else if (model === 'anthropic') {
            const anthropic = new Anthropic({ apiKey });
            const msg = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [{ role: 'user', content: prompt }]
            });
            content = msg.content.map(b => 'text' in b ? b.text : '').join('');
        } else if (model === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await geminiModel.generateContent(prompt);
            const response = await result.response;
            content = response.text();
        }

        return { success: true, content };
    } catch (err: any) {
        return { success: false, content: getFallback(filename, context), error: err.message || 'Unknown error during API call' };
    }
}
