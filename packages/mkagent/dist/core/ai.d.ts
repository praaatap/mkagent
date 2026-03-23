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
import { ProfileConfig } from './config.js';
export declare function generateContent(profile: ProfileConfig, filename: string, context: PromptContext): Promise<{
    success: boolean;
    content: string;
    error?: string;
}>;
export declare function verifyKey(model: 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openai-compatible' | 'local', apiKey: string, baseUrl?: string, modelName?: string): Promise<boolean>;
