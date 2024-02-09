/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @memberof module:common-exports
 * @param {string} modulePath - The relative path used to locate the module.
 * @returns {string|null}
 */
export declare const resolveMainFile: (modulePath: string) => string | null;
export default resolveMainFile;
