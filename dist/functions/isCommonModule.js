'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.isCommonModule = exports.default = void 0
var _makeFilepath = _interopRequireDefault(require('../utilities/makeFilepath'))
var _testFilesystem = require('test-filesystem')
var _fs = require('fs')
var _importRegex = _interopRequireDefault(require('./importRegex'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Attempt to detect if the current module is a common js module.
 * @memberof module:common-exports
 * @param {Object<module|path|file, string|null>} moduleInfo - An object containing the module, path, and file strings.
 * @returns {boolean}
 */
const isCommonModule = moduleInfo => {
  const packagePath = (0, _makeFilepath.default)(moduleInfo.path, 'package.json')
  if ((0, _testFilesystem.fileExists)(packagePath)) {
    const packageData = JSON.parse((0, _fs.readFileSync)(packagePath).toString())
    if (packageData.type && packageData.type === 'module') {
      return false
    }
  }
  if (!(0, _testFilesystem.fileExists)(moduleInfo.file)) {
    // Some native modules don't exist, hope for the best.
    return true
  }
  const mainContents = (0, _fs.readFileSync)(moduleInfo.file).toString()
  return /require\(['`"].+['`"]\)/.test(mainContents) && !(0, _importRegex.default)().test(mainContents)
}
exports.isCommonModule = isCommonModule
var _default = exports.default = isCommonModule
