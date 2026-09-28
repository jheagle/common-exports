import { ModuleInfo } from './makeModuleInfo';
/**
 * Attempt to detect if the current module is a common js module.
 * @memberof module:common-exports
 * @param moduleInfo - An object containing the path and file strings.
 */
export declare const isCommonModule: (moduleInfo: Pick<ModuleInfo, "path" | "file">) => boolean;
