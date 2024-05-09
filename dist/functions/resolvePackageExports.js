'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolvePackageExports = void 0
var _makeFilepath = require('../utilities/makeFilepath')
var _checkPackageExports = require('./checkPackageExports')
/**
 * Given the package details, determined the configured module entry point.
 * @memberof module:common-exports
 * @param {object|string} packageData - The package contents as an object.
 * @param {string} modulePath
 * @returns {string|null}
 */
const resolvePackageExports = (packageData, modulePath) => {
  if (packageData.exports) {
    // The newer "exports" config has precedence over the older "main" config
    if (typeof packageData.exports === 'string') {
      return (0, _makeFilepath.makeFilepath)(modulePath, packageData.exports)
    }
    return (0, _checkPackageExports.checkPackageExports)(packageData.exports, modulePath)
  }
  if (packageData.main) {
    // The classic "main" config is still considered
    return (0, _makeFilepath.makeFilepath)(modulePath, packageData.main)
  }
  return null
}
exports.resolvePackageExports = resolvePackageExports
