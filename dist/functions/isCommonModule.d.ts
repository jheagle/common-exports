import { ModuleInfo } from './makeModuleInfo';
/**
 * Attempt to detect if the current module is a common js module.
 * @memberof module:common-exports
 * @param {Object<module|path|file, string|null>} moduleInfo - An object containing the module, path, and file strings.
 * @returns {boolean}
 */
export declare const isCommonModule: (moduleInfo: ModuleInfo) => boolean;
export default isCommonModule;
