'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveImports = resolveImports
require('core-js/modules/esnext.async-iterator.every.js')
require('core-js/modules/esnext.async-iterator.for-each.js')
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.every.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _findImports = require('./findImports')
var _strAfter = require('../utilities/strAfter')
var _makeFilepath = require('../utilities/makeFilepath')
var _isCommonModule = require('./isCommonModule')
var _makeModuleInfo = require('./makeModuleInfo')
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths.
 * @memberof module:common-exports
 * @param {StreamFile} file - The in-memory fetched file object.
 * @param {string|null} [rootPath=null] - The root path to use when resolving imports.
 * @returns {Array<ModuleInfo>}
 */
function resolveImports (file, rootPath = null) {
  const dirPath = (0, _makeFilepath.makeFilepath)((0, _strAfter.strAfter)(file.base, file.cwd))
  const useRoot = rootPath || dirPath
  return (0, _findImports.findImports)(file.contents.toString()).reduce((modules, moduleName) => {
    const moduleResolutions = (0, _makeModuleInfo.makeModuleInfo)(dirPath, moduleName, useRoot)
    if (moduleResolutions.every(_isCommonModule.isCommonModule)) {
      // CommonJs modules don't need to be updated, keep them as-is
      return modules
    }
    moduleResolutions.forEach(moduleInfo => modules.push(moduleInfo))
    return modules
  }, [])
}
