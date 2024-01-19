'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeCommon = exports.default = void 0
var _gulp = require('gulp')
const babel = require('gulp-babel')
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @return {stream.Stream}
 */
const makeCommon = (srcPath, destPath) => (0, _gulp.src)(srcPath).pipe(babel()).pipe((0, _gulp.dest)(destPath))
exports.makeCommon = makeCommon
var _default = exports.default = makeCommon
