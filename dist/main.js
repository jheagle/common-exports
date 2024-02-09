'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeCommon = exports.default = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _gulpBabel = _interopRequireDefault(require('gulp-babel'))
var _copyResources = _interopRequireDefault(require('./functions/copyResources'))
var _gulp = require('gulp')
var _replaceImports = _interopRequireDefault(require('./functions/replaceImports'))
var _replaceImportMeta = _interopRequireDefault(require('./functions/replaceImportMeta'))
var _resolveImports = _interopRequireDefault(require('./functions/resolveImports'))
var _strAfterLast = _interopRequireDefault(require('./utilities/strAfterLast'))
var _through = _interopRequireDefault(require('through2'))
var _wrapAwait = _interopRequireDefault(require('./functions/wrapAwait'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */
// @ts-ignore

// @ts-ignore

/**
 * Apply babel to source files and output with commonJs compatibility.
 * @memberof module:common-exports
 * @param {string|array} srcPath - The relative path to the file to convert
 * @param {string} destPath - The relative path to the output directory
 * @param {Object<string, *>} [config={}] - Add additional instructions to the process
 * @param {Object<string, Array.<Object.<src|dest, string>>>} [config.copyResources={}] -
 * Add custom files to copy for found modules
 * @param {string} [config.rootPath=''] - Specify the root to use, this helps identify where to stop
 * @return {stream.Stream}
 */
const makeCommon = (srcPath, destPath, config = {}) => (0, _gulp.src)(srcPath).pipe(_through.default.obj(function (file, enc, callback) {
  const rootPath = typeof config.rootPath === 'undefined' ? srcPath : config.rootPath
  // @ts-ignore
  const fileContents = (0, _resolveImports.default)(file, rootPath).reduce((0, _replaceImports.default)(srcPath, destPath, file, config), file.contents.toString());
  (0, _copyResources.default)(srcPath, config)
  file.contents = Buffer.from(fileContents)
  this.push(file)
  callback()
})).pipe((0, _gulpBabel.default)()).pipe(_through.default.obj(function (file, enc, callback) {
  let fileContents = file.contents.toString()
  fileContents = (0, _replaceImportMeta.default)(fileContents)
  const wrappedContents = (0, _wrapAwait.default)(fileContents, (0, _strAfterLast.default)(file.base, '/'))
  file.contents = Buffer.from(wrappedContents)
  this.push(file)
  callback()
})).pipe((0, _gulp.dest)(destPath))
exports.makeCommon = makeCommon
var _default = exports.default = makeCommon
