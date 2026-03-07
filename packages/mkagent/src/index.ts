#!/usr/bin/env node
import { Command } from 'commander';
import { intro, outro, cancel, confirm, isCancel } from '@clack/prompts';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { getConfig, maskKey } from './config.js';
import { runConfigPrompt, runInitPrompt } from './prompts.js';
import { orchestrateGeneration } from './generate.js';
import { generateContent, PromptContext } from './ai.js';
import { detectStack, ProjectIntelligence } from './detect.js';
import ora from 'ora';

const program = new Command();

program
    .name('mkagent')
    .description('AI-powered file generation and scaffolding tool.')
    .version('1.0.0');

program
    .command('config')
    .description('Configure API keys and default AI model')
    .option('--show', 'Show the currently saved config')
    .action(async (options) => {
        intro(chalk.bgCyan(chalk.black(' mkagent config ')));

        if (options.show) {
            const config = await getConfig();
            if (!config) {
                console.log(chalk.yellow('No configuration found. Run `npx mkagent config` to create one.'));
            } else {
                console.log(chalk.green('Current Configuration:'));
                console.log(`  Default Model: ${chalk.bold(config.defaultModel)}`);
                console.log(`  OpenAI Key:    ${maskKey(config.keys?.openai)}`);
                console.log(`  Anthropic Key: ${maskKey(config.keys?.anthropic)}`);
                console.log(`  Gemini Key:    ${maskKey(config.keys?.gemini)}`);
            }
            outro('Done.');
            return;
        }

        await runConfigPrompt();
        outro(chalk.green('Configuration saved successfully!'));
    });

program
    .command('init')
    .description('Initialize a new project with AI scaffolding')
    .option('--dry-run', 'Preview without writing files')
    .action(async (options) => {
        intro(chalk.bgCyan(chalk.black(' mkagent init ')));

        let config = await getConfig();
        if (!config || !config.keys || !config.keys[config.defaultModel]) {
            console.log(chalk.yellow('No valid configuration found. Let\'s set it up first.'));
            const newConfig = await runConfigPrompt();
            if (!newConfig) return;
            config = await getConfig(); // reload
        }

        if (!config) return cancel('Configuration missing. Aborting.');

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
            config,
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
        intro(chalk.bgCyan(chalk.black(' mkagent doctor ')));
        const spinner = ora('Checking configuration...').start();

        try {
            const config = await getConfig();
            if (!config) {
                spinner.fail(chalk.red('No configuration file found. Run `mkagent config` to set up.'));
            } else {
                spinner.succeed(chalk.green('Configuration file found.'));

                const model = config.defaultModel;
                const key = config.keys[model];

                if (key) {
                    spinner.succeed(chalk.green(`API Key for ${model} is present: ${maskKey(key)}`));
                } else {
                    spinner.fail(chalk.red(`API Key for ${model} is missing!`));
                }
            }

            const intelligence = await detectStack();
            console.log(chalk.cyan('\nProject Intelligence:'));
            console.log(`- Detected Stack: ${chalk.bold(intelligence.stack)}`);
            console.log(`- TypeScript: ${intelligence.hasTypeScript ? chalk.green('Yes') : chalk.dim('No')}`);
            console.log(`- Tailwind: ${intelligence.hasTailwind ? chalk.green('Yes') : chalk.dim('No')}`);
            console.log(`- ESLint: ${intelligence.hasESLint ? chalk.green('Yes') : chalk.dim('No')}`);
            console.log(`- Monorepo: ${intelligence.isMonorepo ? chalk.green('Yes') : chalk.dim('No')}`);

            outro(chalk.green('\nHealth check complete. You are ready to go!'));
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
        intro(chalk.bgCyan(chalk.black(' mkagent regenerate ')));

        const config = await getConfig();
        if (!config || !config.keys || !config.keys[config.defaultModel]) {
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
        const possibleAgents = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];
        for (const agent of possibleAgents) {
            if (await fs.pathExists(path.join(process.cwd(), agent))) {
                agentsToGen.push(agent);
            }
        }

        if (agentsToGen.length === 0) {
            return cancel('No existing agent files found in the current folder.');
        }

        const spinner = ora(`⚡ Regenerating agents...`).start();
        for (const file of agentsToGen) {
            const res = await generateContent(config, file, context);
            if (!options.dryRun) {
                if (res.success) {
                    await fs.writeFile(path.join(process.cwd(), file), res.content);
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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
