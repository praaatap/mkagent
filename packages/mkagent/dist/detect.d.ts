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
export declare function detectStack(projectPath?: string): Promise<ProjectIntelligence>;
