/// <reference types="node" />
import { ModuleInfo } from './makeModuleInfo';
/**
 * Statistical information about the file.
 * @typedef {Object<string, number|string>} Stats
 * @property {number} dev
 * @property {number} mode
 * @property {number} nlink
 * @property {number} uid
 * @property {number} gid
 * @property {number} rdev
 * @property {number} blksize
 * @property {number} ino
 * @property {number} size
 * @property {number} blocks
 * @property {number} atimeMs
 * @property {number} mtimeMs
 * @property {number} ctimeMs
 * @property {number} birthtimeMs
 * @property {string} atime
 * @property {string} mtime
 * @property {string} ctime
 * @property {string} birthtime
 */
export type Stats = {
    dev: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    blksize: number;
    ino: number;
    size: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: string;
    mtime: string;
    ctime: string;
    birthtime: string;
};
/**
 * An encoded structure for storing data.
 * @typedef {Object} Buffer
 * @method write
 * @method toString
 * @method toJSON
 * @method equals
 * @method compare
 * @method copy
 * @method slice
 * @method subarray
 * @method reverse
 * @method fill
 * @method indexOf
 * @method lastIndexOf
 * @method entries
 * @method includes
 * @method keys
 * @method values
 */
/**
 * The format used to store a buffered file in memory.
 * @typedef {Object<string, string|Buffer|boolean|Stats>} StreamFile
 * @property {string} base
 * @property {Buffer} contents
 * @property {string} cwd
 * @property {string} history
 * @property {boolean} isVinyl
 * @property {string} path
 * @property {Stats} stat
 */
export type StreamFile = {
    base: string;
    contents: Buffer;
    cwd: string;
    history: string;
    isVinyl: boolean;
    path: string;
    stat: Stats;
};
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths.
 * @memberof module:common-exports
 * @param {StreamFile} file - The in-memory fetched file object.
 * @param {string|null} [rootPath=null] - The root path to use when resolving imports.
 * @returns {Array<ModuleInfo>}
 */
export declare function resolveImports(file: StreamFile, rootPath?: string | null): Array<ModuleInfo>;
