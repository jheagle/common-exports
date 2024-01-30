export type ModuleInfo = {
    module: string;
    path: string | null;
    file: string | null;
};
/**
 * Create the Module Info object to store the name, path, and file.
 * @function
 * @param {string} dirPath
 * @param {string} moduleName
 * @returns {string}
 */
export declare const makeModuleInfo: (dirPath: string, moduleName: string) => ModuleInfo[];
export default makeModuleInfo;
