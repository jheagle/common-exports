'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveImports = resolveImports
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.for-each.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _findImports = require('./findImports')
var _strAfter = require('../utilities/strAfter')
var _makeFilepath = require('../utilities/makeFilepath')
var _makeModuleInfo = require('./makeModuleInfo')
/**
 * Given a file with buffer contents, identify all the imports it has and find their full paths. Common (already
 * CommonJS-compatible) modules are included too, not just modules needing conversion - see {@link ModuleInfo}'s
 * isCommon flag, used by {@link replaceImports} to copy them into the vendor tree as-is rather than converting
 * them. They can't simply be left alone: the vendor output directory structure doesn't mirror the original
 * node_modules layout closely enough for Node's own module resolution to find them from their new location.
 * @memberof module:common-exports
 * @param {StreamFile} file - The in-memory fetched file object.
 * @param {string|null} [rootPath=null] - The root path to use when resolving imports.
 * @returns {Array<ModuleInfo>}
 */
function resolveImports (file, rootPath = null) {
  const dirPath = (0, _makeFilepath.makeFilepath)((0, _strAfter.strAfter)(file.base, file.cwd))
  const useRoot = rootPath || dirPath
  return (0, _findImports.findImports)(file.contents.toString()).reduce((modules, moduleName) => {
    (0, _makeModuleInfo.makeModuleInfo)(dirPath, moduleName, useRoot).forEach(moduleInfo => modules.push(moduleInfo))
    return modules
  }, [])
}
