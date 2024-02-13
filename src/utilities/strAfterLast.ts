/**
 * Retrieve the string part after the last search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfterLast.ts Sí, funciona}
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
export const strAfterLast = (str: string, search: string): string => {
  const index = str.lastIndexOf(search)
  return index === -1 ? '' : str.substring(index + search.length)
}
