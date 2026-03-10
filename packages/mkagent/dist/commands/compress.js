import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getActiveProfile } from '../core/config.js';
import { generateContent } from '../core/ai.js';
export async function runCompress(projectPath = process.cwd()) {
    const profile = await getActiveProfile();
    if (!profile) {
        throw new Error('No active profile found. Run `mkagent config` first.');
    }
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md'];
    const foundFiles = [];
    for (const file of agentFiles) {
        if (await fs.pathExists(path.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }
    if (foundFiles.length === 0) {
        console.log(chalk.yellow('No agent files found to compress.'));
        return;
    }
    const spinner = ora('Compressing agent files for token optimization...').start();
    for (const file of foundFiles) {
        spinner.text = `Compressing ${file}...`;
        const filePath = path.join(projectPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
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
            const res = await generateContent(profile, file, {
                folderName: 'Optimization',
                projectType: 'Minifier',
                description: compressionPrompt,
                commands: '',
                forbidden: ''
            });
            if (res.success) {
                await fs.writeFile(filePath, res.content);
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
    spinner.succeed(chalk.green('Compression complete! Agent files are now token-optimized.'));
}
