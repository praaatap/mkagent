export interface ModelParams {
    temperature?: number;
    maxTokens?: number;
}
export type ModelType = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'openai-compatible' | 'local';
export interface ProfileConfig {
    defaultModel: ModelType;
    keys: {
        openai?: string;
        anthropic?: string;
        gemini?: string;
        groq?: string;
        'openai-compatible'?: string;
        local?: string;
    };
    backupKeys?: {
        openai?: string;
        anthropic?: string;
        gemini?: string;
        groq?: string;
        'openai-compatible'?: string;
        local?: string;
    };
    modelParams?: {
        openai?: ModelParams;
        anthropic?: ModelParams;
        gemini?: ModelParams;
        groq?: ModelParams;
        'openai-compatible'?: ModelParams;
        local?: ModelParams;
    };
    baseUrl?: string;
    modelName?: string;
    githubToken?: string;
}
export interface MkagentConfig {
    activeProfile: string;
    profiles: Record<string, ProfileConfig>;
}
export declare function getConfig(): Promise<MkagentConfig | null>;
export declare function getProfile(name: string): Promise<ProfileConfig | null>;
export declare function listProfiles(): Promise<string[]>;
export declare function getActiveProfile(): Promise<ProfileConfig | null>;
export declare function saveConfig(config: MkagentConfig): Promise<void>;
export declare function maskKey(key?: string): string;
