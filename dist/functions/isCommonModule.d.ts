import { ModuleInfo } from './makeModuleInfo';
/**
 * Attempt to detect if the current module is a common js module.
 * @memberof module:common-exports
 * @param {Object<path|file, string|null>} moduleInfo - An object containing the path and file strings.
 * @returns {boolean}
 */
export declare const isCommonModule: (moduleInfo: Pick<ModuleInfo, "path" | "file">) => boolean;
