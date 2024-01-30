'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveModule = exports.default = void 0
require('core-js/modules/esnext.async-iterator.filter.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.map.js')
var _fs = require('fs')
var _strAfterLast = _interopRequireDefault(require('../utilities/strAfterLast'))
var _makeFilepath = _interopRequireDefault(require('./makeFilepath'))
var _fileExists = _interopRequireDefault(require('./fileExists'))
var _regexEscape = _interopRequireDefault(require('./regexEscape'))
var _strBeforeLast = _interopRequireDefault(require('../utilities/strBeforeLast'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
const modulesDirectory = 'node_modules'
/**
 * Search for the given module and return the full path.
 * @function
 * @param {string} root
 * @param {string} moduleName
 * @param {string} current
 * @returns {Array<string>}
 */
const resolveModule = (root, moduleName, current = '') => {
  if (current === root) {
    return null
  }
  root = (0, _makeFilepath.default)(root)
  if (!current) {
    current = root
  }
  if (moduleName.startsWith('#')) {
    moduleName = moduleName.slice(1)
    current = (0, _makeFilepath.default)(current, 'vendor')
  }
  if (moduleName.startsWith('./')) {
    moduleName = moduleName.slice(2)
  }
  if (moduleName.startsWith('../')) {
    moduleName = moduleName.slice(3)
  }
  const tempCurrent = (0, _makeFilepath.default)(current, (0, _strBeforeLast.default)(moduleName, '/'))
  if ((0, _fileExists.default)(tempCurrent)) {
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
      return foundFiles.map(found => (0, _makeFilepath.default)(tempCurrent, found)).filter(_fileExists.default)
    }
  }
  if ((0, _strAfterLast.default)(current, '/') === modulesDirectory) {
    current = (0, _makeFilepath.default)(current, '../../')
    if (current === root || !current) {
      return []
    }
  }
  return resolveModule(root, moduleName, (0, _makeFilepath.default)(current, modulesDirectory))
}
exports.resolveModule = resolveModule
var _default = exports.default = resolveModule
