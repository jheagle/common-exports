import { StreamFile } from './resolveImports';
import { ModuleInfo } from './makeModuleInfo';
/**
 * Build the content replacements with a reduce function.
 * @callback reduceImports
 * @param {string} content
 * @param {Object} importFile
 * @returns {string}
 */
export type reduceImports = (content: string, importFile: ModuleInfo) => string;
/**
 * Take a srcPath, destPath, and file and return a function to reduce the content for replacing file imports.
 * @param {string} srcPath
 * @param {string} destPath
 * @param {Object} file
 * @param {Object<string, Object.<string, *>>} [config={}]
 * @returns {reduceImports}
 */
export declare const replaceImports: (srcPath: string, destPath: string, file: StreamFile, config?: {
    [key: string]: {
        [key: string]: any;
    };
}) => reduceImports;
export default replaceImports;
