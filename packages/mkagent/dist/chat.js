"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runChat = runChat;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const prompts_1 = require("@clack/prompts");
const config_js_1 = require("./config.js");
const ai_js_1 = require("./ai.js");
async function runChat(projectPath = process.cwd()) {
    const profile = await (0, config_js_1.getActiveProfile)();
    if (!profile) {
        throw new Error('No active profile found. Run `mkagent config` first.');
    }
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md'];
    let contextString = '';
    for (const file of agentFiles) {
        const filePath = path_1.default.join(projectPath, file);
        if (await fs_extra_1.default.pathExists(filePath)) {
            const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
            contextString += `\n--- FILE: ${file} ---\n${content}\n`;
        }
    }
    if (!contextString) {
        console.log(chalk_1.default.yellow('Warning: No agent files found. Chatting without local project context.'));
    }
    console.log(chalk_1.default.cyan(`\nStarting chat session with ${chalk_1.default.bold(profile.defaultModel)}...`));
    console.log(chalk_1.default.dim('Type "exit" or "quit" to end the session.\n'));
    const history = [];
    while (true) {
        const query = await (0, prompts_1.text)({
            message: chalk_1.default.bold('You:'),
            placeholder: 'Ask about the project...'
        });
        if ((0, prompts_1.isCancel)(query) || query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
            break;
        }
        const s = (0, prompts_1.spinner)();
        s.start('Thinking...');
        const fullPrompt = `You are a helpful project assistant for the project "${path_1.default.basename(projectPath)}".
        You have access to the following project context from agent files:
        ${contextString}
        
        Recent Conversation History:
        ${history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}
        
        User Query: ${query}
        
        Response Rules:
        1. Be concise and technical.
        2. Reference specific rules or info from the context if applicable.
        3. Do NOT use emojis.
        4. If you don't know something based on the context, say so gracefully.`;
        try {
            const res = await (0, ai_js_1.generateContent)(profile, 'CHAT_SESSION', {
                folderName: path_1.default.basename(projectPath),
                projectType: 'Interactive Chat',
                description: fullPrompt,
                commands: '',
                forbidden: '',
                overridePrompt: fullPrompt // Directly use our custom prompt
            });
            s.stop();
            if (res.success) {
                console.log(`\n${chalk_1.default.green(chalk_1.default.bold('Assistant:'))}\n${res.content}\n`);
                history.push({ role: 'user', content: query });
                history.push({ role: 'assistant', content: res.content });
                // Keep history manageable
                if (history.length > 10)
                    history.splice(0, 2);
            }
            else {
                console.log(chalk_1.default.red(`\nError: ${res.error}\n`));
            }
        }
        catch (err) {
            s.stop();
            console.log(chalk_1.default.red(`\nFailed to get response: ${err.message}\n`));
        }
    }
    (0, prompts_1.outro)('Chat session ended.');
}
