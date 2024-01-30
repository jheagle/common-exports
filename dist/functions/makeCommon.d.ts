/// <reference types="node" />
import * as stream from 'stream';
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @param {Object<string, Object.<string, *>>} [config={}]
 * @return {stream.Stream}
 */
export declare const makeCommon: (srcPath: string, destPath: string, config?: {
    [key: string]: {
        [key: string]: any;
    };
}) => stream.Stream;
export default makeCommon;
