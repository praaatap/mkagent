"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectStack = detectStack;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function detectStack(projectPath = process.cwd()) {
    const pkgJsonPath = path_1.default.join(projectPath, 'package.json');
    const intelligence = {
        name: path_1.default.basename(projectPath),
        stack: 'Other',
        description: '',
        dependencies: {},
        hasTypeScript: await fs_extra_1.default.pathExists(path_1.default.join(projectPath, 'tsconfig.json')),
        hasTailwind: false,
        hasESLint: await fs_extra_1.default.pathExists(path_1.default.join(projectPath, '.eslintrc*')) || await fs_extra_1.default.pathExists(path_1.default.join(projectPath, 'eslint.config.js')),
        hasPrettier: await fs_extra_1.default.pathExists(path_1.default.join(projectPath, '.prettierrc*')),
        configFiles: [],
        isMonorepo: false,
    };
    const commonConfigs = [
        'tailwind.config.js', 'tailwind.config.ts',
        'next.config.js', 'next.config.mjs',
        'vite.config.ts', 'vite.config.js',
        'turbo.json', 'lucide-react'
    ];
    for (const file of commonConfigs) {
        if (await fs_extra_1.default.pathExists(path_1.default.join(projectPath, file))) {
            intelligence.configFiles.push(file);
        }
    }
    if (await fs_extra_1.default.pathExists(pkgJsonPath)) {
        const pkg = await fs_extra_1.default.readJson(pkgJsonPath);
        intelligence.name = pkg.name || intelligence.name;
        intelligence.description = pkg.description || '';
        intelligence.dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
        const deps = intelligence.dependencies;
        if (deps.next)
            intelligence.stack = 'Next.js';
        else if (deps.react)
            intelligence.stack = 'React';
        else if (deps.express || deps.nestjs || deps.fastify)
            intelligence.stack = 'Node.js API';
        intelligence.hasTailwind = !!(deps.tailwindcss || intelligence.configFiles.some(f => f.startsWith('tailwind')));
        intelligence.isMonorepo = !!(pkg.workspaces || await fs_extra_1.default.pathExists(path_1.default.join(projectPath, 'turbo.json')));
    }
    if (intelligence.stack === 'Other') {
        if (await fs_extra_1.default.pathExists(path_1.default.join(projectPath, 'requirements.txt')) || await fs_extra_1.default.pathExists(path_1.default.join(projectPath, 'pyproject.toml'))) {
            intelligence.stack = 'Python';
        }
    }
    return intelligence;
}
