/**
 * Some import / export conversions use await which must be wrapped in an async function.
 * @memberof module:common-exports
 * @param {string} fileContents - The string content of the file for updating.
 * @param {string} fileName - The name of the file we are doing changes for.
 * @returns {string}
 */
export declare const wrapAwait: (fileContents: string, fileName?: string) => string;
export default wrapAwait;
