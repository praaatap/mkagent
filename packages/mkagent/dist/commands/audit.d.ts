interface AuditResult {
    secrets: string[];
    todos: string[];
    logs: string[];
}
export declare function runAudit(projectPath?: string): Promise<AuditResult>;
export {};
