/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */
/// <reference types="node" />
import * as stream from 'stream';
export type makeCommonConfig = {
    copyResources?: {
        [key: string]: [{
            src: string;
            dest: string;
        }];
    };
    rootPath?: string;
};
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @memberof module:common-exports
 * @param {string|array} srcPath - The relative path to the file to convert
 * @param {string} destPath - The relative path to the output directory
 * @param {Object<string, *>} [config={}] - Add additional instructions to the process
 * @param {Object<string, Array.<Object.<src|dest, string>>>} [config.copyResources={}] -
 * Add custom files to copy for found modules
 * @param {string} [config.rootPath=''] - Specify the root to use, this helps identify where to stop
 * @return {stream.Stream}
 */
export declare const makeCommon: (srcPath: string, destPath: string, config?: makeCommonConfig) => stream.Stream;
export default makeCommon;
