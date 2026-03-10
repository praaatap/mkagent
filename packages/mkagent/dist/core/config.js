import fs from 'fs-extra';
import path from 'path';
import os from 'os';
const CONFIG_DIR = path.join(os.homedir(), '.mkagent');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
export async function getConfig() {
    try {
        if (await fs.pathExists(CONFIG_FILE)) {
            const config = await fs.readJson(CONFIG_FILE);
            // Migration/Backward Compatibility
            if (!config.profiles) {
                const legacyConfig = config;
                const devProfile = {
                    defaultModel: legacyConfig.defaultModel || 'anthropic',
                    keys: legacyConfig.keys || {}
                };
                return {
                    activeProfile: 'default',
                    profiles: { 'default': devProfile }
                };
            }
            return config;
        }
    }
    catch (error) {
        // Ignore error
    }
    return null;
}
export async function getProfile(name) {
    const config = await getConfig();
    return config?.profiles[name] || null;
}
export async function listProfiles() {
    const config = await getConfig();
    if (!config)
        return [];
    return Object.keys(config.profiles);
}
export async function getActiveProfile() {
    const config = await getConfig();
    if (!config)
        return null;
    return config.profiles[config.activeProfile] || null;
}
export async function saveConfig(config) {
    await fs.ensureDir(CONFIG_DIR);
    await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}
export function maskKey(key) {
    if (!key)
        return 'Not set';
    if (key.length <= 8)
        return '****' + key.slice(-2);
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
}
