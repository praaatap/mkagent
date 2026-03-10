import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
export async function runTokens(projectPath = process.cwd()) {
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md', 'README.md', 'CONTRIBUTING.md', 'ARCHITECTURE.md'];
    const foundFiles = [];
    for (const file of agentFiles) {
        if (await fs.pathExists(path.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }
    if (foundFiles.length === 0) {
        console.log(chalk.yellow('No agent files found to count tokens.'));
        return;
    }
    const spinner = ora('Calculating token counts (estimate)...').start();
    let totalTokens = 0;
    const tableData = [];
    for (const file of foundFiles) {
        const content = await fs.readFile(path.join(projectPath, file), 'utf-8');
        const chars = content.length;
        const words = content.split(/\s+/).length;
        // Rough estimate: 1 token per 4 characters for English text
        const estimatedTokens = Math.ceil(chars / 4);
        totalTokens += estimatedTokens;
        tableData.push({ file, chars, words, tokens: estimatedTokens });
    }
    spinner.succeed('Token calculation complete.');
    console.log(chalk.cyan('\nToken Usage Breakdown (Estimated):'));
    console.log(chalk.dim('------------------------------------------------------------'));
    console.log(chalk.bold(`${'File'.padEnd(25)} ${'Chars'.padEnd(10)} ${'Words'.padEnd(10)} ${'Tokens'.padEnd(10)}`));
    console.log(chalk.dim('------------------------------------------------------------'));
    for (const row of tableData) {
        console.log(`${row.file.padEnd(25)} ${row.chars.toString().padEnd(10)} ${row.words.toString().padEnd(10)} ${chalk.green(row.tokens.toString().padEnd(10))}`);
    }
    console.log(chalk.dim('------------------------------------------------------------'));
    console.log(`${chalk.bold('Total Estimate:'.padEnd(47))} ${chalk.bgGreen(chalk.black(` ${totalTokens} tokens `))}`);
    console.log(chalk.dim('\n*Note: Estimates based on ~4 chars per token. Actual counts vary by model and tokenizer.\n'));
}
