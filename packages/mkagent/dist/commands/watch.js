import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { runAudit } from './audit.js';
export async function runWatch(projectPath = process.cwd()) {
    console.log(chalk.cyan(`\nWatching project for changes: ${chalk.bold(path.basename(projectPath))}`));
    console.log(chalk.dim('Press Ctrl+C to stop.\n'));
    const ignoreDirs = ['.git', 'node_modules', '.next', 'dist', 'build', 'out', '.mkagent'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.md'];
    let isUpdating = false;
    const watcher = fs.watch(projectPath, { recursive: true }, async (event, filename) => {
        if (!filename)
            return;
        // Basic filtering
        if (ignoreDirs.some(dir => filename.includes(dir)))
            return;
        if (!extensions.includes(path.extname(filename)) && !filename.endsWith('.json'))
            return;
        if (isUpdating)
            return;
        console.log(`${chalk.dim(`[${new Date().toLocaleTimeString()}]`)} ${chalk.yellow('Change detected:')} ${filename}`);
        isUpdating = true;
        const spinner = ora('Updating project memory...').start();
        try {
            // For now, we just rerun audit to keep MEMORY.md fresh
            await runAudit(projectPath);
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
        console.log(chalk.yellow('\nWatcher stopped.'));
        process.exit();
    });
}
