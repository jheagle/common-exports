import { dest, src } from 'gulp'
// @ts-ignore
import babel from 'gulp-babel'
// @ts-ignore
import through from 'through2'
import strAfterLast from '../utilities/strAfterLast'
import resolveImports from './resolveImports.mjs'
import replaceImports from './replaceImports.mjs'
import replaceImportMeta from './replaceImportMeta.mjs'
import wrapAwait from './wrapAwait.mjs'
import copyResources from './copyResources.mjs'
/**
 * Apply babel to source files and output with commonJs compatibility.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @param {Object<string, Object.<string, *>>} [config={}]
 * @return {stream.Stream}
 */
export const makeCommon = (srcPath, destPath, config = {}) => src(srcPath)
  .pipe(through.obj(function (file, enc, callback) {
    const rootPath = typeof config.rootPath === 'undefined' ? srcPath : config.rootPath
    // @ts-ignore
    const fileContents = resolveImports(file, rootPath)
      .reduce(replaceImports(srcPath, destPath, file, config), file.contents.toString())
    copyResources(srcPath, config)
    file.contents = Buffer.from(fileContents)
    this.push(file)
    callback()
  }))
  .pipe(babel())
  .pipe(through.obj(function (file, enc, callback) {
    let fileContents = file.contents.toString()
    fileContents = replaceImportMeta(fileContents)
    const wrappedContents = wrapAwait(fileContents, strAfterLast(file.base, '/'))
    file.contents = Buffer.from(wrappedContents)
    this.push(file)
    callback()
  }))
  .pipe(dest(destPath))
export default makeCommon
