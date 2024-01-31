'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.resolveMainFile = exports.default = void 0
var _fs = require('fs')
var _makeFilepath = _interopRequireDefault(require('./makeFilepath'))
var _fileExists = _interopRequireDefault(require('./fileExists'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Given a module path, find the file which should be used as main, based on module import.
 * @param {string} modulePath
 * @returns {string|null}
 */
const resolveMainFile = modulePath => {
  if (!(0, _fileExists.default)(modulePath)) {
    // the path might be a direct file but missing the file extension, so, try some file extensions
    const jsModule = `${modulePath}.js`
    if ((0, _fileExists.default)(jsModule)) {
      return jsModule
    }
    const mjsModule = `${modulePath}.mjs`
    if ((0, _fileExists.default)(mjsModule)) {
      return mjsModule
    }
    return null
  }
  if (modulePath.endsWith('.js') || modulePath.endsWith('.mjs')) {
    // if it has a file extension, then the search ends here, we have found the main file
    return modulePath
  }
  const jsFile = (0, _makeFilepath.default)(`${modulePath}.js`)
  if ((0, _fileExists.default)(jsFile)) {
    return jsFile
  }
  const mjsFile = (0, _makeFilepath.default)(`${modulePath}.mjs`)
  if ((0, _fileExists.default)(mjsFile)) {
    return mjsFile
  }
  // Check if there is a package.json and search there for the specified main file
  const packagePath = (0, _makeFilepath.default)(modulePath, 'package.json')
  if ((0, _fileExists.default)(packagePath)) {
    const packageData = JSON.parse((0, _fs.readFileSync)(packagePath).toString())
    if (packageData.exports) {
      if (typeof packageData.exports === 'string') {
        return (0, _makeFilepath.default)(modulePath, packageData.exports)
      }
      return (0, _makeFilepath.default)(modulePath, packageData.exports.default)
    }
    if (packageData.main) {
      return (0, _makeFilepath.default)(modulePath, packageData.main)
    }
  }
  const jsPath = (0, _makeFilepath.default)(modulePath, 'index.js')
  if ((0, _fileExists.default)(jsPath)) {
    return jsPath
  }
  const mjsPath = (0, _makeFilepath.default)(modulePath, 'index.mjs')
  if ((0, _fileExists.default)(mjsPath)) {
    return mjsPath
  }
  return null
}
exports.resolveMainFile = resolveMainFile
var _default = exports.default = resolveMainFile
