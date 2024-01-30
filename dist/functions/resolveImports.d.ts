/// <reference types="node" />
import { ModuleInfo } from './makeModuleInfo';
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
 * @function
 * @param {Object} file
 * @returns {Array<string, Object>}
 */
export declare function resolveImports(file: StreamFile): Array<ModuleInfo>;
export default resolveImports;
