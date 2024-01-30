'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = void 0
exports.resolveImports = resolveImports
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
require('core-js/modules/esnext.async-iterator.every.js')
require('core-js/modules/esnext.iterator.every.js')
require('core-js/modules/esnext.async-iterator.for-each.js')
require('core-js/modules/esnext.iterator.for-each.js')
var _findImports = _interopRequireDefault(require('./findImports'))
var _strAfter = _interopRequireDefault(require('../utilities/strAfter'))
var _makeFilepath = _interopRequireDefault(require('./makeFilepath'))
var _isCommonModule = _interopRequireDefault(require('./isCommonModule'))
var _makeModuleInfo = _interopRequireDefault(require('./makeModuleInfo'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths.
 * @function
 * @param {Object} file
 * @returns {Array<string, Object>}
 */
function resolveImports (file) {
  const dirPath = (0, _makeFilepath.default)((0, _strAfter.default)(file.base, file.cwd))
  return (0, _findImports.default)(file.contents.toString()).reduce((modules, moduleName) => {
    const moduleResolutions = (0, _makeModuleInfo.default)(dirPath, moduleName)
    if (moduleResolutions.every(_isCommonModule.default)) {
      // CommonJs modules don't need to be updated, keep them as-is
      return modules
    }
    moduleResolutions.forEach(moduleInfo => modules.push(moduleInfo))
    return modules
  }, [])
}
var _default = exports.default = resolveImports
