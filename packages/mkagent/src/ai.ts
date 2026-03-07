import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MkagentConfig } from './config.js';
import { agentsTemplate } from './templates/agents.js';
import { claudeTemplate } from './templates/claude.js';
import { geminiTemplate } from './templates/gemini.js';

export interface PromptContext {
    projectName: string;
    projectType: string;
    description: string;
    commands: string;
    forbidden: string;
}

function getFallback(filename: string, context: PromptContext): string {
    if (filename === 'CLAUDE.md') {
        return claudeTemplate(context.projectName, context.projectType, context.description, context.commands, context.forbidden);
    }
    if (filename === 'GEMINI.md') {
        return geminiTemplate(context.projectName, context.projectType, context.description, context.commands, context.forbidden);
    }
    return agentsTemplate(context.projectName, context.projectType, context.description, context.commands, context.forbidden);
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

    const prompt = `You are a world-class AI agent engineer. Your task is to generate a deeply technical, non-generic ${filename} file for a ${context.projectType} project named "${context.projectName}".

Project Context:
- Description: ${context.description}
- Key Commands: ${context.commands}
- Restricted/Forbidden Folders: ${context.forbidden}

Requirements for the content:
1. DO NOT use generic boilerplate. 
2. Use clean, professional, human-like English that is highly optimized for LLM parsing.
3. STRICTLY NO EMOJIS in the output.
4. Analyze the project type and description to provide specific rules for the AI agent (e.g., if it's Next.js, talk about App Router vs Pages Router, Server Components handling, etc.).
5. The file MUST include these specific sections:
   ## Project Intelligence
   ## Tech Stack and Architecture 
   ## Core Workflows (Commands)
   ## Structural Mental Model
   ## Guardrails and Safety
   ## Agent Personality and Instructions

Output ONLY the raw markdown content. Do not include markdown code block backticks.` ;


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
