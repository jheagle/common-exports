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
 * @param {Object} moduleInfo
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
  const mainContents = (0, _fs.readFileSync)(moduleInfo.file).toString()
  return /require\(['`"].+['`"]\)/.test(mainContents) && !(0, _importRegex.default)().test(mainContents)
}
exports.isCommonModule = isCommonModule
var _default = exports.default = isCommonModule
