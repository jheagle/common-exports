/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */
import * as stream from 'stream';
export type updateContentCallback = (content: string) => string;
export type makeCommonConfig = {
    copyResources?: {
        [key: string]: [{
            src: string;
            dest: string;
            updateContent?: updateContentCallback;
        }];
    };
    customChanges?: {
        [key: string]: [{
            updateContent?: updateContentCallback;
        }];
    };
    rootPath?: string;
};
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @memberof module:common-exports
 * @param {string|array} srcPath - The relative path to the file to convert.
 * @param {string} destPath - The relative path to the output directory.
 * @param {Object<string, *>} [config={}] - Add additional instructions to the process.
 * @param {Object<string, Array.<Object.<src|dest|updateContent, string|Function>>>} [config.copyResources={}] -
 * Add custom files to copy for found modules.
 * @param {Object<string, Array.<Object.<updateContent, Function>>>} [config.customChanges={}] -
 * Add custom content changes to the content used.
 * @param {string} [config.rootPath=''] - Specify the root to use, this helps identify where to stop.
 * @param {Map<string, Promise<void>>} [inProgress=new Map()] - Tracks recursive conversions already started (by
 * destination path) for this whole call tree, shared across every recursive makeCommon call it spawns. Without
 * this, the same dependency reachable from multiple import chains (a very common shape once a tree gets deep or
 * wide) gets independently, redundantly re-converted - each duplicate spawning its own full sub-tree of further
 * duplicates - which is what caused this function's historical OOM crash under real-world dependency graphs.
 * @param {Set<string>} [ancestors=new Set()] - The chain of source files currently being converted above this
 * call, in this same branch of the recursion. Real packages do have genuine circular imports (e.g. two files that
 * import from each other) - CommonJS/Node handle that fine at runtime via partial exports, but this function
 * cannot: waiting for a circular dependency's own conversion to finish before considering the current file done
 * would deadlock (each side waiting on the other) forever. When a discovered import's target is already an
 * ancestor, its conversion is already in flight further up this same chain - don't wait on it here too.
 * @returns {stream.Stream}
 */
export declare const makeCommon: (srcPath: string, destPath: string, config?: makeCommonConfig, inProgress?: Map<string, Promise<void>>, ancestors?: Set<string>) => stream.Stream;
