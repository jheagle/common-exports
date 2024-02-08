/**
 * Take a string and escape the regex characters.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/regexEscape.ts Sí, funciona}
 * @param {string} str
 * @returns {string}
 */
export const regexEscape = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default regexEscape
