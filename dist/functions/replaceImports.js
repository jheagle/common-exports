'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.replaceImports = void 0
var _strBeforeLast = require('../utilities/strBeforeLast')
var _makeFilepath = require('../utilities/makeFilepath')
var _testFilesystem = require('test-filesystem')
var _main = require('../main')
var _regexEscape = require('../utilities/regexEscape')
var _makeRelativePath = require('../utilities/makeRelativePath')
/**
 * Take a srcPath, destPath, then return a function to reduce the content for replacing file imports.
 * @memberof module:common-exports
 * @param {string} srcPath - The original path of the file to be updated.
 * @param {string} destPath - The outgoing path of the file once updated.
 * @param {Object<string, Object<string, *>>} [config={}] - Additional configuration options.
 * @returns {reduceImports}
 */
const replaceImports = (srcPath, destPath, config = {}) => (content, importFile) => {
  if (!importFile.file) {
    console.error('Unable to find module', srcPath, importFile)
    return content
  }
  let relativePath = (0, _makeRelativePath.makeRelativePath)(srcPath, importFile.file)
  let newDest = destPath
  if (newDest.endsWith('.js') || newDest.endsWith('.mjs')) {
    newDest = (0, _strBeforeLast.strBeforeLast)(newDest, '/')
  }
  let modulePath = (0, _makeFilepath.makeFilepath)(newDest, relativePath)
  if (modulePath.endsWith('.mjs')) {
    modulePath = (0, _strBeforeLast.strBeforeLast)(modulePath, '.mjs') + '.js'
  }
  if (!(0, _testFilesystem.fileExists)(modulePath)) {
    if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
      modulePath = (0, _strBeforeLast.strBeforeLast)(modulePath, '/')
    }
    (0, _main.makeCommon)(importFile.file, modulePath, config)
  }
  const moduleName = (0, _regexEscape.regexEscape)(importFile.module)
  const moduleMatch = new RegExp(`(['"\`])${moduleName}['"\`]`)
  if (importFile.module.includes('${')) {
    const replaceName = moduleName.replace(/(\\\$\\{.+\\})+/g, '.+')
    const replaceFor = new RegExp(`(.+\/)(${replaceName})(\/.+)`, 'g')
    relativePath = relativePath.replace(replaceFor, '$1' + importFile.module + '$3')
  }
  if (relativePath.endsWith('.mjs')) {
    // Handle wrong ending conversion from .mjs to .js file extension
    relativePath = (0, _strBeforeLast.strBeforeLast)(relativePath, '.mjs') + '.js'
  }
  if (!/^\.+\//.test(relativePath)) {
    relativePath = `./${relativePath}`
  }
  return content.replace(moduleMatch, `$1${relativePath}$1`)
}
exports.replaceImports = replaceImports
