"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTokens = runTokens;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function runTokens(projectPath = process.cwd()) {
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md', 'README.md', 'CONTRIBUTING.md', 'ARCHITECTURE.md'];
    const foundFiles = [];
    for (const file of agentFiles) {
        if (await fs_extra_1.default.pathExists(path_1.default.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }
    if (foundFiles.length === 0) {
        console.log(chalk_1.default.yellow('No agent files found to count tokens.'));
        return;
    }
    const spinner = (0, ora_1.default)('Calculating token counts (estimate)...').start();
    let totalTokens = 0;
    const tableData = [];
    for (const file of foundFiles) {
        const content = await fs_extra_1.default.readFile(path_1.default.join(projectPath, file), 'utf-8');
        const chars = content.length;
        const words = content.split(/\s+/).length;
        // Rough estimate: 1 token per 4 characters for English text
        const estimatedTokens = Math.ceil(chars / 4);
        totalTokens += estimatedTokens;
        tableData.push({ file, chars, words, tokens: estimatedTokens });
    }
    spinner.succeed('Token calculation complete.');
    console.log(chalk_1.default.cyan('\nToken Usage Breakdown (Estimated):'));
    console.log(chalk_1.default.dim('------------------------------------------------------------'));
    console.log(chalk_1.default.bold(`${'File'.padEnd(25)} ${'Chars'.padEnd(10)} ${'Words'.padEnd(10)} ${'Tokens'.padEnd(10)}`));
    console.log(chalk_1.default.dim('------------------------------------------------------------'));
    for (const row of tableData) {
        console.log(`${row.file.padEnd(25)} ${row.chars.toString().padEnd(10)} ${row.words.toString().padEnd(10)} ${chalk_1.default.green(row.tokens.toString().padEnd(10))}`);
    }
    console.log(chalk_1.default.dim('------------------------------------------------------------'));
    console.log(`${chalk_1.default.bold('Total Estimate:'.padEnd(47))} ${chalk_1.default.bgGreen(chalk_1.default.black(` ${totalTokens} tokens `))}`);
    console.log(chalk_1.default.dim('\n*Note: Estimates based on ~4 chars per token. Actual counts vary by model and tokenizer.\n'));
}
