/**
 * Take a string and escape the regex characters.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/regexEscape.ts Sí, funciona}
 * @memberof module:common-exports
 * @param {string} str
 * @returns {string}
 */
export const regexEscape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
