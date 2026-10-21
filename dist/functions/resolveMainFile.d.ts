/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @param modulePath - The relative path used to locate the module.
 */
export declare const resolveMainFile: (modulePath: string) => string | null;
