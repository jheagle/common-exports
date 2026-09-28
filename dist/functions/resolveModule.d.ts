/**
 * Search for the given module and return the full path.
 * @memberof module:common-exports
 * @param root - The base path for searching.
 * @param moduleName - The import name used for retrieving the module.
 * @param current - The current directory we are checking for module matches.
 */
export declare const resolveModule: (root: string, moduleName: string, current?: string) => string[];
