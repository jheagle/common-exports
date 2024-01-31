/**
 * Take a string and escape the regex characters.
 * @param {string} str
 * @returns {string}
 */
export const regexEscape = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default regexEscape
