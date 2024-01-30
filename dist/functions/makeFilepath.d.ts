/**
 * Format the given path so that it does not have trailing slashes and also correctly appends a path.
 * @param {string} root
 * @param {string} [append='']
 * @returns {string}
 */
export declare const makeFilepath: (root: string, append?: string) => string;
export default makeFilepath;
