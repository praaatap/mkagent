import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
export async function scaffoldProject(folderPath, options) {
    const { folderName, useAppRouter, useTailwind, useSrcDir, importAlias, template } = options;
    // Create base folder
    await fs.ensureDir(folderPath);
    const baseDir = useSrcDir ? 'src' : '';
    const appOrPages = useAppRouter ? 'app' : 'pages';
    const contentDir = path.join(baseDir, appOrPages);
    // Folders
    const dirsToCreate = [
        contentDir,
        path.join(baseDir, 'components'),
        path.join(baseDir, 'lib'),
        'public'
    ].filter(Boolean);
    for (const dir of dirsToCreate) {
        await fs.ensureDir(path.join(folderPath, dir));
        await fs.writeFile(path.join(folderPath, dir, '.gitkeep'), '');
    }
    // Default Files
    if (useAppRouter) {
        let pageContent = 'export default function Page() { return <main className="flex min-h-screen flex-col items-center justify-between p-24"><h1>Welcome to mkagent</h1></main>; }\n';
        if (template === 'api') {
            pageContent = 'export default function Page() { return <main className="flex min-h-screen flex-col items-center justify-center p-24"><h1>API Service - mkagent</h1><p>Running on Next.js App Router</p></main>; }\n';
        }
        else if (template === 'dashboard') {
            pageContent = 'export default function Dashboard() { return <div className="p-8"><h1>Admin Dashboard</h1><div className="grid grid-cols-3 gap-4 mt-4"><div className="bg-slate-100 p-4 rounded shadow">Stats</div></div></div>; }\n';
        }
        await fs.writeFile(path.join(folderPath, contentDir, 'page.tsx'), pageContent);
        await fs.writeFile(path.join(folderPath, contentDir, 'layout.tsx'), 'export default function RootLayout({ children }: { children: React.ReactNode }) { return (<html lang="en"><body>{children}</body></html>); }\n');
        await fs.writeFile(path.join(folderPath, contentDir, 'globals.css'), useTailwind ? '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' : '/* Global CSS */\n');
    }
    else {
        await fs.writeFile(path.join(folderPath, contentDir, 'index.tsx'), 'export default function Home() { return <div>Welcome to mkagent (Pages Router)</div>; }\n');
        await fs.writeFile(path.join(folderPath, contentDir, '_app.tsx'), 'import type { AppProps } from "next/app";\n export default function App({ Component, pageProps }: AppProps) { return <Component {...pageProps} />; }\n');
    }
    if (useTailwind) {
        const tailwindConfig = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./${useSrcDir ? 'src/' : ''}pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./${useSrcDir ? 'src/' : ''}components/**/*.{js,ts,jsx,tsx,mdx}",
    "./${useSrcDir ? 'src/' : ''}app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
`;
        await fs.writeFile(path.join(folderPath, 'tailwind.config.ts'), tailwindConfig);
        await fs.writeFile(path.join(folderPath, 'postcss.config.js'), 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, }, };\n');
    }
    // package.json dependencies based on template
    const templateDeps = {};
    if (template === 'saas' || template === 'ecommerce') {
        templateDeps['stripe'] = '^14.0.0';
        templateDeps['@clerk/nextjs'] = '^4.29.9';
    }
    else if (template === 'api') {
        templateDeps['zod'] = '^3.22.4';
    }
    // package.json
    const pkgJson = {
        name: options.folderName,
        version: "1.0.0",
        description: options.description || "A premium AI-agent ready project scaffolded with mkagent.",
        private: true,
        scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint"
        },
        dependencies: {
            "next": "^14.1.0",
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "^0.344.0",
            "framer-motion": "^11.0.8",
            ...templateDeps,
            ...(useTailwind ? { "tailwindcss": "^3.4.1", "postcss": "^8.4.35", "autoprefixer": "^10.4.17" } : {})
        }
    };
    await fs.writeJson(path.join(folderPath, 'package.json'), pkgJson, { spaces: 2 });
    // tsconfig.json
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
            "paths": { [importAlias || "@/*"]: [useSrcDir ? "./src/*" : "./*"] }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
    };
    await fs.writeJson(path.join(folderPath, 'tsconfig.json'), tsconfig, { spaces: 2 });
    await fs.writeFile(path.join(folderPath, '.gitignore'), 'node_modules\n.next\nout\nbuild\n.env\n.env.local\n.DS_Store\n');
    await fs.writeFile(path.join(folderPath, '.env.example'), '# AI Agent Keys Example\nNEXT_PUBLIC_AI_ENABLE=true\n');
    // Git initialization
    try {
        execSync('git init', { cwd: folderPath, stdio: 'ignore' });
        execSync('git add .', { cwd: folderPath, stdio: 'ignore' });
        execSync('git commit -m "initial commit by mkagent"', { cwd: folderPath, stdio: 'ignore' });
    }
    catch (e) {
        // Git might not be installed or configured, fail silently for core scaffolding
    }
}
