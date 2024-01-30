'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.kabobToTitleCase = exports.default = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
require('core-js/stable')
/**
 * Given a string in kebab-case convert to TitleCase (camelCase with a starting capital letter).
 * Original source concepts from {@link https://github.com/jheagle/si-funciona/blob/main/src/helpers/strings/camelCase.ts Sí, funciona}
 * @function
 * @param {string} str
 * @returns {string}
 */
const kabobToTitleCase = str => {
  const words = str.split('-')
  const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return words.reduce((camel, part) => camel.concat(ucFirst(part)), '')
}
exports.kabobToTitleCase = kabobToTitleCase
var _default = exports.default = kabobToTitleCase
