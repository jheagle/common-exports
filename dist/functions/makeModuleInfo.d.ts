export type ModuleInfo = {
    module: string;
    path: string | null;
    file: string | null;
    isCommon: boolean;
};
/**
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param dirPath - Current relative directory to search.
 * @param moduleName - Path used in the import for the module.
 * @param rootPath - The lowest path to search within for the module.
 */
export declare const makeModuleInfo: (dirPath: string, moduleName: string, rootPath?: string | null) => ModuleInfo[];
