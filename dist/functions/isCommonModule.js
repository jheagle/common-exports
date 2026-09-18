'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.isCommonModule = void 0
var _makeFilepath = require('../utilities/makeFilepath')
var _testFilesystem = require('test-filesystem')
var _fs = require('fs')
var _importRegex = require('./importRegex')
/**
 * Attempt to detect if the current module is a common js module.
 * @memberof module:common-exports
 * @param {Object<path|file, string|null>} moduleInfo - An object containing the path and file strings.
 * @returns {boolean}
 */
const isCommonModule = moduleInfo => {
  // Node's own resolution lets a file's own extension override the package's "type" field: .cjs is always
  // CommonJS and .mjs is always an ES module, regardless of what the nearest package.json says. Only a plain
  // .js file (or no clear extension) falls back to the package-level type check below.
  if (moduleInfo.file && moduleInfo.file.endsWith('.cjs')) {
    return true
  }
  if (moduleInfo.file && moduleInfo.file.endsWith('.mjs')) {
    return false
  }
  const packagePath = (0, _makeFilepath.makeFilepath)(moduleInfo.path, 'package.json')
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
  return /require\(['`"].+['`"]\)/.test(mainContents) && !(0, _importRegex.importRegex)().test(mainContents)
}
exports.isCommonModule = isCommonModule
