import { ModuleInfo } from './makeModuleInfo';
/**
 * Attempt to detect if the current module is a common js module.
 * @function
 * @param {Object} moduleInfo
 * @returns {boolean}
 */
export declare const isCommonModule: (moduleInfo: ModuleInfo) => boolean;
export default isCommonModule;
