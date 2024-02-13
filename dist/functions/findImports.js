'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.findImports = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _importRegex = require('./importRegex')
/**
 * Retrieve all the module names from imports.
 * @memberof module:common-exports
 * @param {string} fileContents - The string of contents to parse for import matches.
 * @returns {Array}
 */
const findImports = fileContents => Array.from(fileContents.matchAll((0, _importRegex.importRegex)())).reduce((foundImports, matches) => {
  if (!matches[3].includes(':')) {
    // exclude modules for node:, file:, etc.
    foundImports.push(matches[3])
  }
  return foundImports
}, [])
exports.findImports = findImports
