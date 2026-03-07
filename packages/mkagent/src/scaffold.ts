import fs from 'fs-extra';
import path from 'path';

export async function scaffoldProject(folderPath: string, projectName: string) {
    // Create base folder
    await fs.ensureDir(folderPath);

    // Folders
    const dirsToCreate = [
        'src/app',
        'src/components',
        'src/lib',
        'public'
    ];

    for (const dir of dirsToCreate) {
        await fs.ensureDir(path.join(folderPath, dir));
        // add .gitkeep to empty folders except app which will have files
        if (dir !== 'src/app') {
            await fs.writeFile(path.join(folderPath, dir, '.gitkeep'), '');
        }
    }

    // src/app files
    await fs.writeFile(path.join(folderPath, 'src/app/page.tsx'), 'export default function Page() { return <div>Hello World</div>; }\n');
    await fs.writeFile(path.join(folderPath, 'src/app/layout.tsx'), 'export default function Layout({ children }: { children: React.ReactNode }) { return (<html><body>{children}</body></html>); }\n');
    await fs.writeFile(path.join(folderPath, 'src/app/globals.css'), '/* Tailwind or global CSS */\n');

    // Root files
    const pkgJson = {
        name: projectName,
        version: "1.0.0",
        private: true,
        scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start"
        },
        dependencies: {
            "next": "^14.0.0",
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
        }
    };
    await fs.writeJson(path.join(folderPath, 'package.json'), pkgJson, { spaces: 2 });

    const tsconfig = {
        "compilerOptions": {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": true,
            "skipLibCheck": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "noEmit": true,
            "esModuleInterop": true,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "jsx": "preserve",
            "incremental": true,
            "plugins": [{ "name": "next" }],
            "paths": { "@/*": ["./src/*"] }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
    };
    await fs.writeJson(path.join(folderPath, 'tsconfig.json'), tsconfig, { spaces: 2 });

    const gitignore = `
node_modules
.next
out
build
.env
.env.local
.DS_Store
`;
    await fs.writeFile(path.join(folderPath, '.gitignore'), gitignore.trim() + '\\n');
    await fs.writeFile(path.join(folderPath, '.env.example'), '# Example env\\n');
}
