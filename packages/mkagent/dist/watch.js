"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWatch = runWatch;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const audit_js_1 = require("./audit.js");
async function runWatch(projectPath = process.cwd()) {
    console.log(chalk_1.default.cyan(`\nWatching project for changes: ${chalk_1.default.bold(path_1.default.basename(projectPath))}`));
    console.log(chalk_1.default.dim('Press Ctrl+C to stop.\n'));
    const ignoreDirs = ['.git', 'node_modules', '.next', 'dist', 'build', 'out', '.mkagent'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.md'];
    let isUpdating = false;
    const watcher = fs_extra_1.default.watch(projectPath, { recursive: true }, async (event, filename) => {
        if (!filename)
            return;
        // Basic filtering
        if (ignoreDirs.some(dir => filename.includes(dir)))
            return;
        if (!extensions.includes(path_1.default.extname(filename)) && !filename.endsWith('.json'))
            return;
        if (isUpdating)
            return;
        console.log(`${chalk_1.default.dim(`[${new Date().toLocaleTimeString()}]`)} ${chalk_1.default.yellow('Change detected:')} ${filename}`);
        isUpdating = true;
        const spinner = (0, ora_1.default)('Updating project memory...').start();
        try {
            // For now, we just rerun audit to keep MEMORY.md fresh
            await (0, audit_js_1.runAudit)(projectPath);
            spinner.succeed('Memory updated.');
        }
        catch (err) {
            spinner.fail(`Update failed: ${err.message}`);
        }
        finally {
            isUpdating = false;
        }
    });
    // Keep the process alive
    process.on('SIGINT', () => {
        watcher.close();
        console.log(chalk_1.default.yellow('\nWatcher stopped.'));
        process.exit();
    });
}
