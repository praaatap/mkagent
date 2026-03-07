import fs from 'fs-extra';
import path from 'path';

export interface ProjectIntelligence {
    name: string;
    stack: string;
    description: string;
    dependencies: Record<string, string>;
    hasTypeScript: boolean;
    hasTailwind: boolean;
    hasESLint: boolean;
    hasPrettier: boolean;
    configFiles: string[];
    isMonorepo: boolean;
}

export async function detectStack(projectPath: string = process.cwd()): Promise<ProjectIntelligence> {
    const pkgJsonPath = path.join(projectPath, 'package.json');
    const intelligence: ProjectIntelligence = {
        name: path.basename(projectPath),
        stack: 'Other',
        description: '',
        dependencies: {},
        hasTypeScript: await fs.pathExists(path.join(projectPath, 'tsconfig.json')),
        hasTailwind: false,
        hasESLint: await fs.pathExists(path.join(projectPath, '.eslintrc*')) || await fs.pathExists(path.join(projectPath, 'eslint.config.js')),
        hasPrettier: await fs.pathExists(path.join(projectPath, '.prettierrc*')),
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
        if (await fs.pathExists(path.join(projectPath, file))) {
            intelligence.configFiles.push(file);
        }
    }

    if (await fs.pathExists(pkgJsonPath)) {
        const pkg = await fs.readJson(pkgJsonPath);
        intelligence.name = pkg.name || intelligence.name;
        intelligence.description = pkg.description || '';
        intelligence.dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

        const deps = intelligence.dependencies;
        if (deps.next) intelligence.stack = 'Next.js';
        else if (deps.react) intelligence.stack = 'React';
        else if (deps.express || deps.nestjs || deps.fastify) intelligence.stack = 'Node.js API';

        intelligence.hasTailwind = !!(deps.tailwindcss || intelligence.configFiles.some(f => f.startsWith('tailwind')));
        intelligence.isMonorepo = !!(pkg.workspaces || await fs.pathExists(path.join(projectPath, 'turbo.json')));
    }

    if (intelligence.stack === 'Other') {
        if (await fs.pathExists(path.join(projectPath, 'requirements.txt')) || await fs.pathExists(path.join(projectPath, 'pyproject.toml'))) {
            intelligence.stack = 'Python';
        }
    }

    return intelligence;
}
