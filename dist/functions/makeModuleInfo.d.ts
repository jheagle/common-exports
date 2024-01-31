export type ModuleInfo = {
    module: string;
    path: string | null;
    file: string | null;
};
/**
 * Create the Module Info object to store the name, path, and file.
 * @param {string} dirPath
 * @param {string} moduleName
 * @param {string} rootPath
 * @returns {string}
 */
export declare const makeModuleInfo: (dirPath: string, moduleName: string, rootPath?: string | null) => ModuleInfo[];
export default makeModuleInfo;
