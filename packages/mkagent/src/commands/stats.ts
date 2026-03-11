import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import Table from 'cli-table3';

export async function runStats(projectPath: string = process.cwd()) {
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md', 'README.md', 'ARCHITECTURE.md'];
    const foundFiles = [];

    for (const file of agentFiles) {
        if (await fs.pathExists(path.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }

    if (foundFiles.length === 0) {
        console.log(chalk.yellow('No agent files found to generate stats. Run `mkagent --help` to initialize.'));
        return;
    }

    const spinner = ora('Analyzing project intelligence metrics...').start();

    const stats = [];
    let maxChars = 0;
    let totalChars = 0;

    for (const file of foundFiles) {
        const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
        const chars = content.length;
        totalChars += chars;
        if (chars > maxChars) maxChars = chars;
        stats.push({ file, chars });
    }

    spinner.succeed('Metrics gathered successfully.');

    // Build the table
    const table = new Table({
        head: [
            chalk.cyan.bold('Module Name'),
            chalk.cyan.bold('Size (Bytes)'),
            chalk.cyan.bold('Est. Tokens'),
            chalk.cyan.bold('Complexity Graph')
        ],
        style: { head: [], border: ['gray'] },
        chars: {
            'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
            'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
            'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
            'right': '│', 'right-mid': '┤', 'middle': '│'
        }
    });

    for (const s of stats) {
        const barWidth = 20;
        const normalizedWidth = Math.ceil((s.chars / maxChars) * barWidth);
        const bar = chalk.green('█'.repeat(normalizedWidth)) + chalk.dim('░'.repeat(barWidth - normalizedWidth));
        const estTokens = Math.round(s.chars / 4); // ~4 chars per token

        table.push([
            chalk.white.bold(s.file),
            chalk.yellow(s.chars.toLocaleString()),
            chalk.magenta(estTokens.toLocaleString()),
            bar
        ]);
    }

    const estTotalTokens = Math.round(totalChars / 4);
    let complexityRating = chalk.green.bold('LOW');
    if (totalChars > 15000) complexityRating = chalk.red.bold('HIGH (Refactor Recommended)');
    else if (totalChars > 5000) complexityRating = chalk.yellow.bold('MEDIUM');

    // Build the summary dashboard
    const summaryText = `
${chalk.bold('TOTAL MODULES:')}    ${chalk.cyan(foundFiles.length)}
${chalk.bold('OVERALL SIZE:')}     ${chalk.yellow(totalChars.toLocaleString() + ' chars')}
${chalk.bold('TOTAL TOKENS:')}     ${chalk.magenta('~' + estTotalTokens.toLocaleString())}
${chalk.bold('SYSTEM COMPLEXITY:')} ${complexityRating}
    `.trim();

    const output = `
${table.toString()}

${boxen(summaryText, {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'cyan',
        title: chalk.cyan.bold(' INTELLIGENCE SNAPSHOT '),
        titleAlignment: 'center'
    })}
    `.trim();

    console.log('\n' + output + '\n');
}
