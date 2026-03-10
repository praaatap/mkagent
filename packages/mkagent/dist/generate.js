"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestrateGeneration = orchestrateGeneration;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const ai_js_1 = require("./ai.js");
const scaffold_js_1 = require("./scaffold.js");
const config_js_1 = require("./config.js");
async function orchestrateGeneration(targetFolder, options, intelligence, dryRun = false) {
    const profile = await (0, config_js_1.getActiveProfile)();
    if (!profile) {
        throw new Error('No active profile found. Run `mkagent config` first.');
    }
    const { folderName, projectType, description, agents } = options;
    const context = { ...options, intelligence };
    const spinner = (0, ora_1.default)(`⚡ Generating agents with ${profile.defaultModel}...`).start();
    try {
        for (const filename of agents) {
            spinner.text = `⚡ Generating ${filename} with ${profile.defaultModel}...`;
            const res = await (0, ai_js_1.generateContent)(profile, filename, context);
            if (!res.success) {
                spinner.fail(chalk_1.default.yellow(`Warning: AI generation failed (${res.error}). Using template for ${filename}.`));
                spinner.start();
            }
            if (!dryRun) {
                await fs_extra_1.default.ensureDir(targetFolder);
                await fs_extra_1.default.writeFile(path_1.default.join(targetFolder, filename), res.content);
            }
            else {
                spinner.succeed(chalk_1.default.cyan(`[DRY RUN] Generated ${filename}:`));
                console.log(chalk_1.default.dim(res.content));
                spinner.start();
            }
        }
        spinner.text = `⚡ Generating README.md with ${profile.defaultModel}...`;
        const resReadme = await (0, ai_js_1.generateContent)(profile, 'README.md', context);
        if (!dryRun) {
            await fs_extra_1.default.ensureDir(targetFolder);
            await fs_extra_1.default.writeFile(path_1.default.join(targetFolder, 'README.md'), resReadme.success ? resReadme.content : `# ${folderName}\n\n${description}`);
        }
        else {
            spinner.succeed(chalk_1.default.cyan(`[DRY RUN] Generated README.md:`));
            console.log(chalk_1.default.dim(resReadme.content));
        }
        spinner.succeed(chalk_1.default.green('Markdown files generated successfully.'));
        if (!dryRun) {
            spinner.start('Scaffolding folder structure...');
            await (0, scaffold_js_1.scaffoldProject)(targetFolder, options);
            spinner.succeed(chalk_1.default.green('Project structure scaffolded successfully.'));
        }
    }
    catch (err) {
        spinner.fail(chalk_1.default.red(`Generation process failed: ${err.message}`));
    }
}
