import fs from 'fs-extra';
import path from 'path';
import os from 'os';

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

const CONFIG_DIR = path.join(os.homedir(), '.mkagent');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function getConfig(): Promise<MkagentConfig | null> {
    try {
        if (await fs.pathExists(CONFIG_FILE)) {
            const config = await fs.readJson(CONFIG_FILE);

            // Migration/Backward Compatibility
            if (!config.profiles) {
                const legacyConfig = config as any;
                const devProfile: ProfileConfig = {
                    defaultModel: legacyConfig.defaultModel || 'anthropic',
                    keys: legacyConfig.keys || {}
                };
                return {
                    activeProfile: 'default',
                    profiles: { 'default': devProfile }
                };
            }

            return config as MkagentConfig;
        }
    } catch (error) {
        // Ignore error
    }
    return null;
}

export async function getProfile(name: string): Promise<ProfileConfig | null> {
    const config = await getConfig();
    return config?.profiles[name] || null;
}

export async function listProfiles(): Promise<string[]> {
    const config = await getConfig();
    if (!config) return [];
    return Object.keys(config.profiles);
}

export async function getActiveProfile(): Promise<ProfileConfig | null> {
    const config = await getConfig();
    if (!config) return null;
    return config.profiles[config.activeProfile] || null;
}

export async function saveConfig(config: MkagentConfig): Promise<void> {
    await fs.ensureDir(CONFIG_DIR);
    await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}

export function maskKey(key?: string): string {
    if (!key) return 'Not set';
    if (key.length <= 8) return '****' + key.slice(-2);
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
}
