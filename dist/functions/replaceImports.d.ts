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
 * @param {Array<Promise<void>>} [pending=[]] - Recursive conversions started for discovered imports are pushed
 * here as promises, so the caller can await them before considering the current file done. makeCommon's own
 * recursive calls don't block; without this, a file could be reported "finished" before its own dependencies (or
 * their dependencies, arbitrarily deep) have actually finished being written.
 * @param {Map<string, Promise<void>>} [inProgress=new Map()] - Tracks recursive conversions already started (by
 * destination path), shared across the whole call tree. A dependency reachable from multiple import chains would
 * otherwise be independently, redundantly re-converted every time it's encountered again while its first
 * conversion is still in flight (the fileExists check below can't catch this - the file isn't written yet) -
 * each duplicate spawning its own full sub-tree of further duplicates, which is what caused this function's
 * historical OOM crash. Reusing the same in-flight promise instead of starting a new one avoids that entirely.
 * @param {Set<string>} [ancestors=new Set()] - Source files currently being converted above this one, in this
 * same branch. Real packages can have genuine circular imports (two files that import each other) - waiting for
 * such a target's conversion to finish before this file is done would deadlock, since its own conversion is
 * simultaneously waiting on this one. A target already in this set is already in flight further up the same
 * chain - don't wait on it again here.
 * @returns {reduceImports}
 */
export declare const replaceImports: (srcPath: string, destPath: string, config?: makeCommonConfig, pending?: Array<Promise<void>>, inProgress?: Map<string, Promise<void>>, ancestors?: Set<string>) => reduceImports;
