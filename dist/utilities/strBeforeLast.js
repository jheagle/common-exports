'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.strBeforeLast = exports.default = void 0
require('core-js/stable')
/**
 * Retrieve the string part after the last search match.
 * Original source from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/strBeforeLast.ts Sí, funciona}
 * @function
 * @param {string} str
 * @param {string} search
 * @returns {string}
 */
const strBeforeLast = (str, search) => {
  const index = str.lastIndexOf(search)
  return index === -1 ? '' : str.substring(0, index)
}
exports.strBeforeLast = strBeforeLast
var _default = exports.default = strBeforeLast
