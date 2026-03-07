import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { generateContent, PromptContext } from './ai.js';
import { scaffoldProject } from './scaffold.js';
import { MkagentConfig } from './config.js';

import { ProjectIntelligence } from './detect.js';

import { ProjectOptions } from './prompts.js';

export async function orchestrateGeneration(
    config: MkagentConfig,
    targetFolder: string,
    options: ProjectOptions,
    intelligence: ProjectIntelligence,
    dryRun: boolean = false
) {
    const { folderName, projectType, description, commands, forbidden, agents } = options;
    const context: PromptContext = { ...options, intelligence };

    const spinner = ora(`⚡ Generating agents with ${config.defaultModel}...`).start();

    try {
        for (const filename of agents) {
            spinner.text = `⚡ Generating ${filename} with ${config.defaultModel}...`;
            const res = await generateContent(config, filename, context);

            if (!res.success) {
                spinner.fail(chalk.yellow(`Warning: AI generation failed (${res.error}). Using template for ${filename}.`));
                spinner.start();
            }

            if (!dryRun) {
                await fs.ensureDir(targetFolder);
                await fs.writeFile(path.join(targetFolder, filename), res.content);
            } else {
                spinner.succeed(chalk.cyan(`[DRY RUN] Generated ${filename}:`));
                console.log(chalk.dim(res.content));
                spinner.start();
            }
        }

        spinner.text = `⚡ Generating README.md with ${config.defaultModel}...`;
        const resReadme = await generateContent(config, 'README.md', context);
        if (!dryRun) {
            await fs.ensureDir(targetFolder);
            await fs.writeFile(path.join(targetFolder, 'README.md'), resReadme.success ? resReadme.content : `# ${folderName}\n\n${description}`);
        } else {
            spinner.succeed(chalk.cyan(`[DRY RUN] Generated README.md:`));
            console.log(chalk.dim(resReadme.content));
        }

        spinner.succeed(chalk.green('Markdown files generated successfully.'));

        if (!dryRun) {
            spinner.start('Scaffolding folder structure...');
            await scaffoldProject(targetFolder, options);
            spinner.succeed(chalk.green('Project structure scaffolded successfully.'));
        }

    } catch (err: any) {
        spinner.fail(chalk.red(`Generation process failed: ${err.message}`));
    }
}
