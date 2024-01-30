'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.strAfter = exports.default = void 0
require('core-js/stable')
/**
 * Retrieve the string part after the search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strAfter.ts Sí, funciona}
 * @function
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
const strAfter = (str, search) => {
  const index = str.indexOf(search)
  return index === -1 ? '' : str.substring(index + search.length)
}
exports.strAfter = strAfter
var _default = exports.default = strAfter