/// <reference types="node" />
import * as stream from 'stream';
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @return {stream.Stream}
 */
export declare const makeCommon: (srcPath: string | Array<string>, destPath: string) => stream.Stream;
export default makeCommon;
