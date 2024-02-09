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
 * Create the Module Info object to store the name, path, and file for each matching module.
 * @memberof module:common-exports
 * @param {string} dirPath - Current relative directory to search.
 * @param {string} moduleName - Path used in the import for the module.
 * @param {string} rootPath - The lowest path to search within for the module.
 * @returns {Array<ModuleInfo>}
 */
const makeModuleInfo = (dirPath, moduleName, rootPath = null) => {
  if (!rootPath) {
    // If a root path is not specified, assume the current directory is the root.
    rootPath = dirPath
  }
  return (0, _resolveModule.default)(rootPath, moduleName, dirPath).map(path => ({
    module: moduleName,
    path: path,
    file: (0, _resolveMainFile.default)(path)
  }))
}
exports.makeModuleInfo = makeModuleInfo
var _default = exports.default = makeModuleInfo
