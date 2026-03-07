import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { intro, outro, text, spinner as clackSpinner, isCancel } from '@clack/prompts';
import { getActiveProfile } from './config.js';
import { generateContent } from './ai.js';

export async function runChat(projectPath: string = process.cwd()) {
    const profile = await getActiveProfile();
    if (!profile) {
        throw new Error('No active profile found. Run `mkagent config` first.');
    }

    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md'];
    let contextString = '';

    for (const file of agentFiles) {
        const filePath = path.join(projectPath, file);
        if (await fs.pathExists(filePath)) {
            const content = await fs.readFile(filePath, 'utf-8');
            contextString += `\n--- FILE: ${file} ---\n${content}\n`;
        }
    }

    if (!contextString) {
        console.log(chalk.yellow('Warning: No agent files found. Chatting without local project context.'));
    }

    console.log(chalk.cyan(`\nStarting chat session with ${chalk.bold(profile.defaultModel)}...`));
    console.log(chalk.dim('Type "exit" or "quit" to end the session.\n'));

    const history: { role: 'user' | 'assistant'; content: string }[] = [];

    while (true) {
        const query = await text({
            message: chalk.bold('You:'),
            placeholder: 'Ask about the project...'
        });

        if (isCancel(query) || query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
            break;
        }

        const s = clackSpinner();
        s.start('Thinking...');

        const fullPrompt = `You are a helpful project assistant for the project "${path.basename(projectPath)}".
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
            const res = await generateContent(profile, 'CHAT_SESSION', {
                folderName: path.basename(projectPath),
                projectType: 'Interactive Chat',
                description: fullPrompt,
                commands: '',
                forbidden: '',
                overridePrompt: fullPrompt // Directly use our custom prompt
            });

            s.stop();

            if (res.success) {
                console.log(`\n${chalk.green(chalk.bold('Assistant:'))}\n${res.content}\n`);
                history.push({ role: 'user', content: query });
                history.push({ role: 'assistant', content: res.content });

                // Keep history manageable
                if (history.length > 10) history.splice(0, 2);
            } else {
                console.log(chalk.red(`\nError: ${res.error}\n`));
            }
        } catch (err: any) {
            s.stop();
            console.log(chalk.red(`\nFailed to get response: ${err.message}\n`));
        }
    }

    outro('Chat session ended.');
}
