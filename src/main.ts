/**
 * Bundle a project or vendor projects for usage as CommonJS AND ES6 modules.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 1.0.0
 * @module common-exports
 */

import * as stream from 'stream'
// @ts-ignore
import babel from 'gulp-babel'
import copyResources from './functions/copyResources'
import { dest, src } from 'gulp'
import replaceImports from './functions/replaceImports'
import replaceImportMeta from './functions/replaceImportMeta'
import resolveImports, { StreamFile } from './functions/resolveImports'
import strAfterLast from './utilities/strAfterLast'
// @ts-ignore
import through, { TransformCallback } from 'through2'
import wrapAwait from './functions/wrapAwait'

export type makeCommonConfig = {
  copyResources?: {
    [key: string]: [{ src: string, dest: string }]
  },
  rootPath?: string,
}

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
export const makeCommon = (srcPath: string, destPath: string, config: makeCommonConfig = {}): stream.Stream => src(srcPath)
  .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
    const rootPath = typeof config.rootPath === 'undefined' ? srcPath : config.rootPath
    // @ts-ignore
    const fileContents = resolveImports(file, rootPath)
      .reduce(
        replaceImports(srcPath, destPath, file, config),
        file.contents.toString()
      )
    copyResources(srcPath, config)
    file.contents = Buffer.from(fileContents)
    this.push(file)
    callback()
  }))
  .pipe(babel())
  .pipe(through.obj(function (file: StreamFile, enc: BufferEncoding, callback: TransformCallback): void {
    let fileContents = file.contents.toString()
    fileContents = replaceImportMeta(fileContents)
    const wrappedContents = wrapAwait(fileContents, strAfterLast(file.base, '/'))
    file.contents = Buffer.from(wrappedContents)
    this.push(file)
    callback()
  }))
  .pipe(dest(destPath))

export default makeCommon
