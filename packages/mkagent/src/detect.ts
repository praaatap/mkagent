import fs from 'fs-extra';
import path from 'path';

export async function detectStack(projectPath: string = process.cwd()): Promise<string> {
    const pkgJsonPath = path.join(projectPath, 'package.json');

    if (await fs.pathExists(pkgJsonPath)) {
        const pkg = await fs.readJson(pkgJsonPath);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps.next) return 'Next.js';
        if (deps.react) return 'React';
        if (deps.express || deps.nestjs || deps.fastify) return 'Node.js API';
        if (pkg.workspaces || await fs.pathExists(path.join(projectPath, 'turbo.json'))) return 'Monorepo';
    }

    if (await fs.pathExists(path.join(projectPath, 'requirements.txt')) || await fs.pathExists(path.join(projectPath, 'pyproject.toml'))) {
        return 'Python';
    }

    return 'Other';
}
