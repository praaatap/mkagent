export interface ModelParams {
    temperature?: number;
    maxTokens?: number;
}
export interface ProfileConfig {
    defaultModel: 'openai' | 'anthropic' | 'gemini';
    keys: {
        openai?: string;
        anthropic?: string;
        gemini?: string;
    };
    backupKeys?: {
        openai?: string;
        anthropic?: string;
        gemini?: string;
    };
    modelParams?: {
        openai?: ModelParams;
        anthropic?: ModelParams;
        gemini?: ModelParams;
    };
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
