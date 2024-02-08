'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.replaceImports = exports.default = void 0
var _strBeforeLast = _interopRequireDefault(require('../utilities/strBeforeLast'))
var _makeFilepath = _interopRequireDefault(require('../utilities/makeFilepath'))
var _testFilesystem = require('test-filesystem')
var _makeCommon = _interopRequireDefault(require('./makeCommon'))
var _regexEscape = _interopRequireDefault(require('../utilities/regexEscape'))
var _makeRelativePath = _interopRequireDefault(require('../utilities/makeRelativePath'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Take a srcPath, destPath, and file and return a function to reduce the content for replacing file imports.
 * @param {string} srcPath
 * @param {string} destPath
 * @param {Object} file
 * @param {Object<string, Object.<string, *>>} [config={}]
 * @returns {reduceImports}
 */
const replaceImports = (srcPath, destPath, file, config = {}) => (content, importFile) => {
  if (!importFile.file) {
    console.error('Unable to find module', srcPath, importFile)
    return content
  }
  let relativePath = (0, _makeRelativePath.default)(srcPath, importFile.file)
  let newDest = destPath
  if (newDest.endsWith('.js') || newDest.endsWith('.mjs')) {
    newDest = (0, _strBeforeLast.default)(newDest, '/')
  }
  let modulePath = (0, _makeFilepath.default)(newDest, relativePath)
  if (modulePath.endsWith('.mjs')) {
    modulePath = (0, _strBeforeLast.default)(modulePath, '.mjs') + '.js'
  }
  if (!(0, _testFilesystem.fileExists)(modulePath)) {
    if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
      modulePath = (0, _strBeforeLast.default)(modulePath, '/')
    }
    (0, _makeCommon.default)(importFile.file, modulePath, config)
  }
  const moduleName = (0, _regexEscape.default)(importFile.module)
  const moduleMatch = new RegExp(`(['"\`])${moduleName}['"\`]`)
  if (importFile.module.includes('${')) {
    const replaceName = moduleName.replace(/(\\\$\\{.+\\})+/g, '.+')
    const replaceFor = new RegExp(`(.+\/)(${replaceName})(\/.+)`, 'g')
    relativePath = relativePath.replace(replaceFor, '$1' + importFile.module + '$3')
  }
  return content.replace(moduleMatch, `$1${relativePath}$1`)
}
exports.replaceImports = replaceImports
var _default = exports.default = replaceImports
