/**
 * Retrieve the string part before the last search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBeforeLast.ts Sí, funciona}
 * @memberof module:common-exports
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
export const strBeforeLast = (str, search) => {
  const index = str.lastIndexOf(search)
  return index === -1 ? '' : str.substring(0, index)
}
