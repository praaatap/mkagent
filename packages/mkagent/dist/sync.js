"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSync = runSync;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
const config_js_1 = require("./config.js");
async function runSync(direction = 'push', projectPath = process.cwd()) {
    const profile = await (0, config_js_1.getActiveProfile)();
    if (!profile || !profile.githubToken) {
        throw new Error('GitHub token missing in profile. Run `mkagent config` to add one.');
    }
    const token = profile.githubToken;
    const gistIdPath = path_1.default.join(projectPath, '.mkagent', 'gist_id');
    let gistId = (await fs_extra_1.default.pathExists(gistIdPath)) ? (await fs_extra_1.default.readFile(gistIdPath, 'utf-8')).trim() : null;
    const spinner = (0, ora_1.default)(`Synchronizing (${direction})...`).start();
    try {
        if (direction === 'push') {
            await pushToGist(token, gistId, gistIdPath, projectPath, spinner);
        }
        else {
            if (!gistId) {
                spinner.fail('No remote Gist ID found. You must push first or manually set it in .mkagent/gist_id');
                return;
            }
            await pullFromGist(token, gistId, projectPath, spinner);
        }
    }
    catch (err) {
        spinner.fail(`Sync failed: ${err.message}`);
        throw err;
    }
}
async function pushToGist(token, gistId, gistIdPath, projectPath, spinner) {
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md', 'README.md'];
    const filesToUpload = {};
    for (const file of agentFiles) {
        const filePath = path_1.default.join(projectPath, file);
        if (await fs_extra_1.default.pathExists(filePath)) {
            filesToUpload[file] = { content: await fs_extra_1.default.readFile(filePath, 'utf-8') };
        }
    }
    if (Object.keys(filesToUpload).length === 0) {
        spinner.fail('No agent files found to push.');
        return;
    }
    const method = gistId ? 'PATCH' : 'POST';
    const url = gistId ? `https://api.github.com/gists/${gistId}` : 'https://api.github.com/gists';
    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: `mkagent sync - ${path_1.default.basename(projectPath)}`,
            public: false,
            files: filesToUpload
        })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(`GitHub API Error: ${err.message}`);
    }
    const resData = await response.json();
    if (!gistId) {
        await fs_extra_1.default.ensureDir(path_1.default.dirname(gistIdPath));
        await fs_extra_1.default.writeFile(gistIdPath, resData.id);
        spinner.succeed(`Gist created and files pushed! ID: ${resData.id}`);
    }
    else {
        spinner.succeed('Gist updated successfully!');
    }
}
async function pullFromGist(token, gistId, projectPath, spinner) {
    const url = `https://api.github.com/gists/${gistId}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(`GitHub API Error: ${err.message}`);
    }
    const gist = await response.json();
    for (const [filename, file] of Object.entries(gist.files)) {
        if (filename.endsWith('.md') || filename === '.cursorrules') {
            await fs_extra_1.default.writeFile(path_1.default.join(projectPath, filename), file.content);
        }
    }
    spinner.succeed(`Pulled ${Object.keys(gist.files).length} files from Gist ${gistId}.`);
}
