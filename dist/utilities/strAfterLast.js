'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.strAfterLast = void 0
/**
 * Retrieve the string part after the last search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfterLast.ts Sí, funciona}
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
const strAfterLast = (str, search) => {
  const index = str.lastIndexOf(search)
  return index === -1 ? '' : str.substring(index + search.length)
}
exports.strAfterLast = strAfterLast
