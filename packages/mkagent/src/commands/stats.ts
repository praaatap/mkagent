import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

export async function runStats(projectPath: string = process.cwd()) {
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md', 'README.md'];
    const foundFiles = [];

    for (const file of agentFiles) {
        if (await fs.pathExists(path.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }

    if (foundFiles.length === 0) {
        console.log(chalk.yellow('No agent files found to generate stats.'));
        return;
    }

    const spinner = ora('Gleaning project stats...').start();

    const stats = [];
    let maxChars = 0;

    for (const file of foundFiles) {
        const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
        const chars = content.length;
        if (chars > maxChars) maxChars = chars;
        stats.push({ file, chars });
    }

    spinner.succeed('Stats gathered.');

    console.log(chalk.cyan('\nProject Agent Stats:'));
    console.log(chalk.dim('------------------------------------------------------------'));

    for (const s of stats) {
        const barWidth = 30;
        const normalizedWidth = Math.ceil((s.chars / maxChars) * barWidth);
        const bar = '█'.repeat(normalizedWidth) + '░'.repeat(barWidth - normalizedWidth);

        console.log(`${s.file.padEnd(15)} | ${chalk.green(bar)} | ${s.chars} chars`);
    }

    console.log(chalk.dim('------------------------------------------------------------'));
    console.log(`${chalk.bold('Total Files:')} ${foundFiles.length}`);
    console.log(`${chalk.bold('Complexity:')} ${maxChars > 5000 ? chalk.red('High') : maxChars > 2000 ? chalk.yellow('Medium') : chalk.green('Low')}`);
    console.log('');
}
