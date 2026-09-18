'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.replaceImports = void 0
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
var _fs = require('fs')
var _strBeforeLast = require('../utilities/strBeforeLast')
var _makeFilepath = require('../utilities/makeFilepath')
var _testFilesystem = require('test-filesystem')
var _main = require('../main')
var _regexEscape = require('../utilities/regexEscape')
var _makeRelativePath = require('../utilities/makeRelativePath')
var _streamToPromise = require('../utilities/streamToPromise')
/**
 * Take a srcPath, destPath, then return a function to reduce the content for replacing file imports.
 * @memberof module:common-exports
 * @param {string} srcPath - The original path of the file to be updated.
 * @param {string} destPath - The outgoing path of the file once updated.
 * @param {Object<string, Object<string, *>>} [config={}] - Additional configuration options.
 * @param {Array<Promise<void>>} [pending=[]] - Recursive conversions started for discovered imports are pushed
 * here as promises, so the caller can await them before considering the current file done. makeCommon's own
 * recursive calls don't block; without this, a file could be reported "finished" before its own dependencies (or
 * their dependencies, arbitrarily deep) have actually finished being written.
 * @param {Map<string, Promise<void>>} [inProgress=new Map()] - Tracks recursive conversions already started (by
 * destination path), shared across the whole call tree. A dependency reachable from multiple import chains would
 * otherwise be independently, redundantly re-converted every time it's encountered again while its first
 * conversion is still in flight (the fileExists check below can't catch this - the file isn't written yet) -
 * each duplicate spawning its own full sub-tree of further duplicates, which is what caused this function's
 * historical OOM crash. Reusing the same in-flight promise instead of starting a new one avoids that entirely.
 * @param {Set<string>} [ancestors=new Set()] - Source files currently being converted above this one, in this
 * same branch. Real packages can have genuine circular imports (two files that import each other) - waiting for
 * such a target's conversion to finish before this file is done would deadlock, since its own conversion is
 * simultaneously waiting on this one. A target already in this set is already in flight further up the same
 * chain - don't wait on it again here.
 * @returns {reduceImports}
 */
const replaceImports = (srcPath, destPath, config = {}, pending = [], inProgress = new Map(), ancestors = new Set()) => (content, importFile) => {
  if (!importFile.file || !importFile.path) {
    console.error('Unable to find module', srcPath, importFile)
    return content
  }
  let relativePath = (0, _makeRelativePath.makeRelativePath)(srcPath, importFile.file)
  let newDest = destPath
  if (newDest.endsWith('.js') || newDest.endsWith('.mjs') || newDest.endsWith('.cjs')) {
    newDest = (0, _strBeforeLast.strBeforeLast)(newDest, '/')
  }
  let modulePath = (0, _makeFilepath.makeFilepath)(newDest, relativePath)
  if (modulePath.endsWith('.mjs')) {
    modulePath = (0, _strBeforeLast.strBeforeLast)(modulePath, '.mjs') + '.js'
  }
  let moduleDir = modulePath
  if (moduleDir.endsWith('.js') || moduleDir.endsWith('.mjs') || moduleDir.endsWith('.cjs')) {
    moduleDir = (0, _strBeforeLast.strBeforeLast)(moduleDir, '/')
  }
  if (importFile.isCommon) {
    // Already CommonJS-compatible - copy it as-is instead of converting it. It can't be left alone entirely:
    // the vendor output doesn't mirror the original node_modules layout closely enough for Node's own
    // resolution to find it from its new location otherwise. Gated on fileExists since cpSync is a cheap,
    // idempotent, purely synchronous side effect - safe to skip once something has already put a file there.
    if (!(0, _testFilesystem.fileExists)(modulePath)) {
      // moduleDir mirrors the directory containing the main *file*, which may be nested several levels inside
      // the package itself (e.g. a package whose main is ./dist/cjs/index.cjs) - walk back up the same number
      // of levels to find the destination that actually corresponds to the package root (importFile.path).
      // How many directory levels the main file sits below the package root (0 when it's directly in the
      // package's own root, e.g. get-stream/index.js). Computed by comparing segment counts directly rather
      // than via makeRelativePath, which has its own edge case stripping the final shared segment when the
      // "from" path's last remaining piece has no trailing slash.
      const fileDirDepth = (0, _strBeforeLast.strBeforeLast)(importFile.file, '/').split('/').length
      const packageDepth = importFile.path.split('/').length
      const depthWithinPackage = fileDirDepth - packageDepth
      let packageRootDest = moduleDir
      for (let level = 0; level < depthWithinPackage; level++) {
        packageRootDest = (0, _strBeforeLast.strBeforeLast)(packageRootDest, '/')
      }
      // Whether it's safe to widen the copy to the package's whole node_modules parent depends on the SOURCE
      // side, not the destination: a package nested inside another package's own PRIVATE node_modules (e.g.
      // execa/node_modules/get-stream) has a small, package-scoped node_modules folder, safe to copy wholesale
      // so any sibling it reaches via a relative path (e.g. npm-deduped side-by-side packages) comes along too.
      // A package living directly in the shared, project-level node_modules has no such private folder - its
      // "parent" IS the single node_modules shared by every other package being converted, and copying that
      // wholesale would dump every unrelated package into the vendor tree unconverted. Detect "private"
      // purely from the path string (no filesystem access, so this also works against synthetic/mocked
      // paths in unit tests): a private node_modules folder always sits inside another package, meaning its
      // OWN parent path still contains a further "node_modules" segment somewhere above it; the single shared
      // root node_modules never does.
      const sourceModulesDir = (0, _strBeforeLast.strBeforeLast)(importFile.path, '/')
      const sourceModulesOwner = (0, _strBeforeLast.strBeforeLast)(sourceModulesDir, '/')
      const isPrivatelyNested = sourceModulesOwner.includes('node_modules')
      if (isPrivatelyNested) {
        (0, _fs.cpSync)(sourceModulesDir, (0, _strBeforeLast.strBeforeLast)(packageRootDest, '/'), {
          recursive: true
        })
      } else {
        (0, _fs.cpSync)(importFile.path, packageRootDest, {
          recursive: true
        })
      }
    }
  } else if (!ancestors.has(importFile.file)) {
    // Unlike the copy above, this isn't gated on fileExists: a wholesale sibling copy (just above) may have
    // already dumped a raw, unconverted file at this exact path as a side effect of copying a *different*,
    // privately-nested common package's whole node_modules folder - that folder can easily contain a mix of
    // common and ESM siblings, and the copy has no way to tell them apart. Only inProgress (real conversions
    // this function itself started) should ever be trusted to mean "already handled" for an ESM target.
    let conversion = inProgress.get(modulePath)
    if (!conversion) {
      conversion = (0, _streamToPromise.streamToPromise)((0, _main.makeCommon)(importFile.file, moduleDir, config, inProgress, ancestors))
      inProgress.set(modulePath, conversion)
    }
    pending.push(conversion)
  }
  const moduleName = (0, _regexEscape.regexEscape)(importFile.module)
  const moduleMatch = new RegExp(`(['"\`])${moduleName}['"\`]`)
  if (importFile.module.includes('${')) {
    const replaceName = moduleName.replace(/(\\\$\\{.+\\})+/g, '.+')
    const replaceFor = new RegExp(`(.+\/)(${replaceName})(\/.+)`, 'g')
    relativePath = relativePath.replace(replaceFor, '$1' + importFile.module + '$3')
  }
  if (relativePath.endsWith('.mjs')) {
    // Handle wrong ending conversion from .mjs to .js file extension
    relativePath = (0, _strBeforeLast.strBeforeLast)(relativePath, '.mjs') + '.js'
  }
  if (!/^\.+\//.test(relativePath)) {
    relativePath = `./${relativePath}`
  }
  return content.replace(moduleMatch, `$1${relativePath}$1`)
}
exports.replaceImports = replaceImports
