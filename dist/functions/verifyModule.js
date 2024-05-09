'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.verifyModule = void 0
require('core-js/modules/esnext.async-iterator.filter.js')
require('core-js/modules/esnext.async-iterator.map.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.filter.js')
require('core-js/modules/esnext.iterator.map.js')
var _strAfterLast = require('../utilities/strAfterLast')
var _makeFilepath = require('../utilities/makeFilepath')
var _regexEscape = require('../utilities/regexEscape')
var _fs = require('fs')
var _testFilesystem = require('test-filesystem')
/**
 * Check if the current path contains the module we are looking for.
 * @memberof module:common-exports
 * @param {string} moduleName
 * @param {string} current
 * @returns {Array<string>|null}
 */
const verifyModule = (moduleName, current) => {
  let tempName = moduleName.includes('/') ? (0, _strAfterLast.strAfterLast)(moduleName, '/') : moduleName
  tempName = (0, _makeFilepath.makeFilepath)(tempName)
  tempName = (0, _regexEscape.regexEscape)(tempName)
  if (tempName.includes('\\$\\{')) {
    // now that we already did the escape, we need to check the pattern as escaped, then replace with wildcard
    tempName = tempName.replace(/(\\\$\\{.+\\})+/g, '.+')
  }
  const moduleRegex = new RegExp(`^${tempName}$`)
  const pathStats = (0, _fs.statSync)(current)
  if (pathStats.isDirectory()) {
    const dirFiles = (0, _fs.readdirSync)(current)
    const foundFiles = dirFiles.filter(filePath => moduleRegex.test(filePath))
    if (foundFiles.length) {
      return foundFiles.map(found => (0, _makeFilepath.makeFilepath)(current, found)).filter(_testFilesystem.fileExists)
    }
    if (dirFiles.includes('package.json')) {
      // package.json was in the files we found, use it to get more information on this module
      const packagePath = `${current}/package.json`
      const packageContent = JSON.parse((0, _fs.readFileSync)(packagePath).toString())
      const relativeName = `./${tempName}`
      if (typeof packageContent.exports !== 'undefined' && typeof packageContent.exports[relativeName] !== 'undefined') {
        return [(0, _makeFilepath.makeFilepath)(current, packageContent.exports[relativeName])]
      }
    }
  }
  return null
}
exports.verifyModule = verifyModule
