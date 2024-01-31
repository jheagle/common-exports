/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @param {string} modulePath
 * @returns {string|null}
 */
export declare const resolveMainFile: (modulePath: string) => string | null;
export default resolveMainFile;
