/**
 * Format the given path so that it does not have trailing slashes and also correctly appends a path.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/makeFilePath.ts Sí, funciona}
 * @param {string} root
 * @param {string} [append='']
 * @returns {string}
 */
export declare const makeFilepath: (root: string, append?: string) => string;
