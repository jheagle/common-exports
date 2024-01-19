/**
 * Take a string and escape the regex characters.
 * @function
 * @param {string} str
 * @returns {string}
 */
export const regexEscape = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default regexEscape
