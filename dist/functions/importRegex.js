'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.importRegex = void 0
/**
 * Get the regex for detecting ES6 import statements.
 * @memberof module:common-exports
 * @returns {string}
 */
const importRegex = () => new RegExp('(:?export|import)\\(?(:?\\s*[*a-zA-Z0-9{}\\s-_,/]+\\s*from\\s*)?[\'`"](.+)[\'`"]\\)?', 'g')
exports.importRegex = importRegex
