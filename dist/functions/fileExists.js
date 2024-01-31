'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.fileExists = exports.default = void 0
var _fs = require('fs')
/**
 * Detect if a file exists and is usable.
 * @param {string} filePath
 * @returns {boolean}
 */
const fileExists = filePath => {
  try {
    (0, _fs.accessSync)(filePath, _fs.constants.F_OK)
    return true
  } catch (err) {
    return false
  }
}
exports.fileExists = fileExists
var _default = exports.default = fileExists
