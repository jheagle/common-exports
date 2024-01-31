'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.findImports = exports.default = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _importRegex = _interopRequireDefault(require('./importRegex'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Retrieve all the module names from imports.
 * @param {string} fileContents
 * @returns {Array}
 */
const findImports = fileContents => Array.from(fileContents.matchAll((0, _importRegex.default)())).reduce((foundImports, matches) => {
  if (!matches[3].includes(':')) {
    // exclude modules for node:, file:, etc.
    foundImports.push(matches[3])
  }
  return foundImports
}, [])
exports.findImports = findImports
var _default = exports.default = findImports
