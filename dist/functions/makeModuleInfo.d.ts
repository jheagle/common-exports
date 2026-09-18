/**
 * Module info stores the location data for a module found through imports.
 * @typedef {Object<module|path|file, string|null>} ModuleInfo
 * @property {string} module - Name or path used in the import to get the module.
 * @property {string|null} path - The full (relative to root) path for retrieving the module.
 * @property {string|null} file - The main / index file of the module.
 * @property {boolean} isCommon - Whether this module is already CommonJS-compatible as-is.
 */
export type ModuleInfo = {
    module: string;
    path: string | null;
    file: string | null;
    isCommon: boolean;
};
/**
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param {string} dirPath - Current relative directory to search.
 * @param {string} moduleName - Path used in the import for the module.
 * @param {string} rootPath - The lowest path to search within for the module.
 * @returns {Array<ModuleInfo>}
 */
export declare const makeModuleInfo: (dirPath: string, moduleName: string, rootPath?: string | null) => ModuleInfo[];
