'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeCommon = exports.default = void 0
require('core-js/modules/esnext.async-iterator.reduce.js')
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
var _gulp = require('gulp')
var _gulpBabel = _interopRequireDefault(require('gulp-babel'))
var _through = _interopRequireDefault(require('through2'))
var _strAfterLast = _interopRequireDefault(require('../utilities/strAfterLast'))
var _resolveImports = _interopRequireDefault(require('./resolveImports'))
var _replaceImports = _interopRequireDefault(require('./replaceImports'))
var _replaceImportMeta = _interopRequireDefault(require('./replaceImportMeta'))
var _wrapAwait = _interopRequireDefault(require('./wrapAwait'))
var _copyResources = _interopRequireDefault(require('./copyResources'))
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }
// @ts-ignore

// @ts-ignore

/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @param {Object<string, Object.<string, *>>} [config={}]
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
