'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.importRegex = exports.default = void 0
/**
 * Get the regex for detecting ES6 import statements.
 * @function
 * @returns {string}
 */
const importRegex = () => new RegExp('(:?export|import)\\(?(:?\\s*[a-zA-Z{}\\s-_,/]+\\s*from\\s*)?[\'`"](.+)[\'`"]\\)?', 'g')
exports.importRegex = importRegex
var _default = exports.default = importRegex
