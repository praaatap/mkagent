"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.getProfile = getProfile;
exports.listProfiles = listProfiles;
exports.getActiveProfile = getActiveProfile;
exports.saveConfig = saveConfig;
exports.maskKey = maskKey;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.mkagent');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
async function getConfig() {
    try {
        if (await fs_extra_1.default.pathExists(CONFIG_FILE)) {
            const config = await fs_extra_1.default.readJson(CONFIG_FILE);
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
async function getProfile(name) {
    const config = await getConfig();
    return config?.profiles[name] || null;
}
async function listProfiles() {
    const config = await getConfig();
    if (!config)
        return [];
    return Object.keys(config.profiles);
}
async function getActiveProfile() {
    const config = await getConfig();
    if (!config)
        return null;
    return config.profiles[config.activeProfile] || null;
}
async function saveConfig(config) {
    await fs_extra_1.default.ensureDir(CONFIG_DIR);
    await fs_extra_1.default.writeJson(CONFIG_FILE, config, { spaces: 2 });
}
function maskKey(key) {
    if (!key)
        return 'Not set';
    if (key.length <= 8)
        return '****' + key.slice(-2);
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
}
