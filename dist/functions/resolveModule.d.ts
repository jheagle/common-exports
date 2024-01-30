/**
 * Search for the given module and return the full path.
 * @function
 * @param {string} root
 * @param {string} moduleName
 * @param {string} current
 * @returns {Array<string>}
 */
export declare const resolveModule: (root: string, moduleName: string, current?: string) => string[];
export default resolveModule;
