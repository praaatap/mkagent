"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCompress = runCompress;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const config_js_1 = require("./config.js");
const ai_js_1 = require("./ai.js");
async function runCompress(projectPath = process.cwd()) {
    const profile = await (0, config_js_1.getActiveProfile)();
    if (!profile) {
        throw new Error('No active profile found. Run `mkagent config` first.');
    }
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md'];
    const foundFiles = [];
    for (const file of agentFiles) {
        if (await fs_extra_1.default.pathExists(path_1.default.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }
    if (foundFiles.length === 0) {
        console.log(chalk_1.default.yellow('No agent files found to compress.'));
        return;
    }
    const spinner = (0, ora_1.default)('Compressing agent files for token optimization...').start();
    for (const file of foundFiles) {
        spinner.text = `Compressing ${file}...`;
        const filePath = path_1.default.join(projectPath, file);
        const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
        // We use generateContent with a special "compression" context
        // Instead of the usual PromptContext, we'll create a variant or just reuse it with specific description
        const compressionPrompt = `You are a token optimization expert. Your task is to MINIFY/COMPRESS the following ${file} content while KEEPING ALL CRITICAL TECHNICAL INFORMATION AND INSTRUCTIONS. 
        
        Rules:
        1. Remove verbose explanations and fluff.
        2. Use extremely concise, telegraphic English.
        3. Maintain all file paths, command names, and specific rules.
        4. Do NOT change the meaning.
        5. Output ONLY the compressed content.
        
        Original Content:
        ${content}`;
        // Hacky way to reuse generateContent by overriding the prompt or creating a new internal function
        // For now, let's create a specialized generation function in ai.ts or just use the raw attemptGeneration logic here
        // Actually, let's add a "systemPrompt" or "overridePrompt" to generateContent's context.
        try {
            // I'll update ai.ts to support a direct prompt override for tools like this
            const res = await (0, ai_js_1.generateContent)(profile, file, {
                folderName: 'Optimization',
                projectType: 'Minifier',
                description: compressionPrompt,
                commands: '',
                forbidden: ''
            });
            if (res.success) {
                await fs_extra_1.default.writeFile(filePath, res.content);
            }
            else {
                spinner.fail(`Failed to compress ${file}: ${res.error}`);
                spinner.start();
            }
        }
        catch (err) {
            spinner.fail(`Error compressing ${file}: ${err.message}`);
            spinner.start();
        }
    }
    spinner.succeed(chalk_1.default.green('Compression complete! Agent files are now token-optimized.'));
}
