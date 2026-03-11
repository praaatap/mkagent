import { MkagentConfig } from './config.js';
export declare function runConfigPrompt(): Promise<void | MkagentConfig>;
export interface ProjectOptions {
    folderName: string;
    projectType: string;
    description: string;
    commands: string;
    forbidden: string;
    agents: string[];
    useAppRouter?: boolean;
    useTailwind?: boolean;
    useSrcDir?: boolean;
    importAlias?: string;
    technicalLevel?: 'Senior' | 'Expert' | 'Architect';
    focusArea?: 'Performance' | 'Security' | 'Testing' | 'Fullstack';
    template?: 'saas' | 'api' | 'dashboard' | 'landing' | 'ecommerce' | 'none';
}
export declare function runInitPrompt(): Promise<ProjectOptions | void>;
export declare function runLocalGeneratePrompt(): Promise<ProjectOptions | void>;
