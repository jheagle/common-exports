'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeCommon = void 0
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _gulpBabel = _interopRequireDefault(require('gulp-babel'))
var _copyResources = require('./functions/copyResources')
var _gulp = _interopRequireDefault(require('gulp'))
var _replaceImports = require('./functions/replaceImports')
var _replaceImportMeta = require('./functions/replaceImportMeta')
var _resolveImports = require('./functions/resolveImports')
var _through = _interopRequireDefault(require('through2'))
var _customChanges = require('./functions/customChanges')
function _interopRequireDefault (e) { return e && e.__esModule ? e : { default: e } }
/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */
// @ts-ignore

// @ts-ignore

// @ts-ignore

const {
  dest,
  src
} = _gulp.default
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @memberof module:common-exports
 * @param {string|array} srcPath - The relative path to the file to convert.
 * @param {string} destPath - The relative path to the output directory.
 * @param {Object<string, *>} [config={}] - Add additional instructions to the process.
 * @param {Object<string, Array.<Object.<src|dest|updateContent, string|Function>>>} [config.copyResources={}] -
 * Add custom files to copy for found modules.
 * @param {Object<string, Array.<Object.<updateContent, Function>>>} [config.customChanges={}] -
 * Add custom content changes to the content used.
 * @param {string} [config.rootPath=''] - Specify the root to use, this helps identify where to stop.
 * @return {stream.Stream}
 */
const makeCommon = (srcPath, destPath, config = {}) => src(srcPath).pipe(_through.default.obj(function (file, enc, callback) {
  const rootPath = typeof config.rootPath === 'undefined' ? srcPath : config.rootPath
  // @ts-ignore
  const fileContents = (0, _resolveImports.resolveImports)(file, rootPath).reduce((0, _replaceImports.replaceImports)(srcPath, destPath, config), file.contents.toString());
  (0, _copyResources.copyResources)(srcPath, config)
  file.contents = Buffer.from((0, _customChanges.customChanges)(srcPath, fileContents, config))
  this.push(file)
  callback()
})).pipe((0, _gulpBabel.default)()).pipe(_through.default.obj(function (file, enc, callback) {
  file.contents = Buffer.from((0, _replaceImportMeta.replaceImportMeta)(file.contents.toString()))
  this.push(file)
  callback()
})).pipe(dest(destPath))
exports.makeCommon = makeCommon
if (void 0) {
  // @ts-ignore
  (void 0).commonExports = makeCommon
} else if (typeof window !== 'undefined') {
  // @ts-ignore
  window.commonExports = makeCommon
}
