'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.regexEscape = void 0
/**
 * Take a string and escape the regex characters.
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/regexEscape.ts Sí, funciona}
 * @memberof module:common-exports
 * @param {string} str
 * @returns {string}
 */
const regexEscape = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
exports.regexEscape = regexEscape
