#!/usr/bin/env node
import { Command } from 'commander';
import { intro, outro, cancel, confirm, isCancel } from '@clack/prompts';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { getActiveProfile, maskKey, saveConfig, listProfiles, getProfile } from './core/config.js';
import { runConfigPrompt, runInitPrompt } from './core/prompts.js';
import { orchestrateGeneration } from './core/generate.js';
import { generateContent, PromptContext, verifyKey } from './core/ai.js';
import { detectStack, ProjectIntelligence } from './core/detect.js';
import { runAudit } from './commands/audit.js';
import { runCompress } from './commands/compress.js';
import { runTokens } from './commands/tokens.js';
import { runStats } from './commands/stats.js';
import { runSync } from './commands/sync.js';
import { runChat } from './commands/chat.js';
import { runWatch } from './commands/watch.js';
import ora from 'ora';

const program = new Command();

const LOGO = `
  ${chalk.cyan('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■')}
  ${chalk.cyan('■')} ${chalk.bold('MKAGENT')} ${chalk.dim('— Professional AI Intelligence CLI')} ${chalk.cyan('■')}
  ${chalk.cyan('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■')}
`;

program
    .name('mkagent')
    .description('AI-powered file generation and scaffolding tool.')
    .version('1.0.0');

const showIntro = (cmd: string) => {
    console.log(LOGO);
    intro(`${chalk.bgCyan(chalk.black(` mkagent ${cmd} `))} ${chalk.dim('v1.0.0')}`);
};

program
    .command('config')
    .description('Configure API keys and default AI model')
    .option('--show', 'Show the currently saved config')
    .option('--profile <name>', 'Work on a specific profile')
    .action(async (options) => {
        showIntro('config');

        if (options.show) {
            const profile = options.profile ? await getProfile(options.profile) : await getActiveProfile();
            if (!profile) {
                console.log(chalk.yellow('No profile found. Run `mkagent config` to create one.'));
            } else {
                console.log(chalk.green(`Profile: ${chalk.bold(options.profile || 'Active')}`));
                console.log(`  Default Model: ${chalk.bold(profile.defaultModel)}`);
                console.log(`  OpenAI Key:    ${maskKey(profile.keys?.openai)}`);
                console.log(`  Anthropic Key: ${maskKey(profile.keys?.anthropic)}`);
                console.log(`  Gemini Key:    ${maskKey(profile.keys?.gemini)}`);
                if (profile.githubToken) console.log(`  GitHub Token:  ${maskKey(profile.githubToken)}`);
            }
            const profiles = await listProfiles();
            if (profiles.length > 1) {
                console.log(chalk.dim(`\nAvailable profiles: ${profiles.join(', ')}`));
            }
            outro('Done.');
            return;
        }

        await runConfigPrompt();
        outro(chalk.green('Configuration updated!'));
    });

program
    .command('init')
    .description('Initialize a new project with AI scaffolding')
    .option('--dry-run', 'Preview without writing files')
    .action(async (options) => {
        showIntro('init');

        let profile = await getActiveProfile();
        if (!profile || !profile.keys[profile.defaultModel]) {
            console.log(chalk.yellow('No valid configuration found. Let\'s set it up first.'));
            await runConfigPrompt();
            profile = await getActiveProfile(); // reload
        }

        if (!profile) return cancel('Configuration missing. Aborting.');

        const projectOptions = await runInitPrompt();
        if (!projectOptions) return;

        const targetDir = path.join(process.cwd(), projectOptions.folderName);

        if (await fs.pathExists(targetDir) && !options.dryRun) {
            const override = await confirm({
                message: `Folder ${projectOptions.folderName} already exists. Continue anyway?`,
                initialValue: false
            });
            if (isCancel(override)) return cancel('Operation cancelled.');
        }

        const intelligence = await detectStack();

        await orchestrateGeneration(
            targetDir,
            projectOptions,
            intelligence,
            options.dryRun
        );

        outro(chalk.green(`Project ${projectOptions.folderName} scaffolded successfully!`));
    });

program
    .command('doctor')
    .description('Check the health of your mkagent environment')
    .action(async () => {
        showIntro('doctor');
        const spinner = ora('Checking configuration...').start();

        try {
            const profile = await getActiveProfile();
            if (!profile) {
                spinner.fail(chalk.red('No active profile found. Run `mkagent config` to set up.'));
            } else {
                spinner.succeed(chalk.green(`Active profile: ${chalk.bold(profile.defaultModel)}`));

                const model = profile.defaultModel;
                const key = profile.keys[model];

                if (key) {
                    spinner.start(`Verifying API Key for ${model}...`);
                    const isValid = await verifyKey(model as any, key);
                    if (isValid) {
                        spinner.succeed(chalk.green(`API Key for ${model} is valid and functional.`));
                    } else {
                        spinner.fail(chalk.red(`API Key for ${model} failed live validation! Check your key/balance.`));
                    }
                } else {
                    spinner.fail(chalk.red(`API Key for ${model} is missing!`));
                }
            }

            const intelligence = await detectStack();
            console.log(chalk.cyan('\nProject Context:'));
            console.log(`- Detected Stack: ${chalk.bold(intelligence.stack)}`);
            console.log(`- Monorepo:       ${intelligence.isMonorepo ? chalk.green('Yes') : chalk.dim('No')}`);
            console.log(`- TypeScript:     ${intelligence.hasTypeScript ? chalk.green('Yes') : chalk.dim('No')}`);
            console.log(`- Tailwind:       ${intelligence.hasTailwind ? chalk.green('Yes') : chalk.dim('No')}`);

            if (!profile) {
                console.log(chalk.yellow('\n💡 Next Step: Run `mkagent config` to link your AI models.'));
            }

            outro(chalk.green('\nHealth check complete.'));
        } catch (err: any) {
            spinner.fail(chalk.red(`Doctor failed: ${err.message}`));
            outro(chalk.red('Please fix the errors above.'));
        }
    });

program
    .command('regenerate')
    .description('Re-generate agent .md files in current folder')
    .option('--dry-run', 'Preview without writing files')
    .action(async (options) => {
        showIntro('regenerate');

        const profile = await getActiveProfile();
        if (!profile || !profile.keys[profile.defaultModel]) {
            return cancel('Invalid configuration. Run `npx mkagent config` first.');
        }

        const intelligence = await detectStack();
        const context: PromptContext = {
            folderName: intelligence.name,
            projectType: intelligence.stack,
            description: intelligence.description || 'Regenerated from existing project context',
            commands: intelligence.configFiles.join(', '),
            forbidden: 'dist, .env, node_modules',
            intelligence
        };

        const agentsToGen = [];
        const possibleAgents = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules'];
        for (const agent of possibleAgents) {
            if (await fs.pathExists(path.join(process.cwd(), agent))) {
                agentsToGen.push(agent);
            }
        }

        if (agentsToGen.length === 0) {
            return cancel('No existing agent files found.');
        }

        const spinner = ora(`⚡ Regenerating agents...`).start();
        for (const file of agentsToGen) {
            const filePath = path.join(process.cwd(), file);
            const existingContent = await fs.readFile(filePath, 'utf-8');

            const mergePrompt = `You are a precision merge tool. Your task is to merge the following EXISTING ${file} content with NEW updates while PRESERVING any custom rules, notes, or specific instructions the user has added.
            
            EXISTING CONTENT:
            ${existingContent}
            
            INSTRUCTIONS FOR NEW VERSION:
            - Update the architecture and project intelligence based on latest context.
            - Ensure all guardrails are up to date.
            - DO NOT remove user-added custom personality traits or specific edge-case rules.
            - Combine both into a cohesive, non-redundant ${file} file.
            
            Output ONLY the merged raw content.`;

            const res = await generateContent(profile, file, {
                ...context,
                overridePrompt: mergePrompt
            });

            if (!options.dryRun) {
                if (res.success) {
                    await fs.writeFile(filePath, res.content);
                } else {
                    spinner.fail(chalk.yellow(`Failed to regenerate ${file}: ${res.error}`));
                    spinner.start();
                }
            } else {
                spinner.succeed(chalk.cyan(`[DRY RUN] Regenerated ${file}:`));
                console.log(chalk.dim(res.content));
                spinner.start();
            }
        }
        spinner.succeed(chalk.green('Regeneration complete!'));
        outro('Done.');
    });

// Placeholder for new commands in Phase 2 & 3
program
    .command('audit')
    .description('Scan codebase for hardcoded secrets, TODOs, and console.logs')
    .action(async () => {
        showIntro('audit');
        try {
            await runAudit();
            outro(chalk.green('Audit complete! Findings appended to MEMORY.md.'));
        } catch (err: any) {
            outro(chalk.red(`Audit failed: ${err.message}`));
        }
    });

program
    .command('watch')
    .description('Watch project for changes and auto-update memory')
    .action(async () => {
        showIntro('watch');
        try {
            await runWatch();
        } catch (err: any) {
            outro(chalk.red(`Watch failed: ${err.message}`));
        }
    });

program
    .command('stats')
    .description('Show visual project agent stats')
    .action(async () => {
        showIntro('stats');
        try {
            await runStats();
            outro(chalk.green('Stats display complete!'));
        } catch (err: any) {
            outro(chalk.red(`Stats failed: ${err.message}`));
        }
    });

program
    .command('sync')
    .description('Sync agent files with GitHub Gist')
    .option('--push', 'Push local files to Gist')
    .option('--pull', 'Pull files from Gist')
    .action(async (options) => {
        showIntro('sync');
        try {
            const direction = options.pull ? 'pull' : 'push';
            await runSync(direction);
            outro(chalk.green(`Sync (${direction}) complete!`));
        } catch (err: any) {
            outro(chalk.red(`Sync failed: ${err.message}`));
        }
    });

program
    .command('tokens')
    .description('Calculate token usage for agent .md files')
    .action(async () => {
        showIntro('tokens');
        try {
            await runTokens();
            outro(chalk.green('Token calculation complete!'));
        } catch (err: any) {
            outro(chalk.red(`Calculation failed: ${err.message}`));
        }
    });

program
    .command('chat')
    .description('Start a terminal chat session with AI')
    .action(async () => {
        showIntro('chat');
        try {
            await runChat();
        } catch (err: any) {
            outro(chalk.red(`Chat failed: ${err.message}`));
        }
    });

program
    .command('compress')
    .description('Minify agent .md files to reduce token usage')
    .action(async () => {
        showIntro('compress');
        try {
            await runCompress();
            outro(chalk.green('Compression complete!'));
        } catch (err: any) {
            outro(chalk.red(`Compression failed: ${err.message}`));
        }
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
