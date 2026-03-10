import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { getActiveProfile } from '../core/config.js';
export async function runSync(direction = 'push', projectPath = process.cwd()) {
    const profile = await getActiveProfile();
    if (!profile || !profile.githubToken) {
        throw new Error('GitHub token missing in profile. Run `mkagent config` to add one.');
    }
    const token = profile.githubToken;
    const gistIdPath = path.join(projectPath, '.mkagent', 'gist_id');
    let gistId = (await fs.pathExists(gistIdPath)) ? (await fs.readFile(gistIdPath, 'utf-8')).trim() : null;
    const spinner = ora(`Synchronizing (${direction})...`).start();
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
        const filePath = path.join(projectPath, file);
        if (await fs.pathExists(filePath)) {
            filesToUpload[file] = { content: await fs.readFile(filePath, 'utf-8') };
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
            description: `mkagent sync - ${path.basename(projectPath)}`,
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
        await fs.ensureDir(path.dirname(gistIdPath));
        await fs.writeFile(gistIdPath, resData.id);
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
            await fs.writeFile(path.join(projectPath, filename), file.content);
        }
    }
    spinner.succeed(`Pulled ${Object.keys(gist.files).length} files from Gist ${gistId}.`);
}
