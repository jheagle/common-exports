import { makeCommonConfig } from '../main';
import { ModuleInfo } from './makeModuleInfo';
/**
 * Build the content replacements with a reduce function.
 * @callback reduceImports
 * @param {string} content - The string of file contents to find and replace imports within.
 * @param {ModuleInfo} importFile - Module location info object for the original name and path.
 * @returns {string}
 */
export type reduceImports = (content: string, importFile: ModuleInfo) => string;
/**
 * Take a srcPath, destPath, then return a function to reduce the content for replacing file imports.
 * @memberof module:common-exports
 * @param {string} srcPath - The original path of the file to be updated.
 * @param {string} destPath - The outgoing path of the file once updated.
 * @param {Object<string, Object<string, *>>} [config={}] - Additional configuration options.
 * @returns {reduceImports}
 */
export declare const replaceImports: (srcPath: string, destPath: string, config?: makeCommonConfig) => reduceImports;
