'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.makeCommon = void 0
require('core-js/modules/esnext.iterator.constructor.js')
require('core-js/modules/esnext.iterator.reduce.js')
require('core-js/modules/esnext.map.delete-all.js')
require('core-js/modules/esnext.map.every.js')
require('core-js/modules/esnext.map.filter.js')
require('core-js/modules/esnext.map.find.js')
require('core-js/modules/esnext.map.find-key.js')
require('core-js/modules/esnext.map.includes.js')
require('core-js/modules/esnext.map.key-of.js')
require('core-js/modules/esnext.map.map-keys.js')
require('core-js/modules/esnext.map.map-values.js')
require('core-js/modules/esnext.map.merge.js')
require('core-js/modules/esnext.map.reduce.js')
require('core-js/modules/esnext.map.some.js')
require('core-js/modules/esnext.map.update.js')
require('core-js/modules/esnext.set.add-all.js')
require('core-js/modules/esnext.set.delete-all.js')
require('core-js/modules/esnext.set.difference.js')
require('core-js/modules/esnext.set.every.js')
require('core-js/modules/esnext.set.filter.js')
require('core-js/modules/esnext.set.find.js')
require('core-js/modules/esnext.set.intersection.js')
require('core-js/modules/esnext.set.is-disjoint-from.js')
require('core-js/modules/esnext.set.is-subset-of.js')
require('core-js/modules/esnext.set.is-superset-of.js')
require('core-js/modules/esnext.set.join.js')
require('core-js/modules/esnext.set.map.js')
require('core-js/modules/esnext.set.reduce.js')
require('core-js/modules/esnext.set.some.js')
require('core-js/modules/esnext.set.symmetric-difference.js')
require('core-js/modules/esnext.set.union.js')
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
 * @param {Map<string, Promise<void>>} [inProgress=new Map()] - Tracks recursive conversions already started (by
 * destination path) for this whole call tree, shared across every recursive makeCommon call it spawns. Without
 * this, the same dependency reachable from multiple import chains (a very common shape once a tree gets deep or
 * wide) gets independently, redundantly re-converted - each duplicate spawning its own full sub-tree of further
 * duplicates - which is what caused this function's historical OOM crash under real-world dependency graphs.
 * @param {Set<string>} [ancestors=new Set()] - The chain of source files currently being converted above this
 * call, in this same branch of the recursion. Real packages do have genuine circular imports (e.g. two files that
 * import from each other) - CommonJS/Node handle that fine at runtime via partial exports, but this function
 * cannot: waiting for a circular dependency's own conversion to finish before considering the current file done
 * would deadlock (each side waiting on the other) forever. When a discovered import's target is already an
 * ancestor, its conversion is already in flight further up this same chain - don't wait on it here too.
 * @returns {stream.Stream}
 */
const makeCommon = (srcPath, destPath, config = {}, inProgress = new Map(), ancestors = new Set()) => src(srcPath).pipe(_through.default.obj(function (file, enc, callback) {
  const rootPath = typeof config.rootPath === 'undefined' ? srcPath : config.rootPath
  const pending = []
  const currentAncestors = new Set(ancestors)
  currentAncestors.add(srcPath)
  // @ts-ignore
  const fileContents = (0, _resolveImports.resolveImports)(file, rootPath).reduce((0, _replaceImports.replaceImports)(srcPath, destPath, config, pending, inProgress, currentAncestors), file.contents.toString())
  // makeCommon's own recursive calls (for each discovered import) don't block - wait for them here so this
  // file isn't reported "finished" before its dependencies, arbitrarily deep, have actually been written.
  Promise.all(pending).then(() => {
    (0, _copyResources.copyResources)(srcPath, config)
    file.contents = Buffer.from((0, _customChanges.customChanges)(srcPath, fileContents, config))
    this.push(file)
    callback()
  }, error => callback(error))
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
