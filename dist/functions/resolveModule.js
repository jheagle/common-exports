'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveModule = exports.default = void 0
require('core-js/modules/esnext.async-iterator.filter.js')
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.map.js')
var _fs = require('fs')
var _strAfterLast = _interopRequireDefault(require('../utilities/strAfterLast'))
var _makeFilepath = _interopRequireDefault(require('../utilities/makeFilepath'))
var _testFilesystem = require('test-filesystem')
var _regexEscape = _interopRequireDefault(require('../utilities/regexEscape'))
var _strBeforeLast = _interopRequireDefault(require('../utilities/strBeforeLast'))
var _makeRelativePath = _interopRequireDefault(require('../utilities/makeRelativePath'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
const modulesDirectory = 'node_modules'
/**
 * Search for the given module and return the full path.
 * @memberof module:common-exports
 * @param {string} root - The base path for searching.
 * @param {string} moduleName - The import name used for retrieving the module.
 * @param {string} current - The current directory we are checking for module matches.
 * @returns {Array<string>}
 */
const resolveModule = (root, moduleName, current = '') => {
  root = (0, _makeFilepath.default)(root)
  if (!current) {
    current = root
  }
  let hasFullPath = true
  if (moduleName.startsWith('#')) {
    moduleName = moduleName.slice(1)
    current = (0, _makeFilepath.default)(current, 'vendor')
    hasFullPath = false
  }
  if (moduleName.startsWith('./')) {
    moduleName = moduleName.slice(2)
    hasFullPath = false
  }
  if (moduleName.startsWith('../')) {
    moduleName = moduleName.slice(3)
    hasFullPath = false
  }
  if (hasFullPath) {
    // Given longer paths, reduce them to relative parts
    moduleName = (0, _makeRelativePath.default)(root, moduleName)
  }
  const tempCurrent = (0, _makeFilepath.default)(current, (0, _strBeforeLast.default)(moduleName, '/'))
  if ((0, _testFilesystem.fileExists)(tempCurrent)) {
    let tempName = moduleName.includes('/') ? (0, _strAfterLast.default)(moduleName, '/') : moduleName
    tempName = (0, _makeFilepath.default)(tempName)
    tempName = (0, _regexEscape.default)(tempName)
    if (tempName.includes('\\$\\{')) {
      // now that we already did the escape, we need to check the patter as escaped, then replace with wildcard
      tempName = tempName.replace(/(\\\$\\{.+\\})+/g, '.+')
    }
    const moduleRegex = new RegExp(`^${tempName}$`)
    const foundFiles = (0, _fs.readdirSync)(tempCurrent).filter(filePath => moduleRegex.test(filePath))
    if (foundFiles.length) {
      return foundFiles.map(found => (0, _makeFilepath.default)(tempCurrent, found)).filter(_testFilesystem.fileExists)
    }
  }
  if (current === modulesDirectory) {
    return []
  }
  if ((0, _strAfterLast.default)(current, '/') === modulesDirectory) {
    current = (0, _makeFilepath.default)(current, '../../')
  }
  const next = (0, _makeFilepath.default)(current, modulesDirectory)
  if (next === root || !next) {
    return []
  }
  return resolveModule(root, moduleName, next)
}
exports.resolveModule = resolveModule
var _default = exports.default = resolveModule
