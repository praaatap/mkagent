import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface MkagentConfig {
    defaultModel: 'openai' | 'anthropic' | 'gemini';
    keys: {
        openai?: string;
        anthropic?: string;
        gemini?: string;
    };
}

const CONFIG_DIR = path.join(os.homedir(), '.mkagent');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function getConfig(): Promise<MkagentConfig | null> {
    try {
        if (await fs.pathExists(CONFIG_FILE)) {
            const config = await fs.readJson(CONFIG_FILE);
            return config as MkagentConfig;
        }
    } catch (error) {
        // Ignore error, return null
    }
    return null;
}

export async function saveConfig(config: MkagentConfig): Promise<void> {
    await fs.ensureDir(CONFIG_DIR);
    await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}

export function maskKey(key?: string): string {
    if (!key) return 'Not set';
    if (key.length <= 4) return '****';
    return '*'.repeat(key.length - 4) + key.slice(-4);
}
