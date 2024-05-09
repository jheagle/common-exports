'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveModule = void 0
var _strAfterLast = require('../utilities/strAfterLast')
var _makeFilepath = require('../utilities/makeFilepath')
var _testFilesystem = require('test-filesystem')
var _strBeforeLast = require('../utilities/strBeforeLast')
var _makeRelativePath = require('../utilities/makeRelativePath')
var _verifyModule = require('./verifyModule')
const modulesDirectory = 'node_modules'
/**
 * Search for the given module and return the full path.
 * @memberof module:common-exports
 * @param {string} root - The base path for searching.
 * @param {string} moduleName - The import name used for retrieving the module.
 * @param {string} current - The current directory we are checking for module matches.
 * @returns {Array<string>}
 */
const resolveModule = (root, moduleName, current = '') => {
  root = (0, _makeFilepath.makeFilepath)(root)
  if (!current) {
    current = root
  }
  let hasFullPath = true
  if (moduleName.startsWith('#')) {
    moduleName = moduleName.slice(1)
    current = (0, _makeFilepath.makeFilepath)(current, 'vendor')
    hasFullPath = false
  }
  if (moduleName.startsWith('./')) {
    moduleName = moduleName.slice(2)
    hasFullPath = false
  }
  if (moduleName.startsWith('../')) {
    moduleName = moduleName.slice(3)
    hasFullPath = false
  }
  if (hasFullPath) {
    // Given longer paths, reduce them to relative parts
    moduleName = (0, _makeRelativePath.makeRelativePath)(root, moduleName)
  }
  const tempCurrent = (0, _makeFilepath.makeFilepath)(current, (0, _strBeforeLast.strBeforeLast)(moduleName, '/'))
  if ((0, _testFilesystem.fileExists)(tempCurrent)) {
    const result = (0, _verifyModule.verifyModule)(moduleName, tempCurrent)
    if (result !== null) {
      return result
    }
  }
  if (current === modulesDirectory) {
    return []
  }
  let hasModules = false
  if ((0, _strAfterLast.strAfterLast)(current, '/') === modulesDirectory) {
    hasModules = true
    current = (0, _makeFilepath.makeFilepath)(current, '../../')
  }
  const next = (0, _makeFilepath.makeFilepath)(current, modulesDirectory)
  if (next === root || !next) {
    return []
  }
  if (hasModules && root !== current && current) {
    // Check relative non-modules paths, skip this bit if this is already root level
    return resolveModule(root, moduleName, current)
  }
  return resolveModule(root, moduleName, next)
}
exports.resolveModule = resolveModule
