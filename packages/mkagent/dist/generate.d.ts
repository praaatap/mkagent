import { ProjectIntelligence } from './detect.js';
import { ProjectOptions } from './prompts.js';
export declare function orchestrateGeneration(targetFolder: string, options: ProjectOptions, intelligence: ProjectIntelligence, dryRun?: boolean): Promise<void>;
