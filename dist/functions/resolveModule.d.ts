/**
 * Search for the given module and return the full path.
 * @memberof module:common-exports
 * @param {string} root - The base path for searching.
 * @param {string} moduleName - The import name used for retrieving the module.
 * @param {string} current - The current directory we are checking for module matches.
 * @returns {Array<string>}
 */
export declare const resolveModule: (root: string, moduleName: string, current?: string) => string[];
export default resolveModule;
