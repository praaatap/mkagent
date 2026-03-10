"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStats = runStats;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function runStats(projectPath = process.cwd()) {
    const agentFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'COPILOT.md', '.cursorrules', 'MEMORY.md', 'README.md'];
    const foundFiles = [];
    for (const file of agentFiles) {
        if (await fs_extra_1.default.pathExists(path_1.default.join(projectPath, file))) {
            foundFiles.push(file);
        }
    }
    if (foundFiles.length === 0) {
        console.log(chalk_1.default.yellow('No agent files found to generate stats.'));
        return;
    }
    const spinner = (0, ora_1.default)('Gleaning project stats...').start();
    const stats = [];
    let maxChars = 0;
    for (const file of foundFiles) {
        const content = await fs_extra_1.default.readFile(path_1.default.join(projectPath, file), 'utf-8');
        const chars = content.length;
        if (chars > maxChars)
            maxChars = chars;
        stats.push({ file, chars });
    }
    spinner.succeed('Stats gathered.');
    console.log(chalk_1.default.cyan('\nProject Agent Stats:'));
    console.log(chalk_1.default.dim('------------------------------------------------------------'));
    for (const s of stats) {
        const barWidth = 30;
        const normalizedWidth = Math.ceil((s.chars / maxChars) * barWidth);
        const bar = '█'.repeat(normalizedWidth) + '░'.repeat(barWidth - normalizedWidth);
        console.log(`${s.file.padEnd(15)} | ${chalk_1.default.green(bar)} | ${s.chars} chars`);
    }
    console.log(chalk_1.default.dim('------------------------------------------------------------'));
    console.log(`${chalk_1.default.bold('Total Files:')} ${foundFiles.length}`);
    console.log(`${chalk_1.default.bold('Complexity:')} ${maxChars > 5000 ? chalk_1.default.red('High') : maxChars > 2000 ? chalk_1.default.yellow('Medium') : chalk_1.default.green('Low')}`);
    console.log('');
}
