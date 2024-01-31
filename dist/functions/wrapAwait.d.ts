/**
 * Some import / export conversions use await which must be wrapped in an async function.
 * @param {string} fileContents
 * @param {string} fileName
 * @returns {string}
 */
export declare const wrapAwait: (fileContents: string, fileName?: string) => string;
export default wrapAwait;
