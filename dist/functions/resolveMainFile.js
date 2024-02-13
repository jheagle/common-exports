'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveMainFile = void 0
var _fs = require('fs')
var _makeFilepath = require('../utilities/makeFilepath')
var _testFilesystem = require('test-filesystem')
/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @memberof module:common-exports
 * @param {string} modulePath - The relative path used to locate the module.
 * @returns {string|null}
 */
const resolveMainFile = modulePath => {
  if (!(0, _testFilesystem.fileExists)(modulePath)) {
    // the path might be a direct file but missing the file extension, so, try some file extensions
    const jsModule = `${modulePath}.js`
    if ((0, _testFilesystem.fileExists)(jsModule)) {
      return jsModule
    }
    const mjsModule = `${modulePath}.mjs`
    if ((0, _testFilesystem.fileExists)(mjsModule)) {
      return mjsModule
    }
    return null
  }
  if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
    // if it has a file extension, then the search ends here, we have found the main file
    return modulePath
  }
  const jsFile = (0, _makeFilepath.makeFilepath)(`${modulePath}.js`)
  if ((0, _testFilesystem.fileExists)(jsFile)) {
    return jsFile
  }
  const mjsFile = (0, _makeFilepath.makeFilepath)(`${modulePath}.mjs`)
  if ((0, _testFilesystem.fileExists)(mjsFile)) {
    return mjsFile
  }
  // Check if there is a package.json and search there for the specified main file
  const packagePath = (0, _makeFilepath.makeFilepath)(modulePath, 'package.json')
  if ((0, _testFilesystem.fileExists)(packagePath)) {
    const packageData = JSON.parse((0, _fs.readFileSync)(packagePath).toString())
    if (packageData.exports) {
      if (typeof packageData.exports === 'string') {
        return (0, _makeFilepath.makeFilepath)(modulePath, packageData.exports)
      }
      return (0, _makeFilepath.makeFilepath)(modulePath, packageData.exports.default)
    }
    if (packageData.main) {
      return (0, _makeFilepath.makeFilepath)(modulePath, packageData.main)
    }
  }
  const jsPath = (0, _makeFilepath.makeFilepath)(modulePath, 'index.js')
  if ((0, _testFilesystem.fileExists)(jsPath)) {
    return jsPath
  }
  const mjsPath = (0, _makeFilepath.makeFilepath)(modulePath, 'index.mjs')
  if ((0, _testFilesystem.fileExists)(mjsPath)) {
    return mjsPath
  }
  return null
}
exports.resolveMainFile = resolveMainFile
