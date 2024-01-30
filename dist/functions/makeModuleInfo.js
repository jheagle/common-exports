'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeModuleInfo = exports.default = void 0
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.map.js')
var _resolveMainFile = _interopRequireDefault(require('./resolveMainFile'))
var _resolveModule = _interopRequireDefault(require('./resolveModule'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Create the Module Info object to store the name, path, and file.
 * @function
 * @param {string} dirPath
 * @param {string} moduleName
 * @returns {string}
 */
const makeModuleInfo = (dirPath, moduleName) => (0, _resolveModule.default)(dirPath, moduleName).map(path => ({
  module: moduleName,
  path: path,
  file: (0, _resolveMainFile.default)(path)
}))
exports.makeModuleInfo = makeModuleInfo
var _default = exports.default = makeModuleInfo
