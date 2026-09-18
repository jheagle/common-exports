/**
 * Compare two file paths and simplify them to a relative path.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/makeRelativePath.ts Sí, funciona}
 * @memberof module:common-exports
 * @param {string} fromFile
 * @param {string} toFile
 * @returns {string}
 */
export declare const makeRelativePath: (fromFile: string, toFile: string) => string;
